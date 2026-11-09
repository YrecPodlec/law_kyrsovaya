import type { LegalCase } from "./types";

export const demoCase: LegalCase = {
  number: "CASE-001",
  title: "Спор по договору поставки",
  status: "В работе",
  description: "Взыскание задолженности и неустойки за нарушение сроков оплаты по договору поставки. Подготовка документов и представление интересов клиента в арбитражном суде.",
  client: "ООО «Север Трейд»",
  lawyer: "Анна Смирнова",
  category: "Арбитражный спор",
  openedAt: "2026-11-02",
  asOf: "2026-11-09",
  events: [
    { id: "case-opened", date: "2026-11-02", kind: "opened", title: "Открытие дела", description: "Обращение клиента зарегистрировано. Дело принято в работу." },
    { id: "documents-deadline", date: "2026-11-12", kind: "deadline", title: "Срок подачи документов", description: "Подготовить и направить в суд документы по делу." },
    { id: "scheduled-hearing", date: "2026-11-19", kind: "hearing", title: "Запланированное заседание", description: "Рассмотрение спора в арбитражном суде." },
  ],
};

export const demoCases = [demoCase];
export const findDemoCase = (number: string) => demoCases.find(item => item.number === number);
