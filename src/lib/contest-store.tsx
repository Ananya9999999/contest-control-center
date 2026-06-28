import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  PROBLEMS,
  generateAnnouncements,
  generateInitialSubmissions,
  generateParticipants,
  makeRandomSubmission,
  type Announcement,
  type Participant,
  type Problem,
  type Submission,
} from "./mock-data";

export interface ContestConfig {
  name: string;
  startedAt: number; // epoch ms
  durationMs: number;
  frozen: boolean;
  paused: boolean;
  submissionsEnabled: boolean;
}

interface State {
  config: ContestConfig;
  participants: Participant[];
  submissions: Submission[];
  problems: Problem[];
  announcements: Announcement[];
  feedPaused: boolean;
}

type Action =
  | { type: "ADD_SUBMISSION"; payload: Submission }
  | { type: "TOGGLE_FEED" }
  | { type: "SET_CONFIG"; payload: Partial<ContestConfig> }
  | { type: "ADD_ANNOUNCEMENT"; payload: Announcement }
  | { type: "PIN_ANNOUNCEMENT"; id: string }
  | { type: "REMOVE_ANNOUNCEMENT"; id: string }
  | { type: "SET_PARTICIPANT_STATUS"; id: string; status: Participant["status"] }
  | { type: "REJUDGE"; id: string };

const HOUR = 1000 * 60 * 60;

function init(): State {
  const startedAt = Date.now() - 1000 * 60 * 92; // 1h32m into contest
  const participants = generateParticipants(120);
  const submissions = generateInitialSubmissions(participants, 260, startedAt);
  return {
    config: {
      name: "CodeChef VIT Starters Cup",
      startedAt,
      durationMs: 3 * HOUR,
      frozen: false,
      paused: false,
      submissionsEnabled: true,
    },
    participants,
    submissions,
    problems: PROBLEMS,
    announcements: generateAnnouncements(),
    feedPaused: false,
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_SUBMISSION":
      return { ...state, submissions: [action.payload, ...state.submissions].slice(0, 1000) };
    case "TOGGLE_FEED":
      return { ...state, feedPaused: !state.feedPaused };
    case "SET_CONFIG":
      return { ...state, config: { ...state.config, ...action.payload } };
    case "ADD_ANNOUNCEMENT":
      return { ...state, announcements: [action.payload, ...state.announcements] };
    case "PIN_ANNOUNCEMENT":
      return {
        ...state,
        announcements: state.announcements.map((a) =>
          a.id === action.id ? { ...a, pinned: !a.pinned } : a,
        ),
      };
    case "REMOVE_ANNOUNCEMENT":
      return { ...state, announcements: state.announcements.filter((a) => a.id !== action.id) };
    case "SET_PARTICIPANT_STATUS":
      return {
        ...state,
        participants: state.participants.map((p) =>
          p.id === action.id ? { ...p, status: action.status } : p,
        ),
      };
    case "REJUDGE": {
      const sub = state.submissions.find((s) => s.id === action.id);
      if (!sub) return state;
      const verdicts = ["AC", "WA", "TLE", "RE"] as const;
      const v = verdicts[Math.floor(Math.random() * verdicts.length)];
      const prob = state.problems.find((p) => p.id === sub.problemId)!;
      return {
        ...state,
        submissions: state.submissions.map((s) =>
          s.id === action.id ? { ...s, verdict: v, score: v === "AC" ? prob.points : 0 } : s,
        ),
      };
    }
    default:
      return state;
  }
}

interface ContextValue {
  state: State;
  now: number;
  remainingMs: number;
  elapsedMs: number;
  progress: number;
  dispatch: React.Dispatch<Action>;
  addAnnouncement: (a: Omit<Announcement, "id" | "createdAt">) => void;
}

const ContestContext = createContext<ContextValue | null>(null);

