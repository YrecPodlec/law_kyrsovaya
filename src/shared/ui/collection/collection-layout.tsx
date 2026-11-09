import type { ReactNode } from "react";
import styles from "./collection.module.scss";

export function CollectionLayout({ menu, children }: { menu: ReactNode; children: ReactNode }) {
  return <div className={styles.layout}>{menu}<div className={styles.main}>{children}</div></div>;
}
export function CollectionResults({ children }: { children: ReactNode }) {
  return <p className={styles.results} role="status">{children}</p>;
}
