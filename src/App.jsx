import React, { useState, useMemo, useEffect } from "react";
import { supabase } from "./supabaseClient";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell,
  ResponsiveContainer, CartesianGrid, ReferenceLine,
} from "recharts";
import {
  LayoutDashboard, ClipboardList, TrendingUp, Users as UsersIcon, Info, Filter,
  RefreshCw, DollarSign, Briefcase, CheckCircle2, Clock, AlertTriangle, Circle,
  Plus, Pencil, Trash2, X, ArrowLeftRight, Calculator, FlaskConical,
  Building2, UserMinus, Scale, Layers,
} from "lucide-react";

const LOGO_SRC = "data:image/png;base64,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";

const DEPARTMENTS = ["IPF", "PPP", "EODB", "S&I", "ACCOUNT", "COMMS", "ADMIN"];
const STATUSES = ["Not Started", "Ongoing", "Completed", "Delayed"];
const STATUS_COLOR = { Completed: "#1f7a4d", Ongoing: "#d9a441", "Not Started": "#9aa79f", Delayed: "#b5493f" };
const STATUS_ICON = { Completed: CheckCircle2, Ongoing: Clock, "Not Started": Circle, Delayed: AlertTriangle };
const SOURCE_COLOR = { FDI: "#0b3d2e", DDI: "#d9a441" };
const INVESTMENT_STATUSES = ["Announced", "Actualized"];
const INVESTMENT_STATUS_COLOR = { Announced: "#d9a441", Actualized: "#1f7a4d" };
const SECTOR_PALETTE = ["#0b3d2e", "#1f7a4d", "#3fae67", "#7dc98f", "#d9a441", "#b5493f", "#5b6b62", "#8fc2a4"];
const ANNUAL_TARGET = 1000000000; // stored/target figures are in USD
const FX_RATES = { USD: 1, NGN: 1325 }; // representative mid-market rate; the real app fetches this live
const FX_SYMBOL = { USD: "$", NGN: "₦" };
const FX_AS_OF = "Sep 12, 2026";

// ---- Custom KPI formula engine ----
// A small, safe language inspired by DAX's aggregate+filter pattern:
//   SUM(field), AVERAGE(field), COUNT(*), MIN(field), MAX(field)
//   each with an optional WHERE clause (field OP value [AND ...]),
//   combined with + - * / and parentheses. Never runs SQL or eval().
const KPI_FUNCS = ["SUM", "AVERAGE", "COUNT", "MIN", "MAX"];
const KPI_COMPARATORS = [">=", "<=", "!=", "=", ">", "<"];

function kpiTokenize(input) {
  const tokens = [];
  let i = 0;
  const isSpace = (c) => /\s/.test(c);
  const isDigit = (c) => /[0-9.]/.test(c);
  const isIdentStart = (c) => /[A-Za-z_]/.test(c);
  const isIdentChar = (c) => /[A-Za-z0-9_]/.test(c);
  while (i < input.length) {
    const c = input[i];
    if (isSpace(c)) { i++; continue; }
    if (c === "'" || c === '"') {
      const quote = c; let j = i + 1, str = "";
      while (j < input.length && input[j] !== quote) { str += input[j]; j++; }
      tokens.push({ type: "STRING", value: str }); i = j + 1; continue;
    }
    if (isDigit(c)) {
      let j = i, num = "";
      while (j < input.length && isDigit(input[j])) { num += input[j]; j++; }
      tokens.push({ type: "NUMBER", value: parseFloat(num) }); i = j; continue;
    }
    if (isIdentStart(c)) {
      let j = i, ident = "";
      while (j < input.length && isIdentChar(input[j])) { ident += input[j]; j++; }
      const upper = ident.toUpperCase();
      if (KPI_FUNCS.includes(upper)) tokens.push({ type: "FUNC", value: upper });
      else if (upper === "WHERE") tokens.push({ type: "WHERE" });
      else if (upper === "AND") tokens.push({ type: "AND" });
      else tokens.push({ type: "IDENT", value: ident });
      i = j; continue;
    }
    const map = { "+": "PLUS", "-": "MINUS", "*": "STAR", "/": "SLASH", "(": "LPAREN", ")": "RPAREN" };
    if (map[c]) { tokens.push({ type: map[c] }); i++; continue; }
    let matched = false;
    for (const op of KPI_COMPARATORS) {
      if (input.slice(i, i + op.length) === op) { tokens.push({ type: "OP", value: op }); i += op.length; matched = true; break; }
    }
    if (matched) continue;
    throw new Error(`Unexpected character '${c}' at position ${i}`);
  }
  tokens.push({ type: "EOF" });
  return tokens;
}

class KpiParser {
  constructor(tokens) { this.tokens = tokens; this.pos = 0; }
  peek() { return this.tokens[this.pos]; }
  next() { return this.tokens[this.pos++]; }
  expect(type) { const t = this.next(); if (t.type !== type) throw new Error(`Expected ${type} but got ${t.type}`); return t; }
  parseExpression() {
    let node = this.parseTerm();
    while (["PLUS", "MINUS"].includes(this.peek().type)) {
      const op = this.next().type;
      node = { type: "BinOp", op: op === "PLUS" ? "+" : "-", left: node, right: this.parseTerm() };
    }
    return node;
  }
  parseTerm() {
    let node = this.parseFactor();
    while (["STAR", "SLASH"].includes(this.peek().type)) {
      const op = this.next().type;
      node = { type: "BinOp", op: op === "STAR" ? "*" : "/", left: node, right: this.parseFactor() };
    }
    return node;
  }
  parseFactor() {
    const t = this.peek();
    if (t.type === "NUMBER") { this.next(); return { type: "Number", value: t.value }; }
    if (t.type === "MINUS") { this.next(); return { type: "Negate", value: this.parseFactor() }; }
    if (t.type === "LPAREN") { this.next(); const node = this.parseExpression(); this.expect("RPAREN"); return node; }
    if (t.type === "FUNC") return this.parseAggregate();
    throw new Error(`Unexpected token ${t.type}`);
  }
  parseAggregate() {
    const func = this.next().value;
    this.expect("LPAREN");
    let field = "*";
    if (this.peek().type === "STAR") this.next();
    else field = this.expect("IDENT").value;
    this.expect("RPAREN");
    let where = null;
    if (this.peek().type === "WHERE") { this.next(); where = this.parseConditions(); }
    return { type: "Aggregate", func, field, where };
  }
  parseConditions() {
    const conditions = [this.parseCondition()];
    while (this.peek().type === "AND") { this.next(); conditions.push(this.parseCondition()); }
    return conditions;
  }
  parseCondition() {
    const field = this.expect("IDENT").value;
    const op = this.expect("OP").value;
    const valTok = this.next();
    if (valTok.type !== "STRING" && valTok.type !== "NUMBER") throw new Error(`Expected a value after '${op}'`);
    return { field, op, value: valTok.value };
  }
}

function kpiMatchCondition(row, cond) {
  const rowVal = row[cond.field], val = cond.value;
  switch (cond.op) {
    case "=": return String(rowVal) === String(val);
    case "!=": return String(rowVal) !== String(val);
    case ">": return Number(rowVal) > Number(val);
    case "<": return Number(rowVal) < Number(val);
    case ">=": return Number(rowVal) >= Number(val);
    case "<=": return Number(rowVal) <= Number(val);
    default: throw new Error(`Unknown operator ${cond.op}`);
  }
}
function kpiFilterRows(rows, where) { return where ? rows.filter((r) => where.every((c) => kpiMatchCondition(r, c))) : rows; }
function kpiEvalAggregate(node, rows) {
  const filtered = kpiFilterRows(rows, node.where);
  const { func, field } = node;
  if (func === "COUNT") return filtered.length;
  const values = filtered.map((r) => Number(r[field]) || 0);
  if (func === "SUM") return values.reduce((a, b) => a + b, 0);
  if (func === "AVERAGE") return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  if (func === "MIN") return values.length ? Math.min(...values) : 0;
  if (func === "MAX") return values.length ? Math.max(...values) : 0;
  throw new Error(`Unknown function ${func}`);
}
function kpiEvalNode(node, rows) {
  switch (node.type) {
    case "Number": return node.value;
    case "Negate": return -kpiEvalNode(node.value, rows);
    case "Aggregate": return kpiEvalAggregate(node, rows);
    case "BinOp": {
      const l = kpiEvalNode(node.left, rows), r = kpiEvalNode(node.right, rows);
      if (node.op === "+") return l + r;
      if (node.op === "-") return l - r;
      if (node.op === "*") return l * r;
      if (node.op === "/") return r === 0 ? 0 : l / r;
    }
    default: throw new Error(`Unknown node type ${node.type}`);
  }
}
function parseKpiFormula(formula) {
  const parser = new KpiParser(kpiTokenize(formula));
  const ast = parser.parseExpression();
  parser.expect("EOF");
  return ast;
}
function evaluateKpiFormula(formula, rows) { return kpiEvalNode(parseKpiFormula(formula), rows); }
const KPI_FORMAT = {
  number: (v) => Math.round(v).toLocaleString(),
  percent: (v) => `${Math.round(v)}%`,
  currency: (v) => "$" + Math.round(v).toLocaleString(),
};

const DEPT_TARGETS = { IPF: 4, PPP: 3, EODB: 4, "S&I": 3, ACCOUNT: 3, COMMS: 3, ADMIN: 3 };

// NOTE: the arrays below are no longer used to seed app state -- the app now loads
// real data from Supabase on login. Left here only as a reference for each record's
// shape (handy if you want to bulk-import sample rows via the Supabase SQL editor).
const seedAppraisals = [
  { id: 1, department: "IPF", period: "Q1 2026", activity: "Investor roundtable series", objective: "Widen the pipeline of committed investors", indicator: "No. of new leads engaged", outcome: "14 leads engaged, 3 converted to MOUs", status: "Completed", mov: "Attendance sheets, signed MOUs", comments: "Ahead of target" },
  { id: 2, department: "IPF", period: "Q1 2026", activity: "Diaspora investment forum", objective: "Attract diaspora-backed capital", indicator: "Commitments secured", outcome: "Forum postponed", status: "Delayed", mov: "-", comments: "Venue fell through, rescheduling" },
  { id: 3, department: "PPP", period: "Q1 2026", activity: "Concession framework review", objective: "Modernize PPP concession templates", indicator: "Revised framework approved", outcome: "Draft under legal review", status: "Ongoing", mov: "Draft framework document", comments: "Awaiting AG's office sign-off" },
  { id: 4, department: "EODB", period: "Q1 2026", activity: "Permit turnaround audit", objective: "Cut average permit issuance time", indicator: "Average days to issue", outcome: "Down from 21 to 13 days", status: "Completed", mov: "Permit register export", comments: "" },
  { id: 5, department: "S&I", period: "Q1 2026", activity: "Sector baseline survey", objective: "Establish investment baseline by sector", indicator: "Survey completion rate", outcome: "62% of firms surveyed", status: "Ongoing", mov: "Field survey logs", comments: "Extended into Q2" },
  { id: 6, department: "ACCOUNT", period: "Q1 2026", activity: "Quarterly reconciliation", objective: "Close books within 5 working days", indicator: "Days to close", outcome: "Not yet started", status: "Not Started", mov: "-", comments: "Waiting on bank statements" },
  { id: 7, department: "COMMS", period: "Q1 2026", activity: "Investor newsletter relaunch", objective: "Grow subscriber engagement", indicator: "Open rate", outcome: "Open rate slipped to 18%", status: "Delayed", mov: "Mailchimp analytics", comments: "Needs new editorial calendar" },
  { id: 8, department: "ADMIN", period: "Q1 2026", activity: "Fleet maintenance schedule", objective: "Reduce vehicle downtime", indicator: "Downtime days per quarter", outcome: "Schedule published, tracking begins Q2", status: "Ongoing", mov: "Maintenance log", comments: "" },
];

