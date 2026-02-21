import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const dataDir = process.env.DATA_DIR || path.join(process.cwd(), "data");
const logsFile = path.join(dataDir, "logs.jsonl");
const metricsFile = path.join(dataDir, "metrics.jsonl");
const alertsFile = path.join(dataDir, "alerts.jsonl");

async function ensure() {
  await fs.mkdir(dataDir, { recursive: true });
  for (const f of [logsFile, metricsFile, alertsFile]) {
    try { await fs.access(f); } catch { await fs.writeFile(f, "", "utf-8"); }
  }
}

async function appendJsonl(file, obj) {
  await ensure();
  await fs.appendFile(file, JSON.stringify(obj) + "\n", "utf-8");
  return obj;
}

async function readLastN(file, n) {
  await ensure();
  const content = await fs.readFile(file, "utf-8");
  const lines = content.trim().split("\n").filter(Boolean);
  return lines.slice(-n).reverse().map(l => JSON.parse(l));
}

export const store = {
  async appendLog(input) {
    const log = {
      id: randomUUID(),
      timestamp: input.timestamp || new Date().toISOString(),
      level: input.level,
      service: input.service,
      message: input.message,
    };
    return appendJsonl(logsFile, log);
  },
  async appendMetric(input) {
    const metric = {
      id: randomUUID(),
      timestamp: input.timestamp || new Date().toISOString(),
      name: input.name,
      value: input.value,
      unit: input.unit || "",
    };
    return appendJsonl(metricsFile, metric);
  },
  async appendAlertEvents(events) {
    for (const e of events) await appendJsonl(alertsFile, e);
  },
  async getRecentLogs(n) { return readLastN(logsFile, n); },
  async getRecentMetrics(n) { return readLastN(metricsFile, n); },
  async getRecentAlerts(n) { return readLastN(alertsFile, n); },
};
