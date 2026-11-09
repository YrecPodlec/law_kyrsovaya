import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { WorkspaceHeader } from "./workspace-header";
import styles from "./workspace-shell.module.scss";

export function WorkspaceShell({ children, caseNumber, section }: { children: ReactNode; caseNumber?: string; section?: string }) {
  return <div className={styles.shell}>
    <a className={styles.skipLink} href="#main-content">Перейти к содержимому</a>
    <Sidebar isCaseList={!caseNumber} />
    <div className={styles.workspace}><WorkspaceHeader caseNumber={caseNumber} section={section} /><main className={styles.main} id="main-content">{children}</main></div>
  </div>;
}
