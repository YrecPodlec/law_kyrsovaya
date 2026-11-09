export interface CaseFolder { id: string; caseNumber: string; name: string; parentId?: string }
export interface CaseDocument { id: string; caseNumber: string; folderId: string; name: string; format: string; size: string; updatedAt: string; content: string }

export const demoFolders: CaseFolder[] = [
  { id: "contracts", caseNumber: "CASE-001", name: "Договоры" },
  { id: "appendices", caseNumber: "CASE-001", name: "Приложения", parentId: "contracts" },
  { id: "court", caseNumber: "CASE-001", name: "Судебные документы" },
  { id: "evidence", caseNumber: "CASE-001", name: "Доказательства" },
];

export const demoDocuments: CaseDocument[] = [
  { id: "contract", caseNumber: "CASE-001", folderId: "contracts", name: "Договор поставки № 24", format: "PDF", size: "240 КБ", updatedAt: "2026-11-02", content: "Учебный пример договора.\n\nПоставщик обязуется передать товар, а покупатель — принять и оплатить его в течение 15 рабочих дней с даты поставки.\n\nЗа нарушение срока оплаты предусмотрена неустойка. Споры разрешаются в арбитражном суде." },
  { id: "specification", caseNumber: "CASE-001", folderId: "appendices", name: "Спецификация к договору", format: "PDF", size: "96 КБ", updatedAt: "2026-11-03", content: "Учебный пример приложения.\n\nСпецификация содержит перечень поставляемых товаров, количество, стоимость и согласованные сроки поставки." },
  { id: "claim", caseNumber: "CASE-001", folderId: "court", name: "Проект искового заявления", format: "DOCX", size: "48 КБ", updatedAt: "2026-11-09", content: "Учебный проект искового заявления.\n\nПросим взыскать задолженность по договору поставки и неустойку за нарушение сроков оплаты.\n\nК заявлению прилагаются договор, документы о поставке и расчёт задолженности." },
  { id: "notice", caseNumber: "CASE-001", folderId: "court", name: "Извещение о заседании", format: "PDF", size: "112 КБ", updatedAt: "2026-11-06", content: "Учебное судебное извещение.\n\nРассмотрение спора запланировано на 19 ноября 2026 года. Сторонам предложено представить документы до 12 ноября 2026 года." },
  { id: "delivery", caseNumber: "CASE-001", folderId: "evidence", name: "Товарная накладная", format: "PDF", size: "185 КБ", updatedAt: "2026-11-04", content: "Учебный пример товарной накладной.\n\nПередача товара покупателю подтверждена подписями представителей сторон. Документ используется для подтверждения исполнения поставки." },
  { id: "calculation", caseNumber: "CASE-001", folderId: "evidence", name: "Расчёт задолженности", format: "XLSX", size: "32 КБ", updatedAt: "2026-11-08", content: "Учебная сводка расчёта.\n\nОсновной долг: 450 000 ₽.\nНеустойка: 22 500 ₽.\nИтого: 472 500 ₽.\n\nЭто текстовый пример, а не загруженная электронная таблица." },
];

export const getCaseDocuments = (number: string) => demoDocuments.filter(item => item.caseNumber === number);
export const getCaseFolders = (number: string) => demoFolders.filter(item => item.caseNumber === number);

export function folderIdsWithin(folders: CaseFolder[], selected: string): Set<string> {
  const ids = new Set([selected]);
  for (let changed = true; changed;) {
    changed = false;
    for (const folder of folders) if (folder.parentId && ids.has(folder.parentId) && !ids.has(folder.id)) { ids.add(folder.id); changed = true; }
  }
  return ids;
}

export function filterDocuments(documents: CaseDocument[], folders: CaseFolder[], folder: string, query: string, sort: string) {
  const allowed = folderIdsWithin(folders, folder);
  const search = query.trim().toLocaleLowerCase("ru");
  return documents.filter(item => (folder === "all" || allowed.has(item.folderId)) && item.name.toLocaleLowerCase("ru").includes(search))
    .sort((a, b) => sort === "name" ? a.name.localeCompare(b.name, "ru") : b.updatedAt.localeCompare(a.updatedAt) || a.name.localeCompare(b.name, "ru"));
}
