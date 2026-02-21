import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import express from "express";
import cors from "cors";
import { ingestLogSchema } from "../src/schemas.js";

test("schema validates log payload", () => {
  const good = ingestLogSchema.safeParse({ level:"ERROR", service:"api", message:"boom" });
  assert.equal(good.success, true);
  const bad = ingestLogSchema.safeParse({ level:"NOPE", service:"", message:"" });
  assert.equal(bad.success, false);
});