const seedInvestments = [
  { id: 1, company_investor: "Delta Agro Processing Ltd", project_description: "Cassava processing plant", sector: "Agro-processing", lga: "Ikwerre", amount: 42000000, source: "DDI", jobs_to_be_created: 180, date_recorded: "2026-01-14", department: "IPF", status: "Actualized" },
  { id: 2, company_investor: "Greenline Energy BV", project_description: "Mini-grid solar installation", sector: "Energy", lga: "Ahoada East", amount: 95000000, source: "FDI", jobs_to_be_created: 95, date_recorded: "2026-02-02", department: "IPF", status: "Actualized" },
  { id: 3, company_investor: "Portside Logistics Co.", project_description: "Container freight terminal upgrade", sector: "Logistics", lga: "Port Harcourt", amount: 58000000, source: "DDI", jobs_to_be_created: 140, date_recorded: "2026-02-20", department: "PPP", status: "Announced" },
  { id: 4, company_investor: "Meridian Foods Intl", project_description: "Cold chain storage facility", sector: "Agro-processing", lga: "Obio/Akpor", amount: 31000000, source: "FDI", jobs_to_be_created: 60, date_recorded: "2026-03-05", department: "IPF", status: "Actualized" },
  { id: 5, company_investor: "Coastal Minerals Ltd", project_description: "Sand mining processing unit", sector: "Mining", lga: "Asari-Toru", amount: 27000000, source: "DDI", jobs_to_be_created: 70, date_recorded: "2026-04-18", department: "S&I", status: "Announced" },
  { id: 6, company_investor: "NorthStar Shipping", project_description: "Barge fabrication yard expansion", sector: "Logistics", lga: "Bonny", amount: 73000000, source: "FDI", jobs_to_be_created: 210, date_recorded: "2026-05-30", department: "PPP", status: "Actualized" },
  { id: 7, company_investor: "Rivoli AgriTech", project_description: "Poultry feed mill", sector: "Agro-processing", lga: "Etche", amount: 24000000, source: "DDI", jobs_to_be_created: 85, date_recorded: "2026-07-09", department: "IPF", status: "Announced" },
  { id: 8, company_investor: "BlueWave Energy Partners", project_description: "Gas processing plant expansion", sector: "Energy", lga: "Eleme", amount: 165000000, source: "FDI", jobs_to_be_created: 260, date_recorded: "2026-08-22", department: "IPF", status: "Actualized" },
  { id: 9, company_investor: "Nimbus Data Centres", project_description: "Regional data centre", sector: "Technology", lga: "Obio/Akpor", amount: 58000000, source: "FDI", jobs_to_be_created: 50, date_recorded: "2026-10-11", department: "S&I", status: "Announced" },
];

const seedCustomKpis = [
  { id: 1, name: "FDI Share", description: "Share of total investment value from foreign investors", dataset: "investments", formula: "(SUM(amount) WHERE source = 'FDI') / SUM(amount) * 100", format: "percent" },
  { id: 2, name: "Energy Sector Jobs", description: "Jobs pledged from Energy-sector deals", dataset: "investments", formula: "SUM(jobs_to_be_created) WHERE sector = 'Energy'", format: "number" },
];

const JOB_CATEGORIES = ["Contract", "Fulltime", "Pool", "IT", "NYSC"];
// Agency-wide leadership titles (held once, or once per named department) vs. the
// operational titles that repeat across every department's rank and file.
const TOP_DESIGNATIONS = ["MD/CEO", "Director of Admin & Supply", "Chief of Staff", "Vice President", "Head of Comms", "Head of Account"];
const OPERATIONAL_DESIGNATIONS = ["Senior Portfolio Manager", "Senior Analyst", "Analyst", "Intern", "NYSC", "IT Student"];
const DESIGNATIONS = [...TOP_DESIGNATIONS, ...OPERATIONAL_DESIGNATIONS];
const DESIGNATION_JOB_CATEGORY = {
  "MD/CEO": "Fulltime", "Director of Admin & Supply": "Fulltime", "Chief of Staff": "Fulltime", "Vice President": "Fulltime",
  "Head of Comms": "Fulltime", "Head of Account": "Fulltime",
  "Senior Portfolio Manager": "Fulltime", "Senior Analyst": "Fulltime", "Analyst": "Contract",
  "Intern": "Pool", "NYSC": "NYSC", "IT Student": "IT",
};
const GENDER_COLOR = { Male: "#0b3d2e", Female: "#7dc98f" };

const FIRST_NAMES_M = ["Emeka", "Musa", "Tunde", "Chidi", "Ibrahim", "Segun", "Yusuf", "Kelechi", "Aliyu", "Femi", "Obinna", "Bello"];
const FIRST_NAMES_F = ["Amina", "Ngozi", "Fatima", "Chiamaka", "Halima", "Bukola", "Grace", "Zainab", "Adaeze", "Hauwa", "Funke", "Blessing"];
const LAST_NAMES = ["Okafor", "Suleiman", "Adamu", "Eze", "Yakubu", "Balogun", "Nwosu", "Danjuma", "Okonkwo", "Garba", "Adeyemi", "Musa"];

function makeName(isMale, seed) {
  const firstPool = isMale ? FIRST_NAMES_M : FIRST_NAMES_F;
  return `${firstPool[seed % firstPool.length]} ${LAST_NAMES[(seed * 2 + 1) % LAST_NAMES.length]}`;
}

function buildSeedEmployees() {
  const employees = [];
  let id = 1;

  // Agency-wide leadership sits under ADMIN, except the two role-specific "Head of"
  // titles which map to their own named departments.
  const leadership = [
    { designation: "MD/CEO", department: null, gender: "Male" },
    { designation: "Director of Admin & Supply", department: "ADMIN", gender: "Female" },
    { designation: "Chief of Staff", department: null, gender: "Female" },
    { designation: "Vice President", department: "ADMIN", gender: "Male" },
    { designation: "Head of Comms", department: "COMMS", gender: "Female" },
    { designation: "Head of Account", department: "ACCOUNT", gender: "Male" },
  ];
  leadership.forEach((role, idx) => {
    employees.push({
      id: id++,
      name: makeName(role.gender === "Male", idx),
      department: role.department,
      gender: role.gender,
      job_category: DESIGNATION_JOB_CATEGORY[role.designation],
      designation: role.designation,
      status: "Active",
      hire_date: `${2017 + (idx % 4)}-0${(idx % 9) + 1}-15`,
      exit_date: null,
    });
  });

  // Operational headcount, spread across every department and every operational designation.
  DEPARTMENTS.forEach((dept, dIdx) => {
    const headcount = 6; // per department
    for (let i = 0; i < headcount; i++) {
      const isMale = (dIdx + i) % 2 === 0;
      const gender = isMale ? "Male" : "Female";
      const name = makeName(isMale, dIdx * 3 + i);
      const designation = OPERATIONAL_DESIGNATIONS[i % OPERATIONAL_DESIGNATIONS.length];
      const jobCategory = DESIGNATION_JOB_CATEGORY[designation];
      const hireYear = 2018 + ((dIdx + i) % 8); // spread hire years 2018-2025
      const hireDate = `${hireYear}-0${((dIdx + i) % 9) + 1}-15`;
      // Mark roughly 1 in 8 as exited within the last year, for a realistic attrition rate.
      const isExited = (id % 8 === 0);
      employees.push({
        id: id++,
        name,
        department: dept,
        gender,
        job_category: jobCategory,
        designation,
        status: isExited ? "Exited" : "Active",
        hire_date: hireDate,
        exit_date: isExited ? "2026-0" + (((dIdx + i) % 8) + 1) + "-01" : null,
      });
    }
  });

  return employees;
}

const seedEmployees = buildSeedEmployees();
const TODAY = new Date("2026-09-14");

function yearsBetween(startStr, endStr) {
  const start = new Date(startStr);
  const end = endStr ? new Date(endStr) : TODAY;
  return (end - start) / (1000 * 60 * 60 * 24 * 365.25);
}

function groupByGenderCount(rows, keyField, keyValues, genderFilter) {
  return keyValues.map((key) => {
    const rowsForKey = rows.filter((r) => r[keyField] === key);
    if (genderFilter === "All") {
      return {
        [keyField]: key,
        Male: rowsForKey.filter((r) => r.gender === "Male").length,
        Female: rowsForKey.filter((r) => r.gender === "Female").length,
      };
    }
    return { [keyField]: key, count: rowsForKey.filter((r) => r.gender === genderFilter).length };
  });
}

// NOTE: no longer used now that login goes through real Supabase Auth. Kept only
// as a reminder of the two roles the app expects a profiles row to have.
const DEMO_USERS = {
  admin: { name: "Chidinma Okoro", role: "admin", department: null },
  staff: { name: "Tamuno Wagbara", role: "staff", department: "IPF" },
};

function usd(n) { return "$" + Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 0 }); }
function usdM(n) { return "$" + (Number(n || 0) / 1e6).toFixed(0) + "M"; }
function quarterIndex(dateStr) {
  if (!dateStr) return null;
  const m = new Date(dateStr).getMonth();
  if (Number.isNaN(m)) return null;
  return Math.floor(m / 3);
}
function uniqueValues(arr, key) { return [...new Set(arr.map((x) => x[key]).filter(Boolean))]; }

function useCountUp(value, duration = 800) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let raf, start = null;
    function step(ts) {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return display;
}

