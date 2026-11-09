import assert from "node:assert/strict";
import { test } from "node:test";
import { demoCase } from "../src/entities/legal-case/model/demo-case";
import { getCaseTimeline } from "../src/entities/legal-case/model/timeline";

test("sorts dates without changing the input data", () => {
  const unsorted = { ...demoCase, events: [...demoCase.events].reverse() };
  const originalIds = unsorted.events.map(event => event.id);
  const { events, nextDeadline } = getCaseTimeline(unsorted);
  assert.deepEqual(events.map(event => event.kind), ["opened", "deadline", "hearing"]);
  assert.deepEqual(unsorted.events.map(event => event.id), originalIds);
  assert.equal(nextDeadline?.id, "documents-deadline");
});

test("does not highlight a past deadline", () => {
  assert.equal(getCaseTimeline({ ...demoCase, asOf: "2026-11-13" }).nextDeadline, undefined);
});

test("a deadline today is still relevant", () => {
  assert.equal(getCaseTimeline({ ...demoCase, asOf: "2026-11-12" }).nextDeadline?.id, "documents-deadline");
});
