import { Search } from "lucide-react";
import { useId } from "react";
import styles from "./collection.module.scss";

export function CollectionToolbar({ query, onQuery, sort, onSort, searchLabel }: { query: string; onQuery: (value: string) => void; sort: string; onSort: (value: string) => void; searchLabel: string }) {
  const id = useId();
  return <div className={styles.toolbar}><div className={styles.search}><label htmlFor={`${id}-search`}>{searchLabel}</label><div><Search size={16} aria-hidden="true" /><input id={`${id}-search`} type="search" value={query} placeholder="Введите запрос…" onChange={event => onQuery(event.target.value)} /></div></div><div className={styles.sort}><label htmlFor={`${id}-sort`}>Сортировка</label><select id={`${id}-sort`} value={sort} onChange={event => onSort(event.target.value)}><option value="date">Сначала новые</option><option value="name">По названию</option></select></div></div>;
}