function BrandMark({ size = 40 }) {
  return (
    <div style={{ background: "#fff", borderRadius: "50%", padding: size * 0.16, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.18)", flexShrink: 0 }}>
      <img src={LOGO_SRC} alt="NASIDA" style={{ height: size * 0.68, width: "auto", display: "block" }} />
    </div>
  );
}

function generateInsights(appraisals, investments, target, fmtM) {
  const insights = [];
  const total = appraisals.length;
  const completed = appraisals.filter((r) => r.status === "Completed").length;
  const delayed = appraisals.filter((r) => r.status === "Delayed");
  const rate = total ? Math.round((completed / total) * 100) : 0;

  if (total === 0) {
    insights.push("No activities match the current filters.");
  } else {
    insights.push(`${rate}% of the filtered activities are complete (${completed} of ${total}).`);
    if (delayed.length) {
      const depts = [...new Set(delayed.map((d) => d.department))].join(", ");
      insights.push(`${delayed.length} ${delayed.length > 1 ? "activities are" : "activity is"} delayed, concentrated in ${depts} — these need the closest follow-up this quarter.`);
    }
    const deptStats = DEPARTMENTS.map((d) => {
      const rows = appraisals.filter((r) => r.department === d);
      const c = rows.filter((r) => r.status === "Completed").length;
      return { d, rate: rows.length ? c / rows.length : 0, rows: rows.length };
    }).filter((x) => x.rows > 0);
    if (deptStats.length) {
      const best = deptStats.reduce((a, b) => (b.rate > a.rate ? b : a));
      insights.push(`${best.d} has the strongest completion rate in view at ${Math.round(best.rate * 100)}%.`);
    }
  }

  const totalInvestment = investments.reduce((a, b) => a + Number(b.amount || 0), 0);
  if (investments.length === 0) {
    insights.push("No investment records match the current filters.");
  } else {
    const pct = target ? Math.round((totalInvestment / target) * 100) : 0;
    insights.push(`Filtered investment value is ${fmtM(totalInvestment)} — ${pct}% of the ${fmtM(target)} annual KPI.`);
    const fdi = investments.filter((i) => i.source === "FDI").reduce((a, b) => a + Number(b.amount || 0), 0);
    const ddi = investments.filter((i) => i.source === "DDI").reduce((a, b) => a + Number(b.amount || 0), 0);
    if (fdi + ddi > 0) {
      const fdiShare = Math.round((fdi / (fdi + ddi)) * 100);
      if (fdiShare < 40) insights.push(`FDI is only ${fdiShare}% of what's in view — stepping up international investor outreach could help rebalance it.`);
      else if (fdiShare > 70) insights.push(`FDI makes up ${fdiShare}% of what's in view. Growing domestic investor engagement would diversify funding sources.`);
    }
    const sectorMap = {};
    investments.forEach((i) => { sectorMap[i.sector] = (sectorMap[i.sector] || 0) + Number(i.amount || 0); });
    const sectors = Object.entries(sectorMap).sort((a, b) => b[1] - a[1]);
    if (sectors.length) {
      const [topSector, topAmt] = sectors[0];
      const share = Math.round((topAmt / totalInvestment) * 100);
      if (share > 40) insights.push(`${topSector} accounts for ${share}% of the value in view — a concentration worth diversifying against.`);
    }
  }
  return insights;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [tab, setTab] = useState("overview");
  const [appraisals, setAppraisals] = useState([]);
  const [investments, setInvestments] = useState([]);

  const [deptFilter, setDeptFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [ovDept, setOvDept] = useState("");
  const [ovStatus, setOvStatus] = useState("");
  const [ovSector, setOvSector] = useState("");
  const [ovLga, setOvLga] = useState("");
  const [ovSource, setOvSource] = useState("");
  const [ovInvestStatus, setOvInvestStatus] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showWfFilters, setShowWfFilters] = useState(false);
  const [wfSpinning, setWfSpinning] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [trendMetric, setTrendMetric] = useState("amount");

  const [editingA, setEditingA] = useState(null);
  const [editingI, setEditingI] = useState(null);

  const [currency, setCurrency] = useState("USD");
  const [fxSpin, setFxSpin] = useState(false);

  function fmt(amountUsd) {
    const rate = FX_RATES[currency] || 1;
    const val = Number(amountUsd || 0) * rate;
    return FX_SYMBOL[currency] + val.toLocaleString(undefined, { maximumFractionDigits: 0 });
  }
  function fmtM(amountUsd) {
    const rate = FX_RATES[currency] || 1;
    const val = Number(amountUsd || 0) * rate;
    const sym = FX_SYMBOL[currency];
    if (val >= 1e9) return sym + (val / 1e9).toFixed(1) + "B";
    if (val >= 1e6) return sym + (val / 1e6).toFixed(0) + "M";
    if (val >= 1e3) return sym + (val / 1e3).toFixed(0) + "K";
    return sym + val.toFixed(0);
  }
  function refreshFx() {
    setFxSpin(true);
    setTimeout(() => setFxSpin(false), 500);
  }

  const [employees, setEmployees] = useState([]);
  const [wfGender, setWfGender] = useState("All");
  const [editingE, setEditingE] = useState(null);
  const emptyEmployee = () => ({
    name: "", department: DEPARTMENTS[0], gender: "Male", job_category: "Fulltime",
    designation: "Analyst", status: "Active", hire_date: "", exit_date: "",
  });
  const [formE, setFormE] = useState(emptyEmployee());

  async function submitEmployee(e) {
    e.preventDefault();
    const payload = { ...formE, exit_date: formE.status === "Exited" ? formE.exit_date : null };
    if (editingE) {
      const { data, error } = await supabase.from("employees").update({ ...payload, updated_at: new Date().toISOString() }).eq("id", editingE).select().single();
      if (!error && data) setEmployees(employees.map((r) => (r.id === editingE ? data : r)));
    } else {
      const { data, error } = await supabase.from("employees").insert({ ...payload, created_by: user.id }).select().single();
      if (!error && data) setEmployees([data, ...employees]);
    }
    setEditingE(null);
    setFormE(emptyEmployee());
  }
  async function deleteEmployee(id) {
    if (!confirm("Delete this employee record?")) return;
    const { error } = await supabase.from("employees").delete().eq("id", id);
    if (!error) setEmployees(employees.filter((x) => x.id !== id));
  }
  function startEditEmployee(r) {
    setEditingE(r.id);
    setFormE({ ...r, exit_date: r.exit_date || "" });
  }

  const workforceSummary = useMemo(() => {
    // Everything below is scoped to the current gender filter, so both the charts
    // AND the KPI cards react when you flip between All / Male / Female.
    const filtered = wfGender === "All" ? employees : employees.filter((e) => e.gender === wfGender);
    const active = filtered.filter((e) => e.status === "Active");
    const exited = filtered.filter((e) => e.status === "Exited");
    const totalStaff = active.length;
    const attritionRate = filtered.length ? Math.round((exited.length / filtered.length) * 100) : 0;
    const avgTenure = active.length ? active.reduce((sum, e) => sum + yearsBetween(e.hire_date, null), 0) / active.length : 0;
    const newHires = active.filter((e) => new Date(e.hire_date) >= new Date("2025-01-01")).length;

    // Whole-workforce baselines, used for "share of total" context when a single gender is selected.
    const allActive = employees.filter((e) => e.status === "Active");
    const femaleActiveAll = allActive.filter((e) => e.gender === "Female").length;
    const maleActiveAll = allActive.length - femaleActiveAll;
    const femalePctAll = allActive.length ? Math.round((femaleActiveAll / allActive.length) * 100) : 0;
    const shareOfTotal = allActive.length ? Math.round((totalStaff / allActive.length) * 100) : 0;

    function topBy(field, values) {
      let best = null;
      values.forEach((v) => {
        const count = active.filter((e) => e[field] === v).length;
        if (!best || count > best.count) best = { label: v, count };
      });
      return best;
    }
    const topDept = topBy("department", DEPARTMENTS);
    const topJobCategory = topBy("job_category", JOB_CATEGORIES);
    const topDesignation = topBy("designation", DESIGNATIONS);
    const deptsRepresented = DEPARTMENTS.filter((d) => active.some((e) => e.department === d)).length;

    const byDept = groupByGenderCount(active, "department", DEPARTMENTS, wfGender);
    const byJobCategory = groupByGenderCount(active, "job_category", JOB_CATEGORIES, wfGender);
    const byDesignation = groupByGenderCount(active, "designation", DESIGNATIONS, wfGender);

    return {
      totalStaff, attritionRate, avgTenure, newHires, exitedCount: exited.length,
      maleActiveAll, femaleActiveAll, femalePctAll, shareOfTotal,
      topDept, topJobCategory, topDesignation, deptsRepresented,
      byDept, byJobCategory, byDesignation,
    };
  }, [employees, wfGender]);

  const investmentByDept = useMemo(() => {
    return DEPARTMENTS.map((d) => ({
      department: d,
      total: investments.filter((i) => i.department === d).reduce((a, b) => a + Number(b.amount || 0), 0),
      deals: investments.filter((i) => i.department === d).length,
    }));
  }, [investments]);

  const [customKpis, setCustomKpis] = useState([]);
  const [allProfiles, setAllProfiles] = useState([]);
  const [kpiForm, setKpiForm] = useState({ name: "", description: "", dataset: "investments", formula: "", format: "number" });
  const [kpiTestResult, setKpiTestResult] = useState(null);
  const [kpiTestError, setKpiTestError] = useState(null);
  const [editingKpiId, setEditingKpiId] = useState(null);

  function handleKpiFormulaChange(value) {
    setKpiForm((f) => ({ ...f, formula: value }));
    setKpiTestResult(null);
    if (!value.trim()) { setKpiTestError(null); return; }
    try { parseKpiFormula(value); setKpiTestError(null); }
    catch (e) { setKpiTestError(e.message); }
  }

  function runKpiTest() {
    setKpiTestError(null);
    try {
      const rows = kpiForm.dataset === "appraisals" ? appraisals : investments;
      setKpiTestResult(evaluateKpiFormula(kpiForm.formula, rows));
    } catch (e) {
      setKpiTestResult(null);
      setKpiTestError(e.message);
    }
  }

  async function saveKpi(e) {
    e.preventDefault();
    if (kpiTestError || !kpiForm.formula.trim()) return;
    if (editingKpiId) {
      const { data, error } = await supabase.from("kpi_definitions").update({ ...kpiForm, updated_at: new Date().toISOString() }).eq("id", editingKpiId).select().single();
      if (!error && data) setCustomKpis(customKpis.map((k) => (k.id === editingKpiId ? data : k)));
    } else {
      const { data, error } = await supabase.from("kpi_definitions").insert({ ...kpiForm, created_by: user.id }).select().single();
      if (!error && data) setCustomKpis([data, ...customKpis]);
    }
    setEditingKpiId(null);
    setKpiForm({ name: "", description: "", dataset: "investments", formula: "", format: "number" });
    setKpiTestResult(null);
  }
  async function deleteKpi(id) {
    if (!confirm("Delete this KPI?")) return;
    const { error } = await supabase.from("kpi_definitions").delete().eq("id", id);
    if (!error) setCustomKpis(customKpis.filter((x) => x.id !== id));
  }

  function startEditKpi(k) {
    setEditingKpiId(k.id);
    setKpiForm({ name: k.name, description: k.description || "", dataset: k.dataset, formula: k.formula, format: k.format });
    setKpiTestResult(null);
    setKpiTestError(null);
  }


  const emptyAppraisal = () => ({
    department: user?.role === "admin" ? DEPARTMENTS[0] : user?.department,
    period: "", activity: "", objective: "", indicator: "", outcome: "",
    status: "Not Started", mov: "", comments: "",
  });
  const emptyInvestment = () => ({
    company_investor: "", project_description: "", sector: "", lga: "",
    amount: "", source: "FDI", jobs_to_be_created: "", date_recorded: "", department: "IPF", status: "Announced",
  });

  const [formA, setFormA] = useState(emptyAppraisal());
  const [formI, setFormI] = useState(emptyInvestment());

  function canEditDept(dept) { return user?.role === "admin" || user?.department === dept; }

  async function loadProfile(authUser) {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", authUser.id).single();
    if (error || !data) {
      // Profile row missing (e.g. the auto-create trigger hasn't run yet) -- fail safe as staff with no department
      // rather than crashing, so the person can still sign in and an admin can fix their role afterward.
      setUser({ id: authUser.id, email: authUser.email, name: authUser.email, role: "staff", department: null });
      return;
    }
    setUser({ id: authUser.id, email: authUser.email, name: data.name, role: data.role, department: data.department });
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) loadProfile(session.user);
      setAuthLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) loadProfile(session.user);
      else setUser(null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError("");
    setLoggingIn(true);
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
    if (error) setLoginError(error.message);
    setLoggingIn(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  // Load each table once signed in, then keep it live via Supabase Realtime so
  // every connected dashboard reflects changes made anywhere, instantly.
  useEffect(() => {
    if (!user) return;

    async function loadAll() {
      const [{ data: a }, { data: i }, { data: e }, { data: k }] = await Promise.all([
        supabase.from("appraisals").select("*").order("created_at", { ascending: false }),
        supabase.from("investments").select("*").order("created_at", { ascending: false }),
        supabase.from("employees").select("*").order("created_at", { ascending: false }),
        supabase.from("kpi_definitions").select("*").order("created_at", { ascending: false }),
      ]);
      if (a) setAppraisals(a);
      if (i) setInvestments(i);
      if (e) setEmployees(e);
      if (k) setCustomKpis(k);
      if (user.role === "admin") {
        const { data: profiles } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
        if (profiles) setAllProfiles(profiles);
      }
    }
    loadAll();

    const channel = supabase
      .channel("nasida-live-sync")
      .on("postgres_changes", { event: "*", schema: "public", table: "appraisals" }, () => {
        supabase.from("appraisals").select("*").order("created_at", { ascending: false }).then(({ data }) => data && setAppraisals(data));
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "investments" }, () => {
        supabase.from("investments").select("*").order("created_at", { ascending: false }).then(({ data }) => data && setInvestments(data));
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "employees" }, () => {
        supabase.from("employees").select("*").order("created_at", { ascending: false }).then(({ data }) => data && setEmployees(data));
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "kpi_definitions" }, () => {
        supabase.from("kpi_definitions").select("*").order("created_at", { ascending: false }).then(({ data }) => data && setCustomKpis(data));
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user]);
  function resetOverviewFilters() {
    setSpinning(true);
    setOvDept(""); setOvStatus(""); setOvSector(""); setOvLga(""); setOvSource(""); setOvInvestStatus("");
    setTimeout(() => setSpinning(false), 500);
  }
  function resetWfFilters() {
    setWfSpinning(true);
    setOvDept(""); setOvStatus("");
    setTimeout(() => setWfSpinning(false), 500);
  }

  const filteredAppraisals = useMemo(() => {
    return appraisals.filter((r) => (!deptFilter || r.department === deptFilter) && (!statusFilter || r.status === statusFilter));
  }, [appraisals, deptFilter, statusFilter]);

  const ovAppraisals = useMemo(() => {
    return appraisals.filter((r) => (!ovDept || r.department === ovDept) && (!ovStatus || r.status === ovStatus));
  }, [appraisals, ovDept, ovStatus]);

  const ovInvestments = useMemo(() => {
    return investments.filter((r) => (!ovSector || r.sector === ovSector) && (!ovLga || r.lga === ovLga) && (!ovSource || r.source === ovSource) && (!ovInvestStatus || r.status === ovInvestStatus));
  }, [investments, ovSector, ovLga, ovSource, ovInvestStatus]);

  const sectorOptions = useMemo(() => uniqueValues(investments, "sector"), [investments]);
  const lgaOptions = useMemo(() => uniqueValues(investments, "lga"), [investments]);

  const summary = useMemo(() => {
    const activeDepts = ovDept ? [ovDept] : DEPARTMENTS;
    const byDept = activeDepts.map((d) => {
      const rows = ovAppraisals.filter((r) => r.department === d);
      return {
        department: d,
        Completed: rows.filter((r) => r.status === "Completed").length,
        Ongoing: rows.filter((r) => r.status === "Ongoing").length,
        "Not Started": rows.filter((r) => r.status === "Not Started").length,
        Delayed: rows.filter((r) => r.status === "Delayed").length,
      };
    });
    const targetVsActual = activeDepts.map((d) => {
      const rows = ovAppraisals.filter((r) => r.department === d);
      return { department: d, Completed: rows.filter((r) => r.status === "Completed").length, Target: DEPT_TARGETS[d] || 0 };
    });
    const overall = STATUSES.map((s) => ({ name: s, value: ovAppraisals.filter((r) => r.status === s).length }));

    const sectorMap = {};
    ovInvestments.forEach((i) => { sectorMap[i.sector] = (sectorMap[i.sector] || 0) + Number(i.amount || 0); });
    const bySector = Object.entries(sectorMap).map(([sector, total], idx) => ({ sector, total, color: SECTOR_PALETTE[idx % SECTOR_PALETTE.length] }));

    const lgaMap = {};
    ovInvestments.forEach((i) => { lgaMap[i.lga] = (lgaMap[i.lga] || 0) + Number(i.amount || 0); });
    const byLga = Object.entries(lgaMap).map(([lga, total]) => ({ lga, total }));

    const qAmount = [0, 0, 0, 0], qJobs = [0, 0, 0, 0], qDeals = [0, 0, 0, 0];
    ovInvestments.forEach((i) => {
      const q = quarterIndex(i.date_recorded);
      if (q !== null) { qAmount[q] += Number(i.amount || 0); qJobs[q] += Number(i.jobs_to_be_created || 0); qDeals[q] += 1; }
    });
    const byQuarter = ["Q1", "Q2", "Q3", "Q4"].map((label, i) => ({ quarter: label, amount: qAmount[i], jobs: qJobs[i], deals: qDeals[i] }));

    const totalAmount = ovInvestments.reduce((a, b) => a + Number(b.amount || 0), 0);
    const totalJobs = ovInvestments.reduce((a, b) => a + Number(b.jobs_to_be_created || 0), 0);
    const fdiList = ovInvestments.filter((i) => i.source === "FDI");
    const ddiList = ovInvestments.filter((i) => i.source === "DDI");
    const latestQuarterAmount = byQuarter.reduce((latest, q, idx) => (qAmount[idx] > 0 ? q.amount : latest), 0);
    const onTrackDepts = activeDepts.filter((d) => {
      const c = ovAppraisals.filter((r) => r.department === d && r.status === "Completed").length;
      return c >= (DEPT_TARGETS[d] || 0);
    }).length;

    const announcedList = ovInvestments.filter((i) => i.status === "Announced");
    const actualizedList = ovInvestments.filter((i) => i.status === "Actualized");

    return {
      byDept, targetVsActual, overall, bySector, byLga, byQuarter, totalAmount, totalJobs,
      avgDeal: ovInvestments.length ? totalAmount / ovInvestments.length : 0,
      fdiCount: fdiList.length, ddiCount: ddiList.length,
      fdiJobs: fdiList.reduce((a, b) => a + Number(b.jobs_to_be_created || 0), 0),
      ddiJobs: ddiList.reduce((a, b) => a + Number(b.jobs_to_be_created || 0), 0),
      avgJobs: ovInvestments.length ? Math.round(totalJobs / ovInvestments.length) : 0,
      latestQuarterAmount, onTrackDepts, sectorsCovered: Object.keys(sectorMap).length,
      announcedCount: announcedList.length, actualizedCount: actualizedList.length,
      announcedAmount: announcedList.reduce((a, b) => a + Number(b.amount || 0), 0),
      actualizedAmount: actualizedList.reduce((a, b) => a + Number(b.amount || 0), 0),
    };
  }, [ovAppraisals, ovInvestments, ovDept]);

  const deptRanking = useMemo(() => {
    return [...summary.targetVsActual]
      .map((d) => ({ ...d, pct: d.Target > 0 ? Math.round((d.Completed / d.Target) * 100) : 0 }))
      .sort((a, b) => b.pct - a.pct);
  }, [summary.targetVsActual]);

  const insights = useMemo(() => generateInsights(ovAppraisals, ovInvestments, ANNUAL_TARGET, fmtM), [ovAppraisals, ovInvestments, currency]);
  const kpiPct = Math.min(100, Math.round((summary.totalAmount / ANNUAL_TARGET) * 100));
  const completedCount = ovAppraisals.filter((r) => r.status === "Completed").length;
  const delayedCount = ovAppraisals.filter((r) => r.status === "Delayed").length;
  const completionRate = ovAppraisals.length ? Math.round((completedCount / ovAppraisals.length) * 100) : 0;

  const animatedAmount = useCountUp(summary.totalAmount);
  const animatedJobs = useCountUp(summary.totalJobs);
  const animatedCompleted = useCountUp(completedCount);
  const animatedInvestments = useCountUp(ovInvestments.length);

  async function submitAppraisal(e) {
    e.preventDefault();
    if (editingA) {
      const { data, error } = await supabase.from("appraisals").update({ ...formA, updated_at: new Date().toISOString() }).eq("id", editingA).select().single();
      if (!error && data) setAppraisals(appraisals.map((r) => (r.id === editingA ? data : r)));
    } else {
      const { data, error } = await supabase.from("appraisals").insert({ ...formA, created_by: user.id }).select().single();
      if (!error && data) setAppraisals([data, ...appraisals]);
    }
    setEditingA(null); setFormA(emptyAppraisal());
  }
  async function deleteAppraisal(id) {
    if (!confirm("Delete this record?")) return;
    const { error } = await supabase.from("appraisals").delete().eq("id", id);
    if (!error) setAppraisals(appraisals.filter((x) => x.id !== id));
  }
  async function submitInvestment(e) {
    e.preventDefault();
    if (editingI) {
      const { data, error } = await supabase.from("investments").update({ ...formI, updated_at: new Date().toISOString() }).eq("id", editingI).select().single();
      if (!error && data) setInvestments(investments.map((r) => (r.id === editingI ? data : r)));
    } else {
      const { data, error } = await supabase.from("investments").insert({ ...formI, created_by: user.id }).select().single();
      if (!error && data) setInvestments([data, ...investments]);
    }
    setEditingI(null); setFormI(emptyInvestment());
  }
  async function deleteInvestment(id) {
    if (!confirm("Delete this record?")) return;
    const { error } = await supabase.from("investments").delete().eq("id", id);
    if (!error) setInvestments(investments.filter((x) => x.id !== id));
  }

  const GlobalStyle = () => (
    <style>{`
      @keyframes nasidaFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes nasidaSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      .nasida-fade { animation: nasidaFadeIn 0.4s ease; }
      .nasida-card { transition: transform .18s ease, box-shadow .18s ease; }
      .nasida-card:hover { transform: translateY(-3px); box-shadow: 0 12px 28px rgba(11,61,46,0.14); }
      .nasida-nav-item { transition: background .2s ease, color .2s ease; }
      .nasida-nav-item:hover:not(.nasida-nav-active) { background: rgba(255,255,255,0.12); color: #fff; }
      .nasida-progress-fill { transition: width 1.1s cubic-bezier(.22,.9,.32,1); }
      .nasida-btn { transition: transform .12s ease, box-shadow .12s ease, background .15s ease; }
      .nasida-btn:hover { transform: translateY(-1px); }
      .nasida-row { transition: background .15s ease; }
      .nasida-row:hover { background: #f2f7f3; }
      .nasida-icon-btn { transition: background .15s ease, transform .15s ease; cursor: pointer; }
      .nasida-icon-btn:hover { background: #eaf3ee; }
      .nasida-spin { animation: nasidaSpin 0.5s linear; }
      .nasida-pill { transition: background .15s ease, color .15s ease; cursor: pointer; }
      select, input, textarea, button { font-family: inherit; }
    `}</style>
  );

  if (authLoading) {
    return (
      <div style={styles.loginWrap}>
        <GlobalStyle />
        <div style={{ color: "#fff", fontSize: 14 }}>Loading…</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.loginWrap}>
        <GlobalStyle />
        <form className="nasida-fade" style={styles.loginCard} onSubmit={handleLogin}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}><BrandMark size={76} /></div>
          <h1 style={styles.loginTitle}>NASIDA Performance &amp; Investment Register</h1>
          <p style={styles.loginSub}>Sign in with the account an admin created for you.</p>
          {loginError && <div style={styles.loginError}>{loginError}</div>}
          <label style={styles.loginLabel}>Email</label>
          <input
            style={styles.loginInput}
            type="email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            required
            autoComplete="username"
          />
          <label style={styles.loginLabel}>Password</label>
          <input
            style={styles.loginInput}
            type="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <button type="submit" className="nasida-btn" style={styles.loginBtnPrimary} disabled={loggingIn}>
            {loggingIn ? "Signing in…" : "Sign in"}
          </button>
          <p style={styles.loginNote}>Admin sees every department, edits investments, and creates accounts. Staff can only add or edit their own department's activities.</p>
        </form>
      </div>
    );
  }

  const navItems = [
    ["overview", "Overview", LayoutDashboard],
    ["appraisals", "Department Appraisals", ClipboardList],
    ["investments", "Investments", TrendingUp],
    ["workforce", "Workforce", Building2],
    ...(user.role === "admin" ? [["kpi-builder", "Custom KPIs", Calculator]] : []),
    ...(user.role === "admin" ? [["users", "Manage Users", UsersIcon]] : []),
  ];

  return (
    <div style={styles.shell}>
      <GlobalStyle />
      <aside style={styles.sidebar}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}><BrandMark size={66} /></div>
        <div style={styles.sidebarBrandText}>
          <div style={styles.brandTitle}>NASIDA</div>
          <div style={styles.brandSub}>Performance &amp; Investment Register</div>
        </div>

        <div style={styles.navLabel}>NAVIGATION</div>
        <nav style={styles.nav}>
          {navItems.map(([key, label, Icon]) => (
            <button
              key={key}
              className={`nasida-nav-item ${tab === key ? "nasida-nav-active" : ""}`}
              onClick={() => setTab(key)}
              style={{ ...styles.navItem, ...(tab === key ? styles.navItemActive : {}) }}
            >
              <Icon size={16} strokeWidth={2.2} />
              {label}
            </button>
          ))}
        </nav>

        <div style={styles.navLabel}>INFORMATION</div>
        <button className="nasida-nav-item" style={styles.navItem} onClick={() => setShowInfo(true)}>
          <Info size={16} strokeWidth={2.2} /> About this preview
        </button>

        <div style={styles.sidebarFooter}>
          <div style={styles.currencyRow} title={`Mid-market rate as of ${FX_AS_OF}. The live app refreshes this automatically.`}>
            <ArrowLeftRight size={13} />
            <select style={styles.currencySelect} value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option value="USD">USD ($)</option>
              <option value="NGN">NGN (₦)</option>
            </select>
            <button className={`nasida-icon-btn ${fxSpin ? "nasida-spin" : ""}`} style={styles.currencyRefresh} onClick={refreshFx} title="Refresh rate">
              <RefreshCw size={12} />
            </button>
          </div>
          <div style={styles.userLine}>{user.name}</div>
          <div style={styles.userRole}>{user.role === "admin" ? "Admin" : `${user.department} staff`}</div>
          <button className="nasida-btn" style={styles.switchBtn} onClick={handleLogout}>Sign out</button>
        </div>
      </aside>

      <main style={styles.main}>
        {showInfo && (
          <div style={styles.modalOverlay} onClick={() => setShowInfo(false)}>
            <div className="nasida-fade" style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <strong>About this preview</strong>
                <button className="nasida-icon-btn" style={styles.iconBtn} onClick={() => setShowInfo(false)}><X size={16} /></button>
              </div>
              <p style={styles.modalText}>This is a working front-end preview running on sample data. It shows department appraisal tracking across all 7 NASIDA departments and investment records against the agency's annual KPI. Filters, charts, and the insights panel are all live and recalculate as you change data.</p>
            </div>
          </div>
        )}

        {tab === "overview" && (
          <section key="overview" className="nasida-fade">
            <div style={styles.pageHeader}>
              <div>
                <h1 style={styles.h1}>Overview</h1>
                <p style={styles.pageSub}>Department appraisals &amp; investment register &bull; 2026</p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="nasida-icon-btn" style={styles.iconBtn} title="Filters" onClick={() => setShowFilters((s) => !s)}>
                  <Filter size={17} />
                </button>
                <button className={`nasida-icon-btn ${spinning ? "nasida-spin" : ""}`} style={styles.iconBtn} title="Reset filters" onClick={resetOverviewFilters}>
                  <RefreshCw size={17} />
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="nasida-fade" style={styles.filterBar}>
                <div className="nasida-card" style={styles.filterGroup}>
                  <div style={styles.filterGroupTitle}>Appraisal filters</div>
                  <div style={styles.filterRow}>
                    <select style={styles.select} value={ovDept} onChange={(e) => setOvDept(e.target.value)}>
                      <option value="">All departments</option>
                      {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <select style={styles.select} value={ovStatus} onChange={(e) => setOvStatus(e.target.value)}>
                      <option value="">All statuses</option>
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="nasida-card" style={styles.filterGroup}>
                  <div style={styles.filterGroupTitle}>Investment filters</div>
                  <div style={styles.filterRow}>
                    <select style={styles.select} value={ovSector} onChange={(e) => setOvSector(e.target.value)}>
                      <option value="">All sectors</option>
                      {sectorOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select style={styles.select} value={ovLga} onChange={(e) => setOvLga(e.target.value)}>
                      <option value="">All LGAs</option>
                      {lgaOptions.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                    <select style={styles.select} value={ovSource} onChange={(e) => setOvSource(e.target.value)}>
                      <option value="">FDI &amp; DDI</option>
                      <option value="FDI">FDI only</option>
                      <option value="DDI">DDI only</option>
                    </select>
                    <select style={styles.select} value={ovInvestStatus} onChange={(e) => setOvInvestStatus(e.target.value)}>
                      <option value="">Announced &amp; Actualized</option>
                      {INVESTMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* KPI row */}
            <div style={styles.kpiRow}>
              <KpiCard icon={DollarSign} label="TOTAL INVESTMENT" value={fmtM(animatedAmount)}
                subs={[
                  { value: `${kpiPct}%`, label: "OF $1B TARGET", tone: kpiPct >= 50 ? "up" : "down" },
                  { value: fmt(summary.avgDeal), label: "AVG DEAL SIZE", tone: "neutral" },
                  { value: fmtM(summary.latestQuarterAmount), label: "LATEST QUARTER", tone: "neutral" },
                ]} />
              <KpiCard icon={UsersIcon} label="JOBS TO BE CREATED" value={Math.round(animatedJobs).toLocaleString()}
                subs={[
                  { value: summary.avgJobs, label: "AVG PER PROJECT", tone: "neutral" },
                  { value: summary.fdiJobs.toLocaleString(), label: "FROM FDI", tone: "up" },
                  { value: summary.ddiJobs.toLocaleString(), label: "FROM DDI", tone: "up" },
                ]} />
              <KpiCard icon={Briefcase} label="INVESTMENTS RECORDED" value={Math.round(animatedInvestments)}
                subs={[
                  { value: summary.fdiCount, label: "FDI DEALS", tone: "neutral" },
                  { value: summary.ddiCount, label: "DDI DEALS", tone: "neutral" },
                  { value: summary.sectorsCovered, label: "SECTORS COVERED", tone: "neutral" },
                ]} />
              <KpiCard icon={Layers} label="INVESTMENT PORTFOLIO" value={`${summary.announcedCount + summary.actualizedCount} projects`}
                subs={[
                  { value: summary.announcedCount, label: "ANNOUNCED", tone: "neutral" },
                  { value: summary.actualizedCount, label: "ACTUALIZED", tone: "up" },
                  { value: `${summary.announcedCount + summary.actualizedCount ? Math.round((summary.actualizedCount / (summary.announcedCount + summary.actualizedCount)) * 100) : 0}%`, label: "ACTUALIZED RATE", tone: "neutral" },
                ]} />
            </div>

            {customKpis.length > 0 && (
              <>
                <div style={styles.sectionLabel}>Custom KPIs</div>
                <div style={styles.customKpiRow}>
                  {customKpis.map((k) => {
                    let value, error;
                    try { value = evaluateKpiFormula(k.formula, k.dataset === "appraisals" ? ovAppraisals : ovInvestments); }
                    catch (e) { error = e.message; }
                    return (
                      <div key={k.id} className="nasida-card" style={styles.customKpiCard}>
                        <div style={styles.customKpiTop}>
                          <FlaskConical size={14} color="#d9a441" />
                          <span style={styles.kpiLabel}>{k.name.toUpperCase()}</span>
                        </div>
                        <div style={styles.kpiValue}>{error ? "—" : KPI_FORMAT[k.format](value)}</div>
                        {k.description && <div style={styles.customKpiDesc}>{k.description}</div>}
                        {error && <div style={styles.customKpiError}>Formula error: {error}</div>}
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Insights strip */}
            <div className="nasida-card" style={styles.insightsCard}>
              <div style={styles.insightsTitleRow}><span style={styles.insightsTitle}>Insights &amp; recommendations</span></div>
              <ul style={styles.insightsList}>
                {insights.map((line, i) => <li key={i} style={styles.insightItem}>{line}</li>)}
              </ul>
            </div>

            {/* Investment across LGAs */}
            <div className="nasida-card" style={styles.panel}>
              <div style={styles.panelHeader}>
                <div>
                  <div style={styles.panelTitle}>Investment across {summary.byLga.length} LGAs</div>
                  <div style={styles.panelSub}>Distribution of committed value by Local Government Area</div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={summary.byLga}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7ebe6" />
                  <XAxis dataKey="lga" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => fmtM(v)} />
                  <Tooltip formatter={(v) => fmt(v)} />
                  <Bar dataKey="total" fill="#1f7a4d" radius={[4, 4, 0, 0]} animationDuration={700} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Row: quarterly trend + sector donut */}
            <div style={styles.twoColGrid}>
              <div className="nasida-card" style={styles.panel}>
                <div style={styles.panelHeader}>
                  <div>
                    <div style={styles.panelTitle}>Quarterly investment trend</div>
                    <div style={styles.panelSub}>2026, by quarter</div>
                  </div>
                  <div style={styles.segmentGroup}>
                    {[["amount", "Investment"], ["jobs", "Jobs"], ["deals", "Deals"]].map(([key, label]) => (
                      <button key={key} className="nasida-pill" style={{ ...styles.segmentBtn, ...(trendMetric === key ? styles.segmentBtnActive : {}) }} onClick={() => setTrendMetric(key)}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={summary.byQuarter}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e7ebe6" />
                    <XAxis dataKey="quarter" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => (trendMetric === "amount" ? fmtM(v) : v)} />
                    <Tooltip formatter={(v) => (trendMetric === "amount" ? fmt(v) : v)} />
                    {trendMetric === "amount" && (
                      <ReferenceLine y={ANNUAL_TARGET / 4} stroke="#b5493f" strokeDasharray="4 4" label={{ value: "Pace needed", position: "insideTopRight", fontSize: 10, fill: "#b5493f" }} />
                    )}
                    <Line type="monotone" dataKey={trendMetric} stroke="#0b3d2e" strokeWidth={2.5} dot={{ r: 4, fill: "#0b3d2e" }} activeDot={{ r: 6 }} animationDuration={700} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="nasida-card" style={styles.panel}>
                <div style={styles.panelHeader}>
                  <div>
                    <div style={styles.panelTitle}>Investment by sector</div>
                    <div style={styles.panelSub}>Share of committed value</div>
                  </div>
                </div>
                <div style={styles.donutWrap}>
                  <ResponsiveContainer width="100%" height={210}>
                    <PieChart>
                      <Pie data={summary.bySector} dataKey="total" nameKey="sector" innerRadius={60} outerRadius={90} paddingAngle={2} animationDuration={700}>
                        {summary.bySector.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <Tooltip formatter={(v) => fmt(v)} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={styles.donutCenter}>
                    <div style={styles.donutCenterValue}>{fmtM(summary.totalAmount)}</div>
                    <div style={styles.donutCenterLabel}>Total</div>
                  </div>
                </div>
                <div style={styles.donutLegend}>
                  {summary.bySector.map((s, i) => (
                    <div key={i} style={styles.donutLegendItem}>
                      <span style={{ ...styles.donutDot, background: s.color }} />
                      <span style={styles.donutLegendLabel}>{s.sector}</span>
                      <span style={styles.donutLegendPct}>{summary.totalAmount ? Math.round((s.total / summary.totalAmount) * 100) : 0}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </section>
        )}

        {tab === "appraisals" && (
          <section key="appraisals" className="nasida-fade">
            <h1 style={styles.h1}>Department Appraisals</h1>
            <p style={styles.pageSub}>{user.role === "admin" ? "Viewing and editing across all departments." : `You can edit ${user.department} records only.`}</p>

            <div style={styles.filters}>
              <select style={styles.select} value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
                <option value="">All departments</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <select style={styles.select} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All statuses</option>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <form className="nasida-card" style={styles.card} onSubmit={submitAppraisal}>
              <h3 style={styles.cardTitle}>{editingA ? "Edit activity" : "Log new activity"}</h3>
              <div style={styles.formGrid}>
                <Field label="Department">
                  <select style={styles.input} value={formA.department || DEPARTMENTS[0]} disabled={user.role !== "admin"} onChange={(e) => setFormA({ ...formA, department: e.target.value })}>
                    {user.role === "admin" ? DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>) : <option value={user.department}>{user.department}</option>}
                  </select>
                </Field>
                <Field label="Period"><input style={styles.input} placeholder="e.g. Q2 2026" value={formA.period} onChange={(e) => setFormA({ ...formA, period: e.target.value })} /></Field>
                <Field label="Status">
                  <select style={styles.input} value={formA.status} onChange={(e) => setFormA({ ...formA, status: e.target.value })}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="Activities" full><textarea style={styles.textarea} value={formA.activity} onChange={(e) => setFormA({ ...formA, activity: e.target.value })} /></Field>
                <Field label="Objectives" full><textarea style={styles.textarea} value={formA.objective} onChange={(e) => setFormA({ ...formA, objective: e.target.value })} /></Field>
                <Field label="Indicators" full><textarea style={styles.textarea} value={formA.indicator} onChange={(e) => setFormA({ ...formA, indicator: e.target.value })} /></Field>
                <Field label="Outcomes" full><textarea style={styles.textarea} value={formA.outcome} onChange={(e) => setFormA({ ...formA, outcome: e.target.value })} /></Field>
                <Field label="MoVs" full><textarea style={styles.textarea} value={formA.mov} onChange={(e) => setFormA({ ...formA, mov: e.target.value })} /></Field>
                <Field label="Comments" full><textarea style={styles.textarea} value={formA.comments} onChange={(e) => setFormA({ ...formA, comments: e.target.value })} /></Field>
              </div>
              <div style={styles.formActions}>
                <button type="submit" className="nasida-btn" style={styles.btnPrimary}>{editingA ? <><Pencil size={14} /> Save changes</> : <><Plus size={14} /> Add record</>}</button>
                {editingA && <button type="button" className="nasida-btn" style={styles.btnGhost} onClick={() => { setEditingA(null); setFormA(emptyAppraisal()); }}><X size={14} /> Cancel</button>}
              </div>
            </form>

            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead><tr>{["Dept", "Period", "Activity", "Outcome", "Status", "Comments", ""].map((h) => <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {filteredAppraisals.map((r) => (
                    <tr key={r.id} className="nasida-row">
                      <td style={styles.td}>{r.department}</td>
                      <td style={styles.td}>{r.period}</td>
                      <td style={styles.td}>{r.activity}</td>
                      <td style={styles.td}>{r.outcome}</td>
                      <td style={styles.td}><Badge color={STATUS_COLOR[r.status]}>{r.status}</Badge></td>
                      <td style={styles.td}>{r.comments}</td>
                      <td style={styles.td}>
                        {canEditDept(r.department) && (
                          <>
                            <button style={styles.smallBtn} onClick={() => { setEditingA(r.id); setFormA(r); }}><Pencil size={12} /></button>
                            <button style={styles.smallBtn} onClick={() => deleteAppraisal(r.id)}><Trash2 size={12} /></button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {tab === "investments" && (
          <section key="investments" className="nasida-fade">
            <h1 style={styles.h1}>Investment Records</h1>
            <p style={styles.pageSub}>{user.role === "admin" ? "You can add, edit, and remove records." : "View only — investment data is managed by Admin."}</p>

            {user.role === "admin" && (
              <form className="nasida-card" style={styles.card} onSubmit={submitInvestment}>
                <h3 style={styles.cardTitle}>{editingI ? "Edit investment" : "Log new investment"}</h3>
                <div style={styles.formGrid}>
                  <Field label="Company / Investor"><input style={styles.input} value={formI.company_investor} onChange={(e) => setFormI({ ...formI, company_investor: e.target.value })} /></Field>
                  <Field label="Facilitating department">
                    <select style={styles.input} value={formI.department} onChange={(e) => setFormI({ ...formI, department: e.target.value })}>
                      {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </Field>
                  <Field label="Sector"><input style={styles.input} value={formI.sector} onChange={(e) => setFormI({ ...formI, sector: e.target.value })} /></Field>
                  <Field label="LGA"><input style={styles.input} value={formI.lga} onChange={(e) => setFormI({ ...formI, lga: e.target.value })} /></Field>
                  <Field label="Amount ($)"><input type="number" style={styles.input} value={formI.amount} onChange={(e) => setFormI({ ...formI, amount: e.target.value })} /></Field>
                  <Field label="Source">
                    <select style={styles.input} value={formI.source} onChange={(e) => setFormI({ ...formI, source: e.target.value })}>
                      <option value="FDI">FDI (Foreign)</option>
                      <option value="DDI">DDI (Domestic)</option>
                    </select>
                  </Field>
                  <Field label="Status">
                    <select style={styles.input} value={formI.status} onChange={(e) => setFormI({ ...formI, status: e.target.value })}>
                      {INVESTMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </Field>
                  <Field label="Jobs to be created"><input type="number" style={styles.input} value={formI.jobs_to_be_created} onChange={(e) => setFormI({ ...formI, jobs_to_be_created: e.target.value })} /></Field>
                  <Field label="Date"><input type="date" style={styles.input} value={formI.date_recorded} onChange={(e) => setFormI({ ...formI, date_recorded: e.target.value })} /></Field>
                  <Field label="Project description" full><textarea style={styles.textarea} value={formI.project_description} onChange={(e) => setFormI({ ...formI, project_description: e.target.value })} /></Field>
                </div>
                <div style={styles.formActions}>
                  <button type="submit" className="nasida-btn" style={styles.btnPrimary}>{editingI ? <><Pencil size={14} /> Save changes</> : <><Plus size={14} /> Add investment</>}</button>
                  {editingI && <button type="button" className="nasida-btn" style={styles.btnGhost} onClick={() => { setEditingI(null); setFormI(emptyInvestment()); }}><X size={14} /> Cancel</button>}
                </div>
              </form>
            )}

            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead><tr>{["Company/Investor", "Department", "Sector", "LGA", "Amount", "Source", "Status", "Jobs", "Date", user.role === "admin" ? "" : null].filter((h) => h !== null).map((h, i) => <th key={i} style={styles.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {investments.map((r) => (
                    <tr key={r.id} className="nasida-row">
                      <td style={styles.td}>{r.company_investor}</td>
                      <td style={styles.td}>{r.department}</td>
                      <td style={styles.td}>{r.sector}</td>
                      <td style={styles.td}>{r.lga}</td>
                      <td style={styles.td}>{fmt(r.amount)}</td>
                      <td style={styles.td}><Badge color={SOURCE_COLOR[r.source]}>{r.source}</Badge></td>
                      <td style={styles.td}><Badge color={INVESTMENT_STATUS_COLOR[r.status]}>{r.status}</Badge></td>
                      <td style={styles.td}>{r.jobs_to_be_created}</td>
                      <td style={styles.td}>{r.date_recorded}</td>
                      {user.role === "admin" && (
                        <td style={styles.td}>
                          <button style={styles.smallBtn} onClick={() => { setEditingI(r.id); setFormI(r); }}><Pencil size={12} /></button>
                          <button style={styles.smallBtn} onClick={() => deleteInvestment(r.id)}><Trash2 size={12} /></button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {tab === "workforce" && (
          <section key="workforce" className="nasida-fade">
            <div style={styles.pageHeader}>
              <div>
                <h1 style={styles.h1}>Workforce &amp; Demographics</h1>
                <p style={styles.pageSub}>Headcount, attrition, and staff composition across all 7 departments</p>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <div style={styles.segmentGroup}>
                  {["All", "Male", "Female"].map((g) => (
                    <button key={g} className="nasida-pill" style={{ ...styles.segmentBtn, ...(wfGender === g ? styles.segmentBtnActive : {}) }} onClick={() => setWfGender(g)}>
                      {g}
                    </button>
                  ))}
                </div>
                <button className="nasida-icon-btn" style={styles.iconBtn} title="Appraisal filters" onClick={() => setShowWfFilters((s) => !s)}>
                  <Filter size={17} />
                </button>
                <button className={`nasida-icon-btn ${wfSpinning ? "nasida-spin" : ""}`} style={styles.iconBtn} title="Reset appraisal filters" onClick={resetWfFilters}>
                  <RefreshCw size={17} />
                </button>
              </div>
            </div>

            {showWfFilters && (
              <div className="nasida-fade" style={styles.filterBar}>
                <div className="nasida-card" style={styles.filterGroup}>
                  <div style={styles.filterGroupTitle}>Appraisal filters</div>
                  <div style={styles.filterRow}>
                    <select style={styles.select} value={ovDept} onChange={(e) => setOvDept(e.target.value)}>
                      <option value="">All departments</option>
                      {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <select style={styles.select} value={ovStatus} onChange={(e) => setOvStatus(e.target.value)}>
                      <option value="">All statuses</option>
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div style={styles.kpiRow}>
              <KpiCard icon={UsersIcon} label={wfGender === "All" ? "TOTAL STAFF" : `${wfGender.toUpperCase()} STAFF`} value={workforceSummary.totalStaff}
                subs={wfGender === "All" ? [
                  { value: workforceSummary.maleActiveAll, label: "MALE", tone: "neutral" },
                  { value: workforceSummary.femaleActiveAll, label: "FEMALE", tone: "neutral" },
                  { value: workforceSummary.newHires, label: "NEW SINCE 2025", tone: "up" },
                ] : [
                  { value: workforceSummary.newHires, label: "NEW SINCE 2025", tone: "up" },
                  { value: workforceSummary.topDept ? workforceSummary.topDept.label : "—", label: "TOP DEPARTMENT", tone: "neutral" },
                  { value: workforceSummary.deptsRepresented, label: "DEPTS REPRESENTED", tone: "neutral" },
                ]} />
              <KpiCard icon={UserMinus} label="ATTRITION RATE" value={`${workforceSummary.attritionRate}%`}
                subs={[
                  { value: workforceSummary.exitedCount, label: "EXITS (12 MO)", tone: workforceSummary.exitedCount > 0 ? "down" : "up" },
                  { value: workforceSummary.totalStaff, label: "CURRENT HEADCOUNT", tone: "neutral" },
                  { value: `${100 - workforceSummary.attritionRate}%`, label: "RETENTION", tone: "up" },
                ]} />
              <KpiCard icon={Clock} label="AVERAGE TENURE" value={`${workforceSummary.avgTenure.toFixed(1)} yrs`}
                subs={wfGender === "All" ? [
                  { value: JOB_CATEGORIES.length, label: "JOB CATEGORIES", tone: "neutral" },
                  { value: DESIGNATIONS.length, label: "DESIGNATION LEVELS", tone: "neutral" },
                  { value: workforceSummary.newHires, label: "HIRED SINCE 2025", tone: "neutral" },
                ] : [
                  { value: workforceSummary.topJobCategory ? workforceSummary.topJobCategory.label : "—", label: "TOP JOB CATEGORY", tone: "neutral" },
                  { value: workforceSummary.topDesignation ? workforceSummary.topDesignation.label : "—", label: "TOP DESIGNATION", tone: "neutral" },
                  { value: workforceSummary.newHires, label: "NEW SINCE 2025", tone: "neutral" },
                ]} />
              <KpiCard icon={CheckCircle2} label="ACTIVITIES COMPLETED" value={`${Math.round(animatedCompleted)} / ${ovAppraisals.length}`}
                subs={[
                  { value: `${completionRate}%`, label: "COMPLETION RATE", tone: completionRate >= 50 ? "up" : "down" },
                  { value: delayedCount, label: "DELAYED", tone: delayedCount > 0 ? "down" : "up" },
                  { value: summary.onTrackDepts, label: "DEPTS ON TRACK", tone: "neutral" },
                ]} />
            </div>

            <div className="nasida-card" style={styles.panel}>
              <div style={styles.panelHeader}>
                <div>
                  <div style={styles.panelTitle}>Employees by department</div>
                  <div style={styles.panelSub}>{wfGender === "All" ? "Split by gender" : `${wfGender} staff only`}</div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={workforceSummary.byDept}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7ebe6" />
                  <XAxis dataKey="department" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  {wfGender === "All" && <Legend verticalAlign="top" height={28} wrapperStyle={{ fontSize: 12 }} />}
                  {wfGender === "All" ? [
                    <Bar key="Male" dataKey="Male" stackId="gender" fill={GENDER_COLOR.Male} isAnimationActive={false} />,
                    <Bar key="Female" dataKey="Female" stackId="gender" fill={GENDER_COLOR.Female} radius={[4, 4, 0, 0]} isAnimationActive={false} />,
                  ] : (
                    <Bar dataKey="count" fill={GENDER_COLOR[wfGender]} radius={[4, 4, 0, 0]} isAnimationActive={false} />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="nasida-card" style={styles.panel}>
              <div style={styles.panelHeader}>
                <div>
                  <div style={styles.panelTitle}>Employees by job category</div>
                  <div style={styles.panelSub}>{wfGender === "All" ? "Split by gender" : `${wfGender} staff only`}</div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={workforceSummary.byJobCategory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7ebe6" />
                  <XAxis dataKey="job_category" tick={{ fontSize: 10 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  {wfGender === "All" && <Legend verticalAlign="top" height={28} wrapperStyle={{ fontSize: 12 }} />}
                  {wfGender === "All" ? [
                    <Bar key="Male" dataKey="Male" stackId="gender" fill={GENDER_COLOR.Male} isAnimationActive={false} />,
                    <Bar key="Female" dataKey="Female" stackId="gender" fill={GENDER_COLOR.Female} radius={[4, 4, 0, 0]} isAnimationActive={false} />,
                  ] : (
                    <Bar dataKey="count" fill={GENDER_COLOR[wfGender]} radius={[4, 4, 0, 0]} isAnimationActive={false} />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="nasida-card" style={styles.panel}>
              <div style={styles.panelHeader}>
                <div>
                  <div style={styles.panelTitle}>Employees by designation</div>
                  <div style={styles.panelSub}>{wfGender === "All" ? "Split by gender" : `${wfGender} staff only`} &bull; {DESIGNATIONS.length} designation levels</div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={420}>
                <BarChart data={workforceSummary.byDesignation} layout="vertical" margin={{ left: 10, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7ebe6" />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="designation" tick={{ fontSize: 11 }} width={190} />
                  <Tooltip />
                  {wfGender === "All" && <Legend verticalAlign="top" height={28} wrapperStyle={{ fontSize: 12 }} />}
                  {wfGender === "All" ? [
                    <Bar key="Male" dataKey="Male" stackId="gender" fill={GENDER_COLOR.Male} isAnimationActive={false} />,
                    <Bar key="Female" dataKey="Female" stackId="gender" fill={GENDER_COLOR.Female} isAnimationActive={false} />,
                  ] : (
                    <Bar dataKey="count" fill={GENDER_COLOR[wfGender]} isAnimationActive={false} />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={styles.sectionLabel}>Department analytics</div>
            <div className="nasida-card" style={styles.panel}>
              <div style={styles.panelHeader}>
                <div>
                  <div style={styles.panelTitle}>Activity status mix</div>
                  <div style={styles.panelSub}>Share of activities in view, by status</div>
                </div>
              </div>
              <div style={styles.compositionList}>
                {STATUSES.map((s) => {
                  const count = ovAppraisals.filter((r) => r.status === s).length;
                  const pct = ovAppraisals.length ? Math.round((count / ovAppraisals.length) * 100) : 0;
                  const Icon = STATUS_ICON[s];
                  return (
                    <div key={s} style={styles.compositionRow}>
                      <div style={{ ...styles.compositionIcon, background: STATUS_COLOR[s] + "22", color: STATUS_COLOR[s] }}>
                        <Icon size={16} strokeWidth={2.2} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={styles.compositionLabelRow}>
                          <span style={styles.compositionLabel}>{s} Activities</span>
                          <span style={styles.compositionCount}>{count}</span>
                        </div>
                        <div style={styles.compositionTrack}>
                          <div className="nasida-progress-fill" style={{ ...styles.compositionFill, width: `${pct}%`, background: STATUS_COLOR[s] }} />
                        </div>
                      </div>
                      <span style={styles.compositionPct}>{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={styles.tripleGrid}>
              <ChartBox title="Completed, by department">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={summary.byDept}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e7ebe6" />
                    <XAxis dataKey="department" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="Completed" fill={STATUS_COLOR.Completed} radius={[4, 4, 0, 0]} animationDuration={700} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartBox>
              <ChartBox title="Ongoing, by department">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={summary.byDept}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e7ebe6" />
                    <XAxis dataKey="department" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="Ongoing" fill={STATUS_COLOR.Ongoing} radius={[4, 4, 0, 0]} animationDuration={700} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartBox>
              <ChartBox title="Not started, by department">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={summary.byDept}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e7ebe6" />
                    <XAxis dataKey="department" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="Not Started" fill={STATUS_COLOR["Not Started"]} radius={[4, 4, 0, 0]} animationDuration={700} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartBox>
            </div>

            <div style={styles.chartGrid}>
              <ChartBox title="Completed vs. target, by department">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={summary.targetVsActual}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e7ebe6" />
                    <XAxis dataKey="department" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="Target" fill="#c9d3ce" radius={[4, 4, 0, 0]} animationDuration={700} />
                    <Bar dataKey="Completed" fill={STATUS_COLOR.Completed} radius={[4, 4, 0, 0]} animationDuration={700} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartBox>
              <ChartBox title="Overall status split">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={summary.overall} dataKey="value" nameKey="name" outerRadius={80} label animationDuration={700}>
                      {summary.overall.map((e, i) => <Cell key={i} fill={STATUS_COLOR[e.name]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </ChartBox>
            </div>

            <div className="nasida-card" style={styles.panel}>
              <div style={styles.panelHeader}>
                <div>
                  <div style={styles.panelTitle}>Investment facilitated by department</div>
                  <div style={styles.panelSub}>Total committed value attributed to each department</div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={investmentByDept}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7ebe6" />
                  <XAxis dataKey="department" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => fmtM(v)} />
                  <Tooltip formatter={(v) => fmt(v)} />
                  <Bar dataKey="total" fill="#1f7a4d" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="nasida-card" style={styles.panel}>
              <div style={styles.panelHeader}>
                <div>
                  <div style={styles.panelTitle}>Department performance ranking</div>
                  <div style={styles.panelSub}>Completed &divide; Target &times; 100, ranked highest to lowest</div>
                </div>
              </div>
              <div style={styles.compositionList}>
                {deptRanking.map((d, idx) => (
                  <div key={d.department} style={styles.rankRow}>
                    <div style={{ ...styles.rankBadge, background: idx === 0 ? "#d9a441" : idx === 1 ? "#9aa79f" : idx === 2 ? "#b5793f" : "#eaefe9", color: idx <= 2 ? "#fff" : "#5b6b62" }}>
                      {idx + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={styles.compositionLabelRow}>
                        <span style={styles.compositionLabel}>{d.department}</span>
                        <span style={styles.compositionCount}>{d.Completed} of {d.Target} activities completed</span>
                      </div>
                      <div style={styles.compositionTrack}>
                        <div className="nasida-progress-fill" style={{ ...styles.compositionFill, width: `${Math.min(100, d.pct)}%`, background: d.pct >= 100 ? STATUS_COLOR.Completed : d.pct >= 60 ? STATUS_COLOR.Ongoing : STATUS_COLOR.Delayed }} />
                      </div>
                    </div>
                    <span style={styles.compositionPct}>{d.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {user.role === "admin" && (
              <>
                <div style={styles.sectionLabel}>Manage employee records</div>
                <form className="nasida-card" style={styles.card} onSubmit={submitEmployee}>
                  <h3 style={styles.cardTitle}>{editingE ? "Edit employee" : "Add employee"}</h3>
                  <div style={styles.formGrid}>
                    <Field label="Full name">
                      <input style={styles.input} value={formE.name} onChange={(e) => setFormE({ ...formE, name: e.target.value })} required />
                    </Field>
                    <Field label="Department">
                      <select style={styles.input} value={formE.department || ""} onChange={(e) => setFormE({ ...formE, department: e.target.value || null })}>
                        <option value="">— None (Executive) —</option>
                        {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </Field>
                    <Field label="Gender">
                      <select style={styles.input} value={formE.gender} onChange={(e) => setFormE({ ...formE, gender: e.target.value })}>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </Field>
                    <Field label="Job category">
                      <select style={styles.input} value={formE.job_category} onChange={(e) => setFormE({ ...formE, job_category: e.target.value })}>
                        {JOB_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </Field>
                    <Field label="Designation">
                      <select style={styles.input} value={formE.designation} onChange={(e) => setFormE({ ...formE, designation: e.target.value })}>
                        {DESIGNATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </Field>
                    <Field label="Status">
                      <select style={styles.input} value={formE.status} onChange={(e) => setFormE({ ...formE, status: e.target.value })}>
                        <option value="Active">Active</option>
                        <option value="Exited">Exited</option>
                      </select>
                    </Field>
                    <Field label="Hire date">
                      <input type="date" style={styles.input} value={formE.hire_date} onChange={(e) => setFormE({ ...formE, hire_date: e.target.value })} required />
                    </Field>
                    {formE.status === "Exited" && (
                      <Field label="Exit date">
                        <input type="date" style={styles.input} value={formE.exit_date} onChange={(e) => setFormE({ ...formE, exit_date: e.target.value })} />
                      </Field>
                    )}
                  </div>
                  <div style={styles.formActions}>
                    <button type="submit" className="nasida-btn" style={styles.btnPrimary}>
                      {editingE ? <><Pencil size={14} /> Save changes</> : <><Plus size={14} /> Add employee</>}
                    </button>
                    {editingE && (
                      <button type="button" className="nasida-btn" style={styles.btnGhost} onClick={() => { setEditingE(null); setFormE(emptyEmployee()); }}>
                        <X size={14} /> Cancel
                      </button>
                    )}
                  </div>
                </form>

                <div style={styles.tableWrap}>
                  <table style={styles.table}>
                    <thead>
                      <tr>{["Name", "Department", "Gender", "Job category", "Designation", "Status", "Hire date", "Exit date", ""].map((h) => <th key={h} style={styles.th}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {employees.map((r) => (
                        <tr key={r.id} className="nasida-row">
                          <td style={styles.td}>{r.name}</td>
                          <td style={styles.td}>{r.department || "—"}</td>
                          <td style={styles.td}>{r.gender}</td>
                          <td style={styles.td}>{r.job_category}</td>
                          <td style={styles.td}>{r.designation}</td>
                          <td style={styles.td}><Badge color={r.status === "Active" ? STATUS_COLOR.Completed : STATUS_COLOR.Delayed}>{r.status}</Badge></td>
                          <td style={styles.td}>{r.hire_date}</td>
                          <td style={styles.td}>{r.exit_date || "—"}</td>
                          <td style={styles.td}>
                            <button style={styles.smallBtn} onClick={() => startEditEmployee(r)}><Pencil size={12} /></button>
                            <button style={styles.smallBtn} onClick={() => deleteEmployee(r.id)}><Trash2 size={12} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </section>
        )}

        {tab === "kpi-builder" && user.role === "admin" && (
          <section key="kpi-builder" className="nasida-fade">
            <h1 style={styles.h1}>Custom KPI Builder</h1>
            <p style={styles.pageSub}>Define a formula once and it appears as a live card on the Overview dashboard for everyone.</p>

            <form className="nasida-card" style={styles.card} onSubmit={saveKpi}>
              <h3 style={styles.cardTitle}>{editingKpiId ? "Edit KPI" : "New KPI"}</h3>
              <div style={styles.formGrid}>
                <Field label="Name"><input style={styles.input} value={kpiForm.name} onChange={(e) => setKpiForm({ ...kpiForm, name: e.target.value })} required /></Field>
                <Field label="Dataset">
                  <select style={styles.input} value={kpiForm.dataset} onChange={(e) => setKpiForm({ ...kpiForm, dataset: e.target.value })}>
                    <option value="appraisals">Appraisals</option>
                    <option value="investments">Investments</option>
                  </select>
                </Field>
                <Field label="Display format">
                  <select style={styles.input} value={kpiForm.format} onChange={(e) => setKpiForm({ ...kpiForm, format: e.target.value })}>
                    <option value="number">Number</option>
                    <option value="percent">Percent</option>
                    <option value="currency">Currency</option>
                  </select>
                </Field>
                <Field label="Description" full><input style={styles.input} value={kpiForm.description} onChange={(e) => setKpiForm({ ...kpiForm, description: e.target.value })} /></Field>
                <Field label="Formula" full>
                  <textarea style={styles.textarea} value={kpiForm.formula} onChange={(e) => handleKpiFormulaChange(e.target.value)} placeholder="SUM(amount) WHERE source = 'FDI'" />
                </Field>
              </div>

              <pre style={styles.formulaHelp}>{`Examples:
  SUM(amount) WHERE source = 'FDI'
  COUNT(*) WHERE status = 'Completed'
  (COUNT(*) WHERE status = 'Completed') / COUNT(*) * 100
  AVERAGE(jobs_to_be_created) WHERE sector = 'Energy'`}</pre>

              <div style={styles.formulaTestRow}>
                <button type="button" className="nasida-btn" style={styles.btnGhost} onClick={runKpiTest} disabled={!kpiForm.formula.trim()}>
                  <FlaskConical size={14} /> Test formula
                </button>
                {kpiTestError && <span style={styles.formulaError}>⚠ {kpiTestError}</span>}
                {kpiTestResult !== null && !kpiTestError && (
                  <span style={styles.formulaSuccess}>Result: {KPI_FORMAT[kpiForm.format](kpiTestResult)}</span>
                )}
              </div>

              <div style={styles.formActions}>
                <button type="submit" className="nasida-btn" style={styles.btnPrimary} disabled={!!kpiTestError || !kpiForm.formula.trim()}>
                  {editingKpiId ? <><Pencil size={14} /> Save changes</> : <><Plus size={14} /> Create KPI</>}
                </button>
                {editingKpiId && (
                  <button type="button" className="nasida-btn" style={styles.btnGhost} onClick={() => { setEditingKpiId(null); setKpiForm({ name: "", description: "", dataset: "investments", formula: "", format: "number" }); }}>
                    <X size={14} /> Cancel
                  </button>
                )}
              </div>
            </form>

            <h3 style={styles.cardTitle}>Saved KPIs</h3>
            <div style={styles.customKpiRow}>
              {customKpis.map((k) => {
                let value, error;
                try { value = evaluateKpiFormula(k.formula, k.dataset === "appraisals" ? appraisals : investments); }
                catch (e) { error = e.message; }
                return (
                  <div key={k.id} className="nasida-card" style={styles.customKpiCard}>
                    <div style={styles.customKpiTop}>
                      <FlaskConical size={14} color="#d9a441" />
                      <span style={styles.kpiLabel}>{k.name.toUpperCase()}</span>
                    </div>
                    <div style={styles.kpiValue}>{error ? "—" : KPI_FORMAT[k.format](value)}</div>
                    {k.description && <div style={styles.customKpiDesc}>{k.description}</div>}
                    {error && <div style={styles.customKpiError}>Formula error: {error}</div>}
                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                      <button style={styles.smallBtn} onClick={() => startEditKpi(k)}><Pencil size={12} /></button>
                      <button style={styles.smallBtn} onClick={() => deleteKpi(k.id)}><Trash2 size={12} /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {tab === "users" && user.role === "admin" && (
          <section key="users" className="nasida-fade">
            <h1 style={styles.h1}>Manage Users</h1>
            <p style={styles.pageSub}>
              New accounts are created in the Supabase Dashboard (Authentication → Add user), with{" "}
              <code>role</code> and <code>department</code> set in that user's metadata — this list reflects
              real accounts from your Supabase project.
            </p>
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead><tr>{["Name", "Role", "Department", "Joined"].map((h) => <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {allProfiles.map((p) => (
                    <tr key={p.id} className="nasida-row">
                      <td style={styles.td}>{p.name}</td>
                      <td style={styles.td}>{p.role === "admin" ? "Admin" : "Staff"}</td>
                      <td style={styles.td}>{p.department || "—"}</td>
                      <td style={styles.td}>{p.created_at ? new Date(p.created_at).toLocaleDateString() : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, subs }) {
  return (
    <div className="nasida-card" style={styles.kpiCard}>
      <div style={styles.kpiTopRow}>
        <div style={styles.kpiIconCircle}><Icon size={16} strokeWidth={2.2} /></div>
        <span style={styles.kpiLabel}>{label}</span>
      </div>
      <div style={styles.kpiValue}>{value}</div>
      <div style={styles.kpiSubsRow}>
        {subs.map((s, i) => (
          <div key={i} style={{ ...styles.kpiSub, ...(i > 0 ? styles.kpiSubBorder : {}) }}>
            <div style={{ ...styles.kpiSubValue, color: s.tone === "up" ? "#1f7a4d" : s.tone === "down" ? "#b5493f" : "#0b3d2e" }}>{s.value}</div>
            <div style={styles.kpiSubLabel}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
function ChartBox({ title, children }) {
  return (
    <div className="nasida-card" style={styles.chartBox}>
      <div style={styles.chartTitle}>{title}</div>
      {children}
    </div>
  );
}
function Field({ label, children, full }) {
  return (
    <label style={{ ...styles.field, ...(full ? { gridColumn: "1 / -1" } : {}) }}>
      <span style={styles.fieldLabel}>{label}</span>
      {children}
    </label>
  );
}
function Badge({ color, children }) {
  return <span style={{ ...styles.badge, background: color }}>{children}</span>;
}

const styles = {
  loginWrap: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(160deg,#0b3d2e,#1f7a4d)", fontFamily: "'Segoe UI', system-ui, sans-serif" },
  loginCard: { background: "#f6f8f5", padding: "40px 36px", borderRadius: 14, width: 400, textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.35)" },
  loginTitle: { fontSize: 19, margin: "10px 0 6px", color: "#0b3d2e" },
  loginSub: { fontSize: 13.5, color: "#5b6b62", margin: "0 0 22px" },
  loginBtnPrimary: { width: "100%", padding: "11px", background: "#0b3d2e", color: "#fff", border: "none", borderRadius: 999, fontWeight: 600, fontSize: 14, cursor: "pointer", marginBottom: 10 },
  loginBtnSecondary: { width: "100%", padding: "11px", background: "#fff", color: "#0b3d2e", border: "1px solid #c3cec7", borderRadius: 999, fontWeight: 600, fontSize: 14, cursor: "pointer" },
  loginLabel: { display: "block", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#354039", marginBottom: 4 },
  loginInput: { width: "100%", padding: "9px 10px", borderRadius: 6, border: "1px solid #c3cec7", fontSize: 14, marginBottom: 14, fontFamily: "inherit" },
  loginError: { background: "#fdecea", color: "#c62828", padding: "8px 10px", borderRadius: 6, fontSize: 12.5, marginBottom: 14, textAlign: "left" },
  loginNote: { fontSize: 12, color: "#8b978f", marginTop: 18, lineHeight: 1.5 },

  shell: { display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#f2f4f1" },
  sidebar: { width: 240, background: "linear-gradient(180deg,#0b3d2e 0%,#1a6b4a 100%)", color: "#fff", display: "flex", flexDirection: "column", padding: "22px 16px", flexShrink: 0 },
  sidebarBrandText: { textAlign: "center", marginBottom: 22 },
  brandTitle: { fontSize: 15, fontWeight: 800, letterSpacing: 0.5 },
  brandSub: { fontSize: 10.5, color: "#bfe3cd", marginTop: 2, lineHeight: 1.3, padding: "0 8px" },
  navLabel: { fontSize: 10.5, fontWeight: 700, color: "#9cd2b3", letterSpacing: 1.2, margin: "6px 4px 8px" },
  nav: { display: "flex", flexDirection: "column", gap: 4, marginBottom: 18 },
  navItem: { display: "flex", alignItems: "center", gap: 10, textAlign: "left", background: "none", border: "none", color: "#cfe6d8", padding: "10px 14px", borderRadius: 999, cursor: "pointer", fontSize: 13.5 },
  navItemActive: { background: "#fff", color: "#0b3d2e", fontWeight: 700, boxShadow: "0 3px 8px rgba(0,0,0,0.15)" },
  sidebarFooter: { borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: 14, marginTop: "auto" },
  currencyRow: { display: "flex", alignItems: "center", gap: 6, color: "#bfe3cd", marginBottom: 12 },
  currencySelect: { flex: 1, background: "rgba(255,255,255,0.12)", color: "#fff", border: "none", borderRadius: 6, padding: "5px 6px", fontSize: 12 },
  currencyRefresh: { width: 24, height: 24, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.12)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  userLine: { fontSize: 13, fontWeight: 600 },
  userRole: { fontSize: 11.5, color: "#9cd2b3", marginBottom: 10 },
  switchBtn: { fontSize: 12, background: "rgba(255,255,255,0.14)", color: "#fff", border: "none", padding: "7px 10px", borderRadius: 999, cursor: "pointer", width: "100%" },

  main: { flex: 1, padding: "26px 32px", overflowX: "hidden", position: "relative" },
  pageHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 },
  h1: { fontSize: 21, color: "#0b3d2e", margin: "0 0 3px" },
  pageSub: { fontSize: 13, color: "#7a877f", margin: "0 0 18px" },
  iconBtn: { width: 36, height: 36, borderRadius: 999, border: "1px solid #dfe6e1", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#0b3d2e" },

  modalOverlay: { position: "fixed", inset: 0, background: "rgba(11,61,46,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 },
  modalCard: { background: "#fff", borderRadius: 12, padding: "20px 22px", width: 380, boxShadow: "0 24px 60px rgba(0,0,0,0.3)" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, color: "#0b3d2e" },
  modalText: { fontSize: 13, color: "#4a564e", lineHeight: 1.6, margin: 0 },

  filterBar: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, marginBottom: 18 },
  filterGroup: { background: "#fff", border: "1px solid #dfe6e1", borderRadius: 10, padding: "12px 14px" },
  filterGroupTitle: { fontSize: 11.5, fontWeight: 700, color: "#5b6b62", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.4 },
  filterRow: { display: "flex", gap: 8, flexWrap: "wrap" },

  kpiRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 18 },
  kpiCard: { background: "#fff", borderRadius: 12, padding: "18px 20px", boxShadow: "0 1px 3px rgba(11,61,46,0.06), 0 1px 12px rgba(11,61,46,0.05)" },
  kpiTopRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 10 },
  kpiIconCircle: { width: 28, height: 28, borderRadius: "50%", background: "#e6f2ea", color: "#0b3d2e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  kpiLabel: { fontSize: 10.5, fontWeight: 700, letterSpacing: 0.6, color: "#7a877f", textTransform: "uppercase" },
  kpiValue: { fontSize: 24, fontWeight: 800, color: "#0b3d2e", marginBottom: 12 },
  kpiSubsRow: { display: "flex" },
  kpiSub: { flex: 1, paddingLeft: 10 },
  kpiSubBorder: { borderLeft: "1px solid #eaefe9" },
  kpiSubValue: { fontSize: 13, fontWeight: 700 },
  kpiSubLabel: { fontSize: 9, color: "#9aa79f", fontWeight: 600, letterSpacing: 0.3, marginTop: 2 },

  insightsCard: { background: "#0b3d2e", borderRadius: 12, padding: "16px 20px", marginBottom: 18, color: "#fff" },
  insightsTitleRow: { marginBottom: 8 },
  insightsTitle: { fontSize: 12.5, fontWeight: 700, color: "#d9a441" },
  insightsList: { margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 6 },
  insightItem: { fontSize: 12.5, lineHeight: 1.5, color: "#e9f3ec" },

  twoColGrid: { display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16, marginBottom: 18 },
  panel: { background: "#fff", borderRadius: 12, padding: "18px 20px", boxShadow: "0 1px 3px rgba(11,61,46,0.06), 0 1px 12px rgba(11,61,46,0.05)" },
  panelHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, gap: 10, flexWrap: "wrap" },
  panelTitle: { fontSize: 14, fontWeight: 700, color: "#0b3d2e" },
  panelSub: { fontSize: 11.5, color: "#8b978f", marginTop: 2 },

  segmentGroup: { display: "flex", background: "#f2f5f1", borderRadius: 999, padding: 3, gap: 2 },
  segmentBtn: { border: "none", background: "none", padding: "6px 12px", borderRadius: 999, fontSize: 11.5, fontWeight: 600, color: "#5b6b62" },
  segmentBtnActive: { background: "#0b3d2e", color: "#fff" },

  compositionList: { display: "flex", flexDirection: "column", gap: 16, marginTop: 6 },
  compositionRow: { display: "flex", alignItems: "center", gap: 10 },
  rankRow: { display: "flex", alignItems: "center", gap: 12 },
  rankBadge: { width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0 },
  compositionIcon: { width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  compositionLabelRow: { display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 },
  compositionLabel: { color: "#354039", fontWeight: 600 },
  compositionCount: { color: "#7a877f" },
  compositionTrack: { height: 7, background: "#eef2ee", borderRadius: 6, overflow: "hidden" },
  compositionFill: { height: "100%", borderRadius: 6 },
  compositionPct: { fontSize: 12, fontWeight: 700, color: "#0b3d2e", width: 34, textAlign: "right" },

  donutWrap: { position: "relative" },
  donutCenter: { position: "absolute", top: "42%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" },
  donutCenterValue: { fontSize: 17, fontWeight: 800, color: "#0b3d2e" },
  donutCenterLabel: { fontSize: 10, color: "#8b978f" },
  donutLegend: { display: "flex", flexWrap: "wrap", gap: "6px 14px", marginTop: 8, justifyContent: "center" },
  donutLegendItem: { display: "flex", alignItems: "center", gap: 5, fontSize: 11 },
  donutDot: { width: 8, height: 8, borderRadius: "50%", display: "inline-block" },
  donutLegendLabel: { color: "#354039" },
  donutLegendPct: { color: "#8b978f", fontWeight: 600 },

  sectionLabel: { fontSize: 13, fontWeight: 700, color: "#0b3d2e", margin: "6px 0 10px" },
  customKpiRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 18 },
  customKpiCard: { background: "#fff", borderRadius: 12, padding: "16px 18px", boxShadow: "0 1px 3px rgba(11,61,46,0.06), 0 1px 12px rgba(11,61,46,0.05)", borderLeft: "3px solid #d9a441" },
  customKpiTop: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 },
  customKpiDesc: { fontSize: 11.5, color: "#8b978f", marginTop: -6, marginBottom: 4 },
  customKpiError: { fontSize: 11, color: "#b5493f", marginTop: 4 },
  formulaHelp: { fontSize: 11.5, color: "#5b6b62", background: "#f2f5f1", padding: "10px 12px", borderRadius: 8, marginTop: 10, whiteSpace: "pre-wrap", lineHeight: 1.5 },
  formulaTestRow: { display: "flex", alignItems: "center", gap: 12, marginTop: 12, flexWrap: "wrap" },
  formulaError: { color: "#b5493f", fontSize: 12.5, fontWeight: 600 },
  formulaSuccess: { color: "#1f7a4d", fontSize: 12.5, fontWeight: 700 },
  tripleGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 18 },
  chartGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 16 },
  chartBox: { background: "#fff", borderRadius: 12, boxShadow: "0 1px 3px rgba(11,61,46,0.06), 0 1px 12px rgba(11,61,46,0.05)", padding: "16px 18px" },
  chartTitle: { fontSize: 13, fontWeight: 700, color: "#0b3d2e", marginBottom: 8 },

  filters: { display: "flex", gap: 10, marginBottom: 16 },
  select: { padding: "8px 10px", borderRadius: 8, border: "1px solid #c3cec7", fontSize: 13 },

  card: { background: "#fff", borderRadius: 12, boxShadow: "0 1px 3px rgba(11,61,46,0.06), 0 1px 12px rgba(11,61,46,0.05)", padding: "18px 20px", marginBottom: 22 },
  cardTitle: { fontSize: 14.5, fontWeight: 700, color: "#0b3d2e", margin: "0 0 12px" },
  formGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 },
  field: { display: "flex", flexDirection: "column", gap: 4, fontSize: 12.5, fontWeight: 600, color: "#354039" },
  fieldLabel: { marginBottom: 2 },
  input: { padding: "8px 9px", borderRadius: 8, border: "1px solid #c3cec7", fontWeight: 400, fontSize: 13, fontFamily: "inherit" },
  textarea: { padding: "8px 9px", borderRadius: 8, border: "1px solid #c3cec7", fontWeight: 400, fontSize: 13, minHeight: 56, fontFamily: "inherit", resize: "vertical" },
  formActions: { display: "flex", gap: 10, marginTop: 14 },
  btnPrimary: { display: "inline-flex", alignItems: "center", gap: 6, background: "#0b3d2e", color: "#fff", border: "none", padding: "9px 18px", borderRadius: 999, fontWeight: 600, fontSize: 13, cursor: "pointer" },
  btnGhost: { display: "inline-flex", alignItems: "center", gap: 6, background: "#eaefe9", color: "#354039", border: "none", padding: "9px 18px", borderRadius: 999, fontWeight: 600, fontSize: 13, cursor: "pointer" },

  tableWrap: { background: "#fff", borderRadius: 12, boxShadow: "0 1px 3px rgba(11,61,46,0.06), 0 1px 12px rgba(11,61,46,0.05)", overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 12.5 },
  th: { textAlign: "left", padding: "10px 12px", background: "#f2f5f1", color: "#4a564e", fontWeight: 700, borderBottom: "1px solid #dfe6e1", whiteSpace: "nowrap" },
  td: { padding: "9px 12px", borderBottom: "1px solid #eaefe9", color: "#354039", verticalAlign: "top" },
  smallBtn: { display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11.5, background: "#eaefe9", border: "none", padding: "5px 7px", borderRadius: 6, cursor: "pointer", marginRight: 6, color: "#354039" },
  badge: { color: "#fff", padding: "3px 9px", borderRadius: 12, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" },
};
