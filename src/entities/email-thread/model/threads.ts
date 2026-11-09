export interface MailMessage { id: string; sender: string; date: string; body: string }
export interface EmailThread { id: string; caseNumber: string; category: "client" | "court" | "counterparty"; subject: string; participants: string; messages: MailMessage[] }
export const mailCategories = [ { id: "client", label: "Клиент" }, { id: "court", label: "Суд" }, { id: "counterparty", label: "Контрагент" } ];

const demoThreads: EmailThread[] = [
  { id: "client-documents", caseNumber: "CASE-001", category: "client", subject: "Документы по договору поставки", participants: "Иван Петров · ООО «Север Трейд»", messages: [
    { id: "m1", sender: "Иван Петров <client@example.test>", date: "2026-11-02T09:00:00Z", body: "Добрый день! Просим помочь со взысканием задолженности по договору поставки. Передали договор и товарную накладную для изучения." },
    { id: "m2", sender: "Анна Смирнова <anna@example.test>", date: "2026-11-03T11:30:00Z", body: "Добрый день! Дело принято в работу. Для подготовки расчёта просим уточнить даты платежей и размер непогашенной задолженности." },
    { id: "m3", sender: "Иван Петров <client@example.test>", date: "2026-11-09T08:15:00Z", body: "Добрый день! Сверили расчёт: основной долг составляет 450 000 рублей. Готовы предоставить дополнительные сведения для подачи документов." },
  ] },
  { id: "court-notice", caseNumber: "CASE-001", category: "court", subject: "Извещение о дате судебного заседания", participants: "Канцелярия арбитражного суда", messages: [
    { id: "m4", sender: "Канцелярия <court@example.test>", date: "2026-11-06T10:00:00Z", body: "Учебное уведомление: заседание назначено на 19 ноября 2026 года. Документы по делу необходимо представить до 12 ноября 2026 года." },
  ] },
  { id: "counterparty-reply", caseNumber: "CASE-001", category: "counterparty", subject: "Ответ на претензию об оплате", participants: "Представитель покупателя", messages: [
    { id: "m5", sender: "Представитель покупателя <buyer@example.test>", date: "2026-11-05T13:00:00Z", body: "Добрый день. Претензия получена. Просим направить детализацию расчёта неустойки для рассмотрения требований." },
  ] },
];

export const getCaseThreads = (number: string) => demoThreads.filter(thread => thread.caseNumber === number);
export const lastMessageDate = (thread: EmailThread) => thread.messages.reduce((latest, message) => message.date > latest ? message.date : latest, "");
export function filterThreads(threads: EmailThread[], category: string, query: string, sort: string) {
  const search = query.trim().toLocaleLowerCase("ru");
  return threads.filter(thread => (category === "all" || thread.category === category) && [thread.subject, thread.participants, ...thread.messages.flatMap(message => [message.sender, message.body])].join(" ").toLocaleLowerCase("ru").includes(search))
    .sort((a, b) => sort === "name" ? a.subject.localeCompare(b.subject, "ru") : lastMessageDate(b).localeCompare(lastMessageDate(a)));
}
