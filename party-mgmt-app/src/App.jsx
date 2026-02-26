import React from "react";
import { useState, useEffect, useCallback } from "react";

// ============================================================
// MOCK DATA & CONSTANTS
// ============================================================
const ROLES = {
  SUPER_ADMIN: "Super Admin",
  STATE_COORD: "State Coordinator",
  DISTRICT_COORD: "District Coordinator",
  CONSTITUENCY_COORD: "Constituency Coordinator",
  BOOTH_WORKER: "Booth Worker",
};

const ROLE_LEVEL = {
  "Super Admin": 0,
  "State Coordinator": 1,
  "District Coordinator": 2,
  "Constituency Coordinator": 3,
  "Booth Worker": 4,
};

const ROLE_COLOR = {
  "Super Admin": "#FF6B35",
  "State Coordinator": "#7B61FF",
  "District Coordinator": "#00B4D8",
  "Constituency Coordinator": "#06D6A0",
  "Booth Worker": "#FFD166",
};

const mockUsers = [
  { id: 1, name: "Rajiv Sharma", role: "Super Admin", state: "National", district: "-", constituency: "-", booth: "-", status: "active", phone: "9800000001", email: "rajiv@party.in", joined: "2020-01-01", score: 98, avatar: "RS" },
  { id: 2, name: "Priya Nair", role: "State Coordinator", state: "Maharashtra", district: "-", constituency: "-", booth: "-", status: "active", phone: "9800000002", email: "priya@party.in", joined: "2020-03-15", score: 91, avatar: "PN" },
  { id: 3, name: "Arjun Singh", role: "State Coordinator", state: "Uttar Pradesh", district: "-", constituency: "-", booth: "-", status: "active", phone: "9800000003", email: "arjun@party.in", joined: "2020-04-01", score: 88, avatar: "AS" },
  { id: 4, name: "Deepa Verma", role: "District Coordinator", state: "Maharashtra", district: "Pune", constituency: "-", booth: "-", status: "active", phone: "9800000004", email: "deepa@party.in", joined: "2021-01-10", score: 85, avatar: "DV" },
  { id: 5, name: "Suresh Kumar", role: "District Coordinator", state: "Uttar Pradesh", district: "Lucknow", constituency: "-", booth: "-", status: "inactive", phone: "9800000005", email: "suresh@party.in", joined: "2021-02-20", score: 72, avatar: "SK" },
  { id: 6, name: "Meena Patel", role: "Constituency Coordinator", state: "Maharashtra", district: "Pune", constituency: "Pune Central", booth: "-", status: "active", phone: "9800000006", email: "meena@party.in", joined: "2021-05-15", score: 80, avatar: "MP" },
  { id: 7, name: "Ravi Tiwari", role: "Booth Worker", state: "Maharashtra", district: "Pune", constituency: "Pune Central", booth: "Booth 42", status: "active", phone: "9800000007", email: "ravi@party.in", joined: "2022-01-01", score: 78, avatar: "RT" },
  { id: 8, name: "Anjali Gupta", role: "Booth Worker", state: "Maharashtra", district: "Pune", constituency: "Pune Central", booth: "Booth 43", status: "active", phone: "9800000008", email: "anjali@party.in", joined: "2022-03-01", score: 82, avatar: "AG" },
  { id: 9, name: "Vikram Rao", role: "Booth Worker", state: "Uttar Pradesh", district: "Lucknow", constituency: "Lucknow West", booth: "Booth 12", status: "inactive", phone: "9800000009", email: "vikram@party.in", joined: "2022-06-01", score: 55, avatar: "VR" },
  { id: 10, name: "Kavita Joshi", role: "Constituency Coordinator", state: "Uttar Pradesh", district: "Lucknow", constituency: "Lucknow West", booth: "-", status: "active", phone: "9800000010", email: "kavita@party.in", joined: "2021-08-15", score: 76, avatar: "KJ" },
];

const mockTasks = [
  { id: 1, title: "Door-to-door voter outreach", type: "Outreach", priority: "High", status: "In Progress", assignedTo: "Ravi Tiwari", area: "Pune Central - Booth 42", deadline: "2025-02-28", progress: 65 },
  { id: 2, title: "Organize constituency meeting", type: "Meeting", priority: "Medium", status: "Pending", assignedTo: "Meena Patel", area: "Pune Central", deadline: "2025-03-05", progress: 0 },
  { id: 3, title: "Campaign banner distribution", type: "Campaign", priority: "High", status: "Completed", assignedTo: "Anjali Gupta", area: "Pune Central - Booth 43", deadline: "2025-02-15", progress: 100 },
  { id: 4, title: "Voter list verification", type: "Outreach", priority: "Critical", status: "In Progress", assignedTo: "Kavita Joshi", area: "Lucknow West", deadline: "2025-03-10", progress: 40 },
  { id: 5, title: "Rally event preparation", type: "Event Duty", priority: "High", status: "Pending", assignedTo: "Arjun Singh", area: "Uttar Pradesh", deadline: "2025-03-15", progress: 20 },
  { id: 6, title: "Volunteer training session", type: "Meeting", priority: "Medium", status: "Completed", assignedTo: "Priya Nair", area: "Maharashtra", deadline: "2025-01-30", progress: 100 },
];

const mockEvents = [
  { id: 1, name: "National Convention 2025", date: "2025-03-20", location: "New Delhi", type: "Convention", attendees: 1200, registered: 980, status: "Upcoming" },
  { id: 2, name: "Maharashtra State Rally", date: "2025-03-10", location: "Mumbai", type: "Rally", attendees: 500, registered: 456, status: "Upcoming" },
  { id: 3, name: "Pune District Workshop", date: "2025-02-28", location: "Pune", type: "Workshop", attendees: 80, registered: 72, status: "Upcoming" },
  { id: 4, name: "Voter Awareness Drive", date: "2025-02-15", location: "Multiple Locations", type: "Campaign", attendees: 200, registered: 200, status: "Completed" },
];

const mockMessages = [
  { id: 1, from: "Rajiv Sharma", to: "All Workers", content: "Please ensure 100% voter list verification by March 10th. This is our top priority.", time: "2h ago", level: "broadcast", unread: true },
  { id: 2, from: "Priya Nair", to: "Maharashtra Team", content: "State rally preparations are on track. All district coordinators please confirm worker deployment.", time: "5h ago", level: "state", unread: true },
  { id: 3, from: "Deepa Verma", to: "Pune District", content: "Booth workers - please submit your daily reports by 8 PM each day.", time: "1d ago", level: "district", unread: false },
  { id: 4, from: "Meena Patel", to: "Pune Central Team", content: "Meeting scheduled for tomorrow at 10 AM at the party office.", time: "1d ago", level: "constituency", unread: false },
];

const mockReports = [
  { id: 1, worker: "Ravi Tiwari", date: "2025-02-25", area: "Booth 42", votersContacted: 45, issues: 2, summary: "Completed door-to-door visit on Nehru Street. 45 voters confirmed, 2 new voter registrations.", hasPhoto: true, location: "18.5204° N, 73.8567° E" },
  { id: 2, worker: "Anjali Gupta", date: "2025-02-25", area: "Booth 43", votersContacted: 38, issues: 0, summary: "Distributed party leaflets at the market. Very positive response from locals.", hasPhoto: false, location: "18.5215° N, 73.8590° E" },
  { id: 3, worker: "Vikram Rao", date: "2025-02-24", area: "Booth 12", votersContacted: 22, issues: 1, summary: "Voter awareness session held at community hall.", hasPhoto: true, location: "26.8467° N, 80.9462° E" },
];

