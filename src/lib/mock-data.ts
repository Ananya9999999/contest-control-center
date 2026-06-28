export type Difficulty = "Easy" | "Medium" | "Hard";
export type Verdict =
  | "AC"
  | "WA"
  | "TLE"
  | "RE"
  | "CE"
  | "MLE"
  | "Pending";
export type Language = "C++" | "Python" | "Java" | "JavaScript" | "Go" | "Rust";

export interface Problem {
  id: string;
  code: string;
  title: string;
  difficulty: Difficulty;
  points: number;
  totalSubmissions: number;
  acceptedSubmissions: number;
  tags: string[];
}

export interface Participant {
  id: string;
  handle: string;
  name: string;
  college: string;
  year: number;
  rating: number;
  status: "active" | "idle" | "disqualified" | "offline";
  joinedAt: number; // ms since contest start
  country: string;
}

export interface Submission {
  id: string;
  participantId: string;
  problemId: string;
  verdict: Verdict;
  language: Language;
  runtimeMs: number;
  memoryKb: number;
  submittedAt: number; // ms epoch
  score: number;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  severity: "info" | "warning" | "critical";
  createdAt: number;
  pinned?: boolean;
}

const FIRST = [
  "Aarav","Vihaan","Ananya","Diya","Ishaan","Kavya","Reyansh","Aanya","Arjun","Saanvi",
  "Krish","Myra","Atharv","Sara","Vivaan","Pari","Aditya","Riya","Kabir","Tara",
  "Rohan","Meera","Yash","Anika","Dev","Nyra","Aryan","Ira","Shaurya","Zara",
];
const LAST = [
  "Sharma","Verma","Iyer","Reddy","Patel","Nair","Khan","Gupta","Singh","Rao",
  "Mehta","Bose","Das","Banerjee","Chopra","Kapoor","Joshi","Pillai","Menon","Shetty",
];
const COLLEGES = ["VIT Vellore","VIT Chennai","VIT-AP","VIT Bhopal","IIT Madras","NIT Trichy","BITS Pilani","SRM"];
const COUNTRIES = ["IN","US","SG","AE","DE","JP"];

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}
const rand = rng(20260627);
const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];

export const PROBLEMS: Problem[] = [
  { id: "P1", code: "ARRSUM", title: "Array Sum Queries", difficulty: "Easy", points: 100, totalSubmissions: 412, acceptedSubmissions: 318, tags: ["arrays","prefix-sum"] },
  { id: "P2", code: "BINTREE", title: "Balanced Binary Tree", difficulty: "Medium", points: 250, totalSubmissions: 287, acceptedSubmissions: 142, tags: ["trees","recursion"] },
  { id: "P3", code: "GRAPHX", title: "Shortest Path Grid", difficulty: "Medium", points: 300, totalSubmissions: 198, acceptedSubmissions: 73, tags: ["graphs","bfs"] },
  { id: "P4", code: "DPMAX", title: "Maximum Subarray DP", difficulty: "Easy", points: 150, totalSubmissions: 356, acceptedSubmissions: 241, tags: ["dp","arrays"] },
  { id: "P5", code: "STRPAL", title: "Palindrome Partitioning", difficulty: "Hard", points: 500, totalSubmissions: 142, acceptedSubmissions: 28, tags: ["strings","dp"] },
  { id: "P6", code: "NUMTHRY", title: "Modular Inverse", difficulty: "Hard", points: 450, totalSubmissions: 96, acceptedSubmissions: 19, tags: ["math","number-theory"] },
  { id: "P7", code: "GREEDY1", title: "Interval Scheduling", difficulty: "Medium", points: 275, totalSubmissions: 221, acceptedSubmissions: 118, tags: ["greedy"] },
  { id: "P8", code: "BITOPS", title: "XOR Subset Trick", difficulty: "Hard", points: 475, totalSubmissions: 88, acceptedSubmissions: 15, tags: ["bitmask","dp"] },
];

