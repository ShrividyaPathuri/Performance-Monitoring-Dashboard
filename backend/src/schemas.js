import { z } from "zod";

export const ingestLogSchema = z.object({
  timestamp: z.string().optional(),
  level: z.enum(["TRACE","DEBUG","INFO","WARN","ERROR","FATAL"]).default("INFO"),
  service: z.string().min(1).default("app"),
  message: z.string().min(1),
});

export const ingestMetricSchema = z.object({
  timestamp: z.string().optional(),
  name: z.string().min(1),
  value: z.number(),
  unit: z.string().optional(),
});
