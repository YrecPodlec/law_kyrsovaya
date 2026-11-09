import { Folder } from "lucide-react";
import styles from "./collection.module.scss";

export interface CollectionOption { id: string; label: string; count: number; nested?: boolean }
export function CollectionMenu({ title, options, selected, onSelect }: { title: string; options: CollectionOption[]; selected: string; onSelect: (id: string) => void }) {
  return <aside className={styles.menu}><h3>{title}</h3><div role="group" aria-label={title}>{options.map(option => <button key={option.id} type="button" aria-pressed={selected === option.id} className={option.nested ? styles.nested : undefined} onClick={() => onSelect(option.id)}><Folder size={16} aria-hidden="true" /><span>{option.label}</span><small>{option.count}</small></button>)}</div></aside>;
}
