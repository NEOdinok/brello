import "@mantine/core/styles/ActionIcon.css";

import styles from "./app.module.css";
import { Header } from "./header";
import { KanbanBoard } from "./kanban";
import { $counter, incrementClicked } from "./model";
import { Button } from "./button";
import { useUnit } from "effector-react";

export default function App() {
  const Counter = () => {
    const [counter, handleIncrement] = useUnit([$counter, incrementClicked]);

    return <Button onClick={handleIncrement}>{counter}</Button>;
  };

  return (
    <>
      <Header />
      <Counter />
      <main className={styles.main}>
        <KanbanBoard />
      </main>
    </>
  );
}
