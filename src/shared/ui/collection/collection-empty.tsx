import { SearchX } from "lucide-react";
import styles from "./collection.module.scss";

export function CollectionEmpty({ onReset, message }: { onReset: () => void; message: string }) {
  return <div className={styles.empty}><SearchX size={28} aria-hidden="true" /><h3>{message}</h3><p>Попробуйте другой запрос или выберите все материалы дела.</p><button type="button" onClick={onReset}>Сбросить поиск и фильтры</button></div>;
}
