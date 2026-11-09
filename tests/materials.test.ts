import assert from "node:assert/strict";
import { test } from "node:test";
import { filterDocuments, getCaseDocuments, getCaseFolders } from "../src/entities/case-document/model/documents";
import { filterThreads, getCaseThreads } from "../src/entities/email-thread/model/threads";

test("documents and correspondence are scoped to the selected case", () => {
  assert.equal(getCaseDocuments("missing-case").length, 0);
  assert.equal(getCaseFolders("missing-case").length, 0);
  assert.equal(getCaseThreads("missing-case").length, 0);
  assert.ok(getCaseDocuments("CASE-001").every(item => item.caseNumber === "CASE-001"));
});

test("parent folders include nested documents and combine with search", () => {
  const folders = getCaseFolders("CASE-001");
  const documents = getCaseDocuments("CASE-001");
  assert.equal(filterDocuments(documents, folders, "contracts", "", "date").length, 2);
  assert.equal(filterDocuments(documents, folders, "contracts", " СПЕЦИФИКАЦИЯ ", "date")[0]?.id, "specification");
  assert.equal(filterDocuments(documents, folders, "court", "Спецификация", "date").length, 0);
  assert.equal(filterDocuments(documents, folders, "all", "", "date")[0].id, "claim");
});

test("mail search finds message bodies and respects participant filters", () => {
  const threads = getCaseThreads("CASE-001");
  assert.equal(filterThreads(threads, "all", "450 000", "date")[0]?.id, "client-documents");
  assert.equal(filterThreads(threads, "court", "450 000", "date").length, 0);
  assert.equal(filterThreads(threads, "all", "", "date")[0]?.id, "client-documents");
});
