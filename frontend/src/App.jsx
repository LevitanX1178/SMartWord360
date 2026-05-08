import React, { useMemo, useState, useEffect, useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// ─── DATA ──────────────────────────────────────────────────────────────────────

const patients = [
  {
    id: "PID-360-1001", nid: "1998-5832-7614", phone: "+880 1711-234567", emergencyContact: "+880 1812-345678 (Husband)", name: "Ayesha Rahman", age: 58, gender: "Female",
    ward: "Cardiology", bed: "B-12", status: "Critical", handoverColor: "Red",
    risk: "High", lastMove: "2h 18m", diagnosis: "Acute Coronary Syndrome",
    allergies: ["Penicillin"], currentMeds: ["Aspirin", "Warfarin", "Atorvastatin"],
    visits: [{ hospital: "CityCare Hospital", year: "2024", dx: "Hypertension management", meds: ["Amlodipine", "Losartan"] }, { hospital: "Metro General", year: "2025", dx: "Chest pain evaluation", meds: ["Aspirin", "Nitroglycerin"] }],
    report: "Troponin elevated; ECG abnormal", heartRate: 122, bp: "150/95",
    temp: "101.2°F", oxygen: "92%", doseGiven: "Aspirin 75mg at 10:00 AM",
    lifeStatus: "Needs close monitoring", sampleChecklist: ["Blood collected", "Troponin pending", "ECG done"],
    catheter: "Inserted — urine output 350ml/6h", drainTube: "Not applicable",
    currentDoctor: "Dr. Farhana Islam", nextDoctor: "Dr. Mahmud Rahman",
    assignedNurse: "Nurse Rima Akter", shiftTime: "Morning → Evening",
    familyHistory: "Father had ischemic heart disease",
    drugHistory: "Long-term hypertension medication; previous Warfarin use",
    immunizationHistory: "COVID-19 vaccinated; Flu vaccine not updated",
    avatar: "AR", painScore: 7, mobilityScore: 3, fallRisk: "High",
    admittedDate: "Apr 28, 2026", expectedDischarge: "May 4, 2026",
    insurance: "Government Health Scheme", ward_notes: "Patient anxious. Family notified. Cardiac team on standby.",
    prescriptions: [
      { drug: "Aspirin", dose: "75mg", route: "Oral", freq: "Once daily", prescribedBy: "Dr. Farhana Islam", date: "Apr 28, 2026", status: "Active" },
      { drug: "Warfarin", dose: "5mg", route: "Oral", freq: "Once daily (evening)", prescribedBy: "Dr. Farhana Islam", date: "Apr 28, 2026", status: "Active" },
      { drug: "Atorvastatin", dose: "40mg", route: "Oral", freq: "Once at night", prescribedBy: "Dr. Mahmud Rahman", date: "Apr 29, 2026", status: "Active" },
      { drug: "Metoprolol", dose: "25mg", route: "Oral", freq: "Twice daily", prescribedBy: "Dr. Farhana Islam", date: "Apr 28, 2026", status: "Discontinued" },
    ],
    universalHistory: {
      bloodType: "B+", weight: "68kg", height: "162cm",
      chronicConditions: ["Hypertension (12 yrs)", "Type 2 Diabetes"],
      surgicalHistory: ["Appendectomy (2009)", "Cataract surgery (2021)"],
      previousPrescriptions: [
        { drug: "Amlodipine 5mg", hospital: "CityCare Hospital", year: "2024" },
        { drug: "Metformin 500mg", hospital: "National Medical", year: "2023" },
        { drug: "Losartan 50mg", hospital: "Metro General", year: "2025" },
      ]
    }
  },
  {
    id: "PID-360-1002", nid: "2003-1147-9925", phone: "+880 1955-678901", emergencyContact: "+880 1716-789012 (Wife)", name: "Tanvir Hasan", age: 34, gender: "Male",
    ward: "Medicine", bed: "A-04", status: "Stable", handoverColor: "Yellow",
    risk: "Medium", lastMove: "54m", diagnosis: "Severe Pneumonia",
    allergies: ["Sulfa"], currentMeds: ["Azithromycin", "Paracetamol"],
    visits: [{ hospital: "GreenLife Clinic", year: "2023", dx: "Bronchitis", meds: ["Amoxicillin", "Bromhexine"] }],
    report: "Chest X-ray shows lower lobe opacity", heartRate: 96, bp: "125/82",
    temp: "100.1°F", oxygen: "96%", doseGiven: "Azithromycin completed at 9:30 AM",
    lifeStatus: "Stable but needs oxygen follow-up", sampleChecklist: ["Sputum collected", "CBC sent", "X-ray done"],
    catheter: "No catheter", drainTube: "No drain tube",
    currentDoctor: "Dr. Arif Hossain", nextDoctor: "Dr. Samia Noor",
    assignedNurse: "Nurse Tania Begum", shiftTime: "Morning → Evening",
    familyHistory: "Mother has asthma",
    drugHistory: "Occasional inhaler use; no chronic medicine",
    immunizationHistory: "COVID-19 vaccinated; Pneumonia vaccine unknown",
    avatar: "TH", painScore: 4, mobilityScore: 7, fallRisk: "Low",
    admittedDate: "Apr 29, 2026", expectedDischarge: "May 3, 2026",
    insurance: "Private — Meghna Life", ward_notes: "Responding well to antibiotics. SpO2 improving.",
    prescriptions: [
      { drug: "Azithromycin", dose: "500mg", route: "IV", freq: "Once daily", prescribedBy: "Dr. Arif Hossain", date: "Apr 29, 2026", status: "Active" },
      { drug: "Paracetamol", dose: "500mg", route: "Oral", freq: "Every 6h PRN", prescribedBy: "Dr. Arif Hossain", date: "Apr 29, 2026", status: "Active" },
      { drug: "Salbutamol Nebulizer", dose: "2.5mg", route: "Nebulizer", freq: "Every 8h", prescribedBy: "Dr. Samia Noor", date: "Apr 30, 2026", status: "Active" },
    ],
    universalHistory: {
      bloodType: "O+", weight: "72kg", height: "175cm",
      chronicConditions: ["Seasonal asthma (mild)"],
      surgicalHistory: ["None"],
      previousPrescriptions: [
        { drug: "Amoxicillin 500mg", hospital: "GreenLife Clinic", year: "2023" },
        { drug: "Salbutamol inhaler", hospital: "GreenLife Clinic", year: "2023" },
      ]
    }
  },
  {
    id: "PID-360-1003", nid: "1975-3362-0081", phone: "+880 1830-456789", emergencyContact: "+880 1914-567890 (Son)", name: "Karim Uddin", age: 72, gender: "Male",
    ward: "Neurology", bed: "C-09", status: "Warning", handoverColor: "Green",
    risk: "High", lastMove: "1h 42m", diagnosis: "Post-Stroke Observation",
    allergies: ["None known"], currentMeds: ["Clopidogrel", "Omeprazole"],
    visits: [{ hospital: "National Medical", year: "2022", dx: "TIA (mini stroke)", meds: ["Aspirin", "Ramipril"] }, { hospital: "CityCare Hospital", year: "2025", dx: "BP fluctuation", meds: ["Amlodipine"] }],
    report: "CT scan: ischemic changes", heartRate: 84, bp: "130/85",
    temp: "98.7°F", oxygen: "98%", doseGiven: "Clopidogrel at 8:00 AM",
    lifeStatus: "Improving — discharge planning possible", sampleChecklist: ["CT done", "RBS checked", "Electrolytes ready"],
    catheter: "Removed — passing urine normally", drainTube: "No drain tube",
    currentDoctor: "Dr. Nayeem Chowdhury", nextDoctor: "Dr. Sabrina Khan",
    assignedNurse: "Nurse Jahanara Begum", shiftTime: "Morning → Evening",
    familyHistory: "Brother had stroke",
    drugHistory: "Diabetes and BP medicine for 12 years",
    immunizationHistory: "COVID-19 vaccinated; Tetanus unknown",
    avatar: "KU", painScore: 2, mobilityScore: 5, fallRisk: "Medium",
    admittedDate: "Apr 25, 2026", expectedDischarge: "May 2, 2026",
    insurance: "Government Health Scheme", ward_notes: "Physiotherapy started. Speech therapy referral pending.",
    prescriptions: [
      { drug: "Clopidogrel", dose: "75mg", route: "Oral", freq: "Once daily", prescribedBy: "Dr. Nayeem Chowdhury", date: "Apr 25, 2026", status: "Active" },
      { drug: "Omeprazole", dose: "20mg", route: "Oral", freq: "Once daily (morning)", prescribedBy: "Dr. Nayeem Chowdhury", date: "Apr 25, 2026", status: "Active" },
      { drug: "Amlodipine", dose: "5mg", route: "Oral", freq: "Once daily", prescribedBy: "Dr. Sabrina Khan", date: "Apr 27, 2026", status: "Active" },
    ],
    universalHistory: {
      bloodType: "A+", weight: "65kg", height: "168cm",
      chronicConditions: ["Type 2 Diabetes (10 yrs)", "Hypertension (12 yrs)", "Dyslipidemia"],
      surgicalHistory: ["CABG (2018)", "Prostate surgery (2020)"],
      previousPrescriptions: [
        { drug: "Aspirin 81mg", hospital: "National Medical", year: "2022" },
        { drug: "Ramipril 5mg", hospital: "National Medical", year: "2022" },
        { drug: "Amlodipine 5mg", hospital: "CityCare Hospital", year: "2025" },
        { drug: "Metformin 1000mg", hospital: "National Medical", year: "2022" },
      ]
    }
  },
];

const vitalsHistory = {
  "PID-360-1001": [
    { time: "08:00", hr: 110, spo2: 94, bp: 148, temp: 100.8 },
    { time: "09:00", hr: 115, spo2: 93, bp: 151, temp: 101.0 },
    { time: "10:00", hr: 118, spo2: 93, bp: 152, temp: 101.2 },
    { time: "11:00", hr: 120, spo2: 92, bp: 154, temp: 101.4 },
    { time: "12:00", hr: 122, spo2: 91, bp: 156, temp: 101.6 },
    { time: "13:00", hr: 119, spo2: 92, bp: 153, temp: 101.3 },
  ],
  "PID-360-1002": [
    { time: "08:00", hr: 100, spo2: 94, bp: 128, temp: 100.5 },
    { time: "09:00", hr: 98, spo2: 95, bp: 126, temp: 100.3 },
    { time: "10:00", hr: 97, spo2: 95, bp: 126, temp: 100.2 },
    { time: "11:00", hr: 96, spo2: 96, bp: 125, temp: 100.1 },
    { time: "12:00", hr: 95, spo2: 96, bp: 124, temp: 100.0 },
    { time: "13:00", hr: 94, spo2: 97, bp: 124, temp: 99.8 },
  ],
  "PID-360-1003": [
    { time: "08:00", hr: 86, spo2: 97, bp: 132, temp: 99.0 },
    { time: "09:00", hr: 85, spo2: 97, bp: 131, temp: 98.9 },
    { time: "10:00", hr: 85, spo2: 98, bp: 131, temp: 98.8 },
    { time: "11:00", hr: 84, spo2: 98, bp: 130, temp: 98.7 },
    { time: "12:00", hr: 84, spo2: 98, bp: 130, temp: 98.7 },
    { time: "13:00", hr: 83, spo2: 99, bp: 129, temp: 98.6 },
  ],
};

const interactions = {
  "aspirin+warfarin": { level: "Serious", msg: "High bleeding risk. Patient should be monitored and reviewed by attending physician immediately." },
  "ibuprofen+warfarin": { level: "Contraindicated", msg: "Do NOT administer. Severe GI and systemic bleeding risk. Contraindicated combination." },
  "beta blocker+asthma": { level: "Contraindicated", msg: "Beta-blocker contraindicated in known asthma/COPD. Risk of severe bronchospasm." },
  "dengue+ibuprofen": { level: "Contraindicated", msg: "NSAIDs increase platelet-related bleeding risk in dengue fever. Avoid entirely." },
  "dengue+aspirin": { level: "Contraindicated", msg: "Aspirin contraindicated in dengue due to bleeding complications and Reye syndrome risk." },
  "clopidogrel+omeprazole": { level: "Minor", msg: "Omeprazole may reduce clopidogrel antiplatelet efficacy. Consider pantoprazole as alternative." },
  "azithromycin+paracetamol": { level: "Safe", msg: "No clinically significant interaction detected between azithromycin and paracetamol." },
  "ibuprofen+aspirin": { level: "Serious", msg: "Concurrent NSAID use increases GI bleeding risk and may reduce aspirin's cardioprotective effect." },
};

function getInteraction(a, b) {
  const key = [a.trim().toLowerCase(), b.trim().toLowerCase()].sort().join("+");
  return interactions[key] || { level: "Safe", msg: "No dangerous interaction found in protocol database. Proceed with clinical judgment." };
}

function getTone(v) {
  if (["Critical", "High", "Contraindicated", "Serious", "Red"].includes(v)) return "danger";
  if (["Warning", "Medium", "Minor", "Yellow"].includes(v)) return "warn";
  return "safe";
}

const navItems = [
  { label: "Command Center", icon: "⌘", group: "OVERVIEW" },
  { label: "Patient Records", icon: "◎", group: "OVERVIEW" },
  { label: "Prescription Hub", icon: "⬡", group: "PATIENT CARE" },
  { label: "AI Clinical Notes", icon: "✦", group: "PATIENT CARE" },
  { label: "Rx Safety Checker", icon: "⚕", group: "PATIENT CARE" },
  { label: "Shift Handover", icon: "⇄", group: "PATIENT CARE" },
  { label: "Smart Bed Monitor", icon: "▣", group: "OPERATIONS" },
  { label: "Sample Tracking", icon: "◈", group: "OPERATIONS" },
  { label: "Ambulance Sync", icon: "◆", group: "OPERATIONS" },
];

// ─── ROOT ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [active, setActive] = useState("Command Center");
  const [selectedId, setSelectedId] = useState(patients[0].id);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const selected = patients.find(p => p.id === selectedId) || patients[0];

  return (
    <>
      <style>{css}</style>
      <div className="app">
        {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
        <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="brand">
            <div className="brand-mark">SW</div>
            <div className="brand-text">
              <h1>SmartWard<em>360</em></h1>
              <p>Intelligent Care Platform</p>
            </div>
            <div className="live-badge"><span className="pulse-ring" /><span>LIVE</span></div>
          </div>

          <div className="nav-body">
            {["OVERVIEW", "PATIENT CARE", "OPERATIONS"].map(group => (
              <div className="nav-section" key={group}>
                <p className="nav-label">{group}</p>
                {navItems.filter(n => n.group === group).map(({ label, icon }) => (
                  <button key={label} className={`nav-btn ${active === label ? "active" : ""}`}
                    onClick={() => { setActive(label); setSidebarOpen(false); }}>
                    <span className="nav-icon">{icon}</span>
                    <span>{label}</span>
                    {label === "AI Clinical Notes" && <span className="pill-tag ai">AI</span>}
                    {label === "Prescription Hub" && <span className="pill-tag new">NEW</span>}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <div className="sidebar-footer">
            <div className="doc-avatar">DR</div>
            <div className="doc-info">
              <p className="doc-name">Dr. M. Rahman</p>
              <p className="doc-role">Senior Consultant</p>
            </div>
            <div className="duty-badge">On Duty</div>
          </div>
        </aside>

        <main className="main">
          <TopBar active={active} setSidebarOpen={setSidebarOpen} />
          <div className="mobile-nav-scroll">
            {navItems.map(({ label, icon }) => (
              <button key={label} className={`mob-tab ${active === label ? "active" : ""}`}
                onClick={() => setActive(label)}>{icon} {label}</button>
            ))}
          </div>
          <div className="page">
            {active === "Command Center" && <CommandCenter setSelectedId={setSelectedId} setActive={setActive} />}
            {active === "Patient Records" && <PatientRecords selected={selected} selectedId={selectedId} setSelectedId={setSelectedId} />}
            {active === "Prescription Hub" && <PrescriptionHub selected={selected} selectedId={selectedId} setSelectedId={setSelectedId} />}
            {active === "AI Clinical Notes" && <AIClinicalNotes selected={selected} selectedId={selectedId} setSelectedId={setSelectedId} />}
            {active === "Rx Safety Checker" && <RxChecker selected={selected} selectedId={selectedId} setSelectedId={setSelectedId} />}
            {active === "Shift Handover" && <ShiftHandover />}
            {active === "Smart Bed Monitor" && <SmartBed />}
            {active === "Sample Tracking" && <SampleTracking />}
            {active === "Ambulance Sync" && <AmbulanceSync />}
          </div>
        </main>
      </div>
    </>
  );
}

// ─── TOP BAR ───────────────────────────────────────────────────────────────────

function TopBar({ active, setSidebarOpen }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="hamburger" onClick={() => setSidebarOpen(o => !o)}>
          <span /><span /><span />
        </button>
        <div>
          <p className="page-eye">Chittagong General Hospital</p>
          <h2 className="page-title">{active}</h2>
        </div>
      </div>
      <div className="topbar-right">
        <div className="clock-display">
          <span className="clock-time">{time.toLocaleTimeString("en-BD", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
          <span className="clock-date">{time.toLocaleDateString("en-BD", { weekday: "short", month: "short", day: "numeric" })}</span>
        </div>
        <div className="search-box">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
          <input placeholder="Search patient, ID…" />
        </div>
        <button className="notif-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
          <span className="notif-dot">4</span>
        </button>
      </div>
    </header>
  );
}

// ─── COMMAND CENTER ────────────────────────────────────────────────────────────

function CommandCenter({ setSelectedId, setActive }) {
  return (
    <div className="page-grid">
      <div className="cc-hero">
        <div className="cc-hero-left">
          <div className="cc-eyebrow"><span className="pulse-dot" /><span>Live Monitoring Active</span></div>
          <h1 className="cc-title">Ward Command<br />Center</h1>
          <p className="cc-desc">Real-time patient safety, bed monitoring, drug interactions, and AI-assisted care — unified in one intelligent platform.</p>
          <div className="cc-actions">
            <button className="btn-primary">Start Shift Review</button>
            <button className="btn-outline-white">Critical Alerts</button>
          </div>
        </div>
        <div className="cc-stat-grid">
          {[
            { val: "128", label: "Admitted", delta: "+3", icon: "◎" },
            { val: "12", label: "Critical", delta: "+1", tone: "danger", icon: "△" },
            { val: "34", label: "Lab Pending", delta: "−2", tone: "warn", icon: "◈" },
            { val: "96%", label: "IoT Beds Online", delta: "stable", tone: "safe", icon: "▣" },
          ].map(s => (
            <div key={s.label} className={`cc-stat ${s.tone || ""}`}>
              <div className="cc-stat-icon">{s.icon}</div>
              <div className="cc-stat-body">
                <p className="cc-stat-label">{s.label}</p>
                <div className="cc-stat-row">
                  <strong className="cc-stat-val">{s.val}</strong>
                  <span className={`cc-stat-delta ${s.tone || "safe"}`}>{s.delta}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2-1">
        <Card title="Live Patient Board" icon="⌘" sub="All admitted patients — real-time status">
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Patient</th><th>Universal ID</th><th>Ward / Bed</th><th>Status</th><th>Risk</th><th>Vitals</th><th></th></tr>
              </thead>
              <tbody>
                {patients.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div className="pt-cell">
                        <Avi tone={getTone(p.status)} label={p.avatar} />
                        <div><strong>{p.name}</strong><small>{p.age}y · {p.gender}</small></div>
                      </div>
                    </td>
                    <td><span className="mono-pill">{p.id}</span></td>
                    <td><span className="ward-chip">{p.ward}</span><small>Bed {p.bed}</small></td>
                    <td><Badge tone={getTone(p.status)}>{p.status}</Badge></td>
                    <td><Badge tone={getTone(p.risk)}>{p.risk}</Badge></td>
                    <td>
                      <div className="inline-vitals">
                        <span className={parseInt(p.heartRate) > 100 ? "vt-danger" : "vt-ok"}>♥ {p.heartRate}</span>
                        <span className={parseInt(p.oxygen) < 94 ? "vt-danger" : "vt-ok"}>O₂ {p.oxygen}</span>
                      </div>
                    </td>
                    <td><button className="row-action" onClick={() => { setSelectedId(p.id); setActive("Patient Records"); }}>Open →</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="col-stack">
          <Card title="Priority Alerts" icon="△" sub="Needs attention this shift">
            <div className="alert-stack">
              {[
                { tone: "danger", title: "Movement Alert", msg: "Bed B-12 — inactive 2h 18m", time: "Now" },
                { tone: "warn", title: "Lab Delay", msg: "Troponin pending — PID-360-1001", time: "43m" },
                { tone: "danger", title: "Drug Conflict", msg: "Aspirin + Warfarin flagged", time: "1h" },
                { tone: "safe", title: "System OK", msg: "96% smart beds syncing", time: "—" },
              ].map((a, i) => (
                <div key={i} className={`alert-row ${a.tone}`}>
                  <div className={`alert-indicator ${a.tone}`} />
                  <div className="alert-content">
                    <strong>{a.title}</strong>
                    <span>{a.msg}</span>
                  </div>
                  <span className="alert-time">{a.time}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Bed Occupancy" icon="▣" sub="Ward capacity">
            <div className="occ-list">
              {[
                { ward: "Cardiology", pct: 88, beds: 30 },
                { ward: "Medicine", pct: 72, beds: 45 },
                { ward: "Neurology", pct: 65, beds: 20 },
                { ward: "Surgery", pct: 95, beds: 25 },
              ].map(b => (
                <div key={b.ward} className="occ-row">
                  <div className="occ-info">
                    <span>{b.ward}</span>
                    <span className="occ-fraction">{Math.round(b.pct / 100 * b.beds)}/{b.beds}</span>
                  </div>
                  <div className="occ-track">
                    <div className="occ-fill" style={{ width: b.pct + "%", background: b.pct > 90 ? "var(--c-danger)" : b.pct > 75 ? "var(--c-warn)" : "var(--c-safe)" }} />
                  </div>
                  <span className="occ-pct">{b.pct}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── PATIENT RECORDS ──────────────────────────────────────────────────────────

function PatientRecords({ selected, selectedId, setSelectedId }) {
  const vitals = vitalsHistory[selected.id] || [];

  return (
    <div className="page-grid">
      <div className="grid-2">
        <div className="col-stack">
          <Card title="Universal Patient Identity" icon="◎" sub="Cross-institution registry">
            <select className="inp" value={selectedId} onChange={e => setSelectedId(e.target.value)}>
              {patients.map(p => <option key={p.id} value={p.id}>{p.id} — {p.name}</option>)}
            </select>
            <div className="id-card">
              <div className="id-row">
                <span className="id-label">System ID</span>
                <span className="id-val pid">{selected.id}</span>
              </div>
              <div className="id-divider" />
              <div className="id-row">
                <span className="id-label">National ID (NID)</span>
                <span className="id-val nid">{selected.nid}</span>
              </div>
              <div className="id-divider" />
              <div className="id-row-2">
                <div>
                  <span className="id-label">Patient Phone</span>
                  <a className="id-val phone" href={`tel:${selected.phone}`}>{selected.phone}</a>
                </div>
                <div>
                  <span className="id-label">Emergency Contact</span>
                  <span className="id-val em">{selected.emergencyContact}</span>
                </div>
              </div>
            </div>
            <div className="info-note">ℹ Any registered hospital may access this profile with patient consent and system authorisation.</div>
          </Card>

          <Card title="Clinical Summary" icon="▤" sub="Diagnosis, allergies, current medications">
            <div className="field-grid">
              <Field label="Diagnosis" val={selected.diagnosis} />
              <Field label="Admitted" val={selected.admittedDate} />
              <Field label="Expected Discharge" val={selected.expectedDischarge} />
              <Field label="Insurance" val={selected.insurance} />
              <Field label="Allergies" val={selected.allergies.join(", ")} tone="danger" />
              <Field label="Current Medications" val={selected.currentMeds.join(", ")} />
              <Field label="Family History" val={selected.familyHistory} />
              <Field label="Drug History" val={selected.drugHistory} />
            </div>
          </Card>

          <Card title="Previous Hospital Visits" icon="◉" sub="Cross-institution record">
            {selected.visits.map((v, i) => (
              <div key={i} className="visit-block">
                <div className="visit-head">
                  <span className="visit-icon-circle">H</span>
                  <div><strong>{v.hospital}</strong><small>{v.year}</small></div>
                </div>
                <div className="visit-fields">
                  <div className="vf"><span>Diagnosis</span><strong>{v.dx}</strong></div>
                  <div className="vf"><span>Medications</span><strong>{v.meds.join(", ")}</strong></div>
                </div>
              </div>
            ))}
          </Card>
        </div>

        <div className="col-stack">
          <div className="pt-hero-card">
            <div className={`pt-hero-avi ${getTone(selected.status)}`}>{selected.avatar}</div>
            <div className="pt-hero-info">
              <h2>{selected.name}</h2>
              <p>{selected.age} yrs · {selected.gender} · {selected.ward} · Bed {selected.bed}</p>
              <div className="badge-row">
                <Badge tone={getTone(selected.status)}>{selected.status}</Badge>
                <Badge tone={getTone(selected.risk)}>Risk: {selected.risk}</Badge>
                <Badge tone={getTone(selected.fallRisk)}>Fall: {selected.fallRisk}</Badge>
              </div>
            </div>
          </div>

          <div className="vitals-panel">
            <div className="vitals-panel-head">
              <span className="panel-label">Current Vitals</span>
              <span className="panel-sub">Last reading</span>
            </div>
            <div className="vitals-row">
              <VBox label="Heart Rate" val={selected.heartRate} unit="bpm" tone={parseInt(selected.heartRate) > 100 ? "danger" : "ok"} />
              <VBox label="Blood Pressure" val={selected.bp} unit="mmHg" tone={parseInt(selected.bp) > 140 ? "warn" : "ok"} />
              <VBox label="Temperature" val={selected.temp} unit="" tone={parseFloat(selected.temp) > 100 ? "warn" : "ok"} />
              <VBox label="SpO₂" val={selected.oxygen} unit="" tone={parseInt(selected.oxygen) < 94 ? "danger" : "ok"} />
            </div>
          </div>

          <Card title="Vitals Trend" icon="◟" sub="Last 6 readings — HR & SpO₂">
            <div style={{ height: 210 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={vitals} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="gHR" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gSP" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }} />
                  <Area type="monotone" dataKey="hr" stroke="#3b82f6" strokeWidth={2} fill="url(#gHR)" name="Heart Rate" dot={false} />
                  <Area type="monotone" dataKey="spo2" stroke="#10b981" strokeWidth={2} fill="url(#gSP)" name="SpO₂" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-legend">
              <span><span className="leg-dot" style={{ background: "#3b82f6" }} />Heart Rate</span>
              <span><span className="leg-dot" style={{ background: "#10b981" }} />SpO₂</span>
            </div>
          </Card>

          <Card title="Ward Notes" icon="▤" sub="Clinical observations">
            <p className="ward-notes-text">{selected.ward_notes}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── PRESCRIPTION HUB ─────────────────────────────────────────────────────────

function PrescriptionHub({ selected, selectedId, setSelectedId }) {
  const [tab, setTab] = useState("current");

  return (
    <div className="page-grid">
      <div className="module-hero teal">
        <div>
          <span className="module-eyebrow">Prescription Management</span>
          <h1 className="module-title">Prescription Hub</h1>
          <p className="module-desc">In-hospital and universal medication history across all institutions — with cross-institution registry access.</p>
        </div>
        <div className="module-pt-badge">
          <div className={`pt-hero-avi sm ${getTone(selected.status)}`}>{selected.avatar}</div>
          <div>
            <strong>{selected.name}</strong>
            <span>{selected.ward} · Bed {selected.bed}</span>
          </div>
          <Badge tone={getTone(selected.status)}>{selected.status}</Badge>
        </div>
      </div>

      <div className="grid-2">
        <div className="col-stack">
          <Card title="Patient Selection" icon="◎" sub="">
            <select className="inp" value={selectedId} onChange={e => setSelectedId(e.target.value)}>
              {patients.map(p => <option key={p.id} value={p.id}>{p.id} — {p.name}</option>)}
            </select>
          </Card>

          <Card title="Patient Profile" icon="▣" sub="Identity & key medical facts">
            <div className="profile-quad">
              <div className="pq-cell"><span>Blood Type</span><strong className="blood">{selected.universalHistory.bloodType}</strong></div>
              <div className="pq-cell"><span>Weight</span><strong>{selected.universalHistory.weight}</strong></div>
              <div className="pq-cell"><span>Height</span><strong>{selected.universalHistory.height}</strong></div>
              <div className="pq-cell"><span>Age</span><strong>{selected.age} yrs</strong></div>
            </div>
            <div className="profile-section">
              <p className="section-micro">Chronic Conditions</p>
              <div className="tag-cluster">
                {selected.universalHistory.chronicConditions.map(c => <span key={c} className="tag info">{c}</span>)}
              </div>
            </div>
            <div className="profile-section">
              <p className="section-micro">Allergies</p>
              <div className="tag-cluster">
                {selected.allergies.map(a => <span key={a} className="tag danger">{a}</span>)}
              </div>
            </div>
            <div className="profile-section">
              <p className="section-micro">Surgical History</p>
              {selected.universalHistory.surgicalHistory.map(s => <div key={s} className="surgery-row">{s}</div>)}
            </div>
          </Card>
        </div>

        <div className="col-stack">
          <div className="tab-bar">
            <button className={`tab ${tab === "current" ? "active" : ""}`} onClick={() => setTab("current")}>Current Admission</button>
            <button className={`tab ${tab === "universal" ? "active" : ""}`} onClick={() => setTab("universal")}>Universal History</button>
          </div>

          {tab === "current" && (
            <Card title="Current Prescriptions" icon="⬡" sub={`This admission · ${selected.ward}`}>
              <div className="rx-table-wrap">
                <table className="rx-table">
                  <thead><tr><th>Drug</th><th>Dose & Route</th><th>Frequency</th><th>Prescriber</th><th>Date</th><th>Status</th></tr></thead>
                  <tbody>
                    {selected.prescriptions.map((rx, i) => (
                      <tr key={i} className={rx.status === "Discontinued" ? "discontinued" : ""}>
                        <td><strong>{rx.drug}</strong></td>
                        <td><span className="dose-tag">{rx.dose}</span> <span className="route-txt">{rx.route}</span></td>
                        <td className="txt-muted">{rx.freq}</td>
                        <td className="txt-muted">{rx.prescribedBy}</td>
                        <td className="txt-mono">{rx.date}</td>
                        <td><Badge tone={rx.status === "Active" ? "safe" : "warn"}>{rx.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="info-note">Cross-check against Rx Safety Checker before administering any medication.</div>
            </Card>
          )}

          {tab === "universal" && (
            <Card title="Universal Medication History" icon="◉" sub="Cross-institution records — National Health Registry">
              <div className="info-note info">Retrieved with patient consent. NID: {selected.nid}</div>
              {selected.visits.map((v, i) => (
                <div key={i} className="universal-block">
                  <div className="ub-head">
                    <span className="ub-name">{v.hospital}</span>
                    <span className="ub-year">{v.year}</span>
                    <Badge tone="safe">Verified</Badge>
                  </div>
                  <p className="ub-dx">{v.dx}</p>
                  <div className="tag-cluster">
                    {v.meds.map(m => <span key={m} className="tag neutral">{m}</span>)}
                  </div>
                </div>
              ))}
              <div className="rx-table-wrap" style={{ marginTop: 16 }}>
                <table className="rx-table">
                  <thead><tr><th>Drug</th><th>Hospital</th><th>Year</th></tr></thead>
                  <tbody>
                    {selected.universalHistory.previousPrescriptions.map((rx, i) => (
                      <tr key={i}>
                        <td><strong>{rx.drug}</strong></td>
                        <td className="txt-muted">{rx.hospital}</td>
                        <td className="txt-mono">{rx.year}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── AI CLINICAL NOTES ────────────────────────────────────────────────────────

function AIClinicalNotes({ selected, selectedId, setSelectedId }) {
  const [loading, setLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState(null);
  const [mode, setMode] = useState("summary");
  const [error, setError] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [followUp, setFollowUp] = useState("");

  const modes = [
    { key: "summary", label: "Clinical Summary", desc: "Structured SOAP note" },
    { key: "differential", label: "Differential Dx", desc: "Ranked diagnoses" },
    { key: "discharge", label: "Discharge Note", desc: "Ready-to-sign summary" },
    { key: "handover", label: "Handover Brief", desc: "Shift narrative" },
  ];

  const prompts = {
    summary: `You are a senior hospital physician writing structured clinical notes. Generate a professional SOAP (Subjective, Objective, Assessment, Plan) clinical note for the following patient. Be concise and clinically precise. Format using markdown headers.\n\nPatient: ${selected.name}, ${selected.age}y ${selected.gender}\nWard: ${selected.ward}, Bed ${selected.bed}\nDiagnosis: ${selected.diagnosis}\nCurrent Medications: ${selected.currentMeds.join(", ")}\nAllergies: ${selected.allergies.join(", ")}\nVitals: HR ${selected.heartRate}, BP ${selected.bp}, Temp ${selected.temp}, SpO₂ ${selected.oxygen}\nLatest Report: ${selected.report}\nFamily History: ${selected.familyHistory}\nDrug History: ${selected.drugHistory}\nWard Notes: ${selected.ward_notes}`,
    differential: `You are a senior hospital physician. Generate a ranked differential diagnosis list for the following patient presentation. For each diagnosis include: probability (%), key supporting findings, and recommended next investigation. Format as a numbered list.\n\nPatient: ${selected.name}, ${selected.age}y ${selected.gender}\nPresenting with: ${selected.diagnosis}\nVitals: HR ${selected.heartRate}, BP ${selected.bp}, Temp ${selected.temp}, SpO₂ ${selected.oxygen}\nMedications: ${selected.currentMeds.join(", ")}\nReport: ${selected.report}\nHistory: ${selected.familyHistory}`,
    discharge: `You are a senior hospital physician. Write a professional discharge summary. Include: reason for admission, hospital course, discharge condition, discharge medications, follow-up instructions, and red flag symptoms to watch for.\n\nPatient: ${selected.name}, ${selected.age}y ${selected.gender}\nAdmission Date: ${selected.admittedDate}\nExpected Discharge: ${selected.expectedDischarge}\nDiagnosis: ${selected.diagnosis}\nMedications: ${selected.currentMeds.join(", ")}\nAllergies: ${selected.allergies.join(", ")}\nClinical Progress: ${selected.ward_notes}`,
    handover: `You are a senior clinician preparing a concise shift handover brief. Write a clear, structured handover note for the incoming team covering: patient status, key concerns to monitor, pending tasks, and what to do if patient deteriorates. Use bullet points and be actionable.\n\nPatient: ${selected.name}, ${selected.age}y ${selected.gender}\nWard: ${selected.ward}, Bed ${selected.bed}\nStatus: ${selected.status}\nCurrent issue: ${selected.diagnosis}\nVitals: HR ${selected.heartRate}, BP ${selected.bp}, Temp ${selected.temp}, SpO₂ ${selected.oxygen}\nActive Medications: ${selected.currentMeds.join(", ")}\nNotes: ${selected.ward_notes}\nShift: ${selected.shiftTime}`,
  };

  async function generate() {
    setLoading(true); setAiOutput(null); setError(null); setConversation([]);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: prompts[mode] }] }),
      });
      const data = await res.json();
      const text = data.content?.filter(b => b.type === "text").map(b => b.text).join("") || "No output received.";
      setAiOutput(text);
      setConversation([{ role: "assistant", content: text }]);
    } catch { setError("Unable to connect to AI service. Please check your connection."); }
    finally { setLoading(false); }
  }

  async function sendFollowUp() {
    if (!followUp.trim()) return;
    const msg = followUp.trim();
    setFollowUp("");
    setConversation(c => [...c, { role: "user", content: msg }]);
    setLoading(true);
    try {
      const history = [...conversation, { role: "user", content: msg }];
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: `You are a senior hospital physician assisting with clinical documentation for patient ${selected.name}. Be concise and clinically precise.`, messages: history }),
      });
      const data = await res.json();
      const reply = data.content?.filter(b => b.type === "text").map(b => b.text).join("") || "";
      setConversation(c => [...c, { role: "assistant", content: reply }]);
    } catch { setConversation(c => [...c, { role: "assistant", content: "Error: Could not reach AI service." }]); }
    finally { setLoading(false); }
  }

  return (
    <div className="page-grid">
      <div className="ai-header-section">
        <div className="ai-badge-row">
          <span className="ai-badge">✦ AI-Powered</span>
          <span className="ai-model">Claude Sonnet · Anthropic</span>
        </div>
        <h1 className="ai-title">Clinical Documentation Assistant</h1>
        <p className="ai-subtitle">Generate professional notes, discharge summaries, and handover briefs — grounded in this patient's actual data.</p>
      </div>

      <div className="grid-2">
        <div className="col-stack">
          <Card title="Patient" icon="◎" sub="">
            <select className="inp" value={selectedId} onChange={e => setSelectedId(e.target.value)}>
              {patients.map(p => <option key={p.id} value={p.id}>{p.id} — {p.name}</option>)}
            </select>
            <div className="pt-context-row">
              <Avi tone={getTone(selected.status)} label={selected.avatar} />
              <div>
                <strong>{selected.name}</strong>
                <p>{selected.diagnosis} · {selected.ward}</p>
                <Badge tone={getTone(selected.status)}>{selected.status}</Badge>
              </div>
            </div>
          </Card>

          <Card title="Note Type" icon="▤" sub="Select what to generate">
            <div className="mode-grid">
              {modes.map(m => (
                <button key={m.key} className={`mode-card ${mode === m.key ? "active" : ""}`} onClick={() => setMode(m.key)}>
                  <strong>{m.label}</strong>
                  <span>{m.desc}</span>
                </button>
              ))}
            </div>
          </Card>

          <button className="btn-ai" onClick={generate} disabled={loading}>
            {loading ? <><span className="spin" />Generating note…</> : <>✦ Generate {modes.find(m => m.key === mode)?.label}</>}
          </button>

          <div className="disclaimer">
            <strong>⚠ Clinical Disclaimer</strong>
            <p>AI-generated content is for documentation assistance only. All clinical decisions require review and approval by a licensed healthcare professional.</p>
          </div>
        </div>

        <div className="col-stack">
          <Card title="Generated Note" icon="✦" sub="AI output — review before use">
            {!aiOutput && !loading && !error && (
              <div className="ai-empty"><div className="ai-empty-icon">✦</div><p>Select patient and type, then click Generate.</p></div>
            )}
            {loading && !aiOutput && (
              <div className="ai-loading"><div className="loading-dots"><span /><span /><span /></div><p>Generating clinical note…</p></div>
            )}
            {error && <div className="info-note danger">{error}</div>}
            {aiOutput && (
              <div className="ai-output">
                <div className="ai-content" dangerouslySetInnerHTML={{ __html: mdToHtml(aiOutput) }} />
                <div className="ai-actions">
                  <button className="btn-sm" onClick={() => navigator.clipboard?.writeText(aiOutput)}>Copy Note</button>
                  <button className="btn-sm" onClick={() => { setAiOutput(null); setConversation([]); }}>Clear</button>
                </div>
              </div>
            )}
          </Card>

          {conversation.length > 0 && (
            <Card title="Follow-up" icon="◇" sub="Ask AI to refine or expand">
              <div className="chat-log">
                {conversation.slice(1).map((m, i) => (
                  <div key={i} className={`chat-msg ${m.role}`}>
                    <span className="chat-role">{m.role === "user" ? "You" : "AI"}</span>
                    <div className="chat-bub" dangerouslySetInnerHTML={{ __html: mdToHtml(m.content) }} />
                  </div>
                ))}
              </div>
              <div className="chat-input-row">
                <input className="inp" value={followUp} onChange={e => setFollowUp(e.target.value)}
                  placeholder="Ask a follow-up question…" onKeyDown={e => e.key === "Enter" && sendFollowUp()} />
                <button className="btn-primary" onClick={sendFollowUp} disabled={loading}>Send</button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function mdToHtml(text) {
  return text
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/^### (.*$)/gm, "<h3>$1</h3>")
    .replace(/^## (.*$)/gm, "<h2>$1</h2>")
    .replace(/^# (.*$)/gm, "<h1>$1</h1>")
    .replace(/^- (.*$)/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>")
    .replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>");
}

// ─── RX CHECKER ────────────────────────────────────────────────────────────────

function RxChecker({ selected, selectedId, setSelectedId }) {
  const [newMed, setNewMed] = useState("Ibuprofen");
  const [result, setResult] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  function checkMed(med) {
    if (!med.trim()) return;
    const m = med.trim().toLowerCase();
    const cur = selected.currentMeds.map(x => x.toLowerCase());
    const dx = selected.diagnosis.toLowerCase();
    const allergy = selected.allergies.join(" ").toLowerCase();
    const hist = `${selected.drugHistory} ${selected.familyHistory}`.toLowerCase();
    if (cur.includes(m)) return setResult({ level: "Minor", title: "Duplicate Detected", msg: `${med} already exists in current medications.` });
    if (allergy.includes(m)) return setResult({ level: "Contraindicated", title: "Allergy Conflict", msg: `${med} conflicts with documented allergy. Do not prescribe.` });
    if ((m.includes("ibuprofen") || m.includes("aspirin")) && (cur.includes("warfarin") || cur.includes("clopidogrel")))
      return setResult({ level: "Contraindicated", title: "Bleeding Risk", msg: `${med} with anticoagulant — high bleeding risk.` });
    if (m.includes("beta") && (hist.includes("asthma") || dx.includes("pneumonia")))
      return setResult({ level: "Contraindicated", title: "Respiratory Contraindication", msg: `${med} contraindicated in respiratory compromise.` });
    if (dx.includes("dengue") && (m.includes("ibuprofen") || m.includes("aspirin")))
      return setResult({ level: "Contraindicated", title: "Dengue Warning", msg: `${med} increases bleeding risk in dengue.` });
    const interaction = getInteraction(m, cur[0] || "");
    setResult({ level: interaction.level, title: interaction.level === "Safe" ? "Safe to Prescribe" : `${interaction.level} Interaction`, msg: interaction.msg });
  }

  async function deepAnalysis() {
    setAiLoading(true); setAiAnalysis(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: `You are a clinical pharmacist. Provide a detailed drug interaction analysis for prescribing "${newMed}" to this patient.\n\nPatient: ${selected.name}, ${selected.age}y ${selected.gender}\nDiagnosis: ${selected.diagnosis}\nCurrent medications: ${selected.currentMeds.join(", ")}\nAllergies: ${selected.allergies.join(", ")}\nDrug history: ${selected.drugHistory}\n\nProvide: 1) Interaction risk level, 2) Mechanism if applicable, 3) Clinical significance, 4) Recommendation. Be concise and clinically precise.` }] })
      });
      const data = await res.json();
      setAiAnalysis(data.content?.filter(b => b.type === "text").map(b => b.text).join("") || "");
    } catch { setAiAnalysis("AI analysis unavailable. Please consult pharmacist."); }
    setAiLoading(false);
  }

  return (
    <div className="page-grid">
      <div className="grid-2">
        <div className="col-stack">
          <Card title="Prescription Safety Check" icon="⚕" sub="Check against patient history">
            <div className="rx-pt-bar">
              <Avi tone={getTone(selected.status)} label={selected.avatar} />
              <div>
                <strong>{selected.name}</strong>
                <p>{selected.diagnosis}</p>
              </div>
              <select className="inp" style={{ marginLeft: "auto", width: 200 }} value={selectedId} onChange={e => setSelectedId(e.target.value)}>
                {patients.map(p => <option key={p.id} value={p.id}>{p.id}</option>)}
              </select>
            </div>
            <div className="rx-input-group">
              <input className="inp" value={newMed} placeholder="Enter medicine name…"
                onChange={e => { setNewMed(e.target.value); setResult(null); setAiAnalysis(null); }} />
              <button className="btn-primary" onClick={() => checkMed(newMed)}>Check</button>
            </div>
            {result && (
              <div className={`rx-result ${getTone(result.level)}`}>
                <div className={`rx-icon ${getTone(result.level)}`}>{result.level === "Safe" ? "✓" : result.level === "Minor" ? "!" : "✕"}</div>
                <div>
                  <strong>{result.title}</strong>
                  <p>{result.msg}</p>
                </div>
              </div>
            )}
            {result && (
              <button className="btn-ai" style={{ marginTop: 10 }} onClick={deepAnalysis} disabled={aiLoading}>
                {aiLoading ? <><span className="spin" />Analysing…</> : "✦ AI Deep Pharmacology Analysis"}
              </button>
            )}
            {aiAnalysis && (
              <div className="ai-output" style={{ marginTop: 12 }}>
                <div className="ai-content" dangerouslySetInnerHTML={{ __html: mdToHtml(aiAnalysis) }} />
              </div>
            )}
          </Card>

          <Card title="Severity Guide" icon="◈" sub="">
            <div className="sev-list">
              {[
                { level: "Contraindicated", tone: "danger", desc: "Never co-administer. Serious irreversible harm." },
                { level: "Serious", tone: "warn", desc: "Use only with close monitoring and specialist review." },
                { level: "Minor", tone: "warn", desc: "Manageable with dose adjustment." },
                { level: "Safe", tone: "safe", desc: "No clinically significant interaction." },
              ].map(s => (
                <div key={s.level} className="sev-row">
                  <Badge tone={s.tone}>{s.level}</Badge>
                  <span>{s.desc}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card title="Patient Medication Profile" icon="⬡" sub="Current medications & contraindications">
          <div className="field-grid">
            <Field label="Active Medications" val={selected.currentMeds.join(", ")} />
            <Field label="Allergies" val={selected.allergies.join(", ")} tone="danger" />
            <Field label="Drug History" val={selected.drugHistory} />
            <Field label="Family History" val={selected.familyHistory} />
          </div>
          <div style={{ marginTop: 16 }}>
            <p className="section-micro" style={{ marginBottom: 8 }}>Quick Checks</p>
            <div className="chip-row">
              {["Ibuprofen", "Penicillin", "Beta Blocker", "Omeprazole"].map(m => (
                <button key={m} className="chip" onClick={() => { setNewMed(m); checkMed(m); }}>{m}</button>
              ))}
            </div>
          </div>
          <div className="risk-panel">
            <p className="section-micro" style={{ marginBottom: 12 }}>Risk Metrics</p>
            {[
              { label: "Pain Score", val: selected.painScore, max: 10, tone: selected.painScore > 6 ? "danger" : "warn" },
              { label: "Mobility", val: selected.mobilityScore, max: 10, tone: "safe" },
            ].map(r => (
              <div key={r.label} className="risk-row">
                <span>{r.label}</span>
                <div className="risk-track"><div className="risk-fill" style={{ width: r.val * 10 + "%", background: `var(--c-${r.tone})` }} /></div>
                <span className="risk-num">{r.val}/10</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── SHIFT HANDOVER ───────────────────────────────────────────────────────────

function ShiftHandover() {
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [checks, setChecks] = useState({ meds8am: true, reposition19A: true, bloodSample7A: false, cardiologyFollowup: false, prepareBed4B: false, shiftNotes: true });
  const items = [
    { key: "meds8am", label: "Administer 8AM medications — all patients", p: "normal" },
    { key: "reposition19A", label: "Reposition Bed 19A (Rokeya Begum)", p: "urgent" },
    { key: "bloodSample7A", label: "Collect blood sample — Bed 7A (Farhan Ahmed)", p: "urgent" },
    { key: "cardiologyFollowup", label: "Cardiology follow-up re: Warfarin + Aspirin interaction", p: "critical" },
    { key: "prepareBed4B", label: "Prepare Bed 4B for incoming ambulance patient", p: "normal" },
    { key: "shiftNotes", label: "Document shift notes for 5 critical patients", p: "normal" },
  ];
  const done = Object.values(checks).filter(Boolean).length;

  return (
    <div className="page-grid">
      <div className="handover-hero">
        <div className="hh-left">
          <span className="module-eyebrow" style={{ color: "rgba(255,255,255,0.7)" }}>Clinical Shift Continuity</span>
          <h1>Digital Handover<br />Dashboard</h1>
          <p>Shift-to-shift communication · Zero miscommunication protocol</p>
        </div>
        <div className="shift-cards">
          {[
            { label: "Morning", time: "6:00 – 14:00", icon: "◑", active: true },
            { label: "Evening", time: "14:00 – 22:00", icon: "◔", active: false },
            { label: "Night", time: "22:00 – 6:00", icon: "●", active: false },
          ].map(s => (
            <div key={s.label} className={`shift-card ${s.active ? "active" : ""}`}>
              <span className="shift-icon">{s.icon}</span>
              <strong>{s.label} Shift</strong>
              <span>{s.time}</span>
              {s.active && <span className="shift-now">Active Now</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2">
        <div className="col-stack">
          <Card title="Critical Alerts to Hand Over" icon="△" sub="Must communicate to incoming shift">
            <div className="alert-stack">
              {[
                { tone: "danger", icon: "⬡", pt: "Farhan Ahmed (7A)", title: "Drug Interaction", msg: "Warfarin + Aspirin prescribed. Cardiologist review at 3PM." },
                { tone: "danger", icon: "▣", pt: "Rokeya Begum (19A)", title: "Bed Sore High Risk", msg: "Reposition every 2 hours. Last done 10:30 AM." },
                { tone: "warn", icon: "◈", pt: "6 Patients", title: "Lab Reports Pending", msg: "CBC for Bed 7A, MRI for 19A expected by 2PM." },
                { tone: "safe", icon: "◆", pt: "Incoming", title: "Ambulance — ETA 22 min", msg: "55M, chest pain, BP 180/110. Bed 4B prepared." },
              ].map((a, i) => (
                <div key={i} className={`alert-row ${a.tone}`} style={{ padding: "14px 12px", gap: 12, alignItems: "flex-start" }}>
                  <div className={`alert-indicator ${a.tone}`} />
                  <div className="alert-content">
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 3 }}>
                      <strong>{a.title}</strong>
                      <Badge tone={a.tone}>{a.pt}</Badge>
                    </div>
                    <span>{a.msg}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Patient Handover Board" icon="⇄" sub="All patients — status summary">
            {patients.map(p => (
              <div key={p.id} className={`handover-row ${getTone(p.handoverColor)}`}>
                <div className="ho-left">
                  <Avi tone={getTone(p.handoverColor)} label={p.avatar} />
                  <div>
                    <strong>{p.name}</strong>
                    <span>{p.ward} · Bed {p.bed}</span>
                  </div>
                </div>
                <div className="ho-grid">
                  <div className="ho-cell"><small>Current MD</small><span>{p.currentDoctor}</span></div>
                  <div className="ho-cell"><small>Next MD</small><span>{p.nextDoctor}</span></div>
                  <div className="ho-cell"><small>Nurse</small><span>{p.assignedNurse}</span></div>
                  <div className="ho-cell"><small>Shift</small><span>{p.shiftTime}</span></div>
                </div>
                <Badge tone={getTone(p.handoverColor)}>{p.handoverColor}</Badge>
              </div>
            ))}
          </Card>
        </div>

        <div className="col-stack">
          <Card title="Pre-Shift Checklist" icon="◎" sub={`Complete before 14:00 · ${done}/${items.length} done`}>
            <div className="cl-progress">
              <div className="cl-track"><div className="cl-fill" style={{ width: (done / items.length * 100) + "%" }} /></div>
              <span>{Math.round(done / items.length * 100)}%</span>
            </div>
            <div className="cl-list">
              {items.map(item => (
                <div key={item.key} className={`cl-item ${checks[item.key] ? "done" : ""} ${item.p}`}
                  onClick={() => setChecks(c => ({ ...c, [item.key]: !c[item.key] }))}>
                  <div className={`cl-box ${checks[item.key] ? "checked" : ""}`}>{checks[item.key] && "✓"}</div>
                  <span className={checks[item.key] ? "strikethrough" : ""}>{item.label}</span>
                  {item.p === "critical" && !checks[item.key] && <span className="priority-pip red" />}
                  {item.p === "urgent" && !checks[item.key] && <span className="priority-pip amber" />}
                </div>
              ))}
            </div>
          </Card>

          <Card title="Handover Notes" icon="▤" sub="Notes for incoming shift team">
            <textarea className="inp" value={note} onChange={e => setNote(e.target.value)}
              style={{ minHeight: 100, resize: "vertical" }} placeholder="Add special notes for the incoming shift team…" />
            <button className="btn-primary" style={{ marginTop: 10, width: "100%" }} onClick={() => setSubmitted(true)}>
              {submitted ? "✓ Handover Submitted" : "Submit Handover"}
            </button>
            {submitted && <div className="info-note success" style={{ marginTop: 8 }}>✓ Submitted to evening shift at {new Date().toLocaleTimeString("en-BD", { hour: "2-digit", minute: "2-digit" })}.</div>}
          </Card>

          <Card title="Shift Team" icon="◎" sub="Morning Shift · May 1, 2026">
            {[
              { role: "Senior Consultant", name: "Dr. M. Rahman", dept: "Medicine", avi: "DR" },
              { role: "Registrar", name: "Dr. Farhana Islam", dept: "Cardiology", avi: "FI" },
              { role: "Senior Nurse", name: "Nurse Rima Akter", dept: "Ward B", avi: "RA" },
              { role: "Nurse", name: "Nurse Tania Begum", dept: "Ward A", avi: "TB" },
            ].map(m => (
              <div key={m.name} className="team-row">
                <div className="team-avi">{m.avi}</div>
                <div><strong>{m.name}</strong><span>{m.role} · {m.dept}</span></div>
                <span className="online-dot" style={{ marginLeft: "auto" }} />
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── SMART BED ─────────────────────────────────────────────────────────────────

function SmartBed() {
  const [reminders, setReminders] = useState({});
  return (
    <div className="page-grid">
      <div className="bed-grid">
        {patients.map(p => (
          <div key={p.id} className={`bed-card ${getTone(p.risk)}`}>
            <div className="bed-header">
              <div>
                <p className="bed-number">Bed {p.bed}</p>
                <p className="bed-patient">{p.name}</p>
              </div>
              <Badge tone={getTone(p.risk)}>{p.risk} Risk</Badge>
            </div>
            <div className="bed-move">
              <span className={`move-dot ${getTone(p.risk)}`} />
              <span>Last movement: <strong>{p.lastMove}</strong></span>
            </div>
            <div className="bed-vitals">
              <div className={`bv-cell ${parseInt(p.heartRate) > 100 ? "danger" : ""}`}>
                <span>HR</span><strong>{p.heartRate}</strong>
              </div>
              <div className="bv-cell"><span>BP</span><strong>{p.bp}</strong></div>
              <div className={`bv-cell ${parseFloat(p.temp) > 100 ? "warn" : ""}`}>
                <span>TEMP</span><strong>{p.temp}</strong>
              </div>
              <div className={`bv-cell ${parseInt(p.oxygen) < 94 ? "danger" : ""}`}>
                <span>SpO₂</span><strong>{p.oxygen}</strong>
              </div>
            </div>
            <div className={`bed-bar ${getTone(p.risk)}`} />
            <div className="bed-metrics">
              <div className="bm"><span>Pain</span><strong>{p.painScore}/10</strong></div>
              <div className="bm"><span>Mobility</span><strong>{p.mobilityScore}/10</strong></div>
              <div className="bm"><span>Fall Risk</span><Badge tone={getTone(p.fallRisk)}>{p.fallRisk}</Badge></div>
            </div>
            <button className={`btn-primary ${reminders[p.id] ? "btn-success" : ""}`} style={{ width: "100%", marginTop: 4 }}
              onClick={() => setReminders(r => ({ ...r, [p.id]: true }))}>
              {reminders[p.id] ? "✓ Reminder Sent" : "Send Nurse Reminder"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SAMPLE TRACKING ──────────────────────────────────────────────────────────

const allSamples = [
  { id: "SMP-2026-00184", patient: "Farhan Ahmed", bed: "7A", type: "CBC + Troponin I + CRP", status: "Testing", priority: "STAT", eta: "~11:00 AM", collected: "8:15 AM", dispatched: "8:32 AM", labReceived: "8:58 AM", testingStart: "9:10 AM", steps: ["Collected", "Dispatched", "Lab Received", "Testing", "Report Ready"], currentStep: 3, log: [{ time: "8:15 AM", msg: "Sample collected by Nurse Sultana — Bed 7A" }, { time: "8:32 AM", msg: "Dispatched to Main Laboratory via porter (QR scanned)" }, { time: "8:58 AM", msg: "Received at Lab — logged by Lab Technician Kamal" }, { time: "9:10 AM", msg: "Analysis started — CBC automated analyser, Troponin ELISA", bold: true }, { time: "~11:00 AM", msg: "Expected completion (estimated)", muted: true }] },
  { id: "SMP-2026-00185", patient: "Rokeya Begum", bed: "19A", type: "MRI Brain", status: "Awaiting", priority: "Urgent", eta: "2:00 PM", steps: ["Collected", "Dispatched", "Lab Received", "Testing", "Report Ready"], currentStep: 1, log: [{ time: "9:00 AM", msg: "Sample order placed by Dr. Nayeem" }, { time: "9:20 AM", msg: "Pending MRI slot allocation" }] },
  { id: "SMP-2026-00186", patient: "Nadia Rahman", bed: "3B", type: "HbA1c + Lipids", status: "Ready", priority: "Routine", eta: "Done", steps: ["Collected", "Dispatched", "Lab Received", "Testing", "Report Ready"], currentStep: 4, log: [{ time: "7:00 AM", msg: "Sample collected — Nurse Jannat" }, { time: "7:45 AM", msg: "Lab received" }, { time: "9:30 AM", msg: "Report generated and uploaded", bold: true }] },
  { id: "SMP-2026-00187", patient: "Karim Uddin", bed: "C-09", type: "Wound Culture", status: "Testing", priority: "Routine", eta: "~3:00 PM", steps: ["Collected", "Dispatched", "Lab Received", "Testing", "Report Ready"], currentStep: 3, log: [{ time: "8:30 AM", msg: "Wound swab collected" }, { time: "9:00 AM", msg: "Culture plate inoculated" }, { time: "9:15 AM", msg: "Incubation started", bold: true }] },
];

function SampleTracking() {
  const [sel, setSel] = useState(allSamples[0]);
  const sc = { Testing: "warn", Awaiting: "warn", Ready: "safe", Pending: "warn" };

  return (
    <div className="page-grid">
      <div className="sample-layout">
        <Card title="Active Samples" icon="◈" sub="Live sample movement">
          {allSamples.map(s => (
            <div key={s.id} className={`sample-item ${sel.id === s.id ? "active" : ""}`} onClick={() => setSel(s)}>
              <div className="si-top">
                <span className="si-icon">⬡</span>
                <div><strong>{s.id}</strong><p>{s.patient} · Bed {s.bed}</p></div>
              </div>
              <div className="si-bottom">
                <span className="si-type">{s.type}</span>
                <div className="si-badges">
                  <Badge tone={sc[s.status] || "safe"}>{s.status}</Badge>
                  <span className={`priority-pip-tag ${s.priority.toLowerCase()}`}>{s.priority}</span>
                </div>
                <span className="si-eta">ETA: {s.eta}</span>
              </div>
            </div>
          ))}
        </Card>

        <Card title={`Sample ${sel.id}`} icon="◈" sub={`${sel.patient} · ${sel.type}`}>
          <div className="sample-bar">
            <div className="sb-info">
              <strong>{sel.id}</strong>
              <p>Patient: {sel.patient}</p>
              <p>Type: {sel.type}</p>
            </div>
            <Badge tone={sc[sel.status] || "safe"}>{sel.status}</Badge>
          </div>

          <div className="progress-steps">
            {sel.steps.map((step, i) => {
              const done = i < sel.currentStep;
              const active = i === sel.currentStep;
              return (
                <div key={step} className={`ps-item ${done ? "done" : ""} ${active ? "active" : ""}`}>
                  <div className="ps-dot">{done ? "✓" : active ? <span className="ps-inner" /> : ""}</div>
                  <div className="ps-label">
                    <strong>{step}</strong>
                    {i === 0 && sel.collected && <small>{sel.collected}</small>}
                    {i === 1 && sel.dispatched && <small>{sel.dispatched}</small>}
                    {i === 2 && sel.labReceived && <small>{sel.labReceived}</small>}
                    {i === 3 && sel.testingStart && <small>Since {sel.testingStart}</small>}
                    {i === 4 && <small>Est. {sel.eta}</small>}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="detail-log">
            <div className="dl-header">Detailed Log</div>
            {sel.log.map((l, i) => (
              <div key={i} className="dl-row">
                <span className="dl-time">{l.time}</span>
                <span className={`dl-msg ${l.bold ? "dl-bold" : ""} ${l.muted ? "dl-muted" : ""}`}>{l.msg}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── AMBULANCE SYNC ───────────────────────────────────────────────────────────

const ambulances = [
  { id: "AMB-014", eta: "7 min", case: "Critical STEMI", patient: "Unknown male, ~55 years", vitals: "HR 128 · BP 90/60 · SpO₂ 88%", condition: "Chest pain since 45min, diaphoresis, ST elevation lead II/III", crew: "Paramedic Arafat + EMT Joynal", destBed: "4B", erChecklist: [{ label: "Trauma Bay 1 cleared", done: true }, { label: "Defibrillator ready", done: true }, { label: "Cardiology team paged", done: true }, { label: "Cath lab — Confirm booking", done: false, urgent: true }, { label: "Blood bank — Reserve O-", done: false, urgent: true }, { label: "Bed 4B prepared", done: true }], ecgPoints: "0,95 35,95 48,92 60,95 75,95 88,70 98,125 112,95 160,95 175,92 188,95 205,95 218,55 232,135 248,95 300,95 315,90 328,95 345,95 358,65 372,128 390,95 445,95 458,92 472,95 490,95 503,58 518,132 535,95 600,95", status: "En Route" },
  { id: "AMB-015", eta: "22 min", case: "Trauma — RTA", patient: "Female, ~30 years", vitals: "HR 105 · BP 110/70 · SpO₂ 96%", condition: "Road traffic accident, suspected leg fracture, head laceration", crew: "Paramedic Sumon + EMT Rakib", destBed: "5A", erChecklist: [{ label: "Trauma Bay 2 ready", done: true }, { label: "Orthopedics team alerted", done: false, urgent: true }, { label: "X-Ray suite available", done: true }, { label: "Blood type & cross match ordered", done: false, urgent: true }, { label: "Bed 5A prepared", done: false }, { label: "Surgical team on standby", done: false }], ecgPoints: "0,95 40,95 55,90 70,95 110,95 130,88 150,95 200,95 240,90 260,95 300,95 340,88 360,95 400,95 440,90 460,95 500,95 540,90 560,95 600,95", status: "En Route" },
];

function AmbulanceSync() {
  const [gps, setGps] = useState({
    lat: null,
    lng: null,
    updated: null
  });

  const [sel, setSel] = useState(ambulances[0]);

  const [erChecks, setErChecks] = useState(() => {
    const o = {};
    ambulances[0].erChecklist.forEach((c, i) => {
      o[i] = c.done;
    });
    return o;
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("GPS not supported in this browser");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const updated = new Date().toLocaleTimeString();

        setGps({ lat, lng, updated });

        fetch("http://localhost:5001/location", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ lat, lng })
        })
          .then(res => res.json())
          .then(data => console.log("GPS sent:", data))
          .catch(err => console.log("Backend error:", err));
      },
      (err) => {
        console.log("GPS error:", err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const doneCount = Object.values(erChecks).filter(Boolean).length;

  return (
    <div className="page-grid">
      <div className="amb-tabs">
        {ambulances.map(a => (
          <button
            key={a.id}
            className={`amb-tab ${sel.id === a.id ? "active" : ""}`}
            onClick={() => {
              setSel(a);
              const o = {};
              a.erChecklist.forEach((c, i) => {
                o[i] = c.done;
              });
              setErChecks(o);
            }}
          >
            <span className="amb-tab-icon">◆</span>
            <div>
              <strong>{a.id}</strong>
              <span>{a.case} · ETA {a.eta}</span>
            </div>
            <Badge tone={a.eta.includes("7") ? "danger" : "warn"}>
              {a.status}
            </Badge>
          </button>
        ))}
      </div>

      <div className="grid-2">
        <div className="col-stack">
          <Card
            title={`${sel.id} — GPS Tracking`}
            icon="◆"
            sub={`ETA ${sel.eta} · ${sel.case}`}
          >
            <div className="info-note success">
              <strong>Live GPS</strong>
              <p>Latitude: {gps.lat ?? "Loading..."}</p>
              <p>Longitude: {gps.lng ?? "Loading..."}</p>
              <p>Updated: {gps.updated ?? "--"}</p>
            </div>


            <div style={{ height: "250px", marginTop: "10px", borderRadius: "12px", overflow: "hidden" }}>
              <MapContainer
                center={[gps.lat || 23.7, gps.lng || 90.4]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {gps.lat && gps.lng && (
                  <Marker position={[gps.lat, gps.lng]} />
                )}
              </MapContainer>
            </div>
            <div className="field-grid" style={{ marginTop: 14 }}>
              <Field label="Incoming Patient" val={sel.patient} />
              <Field label="Live Vitals" val={sel.vitals} />
              <Field label="Clinical Condition" val={sel.condition} />
              <Field label="Crew" val={sel.crew} />
              <Field label="Destination Bed" val={sel.destBed} />
              <Field label="Alerts Sent" val="ER + Cardiac team notified" />
            </div>

            <div className="info-note danger" style={{ marginTop: 14 }}>
              <strong>ER Preparation Alert — {sel.case}</strong>
              <p>Incoming in {sel.eta}. Assigned bed: {sel.destBed}.</p>
            </div>
          </Card>

          <Card title="Live ECG Stream" icon="◟" sub={`Streaming from ${sel.id}`}>
            <div className="ecg-wrap">
              <div className="ecg-top">
                <strong>LIVE ECG</strong>
                <span className="ecg-live">
                  <span className="pulse-dot green" />
                  Streaming
                </span>
                <span className="ecg-id">{sel.id}</span>
              </div>

              <svg className="ecg-svg" viewBox="0 0 600 150" preserveAspectRatio="none">
                <defs>
                  <pattern id="ecgGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M20 0L0 0 0 20" fill="none" stroke="rgba(34,197,94,0.1)" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="600" height="150" fill="url(#ecgGrid)" />
                <polyline className="ecg-wave" points={sel.ecgPoints} />
              </svg>

              <div className="ecg-stats">
                <span>HR {sel.vitals.split("HR ")[1]?.split(" ")[0]}</span>
                <span>BP {sel.vitals.split("BP ")[1]?.split(" ")[0]}</span>
                <span>SpO₂ {sel.vitals.split("SpO₂ ")[1]}</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="col-stack">
          <Card title="ER Preparation Checklist" icon="◎" sub={`${sel.id} — ${doneCount}/${sel.erChecklist.length} completed`}>
            <div className="cl-progress">
              <div className="cl-track">
                <div
                  className="cl-fill"
                  style={{ width: (doneCount / sel.erChecklist.length * 100) + "%" }}
                />
              </div>
              <span>{Math.round(doneCount / sel.erChecklist.length * 100)}%</span>
            </div>

            <div className="er-cl-grid">
              {sel.erChecklist.map((item, i) => (
                <div
                  key={i}
                  className={`cl-item ${erChecks[i] ? "done" : ""} ${item.urgent && !erChecks[i] ? "urgent" : ""}`}
                  onClick={() => setErChecks(c => ({ ...c, [i]: !c[i] }))}
                >
                  <div className={`cl-box ${erChecks[i] ? "checked" : ""}`}>
                    {erChecks[i] && "✓"}
                  </div>
                  <span className={erChecks[i] ? "strikethrough" : ""}>
                    {item.label}
                  </span>
                  {item.urgent && !erChecks[i] && <span className="priority-pip amber" />}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

function Card({ title, icon, sub, children }) {
  return (
    <div className="card">
      <div className="card-head">
        <div className="card-icon-wrap">{icon}</div>
        <div><h3 className="card-title">{title}</h3>{sub && <p className="card-sub">{sub}</p>}</div>
      </div>
      {children}
    </div>
  );
}

function Badge({ children, tone }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

function Avi({ tone, label }) {
  return <div className={`avi ${tone}`}>{label}</div>;
}

function Field({ label, val, tone }) {
  return (
    <div className={`field-block ${tone || ""}`}>
      <p>{label}</p>
      <strong>{val}</strong>
    </div>
  );
}

function VBox({ label, val, unit, tone }) {
  return (
    <div className={`vbox ${tone}`}>
      <p>{label}</p>
      <strong>{val}</strong>
      {unit && <small>{unit}</small>}
    </div>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

const css = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');

:root {
  --sidebar-bg:    #0d1117;
  --sidebar-text:  #8b949e;
  --sidebar-hover: rgba(255,255,255,0.06);
  --sidebar-active:rgba(255,255,255,0.1);

  --canvas:    #f4f6f9;
  --surface:   #ffffff;
  --surface2:  #f8f9fb;
  --border:    rgba(0,0,0,0.07);
  --border2:   rgba(0,0,0,0.12);

  --text:      #111827;
  --text2:     #374151;
  --text3:     #6b7280;
  --text4:     #9ca3af;

  --accent:    #2563eb;
  --accent2:   #1d4ed8;

  --c-danger:  #dc2626;
  --c-warn:    #d97706;
  --c-safe:    #059669;

  --danger-bg: #fef2f2;
  --danger-bd: rgba(220,38,38,0.18);
  --warn-bg:   #fffbeb;
  --warn-bd:   rgba(217,119,6,0.2);
  --safe-bg:   #f0fdf4;
  --safe-bd:   rgba(5,150,105,0.2);

  --r:  14px;
  --r2: 9px;
  --sh: 0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: 'IBM Plex Sans', system-ui, sans-serif;
  background: var(--canvas);
  color: var(--text);
  font-size: 14px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
h1,h2,h3,h4 { font-family: 'Outfit', sans-serif; }
button, select, textarea { font-family: inherit; cursor: pointer; }
input { font-family: inherit; }
strong { font-weight: 600; }

.app { display: flex; min-height: 100vh; }

/* ── SIDEBAR ── */
.sidebar {
  width: 248px; position: fixed; inset: 0 auto 0 0;
  background: var(--sidebar-bg);
  display: flex; flex-direction: column;
  z-index: 30; overflow-y: auto;
  border-right: 1px solid rgba(255,255,255,0.05);
}
.sidebar-overlay { display: none; }
.brand {
  display: flex; align-items: center; gap: 10px;
  padding: 20px 16px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.brand-mark {
  width: 36px; height: 36px; border-radius: 10px;
  background: linear-gradient(135deg, #2563eb, #0891b2);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700; color: white;
  font-family: 'Outfit', sans-serif; letter-spacing: -.02em;
  flex-shrink: 0;
}
.brand-text { flex: 1; min-width: 0; }
.brand-text h1 { font-size: 15px; font-weight: 700; color: white; letter-spacing: -0.03em; font-family: 'Outfit', sans-serif; }
.brand-text h1 em { font-style: normal; color: #60a5fa; }
.brand-text p { font-size: 10.5px; color: #6b7280; font-weight: 400; margin-top: 1px; }
.live-badge {
  display: flex; align-items: center; gap: 5px;
  background: rgba(5,150,105,0.12); border: 1px solid rgba(5,150,105,0.25);
  padding: 3px 7px; border-radius: 999px; flex-shrink: 0;
}
.live-badge span:last-child { font-size: 9px; font-weight: 700; color: #34d399; letter-spacing: .08em; }
.pulse-ring { width: 6px; height: 6px; background: #34d399; border-radius: 50%; animation: pulse 1.5s infinite; flex-shrink: 0; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
.pulse-dot { width: 7px; height: 7px; border-radius: 50%; background: #34d399; animation: pulse 1.5s infinite; flex-shrink: 0; }
.pulse-dot.green { background: #4ade80; }

.nav-body { padding: 12px 10px; flex: 1; }
.nav-section { margin-bottom: 6px; }
.nav-label { font-size: 9.5px; font-weight: 700; letter-spacing: .12em; color: #4b5563; padding: 10px 8px 5px; text-transform: uppercase; }
.nav-btn {
  width: 100%; display: flex; align-items: center; gap: 9px;
  padding: 8px 10px; border-radius: 8px; border: none;
  background: transparent; color: var(--sidebar-text);
  font-size: 13px; font-weight: 500; text-align: left;
  transition: all 0.14s; position: relative;
  font-family: 'IBM Plex Sans', sans-serif;
}
.nav-btn:hover { background: var(--sidebar-hover); color: #e5e7eb; }
.nav-btn.active { background: var(--sidebar-active); color: #f9fafb; }
.nav-btn.active::before { content: ""; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 3px; height: 18px; background: var(--accent); border-radius: 0 2px 2px 0; }
.nav-icon { width: 18px; text-align: center; font-size: 13px; flex-shrink: 0; }
.pill-tag { margin-left: auto; font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 999px; letter-spacing: .05em; }
.pill-tag.ai { background: rgba(139,92,246,0.2); color: #a78bfa; border: 1px solid rgba(139,92,246,0.25); }
.pill-tag.new { background: rgba(8,145,178,0.2); color: #22d3ee; border: 1px solid rgba(8,145,178,0.25); }

.sidebar-footer {
  display: flex; align-items: center; gap: 10px;
  padding: 14px 16px;
  border-top: 1px solid rgba(255,255,255,0.06);
}
.doc-avatar { width: 32px; height: 32px; border-radius: 50%; background: #374151; color: #d1d5db; display: flex; align-items: center; justify-content: center; font-size: 10.5px; font-weight: 700; flex-shrink: 0; }
.doc-info { flex: 1; min-width: 0; }
.doc-name { font-size: 12.5px; font-weight: 600; color: #d1d5db; }
.doc-role { font-size: 11px; color: #6b7280; }
.duty-badge { font-size: 9px; font-weight: 700; background: rgba(5,150,105,0.15); color: #34d399; border: 1px solid rgba(5,150,105,0.25); padding: 3px 7px; border-radius: 999px; letter-spacing: .06em; flex-shrink: 0; }

/* ── MAIN ── */
.main { margin-left: 248px; flex: 1; display: flex; flex-direction: column; min-width: 0; }

/* ── TOPBAR ── */
.topbar {
  position: sticky; top: 0; z-index: 20;
  background: rgba(255,255,255,0.96);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
  padding: 12px 28px;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
}
.topbar-left { display: flex; align-items: center; gap: 14px; }
.hamburger { display: none; flex-direction: column; gap: 4px; padding: 6px; border: none; background: transparent; }
.hamburger span { width: 18px; height: 2px; background: var(--text3); border-radius: 1px; display: block; }
.page-eye { font-size: 10.5px; font-weight: 600; color: var(--accent); letter-spacing: .06em; text-transform: uppercase; }
.page-title { font-size: 20px; font-weight: 700; letter-spacing: -0.04em; color: var(--text); font-family: 'Outfit', sans-serif; }
.topbar-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
.clock-display { text-align: right; }
.clock-time { display: block; font-family: 'IBM Plex Mono', monospace; font-size: 13px; font-weight: 500; color: var(--text2); }
.clock-date { display: block; font-size: 10.5px; color: var(--text4); }
.search-box { display: flex; align-items: center; gap: 7px; background: var(--surface2); border: 1px solid var(--border2); padding: 7px 12px; border-radius: 8px; color: var(--text3); }
.search-box input { border: none; outline: none; background: transparent; font-size: 13px; width: 150px; color: var(--text); }
.search-box input::placeholder { color: var(--text4); }
.notif-btn { position: relative; border: 1px solid var(--border2); background: var(--surface); border-radius: 8px; padding: 7px 8px; color: var(--text3); display: flex; align-items: center; justify-content: center; }
.notif-dot { position: absolute; top: -2px; right: -2px; background: var(--c-danger); color: white; font-size: 9px; font-weight: 700; padding: 1px 4px; border-radius: 999px; min-width: 16px; text-align: center; }
.mobile-nav-scroll { display: none; overflow-x: auto; gap: 6px; padding: 8px 16px; border-bottom: 1px solid var(--border); }
.mob-tab { white-space: nowrap; padding: 5px 11px; border-radius: 999px; border: 1px solid var(--border); background: white; font-size: 12px; font-weight: 500; color: var(--text3); flex-shrink: 0; }
.mob-tab.active { background: var(--accent); color: white; border-color: transparent; }

/* ── PAGE ── */
.page { padding: 24px 28px; flex: 1; }
.page-grid { display: flex; flex-direction: column; gap: 20px; }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; align-items: start; }
.grid-2-1 { display: grid; grid-template-columns: 1.6fr 1fr; gap: 18px; }
.col-stack { display: flex; flex-direction: column; gap: 18px; }

/* ── COMMAND CENTER HERO ── */
.cc-hero {
  background: #0d1117;
  border-radius: 20px;
  padding: 36px 40px;
  display: grid; grid-template-columns: 1fr auto;
  gap: 32px; align-items: center;
  position: relative; overflow: hidden;
}
.cc-hero::before {
  content: "";
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at 70% 50%, rgba(37,99,235,0.15) 0%, transparent 60%),
              radial-gradient(ellipse at 20% 80%, rgba(8,145,178,0.1) 0%, transparent 50%);
  pointer-events: none;
}
.cc-eyebrow { display: flex; align-items: center; gap: 8px; font-size: 11.5px; font-weight: 600; color: #4ade80; margin-bottom: 14px; letter-spacing: .03em; }
.cc-title { font-size: 42px; font-weight: 700; letter-spacing: -0.06em; line-height: 1.0; color: white; margin-bottom: 14px; font-family: 'Outfit', sans-serif; }
.cc-desc { color: rgba(255,255,255,0.6); font-size: 13.5px; line-height: 1.7; max-width: 440px; }
.cc-actions { margin-top: 22px; display: flex; gap: 10px; }
.cc-stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.cc-stat { display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 14px 16px; min-width: 140px; }
.cc-stat-icon { font-size: 18px; color: rgba(255,255,255,0.4); flex-shrink: 0; }
.cc-stat-label { font-size: 11px; color: rgba(255,255,255,0.5); font-weight: 500; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 4px; }
.cc-stat-row { display: flex; align-items: baseline; gap: 6px; }
.cc-stat-val { font-size: 26px; font-weight: 700; color: white; letter-spacing: -0.05em; font-family: 'Outfit', sans-serif; }
.cc-stat-delta { font-size: 11px; font-weight: 600; font-family: 'IBM Plex Mono', monospace; }
.cc-stat-delta.danger { color: #f87171; }
.cc-stat-delta.warn { color: #fbbf24; }
.cc-stat-delta.safe { color: #4ade80; }

/* ── CARD ── */
.card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r); padding: 20px; box-shadow: var(--sh); }
.card-head { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px; padding-bottom: 14px; border-bottom: 1px solid var(--border); }
.card-icon-wrap { width: 34px; height: 34px; border-radius: 9px; background: var(--surface2); border: 1px solid var(--border); color: var(--text3); display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
.card-title { font-size: 14px; font-weight: 700; color: var(--text); font-family: 'Outfit', sans-serif; }
.card-sub { font-size: 11.5px; color: var(--text4); margin-top: 2px; }

/* ── BUTTONS ── */
.btn-primary { background: var(--accent); color: white; border: none; padding: 9px 18px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.14s; display: inline-flex; align-items: center; gap: 6px; font-family: 'IBM Plex Sans', sans-serif; }
.btn-primary:hover { background: var(--accent2); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(37,99,235,0.25); }
.btn-primary:disabled { opacity: 0.55; cursor: not-allowed; transform: none; box-shadow: none; }
.btn-primary.btn-success { background: var(--c-safe); }
.btn-outline-white { background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); padding: 9px 18px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.14s; }
.btn-outline-white:hover { background: rgba(255,255,255,0.18); }
.btn-sm { background: var(--surface2); border: 1px solid var(--border2); padding: 6px 12px; border-radius: 7px; font-size: 12px; font-weight: 600; cursor: pointer; color: var(--text2); transition: all 0.14s; }
.btn-sm:hover { background: #eff6ff; color: var(--accent); border-color: #bfdbfe; }
.btn-ai { width: 100%; background: #1e1b4b; color: white; border: none; padding: 12px; border-radius: 9px; font-size: 13.5px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; border: 1px solid rgba(139,92,246,0.3); }
.btn-ai:hover { background: #312e81; border-color: rgba(139,92,246,0.5); transform: translateY(-1px); }
.btn-ai:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
.row-action { background: transparent; border: 1px solid var(--border2); color: var(--accent); padding: 5px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.14s; white-space: nowrap; }
.row-action:hover { background: #eff6ff; }

/* ── BADGE ── */
.badge { display: inline-flex; align-items: center; padding: 3px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; white-space: nowrap; }
.badge.danger { background: var(--danger-bg); color: var(--c-danger); border: 1px solid var(--danger-bd); }
.badge.warn { background: var(--warn-bg); color: var(--c-warn); border: 1px solid var(--warn-bd); }
.badge.safe { background: var(--safe-bg); color: var(--c-safe); border: 1px solid var(--safe-bd); }

/* ── AVATAR ── */
.avi { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; color: white; font-family: 'Outfit', sans-serif; }
.avi.danger { background: var(--c-danger); }
.avi.warn { background: var(--c-warn); }
.avi.safe { background: var(--c-safe); }

/* ── TABLE ── */
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 13px; }
th { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--text4); padding: 8px 10px; border-bottom: 1px solid var(--border); text-align: left; }
td { padding: 11px 10px; border-bottom: 1px solid var(--border); vertical-align: middle; }
tr:last-child td { border-bottom: none; }
tr:hover td { background: var(--surface2); }
td small { font-size: 11px; color: var(--text4); display: block; margin-top: 2px; }
.pt-cell { display: flex; align-items: center; gap: 10px; }
td strong { font-size: 13px; font-weight: 600; }
.mono-pill { background: #eff6ff; color: var(--accent); padding: 3px 8px; border-radius: 5px; font-size: 11px; font-weight: 600; font-family: 'IBM Plex Mono', monospace; letter-spacing: .01em; }
.ward-chip { font-size: 11.5px; font-weight: 600; color: var(--text2); }
.inline-vitals { display: flex; flex-direction: column; gap: 3px; }
.inline-vitals span { font-size: 11.5px; font-weight: 600; font-family: 'IBM Plex Mono', monospace; }
.vt-danger { color: var(--c-danger); }
.vt-ok { color: var(--text3); }

/* ── ALERT STACK ── */
.alert-stack { display: flex; flex-direction: column; gap: 8px; }
.alert-row { display: flex; align-items: flex-start; gap: 10px; padding: 11px 12px; border-radius: var(--r2); border: 1px solid var(--border); background: var(--surface2); }
.alert-row.danger { background: var(--danger-bg); border-color: var(--danger-bd); }
.alert-row.warn { background: var(--warn-bg); border-color: var(--warn-bd); }
.alert-row.safe { background: var(--safe-bg); border-color: var(--safe-bd); }
.alert-indicator { width: 4px; height: 100%; min-height: 32px; border-radius: 2px; flex-shrink: 0; align-self: stretch; }
.alert-indicator.danger { background: var(--c-danger); }
.alert-indicator.warn { background: var(--c-warn); }
.alert-indicator.safe { background: var(--c-safe); }
.alert-content { flex: 1; }
.alert-content strong { display: block; font-size: 12.5px; font-weight: 700; color: var(--text); }
.alert-content span { font-size: 12px; color: var(--text3); line-height: 1.4; }
.alert-time { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--text4); white-space: nowrap; }

/* ── OCCUPANCY ── */
.occ-list { display: flex; flex-direction: column; gap: 10px; }
.occ-row { display: flex; align-items: center; gap: 10px; }
.occ-info { display: flex; justify-content: space-between; align-items: center; width: 100px; flex-shrink: 0; }
.occ-info > span:first-child { font-size: 12.5px; font-weight: 600; color: var(--text2); }
.occ-fraction { font-size: 10.5px; color: var(--text4); font-family: 'IBM Plex Mono', monospace; }
.occ-track { flex: 1; height: 5px; background: var(--border); border-radius: 999px; overflow: hidden; }
.occ-fill { height: 100%; border-radius: 999px; transition: width 0.4s; }
.occ-pct { width: 36px; text-align: right; font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; font-weight: 600; color: var(--text3); }

/* ── INPUT ── */
.inp { width: 100%; padding: 9px 12px; border: 1px solid var(--border2); border-radius: 8px; background: var(--surface); color: var(--text); font-size: 13.5px; font-weight: 500; outline: none; transition: border-color 0.14s; }
.inp::placeholder { color: var(--text4); }
.inp:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(37,99,235,0.08); }
select.inp { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23888'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 30px; }
option { color: #0d1117; background: white; }

/* ── INFO NOTE ── */
.info-note { padding: 10px 13px; border-radius: var(--r2); font-size: 12.5px; line-height: 1.55; background: var(--surface2); border: 1px solid var(--border2); color: var(--text3); margin-top: 10px; }
.info-note.info { background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe; }
.info-note.danger { background: var(--danger-bg); color: var(--c-danger); border-color: var(--danger-bd); }
.info-note.success { background: var(--safe-bg); color: var(--c-safe); border-color: var(--safe-bd); }
.info-note strong { display: block; margin-bottom: 3px; font-weight: 700; }
.info-note p { margin: 0; font-weight: 400; }

/* ── PATIENT HERO ── */
.pt-hero-card { background: linear-gradient(135deg, #f0f9ff 0%, #eff6ff 100%); border: 1px solid #bfdbfe; border-radius: var(--r); padding: 20px; display: flex; align-items: center; gap: 14px; }
.pt-hero-avi { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 700; color: white; flex-shrink: 0; font-family: 'Outfit', sans-serif; }
.pt-hero-avi.sm { width: 44px; height: 44px; border-radius: 12px; font-size: 13px; }
.pt-hero-info h2 { font-size: 20px; font-weight: 700; letter-spacing: -0.04em; }
.pt-hero-info p { font-size: 12.5px; color: var(--text3); margin: 2px 0 6px; }
.badge-row { display: flex; gap: 6px; flex-wrap: wrap; }

/* ── VITALS PANEL ── */
.vitals-panel { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r); box-shadow: var(--sh); overflow: hidden; }
.vitals-panel-head { display: flex; justify-content: space-between; align-items: center; padding: 14px 18px 10px; border-bottom: 1px solid var(--border); }
.panel-label { font-size: 14px; font-weight: 700; color: var(--text); font-family: 'Outfit', sans-serif; }
.panel-sub { font-size: 11.5px; color: var(--text4); }
.vitals-row { display: grid; grid-template-columns: repeat(4,1fr); padding: 4px 8px 12px; gap: 4px; }
.vbox { padding: 14px 10px 10px; text-align: center; border-radius: 10px; border: 1px solid transparent; }
.vbox.ok { background: var(--surface2); border-color: var(--border); }
.vbox.danger { background: var(--danger-bg); border-color: var(--danger-bd); }
.vbox.warn { background: var(--warn-bg); border-color: var(--warn-bd); }
.vbox p { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--text4); margin-bottom: 6px; }
.vbox strong { display: block; font-size: 18px; font-weight: 700; color: var(--text); font-family: 'IBM Plex Mono', monospace; letter-spacing: -0.02em; }
.vbox.danger strong { color: var(--c-danger); }
.vbox.warn strong { color: var(--c-warn); }
.vbox small { font-size: 10px; color: var(--text4); }
.chart-legend { display: flex; gap: 16px; padding: 8px 4px 0; justify-content: flex-end; }
.chart-legend span { display: flex; align-items: center; gap: 5px; font-size: 11.5px; color: var(--text3); }
.leg-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.ward-notes-text { color: var(--text2); line-height: 1.75; font-size: 13.5px; }

/* ── ID CARD ── */
.id-card { margin-top: 12px; border: 1px solid var(--border2); border-radius: var(--r2); overflow: hidden; }
.id-row { padding: 11px 14px; }
.id-row-2 { padding: 11px 14px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.id-divider { height: 1px; background: var(--border); }
.id-label { display: block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: var(--text4); margin-bottom: 4px; }
.id-val { display: block; font-size: 14px; font-weight: 700; color: var(--text); }
.id-val.pid { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--accent); background: #eff6ff; padding: 3px 8px; border-radius: 5px; display: inline-block; }
.id-val.nid { font-family: 'IBM Plex Mono', monospace; font-size: 15px; letter-spacing: .04em; }
.id-val.phone { font-family: 'IBM Plex Mono', monospace; font-size: 13px; color: var(--c-safe); text-decoration: none; }
.id-val.phone:hover { text-decoration: underline; }
.id-val.em { font-size: 12.5px; color: var(--text2); line-height: 1.4; }

/* ── FIELD GRID ── */
.field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.field-block { background: var(--surface2); border: 1px solid var(--border); border-radius: var(--r2); padding: 11px 12px; }
.field-block p { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--text4); margin-bottom: 4px; }
.field-block strong { font-size: 12.5px; color: var(--text2); line-height: 1.4; font-weight: 500; }
.field-block.danger { border-color: var(--danger-bd); background: var(--danger-bg); }
.field-block.danger strong { color: var(--c-danger); font-weight: 600; }

/* ── VISIT BLOCK ── */
.visit-block { border: 1px solid var(--border); border-radius: var(--r2); margin-bottom: 10px; overflow: hidden; }
.visit-head { display: flex; align-items: center; gap: 10px; padding: 10px 13px; background: var(--surface2); border-bottom: 1px solid var(--border); }
.visit-icon-circle { width: 28px; height: 28px; border-radius: 50%; background: var(--accent); color: white; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }
.visit-head strong { font-size: 13.5px; font-weight: 700; display: block; }
.visit-head small { font-size: 11px; color: var(--text4); font-family: 'IBM Plex Mono', monospace; }
.visit-fields { padding: 10px 13px; display: flex; flex-direction: column; gap: 5px; }
.vf { display: flex; gap: 8px; font-size: 12.5px; }
.vf > span { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--text4); padding-top: 2px; flex-shrink: 0; min-width: 80px; }
.vf > strong { color: var(--text2); font-weight: 500; }

/* ── MODULE HERO ── */
.module-hero { border-radius: 18px; padding: 28px 32px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
.module-hero.teal { background: linear-gradient(135deg, #083344, #0e7490); color: white; }
.module-eyebrow { display: inline-block; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.18); padding: 3px 10px; border-radius: 999px; color: rgba(255,255,255,0.9); margin-bottom: 10px; }
.module-title { font-size: 26px; font-weight: 700; letter-spacing: -0.05em; font-family: 'Outfit', sans-serif; margin-bottom: 6px; color: white; }
.module-desc { font-size: 13px; color: rgba(255,255,255,0.7); max-width: 420px; line-height: 1.65; }
.module-pt-badge { display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; padding: 14px 18px; flex-shrink: 0; }
.module-pt-badge strong { display: block; font-size: 14px; font-weight: 700; color: white; }
.module-pt-badge span { font-size: 11.5px; color: rgba(255,255,255,0.6); display: block; }

/* ── PROFILE SECTION ── */
.profile-quad { display: grid; grid-template-columns: repeat(4,1fr); gap: 7px; margin-bottom: 14px; }
.pq-cell { background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; padding: 10px; text-align: center; }
.pq-cell > span { display: block; font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--text4); margin-bottom: 4px; }
.pq-cell > strong { font-size: 15px; font-weight: 700; color: var(--text); font-family: 'Outfit', sans-serif; }
.blood { color: var(--c-danger) !important; }
.profile-section { margin-top: 12px; }
.section-micro { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: var(--text4); margin-bottom: 7px; }
.tag-cluster { display: flex; flex-wrap: wrap; gap: 5px; }
.tag { padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; }
.tag.info { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
.tag.danger { background: var(--danger-bg); color: var(--c-danger); border: 1px solid var(--danger-bd); }
.tag.neutral { background: var(--surface2); color: var(--text2); border: 1px solid var(--border2); }
.surgery-row { background: var(--surface2); border: 1px solid var(--border); border-radius: 7px; padding: 7px 11px; font-size: 12.5px; color: var(--text2); margin-bottom: 5px; }

/* ── TAB BAR ── */
.tab-bar { display: flex; background: var(--surface2); border: 1px solid var(--border); border-radius: var(--r2); padding: 3px; gap: 3px; }
.tab { flex: 1; padding: 8px 12px; border-radius: 7px; border: none; background: transparent; font-size: 13px; font-weight: 600; color: var(--text4); cursor: pointer; transition: all 0.14s; }
.tab.active { background: white; color: var(--accent); box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
.tab:hover:not(.active) { color: var(--text); }

/* ── RX TABLE ── */
.rx-table-wrap { overflow-x: auto; border: 1px solid var(--border); border-radius: var(--r2); }
.rx-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.rx-table th { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--text4); padding: 10px 12px; border-bottom: 1px solid var(--border); text-align: left; background: var(--surface2); }
.rx-table td { padding: 11px 12px; border-bottom: 1px solid var(--border); vertical-align: middle; }
.rx-table tr:last-child td { border-bottom: none; }
.rx-table tr:hover td { background: var(--surface2); }
.rx-table .discontinued td { opacity: 0.45; }
.dose-tag { background: #eff6ff; color: var(--accent); padding: 2px 7px; border-radius: 5px; font-size: 11.5px; font-weight: 700; font-family: 'IBM Plex Mono', monospace; }
.route-txt { font-size: 11.5px; color: var(--text4); }
.txt-muted { color: var(--text3); font-size: 12px; }
.txt-mono { font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; color: var(--text4); }

/* ── UNIVERSAL BLOCK ── */
.universal-block { background: var(--surface2); border: 1px solid var(--border); border-radius: var(--r2); padding: 13px; margin-bottom: 10px; }
.ub-head { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.ub-name { font-size: 13.5px; font-weight: 700; color: var(--text); flex: 1; }
.ub-year { font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; color: var(--text4); }
.ub-dx { font-size: 12.5px; color: var(--text3); margin-bottom: 8px; }

/* ── AI SECTION ── */
.ai-header-section { text-align: center; padding: 8px 0 14px; }
.ai-badge-row { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 10px; }
.ai-badge { background: #1e1b4b; color: #a5b4fc; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; border: 1px solid rgba(139,92,246,0.3); }
.ai-model { font-size: 12px; color: var(--text4); font-weight: 600; }
.ai-title { font-size: 26px; font-weight: 700; letter-spacing: -0.05em; font-family: 'Outfit', sans-serif; color: var(--text); margin-bottom: 8px; }
.ai-subtitle { font-size: 13.5px; color: var(--text3); max-width: 520px; margin: 0 auto; }

.mode-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
.mode-card { background: var(--surface2); border: 1.5px solid var(--border); border-radius: var(--r2); padding: 12px; text-align: left; cursor: pointer; transition: all 0.14s; display: flex; flex-direction: column; gap: 3px; }
.mode-card strong { font-size: 12.5px; font-weight: 700; color: var(--text); }
.mode-card span { font-size: 11px; color: var(--text4); }
.mode-card.active { border-color: #7c3aed; background: #f5f3ff; }
.mode-card.active strong { color: #7c3aed; }
.mode-card:hover:not(.active) { border-color: var(--border2); background: var(--surface); }

.pt-context-row { display: flex; gap: 10px; align-items: center; background: var(--surface2); border: 1px solid var(--border); border-radius: var(--r2); padding: 11px 12px; margin-top: 10px; }
.pt-context-row strong { font-size: 13.5px; display: block; }
.pt-context-row p { font-size: 11.5px; color: var(--text4); margin: 2px 0 4px; }

.ai-empty { text-align: center; padding: 40px 20px; color: var(--text4); }
.ai-empty-icon { font-size: 28px; margin-bottom: 12px; opacity: 0.3; }
.ai-empty p { font-size: 13px; line-height: 1.6; }
.ai-loading { text-align: center; padding: 40px 20px; }
.ai-loading p { font-size: 13px; color: var(--text4); margin-top: 12px; }
.loading-dots { display: flex; justify-content: center; gap: 5px; }
.loading-dots span { width: 7px; height: 7px; background: #7c3aed; border-radius: 50%; animation: bounce 1.2s infinite; }
.loading-dots span:nth-child(2) { animation-delay: 0.2s; }
.loading-dots span:nth-child(3) { animation-delay: 0.4s; }
@keyframes bounce { 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }
.ai-output { background: var(--surface2); border: 1px solid var(--border); border-radius: var(--r2); padding: 16px; font-size: 13.5px; line-height: 1.75; }
.ai-content h1,.ai-content h2,.ai-content h3 { font-size: 14px; font-weight: 700; margin: 12px 0 5px; color: var(--text); font-family: 'Outfit', sans-serif; }
.ai-content p { margin: 0 0 7px; color: var(--text2); }
.ai-content ul { padding-left: 16px; margin: 0 0 7px; }
.ai-content li { margin-bottom: 3px; color: var(--text2); }
.ai-actions { display: flex; gap: 8px; margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border); }
.disclaimer { background: #fefce8; border: 1px solid #fef08a; border-radius: var(--r2); padding: 12px; font-size: 12px; color: #713f12; }
.disclaimer strong { display: block; margin-bottom: 4px; }
.disclaimer p { margin: 0; line-height: 1.5; }
.spin { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.chat-log { display: flex; flex-direction: column; gap: 10px; max-height: 280px; overflow-y: auto; margin-bottom: 12px; }
.chat-msg { display: flex; flex-direction: column; gap: 4px; }
.chat-msg.user { align-items: flex-end; }
.chat-role { font-size: 10px; font-weight: 700; color: var(--text4); text-transform: uppercase; letter-spacing: .05em; }
.chat-bub { max-width: 90%; padding: 10px 12px; border-radius: 10px; font-size: 13px; line-height: 1.6; background: var(--surface2); border: 1px solid var(--border); color: var(--text2); }
.chat-msg.user .chat-bub { background: #eff6ff; border-color: #bfdbfe; color: #1e3a8a; text-align: right; }
.chat-bub h1,.chat-bub h2,.chat-bub h3 { font-size: 13px; font-weight: 700; margin: 6px 0 3px; }
.chat-input-row { display: flex; gap: 8px; }

/* ── RX CHECKER ── */
.rx-pt-bar { display: flex; align-items: center; gap: 10px; background: var(--surface2); border: 1px solid var(--border); padding: 11px 12px; border-radius: var(--r2); margin-bottom: 12px; }
.rx-pt-bar strong { font-size: 14px; }
.rx-pt-bar p { font-size: 11.5px; color: var(--text4); margin: 2px 0 0; }
.rx-input-group { display: grid; grid-template-columns: 1fr auto; gap: 8px; margin-bottom: 12px; }
.rx-result { display: flex; gap: 12px; align-items: flex-start; padding: 13px; border-radius: var(--r2); border: 1px solid; }
.rx-result.danger { background: var(--danger-bg); border-color: var(--danger-bd); }
.rx-result.warn { background: var(--warn-bg); border-color: var(--warn-bd); }
.rx-result.safe { background: var(--safe-bg); border-color: var(--safe-bd); }
.rx-icon { width: 26px; height: 26px; border-radius: 50%; border: 2px solid currentColor; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; }
.rx-result.danger .rx-icon { color: var(--c-danger); }
.rx-result.warn .rx-icon { color: var(--c-warn); }
.rx-result.safe .rx-icon { color: var(--c-safe); }
.rx-result strong { display: block; font-size: 13px; font-weight: 700; margin-bottom: 3px; color: var(--text); }
.rx-result p { margin: 0; font-size: 12.5px; line-height: 1.5; color: var(--text2); }
.sev-list { display: flex; flex-direction: column; gap: 9px; }
.sev-row { display: flex; align-items: center; gap: 10px; }
.sev-row span { font-size: 12.5px; color: var(--text3); }
.chip-row { display: flex; gap: 6px; flex-wrap: wrap; }
.chip { padding: 5px 12px; border-radius: 999px; border: 1px solid var(--border2); background: var(--surface2); font-size: 12px; font-weight: 600; cursor: pointer; color: var(--text3); transition: all 0.14s; }
.chip:hover { background: #eff6ff; border-color: #bfdbfe; color: var(--accent); }
.risk-panel { margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border); }
.risk-row { display: flex; align-items: center; gap: 10px; font-size: 12.5px; margin-bottom: 8px; }
.risk-row > span:first-child { width: 80px; color: var(--text3); }
.risk-track { flex: 1; height: 5px; background: var(--border); border-radius: 999px; overflow: hidden; }
.risk-fill { height: 100%; border-radius: 999px; transition: width 0.4s; }
.risk-num { width: 36px; text-align: right; font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600; color: var(--text4); }

/* ── HANDOVER ── */
.handover-hero { background: #0d1117; border-radius: 20px; padding: 32px 36px; display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; position: relative; overflow: hidden; }
.handover-hero::before { content:""; position:absolute; inset:0; background: radial-gradient(ellipse at 80% 50%, rgba(37,99,235,0.12), transparent 60%); pointer-events: none; }
.hh-left h1 { font-size: 28px; font-weight: 700; letter-spacing: -0.05em; color: white; font-family: 'Outfit', sans-serif; margin: 8px 0 6px; }
.hh-left p { color: rgba(255,255,255,0.5); font-size: 13px; }
.shift-cards { display: flex; gap: 10px; flex-shrink: 0; }
.shift-card { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 14px 16px; min-width: 130px; display: flex; flex-direction: column; gap: 2px; }
.shift-card.active { background: rgba(255,255,255,0.13); border-color: rgba(255,255,255,0.2); }
.shift-icon { font-size: 18px; color: rgba(255,255,255,0.5); margin-bottom: 4px; }
.shift-card strong { font-size: 13px; font-weight: 700; color: white; }
.shift-card > span { font-size: 11.5px; color: rgba(255,255,255,0.5); }
.shift-now { margin-top: 6px; font-size: 10px; font-weight: 700; background: #4ade80; color: #052e16; padding: 2px 8px; border-radius: 999px; display: inline-block; }

.handover-row { display: flex; align-items: center; gap: 12px; padding: 14px 0; border-bottom: 1px solid var(--border); border-left: 3px solid transparent; padding-left: 10px; margin-left: -10px; }
.handover-row:last-child { border-bottom: none; }
.handover-row.danger { border-left-color: var(--c-danger); }
.handover-row.warn { border-left-color: var(--c-warn); }
.handover-row.safe { border-left-color: var(--c-safe); }
.ho-left { display: flex; align-items: center; gap: 10px; flex-shrink: 0; min-width: 200px; }
.ho-left strong { display: block; font-size: 13.5px; font-weight: 700; }
.ho-left span { font-size: 11.5px; color: var(--text4); }
.ho-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; flex: 1; }
.ho-cell { background: var(--surface2); border-radius: 7px; padding: 6px 8px; }
.ho-cell small { display: block; font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--text4); margin-bottom: 2px; }
.ho-cell span { font-size: 11.5px; font-weight: 600; color: var(--text2); }

.cl-progress { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
.cl-track { flex: 1; height: 6px; background: var(--border); border-radius: 999px; overflow: hidden; }
.cl-fill { height: 100%; background: var(--c-safe); border-radius: 999px; transition: width 0.4s; }
.cl-progress span { font-size: 12px; font-weight: 700; color: var(--c-safe); font-family: 'IBM Plex Mono', monospace; white-space: nowrap; }
.cl-list { display: flex; flex-direction: column; gap: 5px; }
.cl-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: var(--r2); border: 1px solid var(--border); background: var(--surface2); cursor: pointer; font-size: 13px; color: var(--text); transition: all 0.14s; }
.cl-item:hover { border-color: var(--border2); }
.cl-item.done { background: var(--safe-bg); border-color: var(--safe-bd); }
.cl-item.urgent:not(.done) { border-color: var(--warn-bd); background: var(--warn-bg); }
.cl-box { width: 18px; height: 18px; border-radius: 5px; border: 1.5px solid var(--border2); display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: white; flex-shrink: 0; transition: all 0.14s; }
.cl-box.checked { background: var(--c-safe); border-color: var(--c-safe); }
.strikethrough { text-decoration: line-through; color: var(--text4); }
.priority-pip { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; margin-left: auto; }
.priority-pip.red { background: var(--c-danger); }
.priority-pip.amber { background: var(--c-warn); }

.team-row { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid var(--border); }
.team-row:last-child { border-bottom: none; }
.team-avi { width: 32px; height: 32px; border-radius: 50%; background: #374151; color: #d1d5db; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; flex-shrink: 0; }
.team-row strong { display: block; font-size: 13px; font-weight: 700; }
.team-row span { display: block; font-size: 11px; color: var(--text4); }
.online-dot { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 0 2px #dcfce7; flex-shrink: 0; }

/* ── BED MONITOR ── */
.bed-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
.bed-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r); padding: 18px; display: flex; flex-direction: column; gap: 12px; box-shadow: var(--sh); border-top: 3px solid transparent; }
.bed-card.danger { border-top-color: var(--c-danger); }
.bed-card.warn { border-top-color: var(--c-warn); }
.bed-card.safe { border-top-color: var(--c-safe); }
.bed-header { display: flex; justify-content: space-between; align-items: flex-start; }
.bed-number { font-size: 22px; font-weight: 700; letter-spacing: -0.04em; font-family: 'Outfit', sans-serif; }
.bed-patient { font-size: 13px; color: var(--text3); margin-top: 2px; }
.bed-move { display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: var(--text3); }
.move-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.move-dot.danger { background: var(--c-danger); animation: pulse 1s infinite; }
.move-dot.warn { background: var(--c-warn); }
.move-dot.safe { background: var(--c-safe); }
.bed-vitals { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.bv-cell { background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; padding: 9px 10px; }
.bv-cell.danger { background: var(--danger-bg); border-color: var(--danger-bd); }
.bv-cell.warn { background: var(--warn-bg); border-color: var(--warn-bd); }
.bv-cell span { display: block; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--text4); margin-bottom: 3px; }
.bv-cell strong { font-size: 15px; font-weight: 700; font-family: 'IBM Plex Mono', monospace; color: var(--text); }
.bed-bar { height: 3px; border-radius: 999px; }
.bed-bar.danger { background: var(--c-danger); }
.bed-bar.warn { background: var(--c-warn); }
.bed-bar.safe { background: var(--c-safe); }
.bed-metrics { display: grid; grid-template-columns: repeat(3,1fr); gap: 4px; }
.bm { text-align: center; }
.bm span { display: block; font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--text4); }
.bm strong { font-size: 12.5px; font-weight: 700; color: var(--text); }

/* ── SAMPLE TRACKING ── */
.sample-layout { display: grid; grid-template-columns: 340px 1fr; gap: 18px; align-items: start; }
.sample-item { border: 1px solid var(--border); border-radius: var(--r2); padding: 13px; margin-bottom: 9px; cursor: pointer; transition: all 0.14s; background: var(--surface); }
.sample-item:hover { border-color: var(--border2); }
.sample-item.active { border-color: var(--accent); background: #eff6ff; }
.si-top { display: flex; gap: 10px; margin-bottom: 9px; }
.si-icon { font-size: 18px; flex-shrink: 0; }
.si-top strong { font-size: 12.5px; font-weight: 700; font-family: 'IBM Plex Mono', monospace; color: var(--accent); display: block; }
.si-top p { font-size: 11.5px; color: var(--text4); margin-top: 2px; }
.si-bottom { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.si-type { font-size: 12px; color: var(--text3); flex: 1; }
.si-badges { display: flex; gap: 5px; }
.si-eta { font-size: 11px; color: var(--text4); font-family: 'IBM Plex Mono', monospace; }
.priority-pip-tag { padding: 2px 7px; border-radius: 999px; font-size: 10px; font-weight: 700; text-transform: uppercase; }
.priority-pip-tag.stat { background: var(--danger-bg); color: var(--c-danger); border: 1px solid var(--danger-bd); }
.priority-pip-tag.urgent { background: var(--warn-bg); color: var(--c-warn); border: 1px solid var(--warn-bd); }
.priority-pip-tag.routine { background: var(--surface2); color: var(--text4); border: 1px solid var(--border); }

.sample-bar { display: flex; align-items: center; justify-content: space-between; padding: 13px; background: var(--surface2); border: 1px solid var(--border); border-radius: var(--r2); margin-bottom: 20px; gap: 12px; }
.sb-info strong { font-size: 13.5px; font-weight: 700; font-family: 'IBM Plex Mono', monospace; color: var(--accent); display: block; }
.sb-info p { font-size: 11.5px; color: var(--text4); margin-top: 2px; }

.progress-steps { display: flex; align-items: flex-start; justify-content: space-between; gap: 4px; margin-bottom: 22px; position: relative; }
.progress-steps::before { content:""; position:absolute; top:19px; left:20px; right:20px; height:1.5px; background:var(--border); z-index:0; }
.ps-item { display: flex; flex-direction: column; align-items: center; gap: 8px; flex: 1; z-index: 1; }
.ps-dot { width: 38px; height: 38px; border-radius: 50%; background: var(--surface2); border: 2px solid var(--border2); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: white; background: white; transition: all 0.2s; }
.ps-item.done .ps-dot { background: var(--c-safe); border-color: var(--c-safe); color: white; }
.ps-item.active .ps-dot { background: var(--accent); border-color: var(--accent); box-shadow: 0 0 0 5px rgba(37,99,235,0.12); }
.ps-inner { width: 10px; height: 10px; background: white; border-radius: 50%; animation: pulse 1s infinite; }
.ps-label { text-align: center; }
.ps-label strong { display: block; font-size: 11px; font-weight: 700; color: var(--text4); }
.ps-item.done .ps-label strong { color: var(--c-safe); }
.ps-item.active .ps-label strong { color: var(--accent); }
.ps-label small { font-size: 10px; color: var(--text4); font-family: 'IBM Plex Mono', monospace; }

.detail-log { border: 1px solid var(--border); border-radius: var(--r2); overflow: hidden; }
.dl-header { padding: 10px 14px; font-size: 12px; font-weight: 700; color: var(--text3); background: var(--surface2); border-bottom: 1px solid var(--border); text-transform: uppercase; letter-spacing: .06em; }
.dl-row { display: flex; gap: 14px; padding: 9px 14px; border-bottom: 1px solid var(--border); }
.dl-row:last-child { border-bottom: none; }
.dl-time { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--accent); font-weight: 600; width: 62px; flex-shrink: 0; padding-top: 1px; }
.dl-msg { font-size: 12.5px; color: var(--text3); line-height: 1.5; }
.dl-bold { font-weight: 700; color: var(--text); }
.dl-muted { color: var(--text4); font-style: italic; }

/* ── AMBULANCE ── */
.amb-tabs { display: flex; gap: 10px; flex-wrap: wrap; }
.amb-tab { flex: 1; min-width: 240px; display: flex; align-items: center; gap: 12px; background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--r2); padding: 13px 15px; cursor: pointer; transition: all 0.14s; text-align: left; }
.amb-tab:hover { border-color: var(--border2); }
.amb-tab.active { border-color: var(--accent); background: #eff6ff; }
.amb-tab-icon { font-size: 22px; flex-shrink: 0; }
.amb-tab strong { display: block; font-size: 14px; font-weight: 700; color: var(--text); font-family: 'Outfit', sans-serif; }
.amb-tab > div span { font-size: 11.5px; color: var(--text4); }
.amb-tab .badge { margin-left: auto; flex-shrink: 0; }

.gps-view { height: 200px; background: linear-gradient(135deg, #e0f2fe, #e0f7fa); border: 1px solid #bae6fd; border-radius: 12px; position: relative; overflow: hidden; }
.gps-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(14,116,144,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(14,116,144,.06) 1px, transparent 1px); background-size: 26px 26px; }
.gps-hospital { position: absolute; right: 22px; bottom: 32px; z-index: 3; background: white; border-radius: 999px; padding: 6px 11px; font-size: 11px; font-weight: 700; color: var(--c-safe); box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.gps-amb { position: absolute; left: 55px; top: 65px; z-index: 3; font-size: 20px; color: var(--c-danger); animation: ambMove 2s ease-in-out infinite; }
@keyframes ambMove { 0%,100%{transform:translate(0,0)} 50%{transform:translate(4px,-3px)} }
.gps-route-line { position: absolute; left: 78px; top: 78px; width: 52%; height: 68px; border-top: 3px dashed var(--accent); border-right: 3px dashed var(--accent); border-radius: 0 36px 0 0; z-index: 2; opacity: .6; }
.gps-eta { position: absolute; right: 22px; top: 18px; z-index: 4; background: #0d1117; color: white; padding: 9px 13px; border-radius: 10px; text-align: center; }
.gps-eta span { display: block; font-size: 9px; font-weight: 700; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: .08em; }
.gps-eta strong { display: block; font-size: 18px; font-weight: 700; color: #4ade80; font-family: 'IBM Plex Mono', monospace; letter-spacing: -0.04em; }

.er-cl-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }

.ecg-wrap { background: #020617; border-radius: 12px; padding: 16px; }
.ecg-top { display: flex; align-items: center; gap: 8px; color: white; margin-bottom: 12px; font-size: 12px; font-weight: 700; font-family: 'IBM Plex Mono', monospace; }
.ecg-live { display: flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 600; color: #4ade80; }
.ecg-id { margin-left: auto; font-size: 11px; color: rgba(255,255,255,0.3); }
.ecg-svg { width: 100%; height: 130px; display: block; }
.ecg-wave { fill: none; stroke: #22c55e; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; filter: drop-shadow(0 0 4px rgba(34,197,94,0.7)); stroke-dasharray: 900; stroke-dashoffset: 900; animation: ecgDraw 2.8s linear infinite; }
@keyframes ecgDraw { 0%{stroke-dashoffset:900} 70%{stroke-dashoffset:0} 100%{stroke-dashoffset:-250} }
.ecg-stats { display: flex; justify-content: space-around; margin-top: 10px; font-size: 12.5px; font-weight: 700; color: #86efac; font-family: 'IBM Plex Mono', monospace; }

.comm-log { display: flex; flex-direction: column; gap: 8px; max-height: 290px; overflow-y: auto; }
.comm-item { display: flex; gap: 10px; }
.comm-t { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--text4); flex-shrink: 0; padding-top: 3px; }
.comm-body { flex: 1; padding: 9px 12px; border-radius: var(--r2); border: 1px solid var(--border); }
.comm-item.amb .comm-body { background: var(--warn-bg); border-color: var(--warn-bd); }
.comm-item.er .comm-body { background: #eff6ff; border-color: #bfdbfe; }
.comm-body strong { display: block; font-size: 10px; font-weight: 700; color: var(--text3); margin-bottom: 2px; text-transform: uppercase; letter-spacing: .05em; }
.comm-body p { font-size: 12.5px; color: var(--text2); line-height: 1.5; margin: 0; }

/* ── RESPONSIVE ── */
@media (max-width: 1100px) {
  .grid-2, .grid-2-1 { grid-template-columns: 1fr; }
  .vitals-row { grid-template-columns: repeat(4,1fr); }
  .bed-grid { grid-template-columns: repeat(2,1fr); }
  .cc-hero { grid-template-columns: 1fr; }
  .cc-stat-grid { grid-template-columns: repeat(4,1fr); }
  .sample-layout { grid-template-columns: 1fr; }
}
@media (max-width: 768px) {
  .sidebar { transform: translateX(-100%); transition: transform 0.22s; }
  .sidebar.open { transform: translateX(0); }
  .sidebar-overlay { display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 29; }
  .main { margin-left: 0; }
  .hamburger { display: flex; }
  .mobile-nav-scroll { display: flex; }
  .topbar { padding: 10px 16px; }
  .page { padding: 14px 16px; }
  .cc-stat-grid { grid-template-columns: repeat(2,1fr); }
  .vitals-row { grid-template-columns: repeat(2,1fr); }
  .bed-grid { grid-template-columns: 1fr; }
  .field-grid { grid-template-columns: 1fr; }
  .profile-quad { grid-template-columns: repeat(2,1fr); }
  .mode-grid { grid-template-columns: 1fr; }
  .shift-cards { flex-direction: column; }
  .er-cl-grid { grid-template-columns: 1fr; }
  .amb-tabs { flex-direction: column; }
  .progress-steps { flex-wrap: wrap; gap: 10px; }
  .progress-steps::before { display: none; }
  .cc-title { font-size: 30px; }
  .page-title { font-size: 18px; }
  .clock-display { display: none; }
  .search-box input { width: 100px; }
}
`;