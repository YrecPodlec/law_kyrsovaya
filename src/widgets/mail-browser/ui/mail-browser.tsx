"use client";

import { useState } from "react";
import { ThreadRow, filterThreads, mailCategories, type EmailThread } from "@/entities/email-thread";
import { CollectionEmpty, CollectionLayout, CollectionMenu, CollectionResults, CollectionToolbar } from "@/shared/ui/collection";
import { Panel } from "@/shared/ui/panel";
import styles from "./mail-browser.module.scss";

export function MailBrowser({ threads }: { threads: EmailThread[] }) {
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("date");
  const filtered = filterThreads(threads, category, query, sort);
  const options = [{ id: "all", label: "Вся переписка", count: threads.length }, ...mailCategories.map(item => ({ ...item, count: threads.filter(thread => thread.category === item.id).length }))];
  return <Panel labelledBy="mail-title"><header className={styles.header}><h2 id="mail-title">Переписка по делу</h2><p>Письма объединены в цепочки. Поиск работает по теме, участникам и тексту писем.</p></header>
    <CollectionLayout menu={<CollectionMenu title="Участники переписки" options={options} selected={category} onSelect={setCategory} />}>
      <CollectionToolbar query={query} onQuery={setQuery} sort={sort} onSort={setSort} searchLabel="Поиск по переписке дела" />
      <CollectionResults>Найдено цепочек: {filtered.length} из {threads.length} · Писем: {filtered.reduce((count, thread) => count + thread.messages.length, 0)}</CollectionResults>
      {filtered.length ? filtered.map(thread => <ThreadRow key={thread.id} thread={thread} />) : <CollectionEmpty message="Переписка не найдена" onReset={() => { setQuery(""); setCategory("all"); }} />}
    </CollectionLayout>
  </Panel>;
}