const areaHierarchy = {
  Maharashtra: {
    Pune: { "Pune Central": ["Booth 42", "Booth 43", "Booth 44"], "Pune East": ["Booth 51", "Booth 52"] },
    Mumbai: { "Mumbai South": ["Booth 1", "Booth 2"], "Mumbai North": ["Booth 3", "Booth 4"] },
  },
  "Uttar Pradesh": {
    Lucknow: { "Lucknow West": ["Booth 12", "Booth 13"], "Lucknow East": ["Booth 21", "Booth 22"] },
    Kanpur: { "Kanpur Central": ["Booth 31", "Booth 32"] },
  },
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
function getInitials(name) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// ============================================================
// DESIGN SYSTEM - CSS-in-JS style objects for inline styles
// ============================================================
const theme = {
  bg: "#0A0E1A",
  bgCard: "#111827",
  bgCardHover: "#1a2235",
  bgPanel: "#0D1526",
  border: "#1e2d45",
  borderLight: "#253652",
  accent: "#FF6B35",
  accentGlow: "rgba(255,107,53,0.15)",
  text: "#E8EDF5",
  textMuted: "#8B9AB5",
  textFaint: "#4A5A7A",
  success: "#06D6A0",
  warning: "#FFD166",
  danger: "#EF476F",
  info: "#00B4D8",
  purple: "#7B61FF",
};

// ============================================================
// SMALL COMPONENTS
// ============================================================
function Avatar({ name, size = 36, role }) {
  const color = ROLE_COLOR[role] || theme.accent;
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${color}33, ${color}66)`,
      border: `2px solid ${color}44`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35, fontWeight: 700, color,
      flexShrink: 0, letterSpacing: "0.05em"
    }}>
      {getInitials(name)}
    </div>
  );
}

function Badge({ label, color, small }) {
  return (
    <span style={{
      background: color + "22", color, border: `1px solid ${color}44`,
      borderRadius: 4, padding: small ? "1px 6px" : "3px 10px",
      fontSize: small ? 10 : 11, fontWeight: 600, letterSpacing: "0.05em",
      textTransform: "uppercase", whiteSpace: "nowrap"
    }}>{label}</span>
  );
}

function StatusBadge({ status }) {
  const map = {
    "active": [theme.success, "Active"],
    "inactive": [theme.textFaint, "Inactive"],
    "Pending": [theme.warning, "Pending"],
    "In Progress": [theme.info, "In Progress"],
    "Completed": [theme.success, "Completed"],
    "Upcoming": [theme.purple, "Upcoming"],
    "Critical": [theme.danger, "Critical"],
    "High": [theme.accent, "High"],
    "Medium": [theme.warning, "Medium"],
    "Low": [theme.success, "Low"],
  };
  const [color, label] = map[status] || [theme.textMuted, status];
  return <Badge label={label} color={color} small />;
}

function Card({ children, style, onClick, hover }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: theme.bgCard,
        border: `1px solid ${isHovered && hover ? theme.borderLight : theme.border}`,
        borderRadius: 12, padding: 20,
        transition: "all 0.2s ease",
        transform: isHovered && hover ? "translateY(-2px)" : "none",
        cursor: onClick ? "pointer" : "default",
        ...style
      }}
    >
      {children}
    </div>
  );
}

function StatCard({ label, value, sub, icon, color, trend }) {
  return (
    <Card hover style={{ flex: 1, minWidth: 180 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ color: theme.textMuted, fontSize: 12, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
          <div style={{ color: theme.text, fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{value}</div>
          {sub && <div style={{ color: theme.textMuted, fontSize: 12, marginTop: 6 }}>{sub}</div>}
        </div>
        <div style={{
          width: 44, height: 44, borderRadius: 10,
          background: (color || theme.accent) + "18",
          border: `1px solid ${(color || theme.accent)}33`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20
        }}>{icon}</div>
      </div>
      {trend !== undefined && (
        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 4, color: trend > 0 ? theme.success : theme.danger, fontSize: 12, fontWeight: 600 }}>
          {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% this week
        </div>
      )}
    </Card>
  );
}

function ProgressBar({ value, color, height = 6 }) {
  return (
    <div style={{ background: theme.border, borderRadius: 99, height, overflow: "hidden" }}>
      <div style={{
        width: `${value}%`, height: "100%", borderRadius: 99,
        background: color || theme.accent,
        transition: "width 0.6s ease"
      }} />
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = "text", icon }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: "block", color: theme.textMuted, fontSize: 12, fontWeight: 600, marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</label>}
      <div style={{ position: "relative" }}>
        {icon && <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: theme.textFaint, fontSize: 16 }}>{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: "100%", background: theme.bgPanel, border: `1px solid ${theme.border}`,
            borderRadius: 8, padding: `10px ${icon ? "12px 10px 36px" : "12px"}`,
            color: theme.text, fontSize: 14, outline: "none",
            boxSizing: "border-box",
            transition: "border-color 0.2s",
          }}
          onFocus={e => e.target.style.borderColor = theme.accent}
          onBlur={e => e.target.style.borderColor = theme.border}
        />
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: "block", color: theme.textMuted, fontSize: 12, fontWeight: 600, marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</label>}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: "100%", background: theme.bgPanel, border: `1px solid ${theme.border}`,
          borderRadius: 8, padding: "10px 12px", color: theme.text, fontSize: 14, outline: "none",
          appearance: "none", cursor: "pointer"
        }}
      >
        {options.map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
      </select>
    </div>
  );
}

function Button({ children, onClick, variant = "primary", size = "md", style, disabled }) {
  const [hovered, setHovered] = useState(false);
  const styles = {
    primary: { background: theme.accent, color: "#fff", border: "none" },
    ghost: { background: "transparent", color: theme.textMuted, border: `1px solid ${theme.border}` },
    danger: { background: theme.danger + "22", color: theme.danger, border: `1px solid ${theme.danger}44` },
    success: { background: theme.success + "22", color: theme.success, border: `1px solid ${theme.success}44` },
    info: { background: theme.info + "22", color: theme.info, border: `1px solid ${theme.info}44` },
  };
  const sizes = {
    sm: { padding: "6px 14px", fontSize: 12 },
    md: { padding: "9px 18px", fontSize: 13 },
    lg: { padding: "12px 24px", fontSize: 14 },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...styles[variant], ...sizes[size],
        borderRadius: 8, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : hovered ? 0.85 : 1,
        transition: "all 0.15s ease", whiteSpace: "nowrap",
        ...style
      }}
    >
      {children}
    </button>
  );
}

function Modal({ open, onClose, title, children, width = 560 }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: 20, backdropFilter: "blur(4px)"
    }} onClick={onClose}>
      <div style={{
        background: theme.bgCard, border: `1px solid ${theme.borderLight}`,
        borderRadius: 16, padding: 28, width: "100%", maxWidth: width,
        maxHeight: "90vh", overflow: "auto",
        boxShadow: "0 25px 60px rgba(0,0,0,0.5)"
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ color: theme.text, fontSize: 18, fontWeight: 700, margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: theme.textMuted, cursor: "pointer", fontSize: 20, lineHeight: 1 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Table({ columns, data, onRowClick }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
            {columns.map(col => (
              <th key={col.key} style={{ padding: "10px 14px", color: theme.textMuted, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", fontSize: 11, textAlign: "left", whiteSpace: "nowrap" }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}
              onClick={() => onRowClick && onRowClick(row)}
              style={{
                borderBottom: `1px solid ${theme.border}22`,
                cursor: onRowClick ? "pointer" : "default",
                transition: "background 0.15s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = theme.bgCardHover}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              {columns.map(col => (
                <td key={col.key} style={{ padding: "12px 14px", color: theme.text, verticalAlign: "middle" }}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================
// PAGE: LOGIN
// ============================================================
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("rajiv@party.in");
  const [password, setPassword] = useState("admin123");
  const [role, setRole] = useState("Super Admin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      const user = mockUsers.find(u => u.email === email);
      if (user || password === "admin123") {
        onLogin(user || mockUsers[0]);
      } else {
        setError("Invalid credentials. Try rajiv@party.in / admin123");
      }
      setLoading(false);
    }, 800);
  };

  const demoRoles = [
    { label: "Super Admin", email: "rajiv@party.in" },
    { label: "State Coord", email: "priya@party.in" },
    { label: "District Coord", email: "deepa@party.in" },
    { label: "Booth Worker", email: "ravi@party.in" },
  ];

  return (
    <div style={{
      minHeight: "100vh", background: theme.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Georgia', serif",
      position: "relative", overflow: "hidden"
    }}>
      {/* Background pattern */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.04,
        backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
        backgroundSize: "40px 40px"
      }} />
      <div style={{
        position: "absolute", top: -200, right: -200, width: 600, height: 600,
        borderRadius: "50%", background: `radial-gradient(circle, ${theme.accent}15, transparent 70%)`
      }} />
      <div style={{
        position: "absolute", bottom: -200, left: -200, width: 500, height: 500,
        borderRadius: "50%", background: `radial-gradient(circle, ${theme.purple}10, transparent 70%)`
      }} />

      <div style={{ width: "100%", maxWidth: 420, padding: 20, position: "relative" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 18,
            background: `linear-gradient(135deg, ${theme.accent}, #FF8C55)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px", fontSize: 32, fontWeight: 900,
            boxShadow: `0 8px 30px ${theme.accent}40`
          }}>⚑</div>
          <h1 style={{ color: theme.text, fontSize: 24, fontWeight: 800, margin: "0 0 4px", letterSpacing: "-0.02em" }}>
            Jana Shakti
          </h1>
          <p style={{ color: theme.textMuted, fontSize: 13, margin: 0 }}>Political Party Management System</p>
        </div>

        <Card>
          <h2 style={{ color: theme.text, fontSize: 16, fontWeight: 700, margin: "0 0 20px" }}>Sign in to your account</h2>

          {error && (
            <div style={{ background: theme.danger + "15", border: `1px solid ${theme.danger}33`, borderRadius: 8, padding: "10px 14px", color: theme.danger, fontSize: 12, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <Input label="Email Address" value={email} onChange={setEmail} placeholder="your@email.com" icon="✉" />
          <Input label="Password" value={password} onChange={setPassword} placeholder="••••••••" type="password" icon="🔒" />

          <Button onClick={handleLogin} disabled={loading} style={{ width: "100%", justifyContent: "center", marginTop: 4 }} size="lg">
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${theme.border}` }}>
            <p style={{ color: theme.textMuted, fontSize: 11, textAlign: "center", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>Quick Demo Access</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {demoRoles.map(r => (
                <button key={r.label} onClick={() => { setEmail(r.email); setPassword("admin123"); }}
                  style={{
                    background: theme.bgPanel, border: `1px solid ${theme.border}`,
                    borderRadius: 6, padding: "8px 10px", color: theme.textMuted,
                    fontSize: 11, cursor: "pointer", fontWeight: 500,
                    transition: "all 0.15s"
                  }}
                  onMouseEnter={e => { e.target.style.borderColor = theme.accent; e.target.style.color = theme.text; }}
                  onMouseLeave={e => { e.target.style.borderColor = theme.border; e.target.style.color = theme.textMuted; }}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ============================================================
// PAGE: DASHBOARD
// ============================================================
function DashboardPage({ currentUser }) {
  const isAdmin = ROLE_LEVEL[currentUser.role] <= 1;

  const activeWorkers = mockUsers.filter(u => u.status === "active").length;
  const completedTasks = mockTasks.filter(t => t.status === "Completed").length;
  const upcomingEvents = mockEvents.filter(e => e.status === "Upcoming").length;
  const totalReports = mockReports.length;

  const stateStats = [
    { state: "Maharashtra", workers: 4250, active: 3890, coverage: 82, trend: 5 },
    { state: "Uttar Pradesh", workers: 6100, active: 5200, coverage: 74, trend: 3 },
    { state: "Gujarat", workers: 3200, active: 2900, coverage: 89, trend: 8 },
    { state: "Rajasthan", workers: 2800, active: 2400, coverage: 70, trend: -2 },
    { state: "Bihar", workers: 4800, active: 3600, coverage: 65, trend: 4 },
  ];

  const taskTypeData = [
    { type: "Outreach", count: 145, color: theme.accent },
    { type: "Campaign", count: 98, color: theme.purple },
    { type: "Meeting", count: 67, color: theme.info },
    { type: "Event Duty", count: 43, color: theme.warning },
  ];

  return (
    <div>
      {/* Welcome banner */}
      <div style={{
        background: `linear-gradient(135deg, ${theme.accent}18, ${theme.purple}10)`,
        border: `1px solid ${theme.accent}25`, borderRadius: 14,
        padding: "20px 24px", marginBottom: 24,
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12
      }}>
        <div>
          <h1 style={{ color: theme.text, fontSize: 22, fontWeight: 800, margin: "0 0 4px", letterSpacing: "-0.02em" }}>
            Welcome back, {currentUser.name.split(" ")[0]} 👋
          </h1>
          <p style={{ color: theme.textMuted, fontSize: 13, margin: 0 }}>
            {currentUser.role} · {currentUser.state} · Today: {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Button variant="ghost" size="sm">📥 Export Report</Button>
          <Button size="sm">+ New Task</Button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <StatCard label="Total Workers" value="21,150" sub="Across all states" icon="👥" color={theme.info} trend={7} />
        <StatCard label="Active Workers" value={`${activeWorkers}/10`} sub="Mock data visible" icon="✅" color={theme.success} trend={3} />
        <StatCard label="Tasks Completed" value={`${completedTasks}/${mockTasks.length}`} sub="This month" icon="📋" color={theme.accent} trend={12} />
        <StatCard label="Upcoming Events" value={upcomingEvents} sub="Next 30 days" icon="📅" color={theme.purple} />
        <StatCard label="Daily Reports" value={totalReports} sub="Submitted today" icon="📊" color={theme.warning} trend={-4} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, marginBottom: 20 }}>
        {/* State-wise coverage */}
        <Card>
          <h3 style={{ color: theme.text, fontSize: 15, fontWeight: 700, margin: "0 0 18px", display: "flex", alignItems: "center", gap: 8 }}>
            🗺 State-wise Worker Coverage
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {stateStats.map(s => (
              <div key={s.state}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, alignItems: "center" }}>
                  <span style={{ color: theme.text, fontSize: 13, fontWeight: 600 }}>{s.state}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ color: theme.textMuted, fontSize: 12 }}>{s.active.toLocaleString()} / {s.workers.toLocaleString()}</span>
                    <span style={{ color: s.trend > 0 ? theme.success : theme.danger, fontSize: 11, fontWeight: 600 }}>
                      {s.trend > 0 ? "▲" : "▼"}{Math.abs(s.trend)}%
                    </span>
                    <span style={{ color: theme.text, fontSize: 13, fontWeight: 700, width: 36, textAlign: "right" }}>{s.coverage}%</span>
                  </div>
                </div>
                <ProgressBar value={s.coverage} color={s.coverage > 80 ? theme.success : s.coverage > 65 ? theme.warning : theme.danger} />
              </div>
            ))}
          </div>
        </Card>

        {/* Task distribution */}
        <Card>
          <h3 style={{ color: theme.text, fontSize: 15, fontWeight: 700, margin: "0 0 18px" }}>📌 Task Distribution</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {taskTypeData.map(t => (
              <div key={t.type} style={{
                display: "flex", alignItems: "center", gap: 12,
                background: t.color + "10", border: `1px solid ${t.color}22`,
                borderRadius: 8, padding: "12px 14px"
              }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: t.color, flexShrink: 0 }} />
                <span style={{ flex: 1, color: theme.text, fontSize: 13, fontWeight: 500 }}>{t.type}</span>
                <span style={{ color: t.color, fontSize: 20, fontWeight: 800 }}>{t.count}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: theme.textMuted, fontSize: 12 }}>Total Active Tasks</span>
            <span style={{ color: theme.text, fontWeight: 700 }}>{taskTypeData.reduce((a, t) => a + t.count, 0)}</span>
          </div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Recent Tasks */}
        <Card>
          <h3 style={{ color: theme.text, fontSize: 15, fontWeight: 700, margin: "0 0 16px" }}>📋 Recent Tasks</h3>
          {mockTasks.slice(0, 4).map(task => (
            <div key={task.id} style={{
              padding: "12px 0", borderBottom: `1px solid ${theme.border}22`,
              display: "flex", gap: 12, alignItems: "flex-start"
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%", marginTop: 5, flexShrink: 0,
                background: task.status === "Completed" ? theme.success : task.status === "In Progress" ? theme.info : theme.warning
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ color: theme.text, fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{task.title}</div>
                <div style={{ color: theme.textMuted, fontSize: 11 }}>{task.assignedTo} · {task.area}</div>
                {task.status === "In Progress" && <ProgressBar value={task.progress} color={theme.info} height={4} />}
              </div>
              <StatusBadge status={task.status} />
            </div>
          ))}
        </Card>

        {/* Recent Reports */}
        <Card>
          <h3 style={{ color: theme.text, fontSize: 15, fontWeight: 700, margin: "0 0 16px" }}>📊 Recent Field Reports</h3>
          {mockReports.map(r => (
            <div key={r.id} style={{ padding: "12px 0", borderBottom: `1px solid ${theme.border}22` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ color: theme.text, fontSize: 13, fontWeight: 600 }}>{r.worker}</span>
                <span style={{ color: theme.textMuted, fontSize: 11 }}>{r.date}</span>
              </div>
              <div style={{ color: theme.textMuted, fontSize: 12, marginBottom: 6, lineHeight: 1.5 }}>{r.summary.slice(0, 80)}...</div>
              <div style={{ display: "flex", gap: 12 }}>
                <span style={{ color: theme.success, fontSize: 11, fontWeight: 600 }}>👤 {r.votersContacted} voters</span>
                {r.issues > 0 && <span style={{ color: theme.warning, fontSize: 11, fontWeight: 600 }}>⚠ {r.issues} issues</span>}
                {r.hasPhoto && <span style={{ color: theme.info, fontSize: 11 }}>📷 Photo</span>}
                <span style={{ color: theme.textFaint, fontSize: 11 }}>📍 GPS</span>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ============================================================
// PAGE: WORKERS
// ============================================================
function WorkersPage({ currentUser }) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [stateFilter, setStateFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [workers, setWorkers] = useState(mockUsers);

  const [newWorker, setNewWorker] = useState({ name: "", email: "", phone: "", role: "Booth Worker", state: "", district: "", constituency: "", booth: "" });

  const filtered = workers.filter(w => {
    const matchSearch = !search || w.name.toLowerCase().includes(search.toLowerCase()) || w.email.includes(search);
    const matchRole = roleFilter === "All" || w.role === roleFilter;
    const matchState = stateFilter === "All" || w.state === stateFilter;
    const matchStatus = statusFilter === "All" || w.status === statusFilter;
    return matchSearch && matchRole && matchState && matchStatus;
  });

  const canManage = ROLE_LEVEL[currentUser.role] <= 2;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ color: theme.text, fontSize: 20, fontWeight: 800, margin: "0 0 4px" }}>Worker Management</h2>
          <p style={{ color: theme.textMuted, fontSize: 13, margin: 0 }}>{filtered.length} workers found</p>
        </div>
        {canManage && <Button onClick={() => setShowAddModal(true)}>+ Add Worker</Button>}
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: 20, padding: "16px 20px" }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: 2, minWidth: 200 }}>
            <Input label="" value={search} onChange={setSearch} placeholder="🔍 Search by name or email..." />
          </div>
          <div style={{ flex: 1, minWidth: 150 }}>
            <Select label="" value={roleFilter} onChange={setRoleFilter} options={["All", ...Object.values(ROLES)]} />
          </div>
          <div style={{ flex: 1, minWidth: 150 }}>
            <Select label="" value={stateFilter} onChange={setStateFilter} options={["All", "Maharashtra", "Uttar Pradesh", "Gujarat", "Rajasthan", "Bihar"]} />
          </div>
          <div style={{ flex: 1, minWidth: 130 }}>
            <Select label="" value={statusFilter} onChange={setStatusFilter} options={["All", "active", "inactive"]} />
          </div>
          <Button variant="ghost" size="md" onClick={() => { setSearch(""); setRoleFilter("All"); setStateFilter("All"); setStatusFilter("All"); }} style={{ marginBottom: 16 }}>
            Clear
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <Table
          columns={[
            {
              key: "name", label: "Worker",
              render: (v, row) => (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar name={row.name} role={row.role} size={34} />
                  <div>
                    <div style={{ color: theme.text, fontWeight: 600 }}>{row.name}</div>
                    <div style={{ color: theme.textMuted, fontSize: 11 }}>{row.email}</div>
                  </div>
                </div>
              )
            },
            { key: "role", label: "Role", render: v => <Badge label={v} color={ROLE_COLOR[v]} small /> },
            { key: "state", label: "State" },
            { key: "district", label: "District" },
            { key: "status", label: "Status", render: v => <StatusBadge status={v} /> },
            {
              key: "score", label: "Score",
              render: v => (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: v >= 80 ? theme.success : v >= 60 ? theme.warning : theme.danger, fontWeight: 700 }}>{v}</span>
                  <ProgressBar value={v} color={v >= 80 ? theme.success : v >= 60 ? theme.warning : theme.danger} />
                </div>
              )
            },
            {
              key: "id", label: "Actions",
              render: (v, row) => (
                <div style={{ display: "flex", gap: 6 }}>
                  <Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); setSelectedWorker(row); }}>View</Button>
                  {canManage && <Button variant="info" size="sm">Edit</Button>}
                </div>
              )
            },
          ]}
          data={filtered}
          onRowClick={setSelectedWorker}
        />
      </Card>

      {/* Worker Detail Modal */}
      <Modal open={!!selectedWorker} onClose={() => setSelectedWorker(null)} title="Worker Profile" width={600}>
        {selectedWorker && (
          <div>
            <div style={{ display: "flex", gap: 16, marginBottom: 20, padding: "16px", background: theme.bgPanel, borderRadius: 10 }}>
              <Avatar name={selectedWorker.name} role={selectedWorker.role} size={60} />
              <div>
                <h3 style={{ color: theme.text, fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>{selectedWorker.name}</h3>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Badge label={selectedWorker.role} color={ROLE_COLOR[selectedWorker.role]} />
                  <StatusBadge status={selectedWorker.status} />
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                ["📞 Phone", selectedWorker.phone],
                ["✉ Email", selectedWorker.email],
                ["🗺 State", selectedWorker.state],
                ["🏘 District", selectedWorker.district || "—"],
                ["📍 Constituency", selectedWorker.constituency || "—"],
                ["🗳 Booth", selectedWorker.booth || "—"],
                ["📅 Joined", selectedWorker.joined],
                ["⭐ Score", `${selectedWorker.score}/100`],
              ].map(([label, value]) => (
                <div key={label} style={{ padding: "12px 14px", background: theme.bg, borderRadius: 8 }}>
                  <div style={{ color: theme.textMuted, fontSize: 11, marginBottom: 4 }}>{label}</div>
                  <div style={{ color: theme.text, fontSize: 13, fontWeight: 600 }}>{value}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16 }}>
              <div style={{ color: theme.textMuted, fontSize: 11, marginBottom: 6 }}>Performance Score</div>
              <ProgressBar value={selectedWorker.score} color={selectedWorker.score >= 80 ? theme.success : theme.warning} height={10} />
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <Button variant="ghost" style={{ flex: 1 }}>📨 Message</Button>
              <Button variant="success" style={{ flex: 1 }}>📋 Assign Task</Button>
              {canManage && <Button style={{ flex: 1 }}>✏ Edit Profile</Button>}
            </div>
          </div>
        )}
      </Modal>

      {/* Add Worker Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Register New Worker">
        <Input label="Full Name" value={newWorker.name} onChange={v => setNewWorker({ ...newWorker, name: v })} placeholder="Enter full name" />
        <Input label="Email" value={newWorker.email} onChange={v => setNewWorker({ ...newWorker, email: v })} placeholder="email@example.com" />
        <Input label="Phone" value={newWorker.phone} onChange={v => setNewWorker({ ...newWorker, phone: v })} placeholder="10-digit mobile number" />
        <Select label="Role" value={newWorker.role} onChange={v => setNewWorker({ ...newWorker, role: v })} options={Object.values(ROLES)} />
        <Select label="State" value={newWorker.state} onChange={v => setNewWorker({ ...newWorker, state: v })} options={["", "Maharashtra", "Uttar Pradesh", "Gujarat"]} />
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <Button variant="ghost" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>Cancel</Button>
          <Button style={{ flex: 1 }} onClick={() => {
            if (newWorker.name && newWorker.email) {
              setWorkers([...workers, { ...newWorker, id: workers.length + 1, status: "active", score: 50, district: "-", constituency: "-", booth: "-", joined: new Date().toISOString().split("T")[0] }]);
              setShowAddModal(false);
              setNewWorker({ name: "", email: "", phone: "", role: "Booth Worker", state: "", district: "", constituency: "", booth: "" });
            }
          }}>Register Worker</Button>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================
// PAGE: TASKS
// ============================================================
function TasksPage({ currentUser }) {
  const [tasks, setTasks] = useState(mockTasks);
  const [filter, setFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", type: "Outreach", priority: "Medium", assignedTo: "", area: "", deadline: "" });

  const filtered = tasks.filter(t => filter === "All" || t.status === filter);
  const canCreate = ROLE_LEVEL[currentUser.role] <= 3;

  const statuses = ["All", "Pending", "In Progress", "Completed"];
  const typeCounts = {
    Pending: tasks.filter(t => t.status === "Pending").length,
    "In Progress": tasks.filter(t => t.status === "In Progress").length,
    Completed: tasks.filter(t => t.status === "Completed").length,
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ color: theme.text, fontSize: 20, fontWeight: 800, margin: 0 }}>Task Management</h2>
        {canCreate && <Button onClick={() => setShowAdd(true)}>+ Create Task</Button>}
      </div>

      {/* Summary cards */}
      <div style={{ display: "flex", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          ["Pending", typeCounts.Pending, theme.warning],
          ["In Progress", typeCounts["In Progress"], theme.info],
          ["Completed", typeCounts.Completed, theme.success],
        ].map(([label, count, color]) => (
          <div key={label} onClick={() => setFilter(label)}
            style={{
              flex: 1, minWidth: 120, padding: "16px 18px",
              background: filter === label ? color + "18" : theme.bgCard,
              border: `1px solid ${filter === label ? color : theme.border}`,
              borderRadius: 10, cursor: "pointer", transition: "all 0.2s",
              textAlign: "center"
            }}>
            <div style={{ fontSize: 26, fontWeight: 800, color }}>{count}</div>
            <div style={{ color: theme.textMuted, fontSize: 12, fontWeight: 500 }}>{label}</div>
          </div>
        ))}
        <div onClick={() => setFilter("All")}
          style={{
            flex: 1, minWidth: 120, padding: "16px 18px",
            background: filter === "All" ? theme.accent + "18" : theme.bgCard,
            border: `1px solid ${filter === "All" ? theme.accent : theme.border}`,
            borderRadius: 10, cursor: "pointer", transition: "all 0.2s", textAlign: "center"
          }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: theme.accent }}>{tasks.length}</div>
          <div style={{ color: theme.textMuted, fontSize: 12, fontWeight: 500 }}>All Tasks</div>
        </div>
      </div>

      {/* Task list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map(task => (
          <Card key={task.id} hover>
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{
                width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                background: task.status === "Completed" ? theme.success + "18" : task.status === "In Progress" ? theme.info + "18" : theme.warning + "18",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18
              }}>
                {task.type === "Outreach" ? "🏘" : task.type === "Campaign" ? "📢" : task.type === "Meeting" ? "👥" : "🎪"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4, flexWrap: "wrap" }}>
                  <h4 style={{ color: theme.text, fontSize: 14, fontWeight: 700, margin: 0 }}>{task.title}</h4>
                  <StatusBadge status={task.priority} />
                  <StatusBadge status={task.status} />
                </div>
                <div style={{ color: theme.textMuted, fontSize: 12, marginBottom: 8 }}>
                  👤 {task.assignedTo} · 📍 {task.area} · 📅 Due: {task.deadline}
                </div>
                {task.status !== "Pending" && (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ color: theme.textMuted, fontSize: 11 }}>Progress</span>
                      <span style={{ color: theme.text, fontSize: 11, fontWeight: 600 }}>{task.progress}%</span>
                    </div>
                    <ProgressBar value={task.progress} color={task.status === "Completed" ? theme.success : theme.info} />
                  </div>
                )}
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                {task.status !== "Completed" && (
                  <Button variant="success" size="sm" onClick={() => {
                    setTasks(tasks.map(t => t.id === task.id ? { ...t, status: "Completed", progress: 100 } : t));
                  }}>Complete</Button>
                )}
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Task Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Create New Task">
        <Input label="Task Title" value={newTask.title} onChange={v => setNewTask({ ...newTask, title: v })} placeholder="Enter task description" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Select label="Task Type" value={newTask.type} onChange={v => setNewTask({ ...newTask, type: v })} options={["Outreach", "Campaign", "Meeting", "Event Duty"]} />
          <Select label="Priority" value={newTask.priority} onChange={v => setNewTask({ ...newTask, priority: v })} options={["Low", "Medium", "High", "Critical"]} />
        </div>
        <Select label="Assign To" value={newTask.assignedTo} onChange={v => setNewTask({ ...newTask, assignedTo: v })} options={["", ...mockUsers.map(u => u.name)]} />
        <Input label="Area" value={newTask.area} onChange={v => setNewTask({ ...newTask, area: v })} placeholder="e.g. Pune Central - Booth 42" />
        <Input label="Deadline" value={newTask.deadline} onChange={v => setNewTask({ ...newTask, deadline: v })} type="date" />
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <Button variant="ghost" style={{ flex: 1 }} onClick={() => setShowAdd(false)}>Cancel</Button>
          <Button style={{ flex: 1 }} onClick={() => {
            if (newTask.title) {
              setTasks([...tasks, { ...newTask, id: tasks.length + 1, status: "Pending", progress: 0 }]);
              setShowAdd(false);
              setNewTask({ title: "", type: "Outreach", priority: "Medium", assignedTo: "", area: "", deadline: "" });
            }
          }}>Create Task</Button>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================
// PAGE: REPORTS
// ============================================================
function ReportsPage({ currentUser }) {
  const [showSubmit, setShowSubmit] = useState(false);
  const [reports, setReports] = useState(mockReports);
  const [report, setReport] = useState({ summary: "", votersContacted: "", issues: "", location: "" });
  const [submitted, setSubmitted] = useState(false);

  const isWorker = ROLE_LEVEL[currentUser.role] >= 3;

  const handleSubmit = () => {
    if (report.summary) {
      setReports([{
        id: reports.length + 1,
        worker: currentUser.name,
        date: new Date().toISOString().split("T")[0],
        area: currentUser.booth || currentUser.constituency || currentUser.state,
        votersContacted: parseInt(report.votersContacted) || 0,
        issues: parseInt(report.issues) || 0,
        summary: report.summary,
        hasPhoto: false,
        location: report.location || "GPS pending",
      }, ...reports]);
      setSubmitted(true);
      setTimeout(() => { setShowSubmit(false); setSubmitted(false); }, 2000);
      setReport({ summary: "", votersContacted: "", issues: "", location: "" });
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ color: theme.text, fontSize: 20, fontWeight: 800, margin: "0 0 4px" }}>Field Reports</h2>
          <p style={{ color: theme.textMuted, fontSize: 13, margin: 0 }}>Daily activity reports from ground workers</p>
        </div>
        <Button onClick={() => setShowSubmit(true)}>+ Submit Report</Button>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
        <StatCard label="Total Reports" value={reports.length} icon="📊" color={theme.info} />
        <StatCard label="Voters Contacted" value={reports.reduce((a, r) => a + r.votersContacted, 0)} icon="👤" color={theme.success} />
        <StatCard label="Issues Raised" value={reports.reduce((a, r) => a + r.issues, 0)} icon="⚠" color={theme.warning} />
        <StatCard label="With Photos" value={reports.filter(r => r.hasPhoto).length} icon="📷" color={theme.purple} />
      </div>

      {/* Report cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {reports.map(r => (
          <Card key={r.id}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar name={r.worker} role={mockUsers.find(u => u.name === r.worker)?.role || "Booth Worker"} size={38} />
                <div>
                  <div style={{ color: theme.text, fontWeight: 600, fontSize: 14 }}>{r.worker}</div>
                  <div style={{ color: theme.textMuted, fontSize: 11 }}>📍 {r.area} · 📅 {r.date}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Badge label={`${r.votersContacted} voters`} color={theme.success} />
                {r.issues > 0 && <Badge label={`${r.issues} issues`} color={theme.warning} />}
                {r.hasPhoto && <Badge label="📷 Photo" color={theme.info} />}
              </div>
            </div>
            <p style={{ color: theme.textMuted, fontSize: 13, margin: "0 0 10px", lineHeight: 1.6 }}>{r.summary}</p>
            <div style={{ display: "flex", gap: 16, fontSize: 11, color: theme.textFaint }}>
              <span>📡 GPS: {r.location}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Submit Report Modal */}
      <Modal open={showSubmit} onClose={() => setShowSubmit(false)} title="Submit Daily Report">
        {submitted ? (
          <div style={{ textAlign: "center", padding: "30px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <h3 style={{ color: theme.success, fontSize: 18, fontWeight: 700 }}>Report Submitted!</h3>
            <p style={{ color: theme.textMuted }}>Your report has been recorded successfully.</p>
          </div>
        ) : (
          <>
            <div style={{ padding: "12px 16px", background: theme.bgPanel, borderRadius: 8, marginBottom: 16, fontSize: 12, color: theme.textMuted }}>
              Worker: <strong style={{ color: theme.text }}>{currentUser.name}</strong> · Area: <strong style={{ color: theme.text }}>{currentUser.booth || currentUser.constituency || currentUser.state}</strong>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", color: theme.textMuted, fontSize: 12, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Summary *</label>
              <textarea
                value={report.summary}
                onChange={e => setReport({ ...report, summary: e.target.value })}
                placeholder="Describe your activities today..."
                rows={4}
                style={{
                  width: "100%", background: theme.bgPanel, border: `1px solid ${theme.border}`,
                  borderRadius: 8, padding: 12, color: theme.text, fontSize: 14,
                  resize: "vertical", outline: "none", boxSizing: "border-box"
                }}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Input label="Voters Contacted" value={report.votersContacted} onChange={v => setReport({ ...report, votersContacted: v })} placeholder="0" type="number" />
              <Input label="Issues Raised" value={report.issues} onChange={v => setReport({ ...report, issues: v })} placeholder="0" type="number" />
            </div>
            <Input label="GPS Location" value={report.location} onChange={v => setReport({ ...report, location: v })} placeholder="Will be auto-captured" icon="📍" />

            {/* Photo upload simulation */}
            <div style={{
              border: `2px dashed ${theme.border}`, borderRadius: 8, padding: "20px",
              textAlign: "center", marginBottom: 16, cursor: "pointer", color: theme.textMuted, fontSize: 13
            }}>
              📷 Click to attach photos or videos<br />
              <span style={{ fontSize: 11 }}>Supports JPG, PNG, MP4 (max 10MB)</span>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <Button variant="ghost" style={{ flex: 1 }} onClick={() => setShowSubmit(false)}>Cancel</Button>
              <Button style={{ flex: 1 }} onClick={handleSubmit}>Submit Report</Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

// ============================================================
// PAGE: EVENTS
// ============================================================
function EventsPage() {
  const [events, setEvents] = useState(mockEvents);
  const [showAdd, setShowAdd] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: "", date: "", location: "", type: "Rally", attendees: "" });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ color: theme.text, fontSize: 20, fontWeight: 800, margin: 0 }}>Events & Campaigns</h2>
        <Button onClick={() => setShowAdd(true)}>+ Create Event</Button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {events.map(event => (
          <Card key={event.id} hover>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{
                padding: "6px 12px", borderRadius: 6,
                background: event.type === "Convention" ? theme.purple + "22" : event.type === "Rally" ? theme.accent + "22" : event.type === "Workshop" ? theme.info + "22" : theme.success + "22",
                color: event.type === "Convention" ? theme.purple : event.type === "Rally" ? theme.accent : event.type === "Workshop" ? theme.info : theme.success,
                fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em"
              }}>
                {event.type}
              </div>
              <StatusBadge status={event.status} />
            </div>
            <h3 style={{ color: theme.text, fontSize: 15, fontWeight: 700, margin: "0 0 8px" }}>{event.name}</h3>
            <div style={{ color: theme.textMuted, fontSize: 12, marginBottom: 16 }}>
              📅 {event.date} · 📍 {event.location}
            </div>

            {/* Attendance progress */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: theme.textMuted, fontSize: 12 }}>Registration</span>
                <span style={{ color: theme.text, fontSize: 12, fontWeight: 600 }}>{event.registered} / {event.attendees}</span>
              </div>
              <ProgressBar value={(event.registered / event.attendees) * 100} color={event.registered >= event.attendees * 0.9 ? theme.success : theme.warning} />
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <Button variant="ghost" size="sm" style={{ flex: 1 }}>👥 Workers</Button>
              <Button variant="info" size="sm" style={{ flex: 1 }}>📋 Details</Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Create New Event">
        <Input label="Event Name" value={newEvent.name} onChange={v => setNewEvent({ ...newEvent, name: v })} placeholder="Event name" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Input label="Date" value={newEvent.date} onChange={v => setNewEvent({ ...newEvent, date: v })} type="date" />
          <Select label="Type" value={newEvent.type} onChange={v => setNewEvent({ ...newEvent, type: v })} options={["Rally", "Convention", "Workshop", "Campaign"]} />
        </div>
        <Input label="Location" value={newEvent.location} onChange={v => setNewEvent({ ...newEvent, location: v })} placeholder="Venue or city" />
        <Input label="Expected Attendees" value={newEvent.attendees} onChange={v => setNewEvent({ ...newEvent, attendees: v })} type="number" />
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <Button variant="ghost" style={{ flex: 1 }} onClick={() => setShowAdd(false)}>Cancel</Button>
          <Button style={{ flex: 1 }} onClick={() => {
            if (newEvent.name) {
              setEvents([...events, { ...newEvent, id: events.length + 1, registered: 0, attendees: parseInt(newEvent.attendees) || 100, status: "Upcoming" }]);
              setShowAdd(false);
              setNewEvent({ name: "", date: "", location: "", type: "Rally", attendees: "" });
            }
          }}>Create Event</Button>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================
// PAGE: MESSAGES
// ============================================================
function MessagesPage({ currentUser }) {
  const [messages, setMessages] = useState(mockMessages);
  const [showCompose, setShowCompose] = useState(false);
  const [newMsg, setNewMsg] = useState({ to: "All Workers", content: "", level: "broadcast" });
  const [activeMsg, setActiveMsg] = useState(messages[0]);

  const canBroadcast = ROLE_LEVEL[currentUser.role] <= 2;

  const levelColor = { broadcast: theme.accent, state: theme.purple, district: theme.info, constituency: theme.success };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ color: theme.text, fontSize: 20, fontWeight: 800, margin: 0 }}>Communication Center</h2>
        {canBroadcast && <Button onClick={() => setShowCompose(true)}>+ Compose Message</Button>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 20 }}>
        {/* Message list */}
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: theme.text, fontWeight: 600, fontSize: 14 }}>Inbox</span>
            <Badge label={`${messages.filter(m => m.unread).length} new`} color={theme.accent} small />
          </div>
          {messages.map(msg => (
            <div key={msg.id}
              onClick={() => { setActiveMsg(msg); setMessages(messages.map(m => m.id === msg.id ? { ...m, unread: false } : m)); }}
              style={{
                padding: "14px 18px",
                borderBottom: `1px solid ${theme.border}22`,
                cursor: "pointer", background: activeMsg?.id === msg.id ? theme.bgCardHover : "transparent",
                borderLeft: `3px solid ${activeMsg?.id === msg.id ? theme.accent : "transparent"}`,
                transition: "all 0.15s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = theme.bgCardHover}
              onMouseLeave={e => e.currentTarget.style.background = activeMsg?.id === msg.id ? theme.bgCardHover : "transparent"}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ color: msg.unread ? theme.text : theme.textMuted, fontWeight: msg.unread ? 700 : 500, fontSize: 13 }}>
                  {msg.unread && <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: theme.accent, marginRight: 6 }} />}
                  {msg.from}
                </span>
                <span style={{ color: theme.textFaint, fontSize: 11 }}>{msg.time}</span>
              </div>
              <div style={{ color: theme.textMuted, fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {msg.content}
              </div>
              <div style={{ marginTop: 6 }}>
                <Badge label={msg.level} color={levelColor[msg.level]} small />
              </div>
            </div>
          ))}
        </Card>

        {/* Message view */}
        <Card>
          {activeMsg ? (
            <>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${theme.border}` }}>
                <Avatar name={activeMsg.from} role="Super Admin" size={44} />
                <div>
                  <h3 style={{ color: theme.text, fontSize: 15, fontWeight: 700, margin: "0 0 4px" }}>From: {activeMsg.from}</h3>
                  <div style={{ color: theme.textMuted, fontSize: 12 }}>To: {activeMsg.to} · {activeMsg.time}</div>
                  <div style={{ marginTop: 6 }}>
                    <Badge label={`Level: ${activeMsg.level}`} color={levelColor[activeMsg.level]} small />
                  </div>
                </div>
              </div>
              <p style={{ color: theme.text, fontSize: 14, lineHeight: 1.8, margin: "0 0 20px" }}>{activeMsg.content}</p>
              <div style={{ display: "flex", gap: 10 }}>
                <Button variant="ghost" size="sm">↩ Reply</Button>
                <Button variant="ghost" size="sm">→ Forward</Button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 0", color: theme.textFaint }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
              <p>Select a message to read</p>
            </div>
          )}
        </Card>
      </div>

      {/* Compose Modal */}
      <Modal open={showCompose} onClose={() => setShowCompose(false)} title="Compose Broadcast Message">
        <Select label="Audience" value={newMsg.to} onChange={v => setNewMsg({ ...newMsg, to: v })} options={["All Workers", "Maharashtra Team", "Uttar Pradesh Team", "State Coordinators", "District Coordinators"]} />
        <Select label="Level" value={newMsg.level} onChange={v => setNewMsg({ ...newMsg, level: v })} options={[
          { value: "broadcast", label: "Broadcast (National)" },
          { value: "state", label: "State Level" },
          { value: "district", label: "District Level" },
          { value: "constituency", label: "Constituency Level" },
        ]} />
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", color: theme.textMuted, fontSize: 12, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Message *</label>
          <textarea
            value={newMsg.content}
            onChange={e => setNewMsg({ ...newMsg, content: e.target.value })}
            placeholder="Type your message..."
            rows={5}
            style={{
              width: "100%", background: theme.bgPanel, border: `1px solid ${theme.border}`,
              borderRadius: 8, padding: 12, color: theme.text, fontSize: 14,
              resize: "vertical", outline: "none", boxSizing: "border-box"
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Button variant="ghost" style={{ flex: 1 }} onClick={() => setShowCompose(false)}>Cancel</Button>
          <Button style={{ flex: 1 }} onClick={() => {
            if (newMsg.content) {
              setMessages([{
                id: messages.length + 1, from: currentUser.name, to: newMsg.to,
                content: newMsg.content, time: "just now", level: newMsg.level, unread: true
              }, ...messages]);
              setShowCompose(false);
              setNewMsg({ to: "All Workers", content: "", level: "broadcast" });
            }
          }}>Send Message</Button>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================
// PAGE: AREAS
// ============================================================
function AreasPage() {
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedConstituency, setSelectedConstituency] = useState(null);

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ color: theme.text, fontSize: 20, fontWeight: 800, margin: "0 0 4px" }}>Area Hierarchy Management</h2>
        <p style={{ color: theme.textMuted, fontSize: 13, margin: 0 }}>Country → State → District → Constituency → Booth</p>
      </div>

      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, padding: "12px 16px", background: theme.bgCard, borderRadius: 8, border: `1px solid ${theme.border}` }}>
        <span
          onClick={() => { setSelectedState(null); setSelectedDistrict(null); setSelectedConstituency(null); }}
          style={{ color: !selectedState ? theme.text : theme.accent, cursor: "pointer", fontWeight: !selectedState ? 700 : 400, fontSize: 13 }}
        >
          🇮🇳 India
        </span>
        {selectedState && <>
          <span style={{ color: theme.textFaint }}>›</span>
          <span onClick={() => { setSelectedDistrict(null); setSelectedConstituency(null); }}
            style={{ color: !selectedDistrict ? theme.text : theme.accent, cursor: "pointer", fontWeight: !selectedDistrict ? 700 : 400, fontSize: 13 }}>
            {selectedState}
          </span>
        </>}
        {selectedDistrict && <>
          <span style={{ color: theme.textFaint }}>›</span>
          <span onClick={() => setSelectedConstituency(null)}
            style={{ color: !selectedConstituency ? theme.text : theme.accent, cursor: "pointer", fontWeight: !selectedConstituency ? 700 : 400, fontSize: 13 }}>
            {selectedDistrict}
          </span>
        </>}
        {selectedConstituency && <>
          <span style={{ color: theme.textFaint }}>›</span>
          <span style={{ color: theme.text, fontWeight: 700, fontSize: 13 }}>{selectedConstituency}</span>
        </>}
      </div>

      {/* Level view */}
      {!selectedState && (
        <div>
          <h3 style={{ color: theme.textMuted, fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>States</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {Object.keys(areaHierarchy).map(state => (
              <Card key={state} hover onClick={() => setSelectedState(state)} style={{ cursor: "pointer" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>🗺</div>
                <h4 style={{ color: theme.text, fontSize: 14, fontWeight: 700, margin: "0 0 4px" }}>{state}</h4>
                <p style={{ color: theme.textMuted, fontSize: 12, margin: 0 }}>{Object.keys(areaHierarchy[state]).length} Districts</p>
                <div style={{ marginTop: 10 }}>
                  <Badge label="Active" color={theme.success} small />
                </div>
              </Card>
            ))}
            <Card hover style={{ cursor: "pointer", border: `2px dashed ${theme.border}`, background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 6, minHeight: 120 }}>
              <div style={{ color: theme.textFaint, fontSize: 24 }}>+</div>
              <span style={{ color: theme.textFaint, fontSize: 12 }}>Add State</span>
            </Card>
          </div>
        </div>
      )}

      {selectedState && !selectedDistrict && (
        <div>
          <h3 style={{ color: theme.textMuted, fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Districts in {selectedState}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {Object.keys(areaHierarchy[selectedState]).map(district => (
              <Card key={district} hover onClick={() => setSelectedDistrict(district)} style={{ cursor: "pointer" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>🏙</div>
                <h4 style={{ color: theme.text, fontSize: 14, fontWeight: 700, margin: "0 0 4px" }}>{district}</h4>
                <p style={{ color: theme.textMuted, fontSize: 12, margin: 0 }}>
                  {Object.keys(areaHierarchy[selectedState][district]).length} Constituencies
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {selectedState && selectedDistrict && !selectedConstituency && (
        <div>
          <h3 style={{ color: theme.textMuted, fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Constituencies in {selectedDistrict}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {Object.keys(areaHierarchy[selectedState][selectedDistrict]).map(constituency => (
              <Card key={constituency} hover onClick={() => setSelectedConstituency(constituency)} style={{ cursor: "pointer" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>🏛</div>
                <h4 style={{ color: theme.text, fontSize: 14, fontWeight: 700, margin: "0 0 4px" }}>{constituency}</h4>
                <p style={{ color: theme.textMuted, fontSize: 12, margin: 0 }}>
                  {areaHierarchy[selectedState][selectedDistrict][constituency].length} Booths
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {selectedState && selectedDistrict && selectedConstituency && (
        <div>
          <h3 style={{ color: theme.textMuted, fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Booths in {selectedConstituency}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {areaHierarchy[selectedState][selectedDistrict][selectedConstituency].map(booth => {
              const worker = mockUsers.find(u => u.booth === booth);
              return (
                <Card key={booth}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: 24, marginBottom: 6 }}>🗳</div>
                      <h4 style={{ color: theme.text, fontSize: 14, fontWeight: 700, margin: "0 0 4px" }}>{booth}</h4>
                    </div>
                    <StatusBadge status={worker ? "active" : "inactive"} />
                  </div>
                  {worker ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, padding: "8px", background: theme.bgPanel, borderRadius: 6 }}>
                      <Avatar name={worker.name} role={worker.role} size={28} />
                      <div>
                        <div style={{ color: theme.text, fontSize: 12, fontWeight: 600 }}>{worker.name}</div>
                        <div style={{ color: theme.textMuted, fontSize: 10 }}>Assigned</div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ marginTop: 10, color: theme.textFaint, fontSize: 12 }}>No worker assigned</div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// PAGE: ANALYTICS
// ============================================================
function AnalyticsPage() {
  const topWorkers = [...mockUsers].sort((a, b) => b.score - a.score).slice(0, 5);

  return (
    <div>
      <h2 style={{ color: theme.text, fontSize: 20, fontWeight: 800, margin: "0 0 20px" }}>Analytics & Performance</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Performance ranking */}
        <Card>
          <h3 style={{ color: theme.text, fontSize: 15, fontWeight: 700, margin: "0 0 16px" }}>🏆 Top Performers</h3>
          {topWorkers.map((w, i) => (
            <div key={w.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${theme.border}22` }}>
              <div style={{
                width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                background: i === 0 ? "#FFD700" + "22" : i === 1 ? "#C0C0C0" + "22" : i === 2 ? "#CD7F32" + "22" : theme.bgPanel,
                border: `1px solid ${i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : theme.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: i < 3 ? ["#FFD700", "#C0C0C0", "#CD7F32"][i] : theme.textFaint,
                fontSize: 13, fontWeight: 700
              }}>#{i + 1}</div>
              <Avatar name={w.name} role={w.role} size={34} />
              <div style={{ flex: 1 }}>
                <div style={{ color: theme.text, fontSize: 13, fontWeight: 600 }}>{w.name}</div>
                <div style={{ color: theme.textMuted, fontSize: 11 }}>{w.role} · {w.state}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: w.score >= 80 ? theme.success : w.score >= 60 ? theme.warning : theme.danger, fontSize: 16, fontWeight: 800 }}>{w.score}</div>
                <div style={{ color: theme.textFaint, fontSize: 10 }}>score</div>
              </div>
            </div>
          ))}
        </Card>

        {/* Activity metrics */}
        <Card>
          <h3 style={{ color: theme.text, fontSize: 15, fontWeight: 700, margin: "0 0 16px" }}>📈 Weekly Activity</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { label: "Voter Contacts", value: 2840, max: 5000, color: theme.accent },
              { label: "Tasks Completed", value: 67, max: 100, color: theme.success },
              { label: "Reports Submitted", value: 89, max: 100, color: theme.info },
              { label: "Events Attended", value: 34, max: 50, color: theme.purple },
              { label: "New Volunteers", value: 23, max: 50, color: theme.warning },
            ].map(m => (
              <div key={m.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ color: theme.textMuted, fontSize: 12 }}>{m.label}</span>
                  <span style={{ color: theme.text, fontSize: 12, fontWeight: 700 }}>{m.value.toLocaleString()}</span>
                </div>
                <ProgressBar value={(m.value / m.max) * 100} color={m.color} height={8} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Detailed stats table */}
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${theme.border}` }}>
          <h3 style={{ color: theme.text, fontSize: 15, fontWeight: 700, margin: 0 }}>Worker Performance Summary</h3>
        </div>
        <Table
          columns={[
            { key: "name", label: "Worker", render: (v, row) => <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Avatar name={row.name} role={row.role} size={30} /><div><div style={{ color: theme.text, fontSize: 13, fontWeight: 600 }}>{row.name}</div><div style={{ color: theme.textMuted, fontSize: 11 }}>{row.role}</div></div></div> },
            { key: "state", label: "State" },
            { key: "status", label: "Status", render: v => <StatusBadge status={v} /> },
            {
              key: "score", label: "Performance Score",
              render: (v, row) => (
                <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 120 }}>
                  <ProgressBar value={v} color={v >= 80 ? theme.success : v >= 60 ? theme.warning : theme.danger} />
                  <span style={{ color: theme.text, fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{v}</span>
                </div>
              )
            },
          ]}
          data={mockUsers}
        />
      </Card>
    </div>
  );
}

// ============================================================
// SIDEBAR NAVIGATION
// ============================================================
function Sidebar({ currentPage, onNavigate, currentUser, onLogout, collapsed }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "⊞", minRole: 0 },
    { id: "workers", label: "Workers", icon: "👥", minRole: 0 },
    { id: "tasks", label: "Tasks", icon: "📋", minRole: 0 },
    { id: "reports", label: "Reports", icon: "📊", minRole: 0 },
    { id: "events", label: "Events", icon: "📅", minRole: 0 },
    { id: "messages", label: "Messages", icon: "💬", minRole: 0 },
    { id: "areas", label: "Areas", icon: "🗺", minRole: 0 },
    { id: "analytics", label: "Analytics", icon: "📈", minRole: 0 },
  ];

  return (
    <div style={{
      width: collapsed ? 60 : 220, background: theme.bgPanel,
      borderRight: `1px solid ${theme.border}`,
      display: "flex", flexDirection: "column", height: "100vh",
      position: "fixed", left: 0, top: 0, bottom: 0, overflow: "hidden",
      transition: "width 0.3s ease", zIndex: 100, flexShrink: 0
    }}>
      {/* Logo */}
      <div style={{ padding: collapsed ? "20px 12px" : "20px 18px", borderBottom: `1px solid ${theme.border}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8, flexShrink: 0,
            background: `linear-gradient(135deg, ${theme.accent}, #FF8C55)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 900, color: "white"
          }}>⚑</div>
          {!collapsed && (
            <div>
              <div style={{ color: theme.text, fontSize: 13, fontWeight: 800, lineHeight: 1 }}>Jana Shakti</div>
              <div style={{ color: theme.textFaint, fontSize: 10 }}>Management System</div>
            </div>
          )}
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "10px 8px" }}>
        {navItems.filter(i => ROLE_LEVEL[currentUser.role] >= 0).map(item => {
          const active = currentPage === item.id;
          return (
            <button key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                width: "100%", padding: collapsed ? "10px 12px" : "10px 12px",
                background: active ? theme.accent + "18" : "transparent",
                border: `1px solid ${active ? theme.accent + "33" : "transparent"}`,
                borderRadius: 8, marginBottom: 2,
                color: active ? theme.accent : theme.textMuted,
                cursor: "pointer", transition: "all 0.15s", textAlign: "left",
                justifyContent: collapsed ? "center" : "flex-start"
              }}
              onMouseEnter={e => !active && (e.currentTarget.style.background = theme.bgCard)}
              onMouseLeave={e => !active && (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && <span style={{ fontSize: 13, fontWeight: active ? 600 : 400 }}>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* User section */}
      <div style={{ padding: "12px 10px", borderTop: `1px solid ${theme.border}`, flexShrink: 0 }}>
        {!collapsed && (
          <div style={{ padding: "10px", background: theme.bg, borderRadius: 8, marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Avatar name={currentUser.name} role={currentUser.role} size={30} />
              <div style={{ overflow: "hidden" }}>
                <div style={{ color: theme.text, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{currentUser.name}</div>
                <div style={{ color: theme.textFaint, fontSize: 10, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{currentUser.role}</div>
              </div>
            </div>
          </div>
        )}
        <button onClick={onLogout} style={{
          display: "flex", alignItems: "center", gap: 8, width: "100%",
          padding: "8px 12px", background: "transparent", border: `1px solid ${theme.border}`,
          borderRadius: 8, color: theme.textMuted, cursor: "pointer", fontSize: 12,
          justifyContent: collapsed ? "center" : "flex-start",
          transition: "all 0.15s"
        }}
          onMouseEnter={e => { e.target.style.background = theme.danger + "15"; e.target.style.color = theme.danger; }}
          onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = theme.textMuted; }}
        >
          <span>⏻</span>
          {!collapsed && "Sign Out"}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// HEADER
// ============================================================
function Header({ currentUser, currentPage, notifications, onToggleSidebar, collapsed }) {
  const pageNames = {
    dashboard: "Dashboard",
    workers: "Worker Management",
    tasks: "Task Management",
    reports: "Field Reports",
    events: "Events & Campaigns",
    messages: "Communication",
    areas: "Area Management",
    analytics: "Analytics",
  };

  return (
    <div style={{
      height: 60, background: theme.bgPanel, borderBottom: `1px solid ${theme.border}`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 20px", position: "sticky", top: 0, zIndex: 50
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onToggleSidebar} style={{
          background: "none", border: `1px solid ${theme.border}`, borderRadius: 6,
          padding: "6px 8px", color: theme.textMuted, cursor: "pointer", fontSize: 16
        }}>☰</button>
        <div>
          <span style={{ color: theme.text, fontSize: 15, fontWeight: 700 }}>{pageNames[currentPage]}</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Status indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", background: theme.success + "15", border: `1px solid ${theme.success}33`, borderRadius: 20 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: theme.success }} />
          <span style={{ color: theme.success, fontSize: 11, fontWeight: 600 }}>Live</span>
        </div>
        {/* Notification bell */}
        <div style={{ position: "relative" }}>
          <button style={{ background: "none", border: `1px solid ${theme.border}`, borderRadius: 8, padding: "6px 10px", color: theme.textMuted, cursor: "pointer", fontSize: 16 }}>
            🔔
          </button>
          {notifications > 0 && (
            <span style={{
              position: "absolute", top: -4, right: -4, width: 16, height: 16,
              background: theme.accent, borderRadius: "50%", fontSize: 9, fontWeight: 700,
              color: "white", display: "flex", alignItems: "center", justifyContent: "center"
            }}>{notifications}</span>
          )}
        </div>
        <Avatar name={currentUser.name} role={currentUser.role} size={34} />
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogin = (user) => setCurrentUser(user);
  const handleLogout = () => { setCurrentUser(null); setCurrentPage("dashboard"); };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const sidebarWidth = sidebarCollapsed ? 60 : 220;

  const pages = {
    dashboard: <DashboardPage currentUser={currentUser} />,
    workers: <WorkersPage currentUser={currentUser} />,
    tasks: <TasksPage currentUser={currentUser} />,
    reports: <ReportsPage currentUser={currentUser} />,
    events: <EventsPage />,
    messages: <MessagesPage currentUser={currentUser} />,
    areas: <AreasPage />,
    analytics: <AnalyticsPage />,
  };

  return (
    <div style={{ fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', sans-serif", background: theme.bg, minHeight: "100vh", color: theme.text }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: ${theme.bg}; }
        ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: ${theme.borderLight}; }
        input, select, textarea { font-family: inherit; }
        button { font-family: inherit; }
        @media (max-width: 768px) {
          .sidebar { width: 60px !important; }
          .main-content { margin-left: 60px !important; }
        }
      `}</style>

      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        currentUser={currentUser}
        onLogout={handleLogout}
        collapsed={sidebarCollapsed}
      />

      <div style={{ marginLeft: sidebarWidth, transition: "margin-left 0.3s ease" }}>
        <Header
          currentUser={currentUser}
          currentPage={currentPage}
          notifications={3}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          collapsed={sidebarCollapsed}
        />
        <main style={{ padding: 24, maxWidth: 1400 }}>
          {pages[currentPage]}
        </main>
      </div>
    </div>
  );
}