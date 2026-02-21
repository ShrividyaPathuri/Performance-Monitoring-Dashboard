import { randomUUID } from "node:crypto";

/**
 * Simple policy:
 * - If last 20 logs have >= 5 ERROR/FATAL, raise ERROR_SPIKE
 * - If last 10 cpu metrics average > 85, raise CPU_HIGH
 */
export function computeAlerts(logs, metrics) {
  const events = [];
  const recentLogs = logs.slice(0, 20);
  const errCount = recentLogs.filter(l => l.level === "ERROR" || l.level === "FATAL").length;
  if (errCount >= 5) {
    events.push({
      id: randomUUID(),
      timestamp: new Date().toISOString(),
      type: "ERROR_SPIKE",
      severity: "HIGH",
      message: `High error rate: ${errCount}/20 recent logs are ERROR/FATAL`,
    });
  }

  const cpu = metrics.filter(m => m.name.toLowerCase() === "cpu").slice(0, 10);
  if (cpu.length >= 5) {
    const avg = cpu.reduce((s,m)=>s+m.value,0)/cpu.length;
    if (avg > 85) {
      events.push({
        id: randomUUID(),
        timestamp: new Date().toISOString(),
        type: "CPU_HIGH",
        severity: "MEDIUM",
        message: `CPU average high: ${avg.toFixed(1)} over last ${cpu.length} samples`,
      });
    }
  }
  return events;
}
