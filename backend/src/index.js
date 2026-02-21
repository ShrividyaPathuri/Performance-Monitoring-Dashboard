import express from "express";
import cors from "cors";
import { ingestLogSchema, ingestMetricSchema } from "./schemas.js";
import { store } from "./store.js";
import { computeAlerts } from "./alerts.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.post("/api/ingest/log", async (req, res) => {
  const parsed = ingestLogSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const log = await store.appendLog(parsed.data);
  await store.appendAlertEvents(computeAlerts(await store.getRecentLogs(200), await store.getRecentMetrics(200)));
  res.json({ ok: true, log });
});

app.post("/api/ingest/metric", async (req, res) => {
  const parsed = ingestMetricSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const metric = await store.appendMetric(parsed.data);
  await store.appendAlertEvents(computeAlerts(await store.getRecentLogs(200), await store.getRecentMetrics(200)));
  res.json({ ok: true, metric });
});

app.get("/api/logs", async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit ?? "50", 10) || 50, 500);
  res.json({ logs: await store.getRecentLogs(limit) });
});

app.get("/api/metrics", async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit ?? "200", 10) || 200, 2000);
  res.json({ metrics: await store.getRecentMetrics(limit) });
});

app.get("/api/alerts", async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit ?? "50", 10) || 50, 500);
  res.json({ alerts: await store.getRecentAlerts(limit) });
});

const port = process.env.PORT ? Number(process.env.PORT) : 5050;
app.listen(port, () => console.log(`monitoring-api listening on :${port}`));