export function generateParticipants(n = 120): Participant[] {
  const out: Participant[] = [];
  for (let i = 0; i < n; i++) {
    const first = pick(FIRST);
    const last = pick(LAST);
    const handle = `${first.toLowerCase()}_${Math.floor(rand() * 999)}`;
    const statusRoll = rand();
    out.push({
      id: `U${1000 + i}`,
      handle,
      name: `${first} ${last}`,
      college: pick(COLLEGES),
      year: 1 + Math.floor(rand() * 4),
      rating: 800 + Math.floor(rand() * 2200),
      status:
        statusRoll < 0.7 ? "active" :
        statusRoll < 0.88 ? "idle" :
        statusRoll < 0.97 ? "offline" : "disqualified",
      joinedAt: Math.floor(rand() * 1000 * 60 * 5),
      country: pick(COUNTRIES),
    });
  }
  return out;
}

const VERDICT_WEIGHTS: [Verdict, number][] = [
  ["AC", 0.42], ["WA", 0.28], ["TLE", 0.12], ["RE", 0.08], ["CE", 0.05], ["MLE", 0.05],
];
function weightedVerdict(): Verdict {
  let r = rand();
  for (const [v, w] of VERDICT_WEIGHTS) {
    if ((r -= w) <= 0) return v;
  }
  return "AC";
}

export function generateInitialSubmissions(
  participants: Participant[],
  count = 240,
  contestStart: number,
): Submission[] {
  const subs: Submission[] = [];
  for (let i = 0; i < count; i++) {
    const p = participants[Math.floor(rand() * participants.length)];
    const prob = PROBLEMS[Math.floor(rand() * PROBLEMS.length)];
    const verdict = weightedVerdict();
    const t = contestStart + Math.floor(rand() * (Date.now() - contestStart));
    subs.push({
      id: `S${100000 + i}`,
      participantId: p.id,
      problemId: prob.id,
      verdict,
      language: pick(["C++","Python","Java","JavaScript","Go","Rust"]) as Language,
      runtimeMs: 20 + Math.floor(rand() * 1500),
      memoryKb: 1024 + Math.floor(rand() * 64 * 1024),
      submittedAt: t,
      score: verdict === "AC" ? prob.points : 0,
    });
  }
  return subs.sort((a, b) => b.submittedAt - a.submittedAt);
}

export function generateAnnouncements(): Announcement[] {
  const now = Date.now();
  return [
    { id: "A1", title: "Contest is LIVE", body: "Good luck to all participants! Submissions are now open.", severity: "info", createdAt: now - 1000 * 60 * 90, pinned: true },
    { id: "A2", title: "Clarification on Problem GRAPHX", body: "The grid may contain at most 10^6 cells. Plan memory accordingly.", severity: "warning", createdAt: now - 1000 * 60 * 42 },
    { id: "A3", title: "Judge restart at minute 75", body: "Brief 30s judge maintenance window. No data loss expected.", severity: "info", createdAt: now - 1000 * 60 * 20 },
  ];
}

export function makeRandomSubmission(
  participants: Participant[],
): Omit<Submission, "id" | "submittedAt"> {
  const p = participants[Math.floor(Math.random() * participants.length)];
  const prob = PROBLEMS[Math.floor(Math.random() * PROBLEMS.length)];
  const r = Math.random();
  const verdict: Verdict =
    r < 0.45 ? "AC" : r < 0.7 ? "WA" : r < 0.82 ? "TLE" : r < 0.9 ? "RE" : r < 0.96 ? "CE" : "MLE";
  const langs: Language[] = ["C++","Python","Java","JavaScript","Go","Rust"];
  return {
    participantId: p.id,
    problemId: prob.id,
    verdict,
    language: langs[Math.floor(Math.random() * langs.length)],
    runtimeMs: 20 + Math.floor(Math.random() * 1500),
    memoryKb: 1024 + Math.floor(Math.random() * 64 * 1024),
    score: verdict === "AC" ? prob.points : 0,
  };
}
