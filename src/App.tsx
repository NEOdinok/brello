import "@mantine/core/styles/ActionIcon.css";

import styles from "./app.module.css";
import { Header } from "./header";
import { KanbanBoard } from "./pages/kanban/view";

export default function App() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <KanbanBoard />
      </main>
    </>
  );
}