export function ContestProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, init);
  const [now, setNow] = useState(() => Date.now());
  const subIdRef = useRef(900000);
  const annIdRef = useRef(100);

  // Clock tick
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // Live submission stream
  useEffect(() => {
    if (state.feedPaused || state.config.paused || !state.config.submissionsEnabled) return;
    const t = setInterval(() => {
      const partial = makeRandomSubmission(state.participants);
      const sub: Submission = {
        ...partial,
        id: `S${++subIdRef.current}`,
        submittedAt: Date.now(),
      };
      dispatch({ type: "ADD_SUBMISSION", payload: sub });
    }, 2200);
    return () => clearInterval(t);
  }, [state.feedPaused, state.config.paused, state.config.submissionsEnabled, state.participants]);

  const elapsedMs = state.config.paused ? 0 : Math.max(0, now - state.config.startedAt);
  const remainingMs = Math.max(0, state.config.durationMs - elapsedMs);
  const progress = Math.min(100, (elapsedMs / state.config.durationMs) * 100);

  const addAnnouncement = useCallback(
    (a: Omit<Announcement, "id" | "createdAt">) => {
      dispatch({
        type: "ADD_ANNOUNCEMENT",
        payload: { ...a, id: `A${++annIdRef.current}`, createdAt: Date.now() },
      });
    },
    [],
  );

  const value = useMemo<ContextValue>(
    () => ({ state, now, remainingMs, elapsedMs, progress, dispatch, addAnnouncement }),
    [state, now, remainingMs, elapsedMs, progress, addAnnouncement],
  );

  return <ContestContext.Provider value={value}>{children}</ContestContext.Provider>;
}

export function useContest() {
  const ctx = useContext(ContestContext);
  if (!ctx) throw new Error("useContest must be used inside ContestProvider");
  return ctx;
}

/* ---------- Derived selectors ---------- */

export interface LeaderboardRow {
  rank: number;
  participant: Participant;
  score: number;
  solved: number;
  lastAcceptedAt: number | null;
  attempts: number;
  byProblem: Record<string, { solved: boolean; attempts: number }>;
}

export function useLeaderboard(): LeaderboardRow[] {
  const { state } = useContest();
  return useMemo(() => {
    const map = new Map<string, LeaderboardRow>();
    for (const p of state.participants) {
      map.set(p.id, {
        rank: 0,
        participant: p,
        score: 0,
        solved: 0,
        lastAcceptedAt: null,
        attempts: 0,
        byProblem: Object.fromEntries(
          state.problems.map((pr) => [pr.id, { solved: false, attempts: 0 }]),
        ),
      });
    }
    // Process oldest first for correct "first AC" timing
    const ordered = [...state.submissions].sort((a, b) => a.submittedAt - b.submittedAt);
    for (const s of ordered) {
      const row = map.get(s.participantId);
      if (!row) continue;
      row.attempts++;
      const pb = row.byProblem[s.problemId];
      if (!pb) continue;
      pb.attempts++;
      if (s.verdict === "AC" && !pb.solved) {
        pb.solved = true;
        row.score += s.score;
        row.solved++;
        row.lastAcceptedAt = s.submittedAt;
      }
    }
    const rows = [...map.values()].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.solved !== a.solved) return b.solved - a.solved;
      return (a.lastAcceptedAt ?? Infinity) - (b.lastAcceptedAt ?? Infinity);
    });
    rows.forEach((r, i) => (r.rank = i + 1));
    return rows;
  }, [state.participants, state.submissions, state.problems]);
}

export function useStats() {
  const { state } = useContest();
  return useMemo(() => {
    const total = state.submissions.length;
    const ac = state.submissions.filter((s) => s.verdict === "AC").length;
    const active = state.participants.filter((p) => p.status === "active").length;
    const acRate = total ? (ac / total) * 100 : 0;
    const since = Date.now() - 60_000;
    const perMin = state.submissions.filter((s) => s.submittedAt >= since).length;
    return { total, ac, active, acRate, perMin, totalParticipants: state.participants.length };
  }, [state.submissions, state.participants]);
}
