export interface CaseEvent {
  id: string;
  date: string;
  kind: "opened" | "deadline" | "hearing";
  title: string;
  description: string;
}

export interface LegalCase {
  number: string;
  title: string;
  status: string;
  description: string;
  client: string;
  lawyer: string;
  category: string;
  openedAt: string;
  asOf: string;
  events: readonly CaseEvent[];
}
