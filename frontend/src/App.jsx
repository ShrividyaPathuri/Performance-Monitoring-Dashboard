import React, { useEffect, useMemo, useState } from "react";
import { fetchJSON } from "./api.js";
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale } from "chart.js";

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale);

function Sparkline({ points, title }) {
  const ref = React.useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext("2d");
    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: points.map((_, i) => i + 1),
        datasets: [{ data: points }],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false }, title: { display: true, text: title } },
        scales: { x: { display: false }, y: { display: true } },
      },
    });
    return () => chart.destroy();
  }, [points, title]);

  return <canvas ref={ref} height="120"></canvas>;
}

export default function App() {
  const [logs, setLogs] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [err, setErr] = useState("");

  async function refresh() {
    try {
      setErr("");
      const [l, m, a] = await Promise.all([
        fetchJSON("/api/logs?limit=30"),
        fetchJSON("/api/metrics?limit=200"),
        fetchJSON("/api/alerts?limit=10"),
      ]);
      setLogs(l.logs);
      setMetrics(m.metrics);
      setAlerts(a.alerts);
    } catch (e) {
      setErr(String(e));
    }
  }

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 3000);
    return () => clearInterval(t);
  }, []);

  const cpuPoints = useMemo(() => metrics.filter(x => x.name.toLowerCase()==="cpu").slice(0, 20).reverse().map(x => x.value), [metrics]);
  const memPoints = useMemo(() => metrics.filter(x => x.name.toLowerCase()==="mem").slice(0, 20).reverse().map(x => x.value), [metrics]);

  return (
    <div style={{ fontFamily: "system-ui, Arial", padding: 20, maxWidth: 1050, margin: "0 auto" }}>
      <h1>Performance Monitoring Dashboard</h1>
      <p style={{ color: "#555" }}>
        Live view of recent metrics, logs, and alert events. (Demo dataset stored locally.)
      </p>
      {err && <div style={{ background: "#fee", padding: 10, border: "1px solid #f88" }}>{err}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
          <Sparkline title="CPU (last 20)" points={cpuPoints.length ? cpuPoints : [0]} />
        </div>
        <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
          <Sparkline title="Memory (last 20)" points={memPoints.length ? memPoints : [0]} />
        </div>
      </div>

      <h2 style={{ marginTop: 24 }}>Alerts</h2>
      <ul>
        {alerts.map(a => (
          <li key={a.id}><b>{a.type}</b> ({a.severity}) — {a.message}</li>
        ))}
        {!alerts.length && <li>No alerts yet.</li>}
      </ul>

      <h2>Recent Logs</h2>
      <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12, overflowX: "auto" }}>
        <table width="100%" cellPadding="6">
          <thead>
            <tr style={{ textAlign: "left" }}>
              <th>Time</th><th>Level</th><th>Service</th><th>Message</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(l => (
              <tr key={l.id}>
                <td style={{ whiteSpace: "nowrap" }}>{l.timestamp}</td>
                <td><span style={{ fontWeight: 700 }}>{l.level}</span></td>
                <td>{l.service}</td>
                <td>{l.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ marginTop: 18, color: "#666" }}>
        Tip: POST metrics/logs to the backend to see charts and alerts update in real-time.
      </p>
    </div>
  );
}
