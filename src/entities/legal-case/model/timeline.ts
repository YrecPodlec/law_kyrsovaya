import type { LegalCase } from "./types";

export function getCaseTimeline(legalCase: LegalCase) {
  const events = [...legalCase.events].sort((a, b) => a.date.localeCompare(b.date));
  const nextDeadline = events.find(event => event.kind === "deadline" && event.date >= legalCase.asOf);
  return { events, nextDeadline };
}
