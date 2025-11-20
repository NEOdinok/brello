import { useState } from "react";

import { containerStyles } from "../container";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { ActionIcon, Group } from "@mantine/core";
import { IconCheck, IconPencil, IconTrash, IconX } from "@tabler/icons-react";
import cn from "clsx";
import { nanoid } from "nanoid";

import { Button } from "../button";
import { customScrollStyles } from "../custom-scroll";
import { Textarea } from "../textarea";
import styles from "./styles.module.css";
import { type KanbanCard, type KanbanList } from "../types";

/* ============================================================================
   RANDOM TASK GENERATOR - Extract to src/lib/generateTasks.ts or similar
   ============================================================================ */

const taskNames = [
  "Set up development environment",
  "Review opened issues",
  "Implement Kanban feature",
  "Fix critical bugs",
  "Refactor authentication module",
  "Add unit tests for API",
  "Update documentation",
  "Optimize database queries",
  "Design new dashboard",
  "Integrate payment system",
  "Setup CI/CD pipeline",
  "Create user onboarding flow",
  "Implement dark mode",
  "Add notification system",
  "Setup error tracking",
  "Migrate to new database",
  "Add search functionality",
  "Improve performance metrics",
  "Create admin dashboard",
  "Setup monitoring alerts",
  "Add multi-language support",
  "Implement caching strategy",
  "Create API documentation",
  "Setup automated backups",
  "Add two-factor authentication",
  "Optimize images and assets",
  "Create mobile app mockups",
  "Setup analytics tracking",
  "Implement feature flags",
  "Add batch processing",
  "Create deployment scripts",
  "Setup security audit",
  "Add data validation layer",
  "Implement webhooks",
  "Create rate limiting",
  "Add email notifications",
  "Setup log aggregation",
  "Implement retry logic",
  "Create recovery procedures",
  "Add accessibility features",
  "Setup A/B testing",
  "Implement pagination",
  "Create user roles system",
  "Add data encryption",
  "Setup CDN integration",
  "Implement real-time updates",
  "Create backup strategies",
  "Add compression support",
  "Setup load balancing",
];

function randomTaskName(): string {
  return taskNames[Math.floor(Math.random() * taskNames.length)];
}

function createRandomTaskList(amount: number): KanbanCard[] {
  return Array.from({ length: amount }, () => ({
    id: nanoid(),
    title: randomTaskName(),
  }));
}

const largeTestBoard: KanbanList[] = [
  {
    id: nanoid(),
    title: "To Do",
    cards: createRandomTaskList(10),
  },
  {
    id: nanoid(),
    title: "In Progress",
    cards: createRandomTaskList(15),
  },
  {
    id: nanoid(),
    title: "Done",
    cards: createRandomTaskList(30),
  },
];

/* ============================================================================
   HELPER FUNCTIONS - Extract to src/lib/kanbanHelpers.ts or similar
   ============================================================================ */

function listReorder(
  list: KanbanList,
  startIndex: number,
  endIndex: number
): KanbanList {
  const cards = Array.from(list.cards);
  const [removed] = cards.splice(startIndex, 1);
  cards.splice(endIndex, 0, removed);

  return { ...list, cards };
}

function cardMove(
  board: KanbanList[],
  sourceColumnId: string,
  destinationColumnId: string,
  fromIndex: number,
  toIndex: number
): KanbanList[] {
  const sourceColumnIndex = board.findIndex(
    (column) => column.id === sourceColumnId
  );
  const destinationColumnIndex = board.findIndex(
    (column) => column.id === destinationColumnId
  );

  const sourceColumn = board[sourceColumnIndex];
  const destinationColumn = board[destinationColumnIndex];

  const card = sourceColumn.cards[fromIndex];

  const updatedSourceColumn = {
    ...sourceColumn,
    cards: sourceColumn.cards.filter((_, index) => index !== fromIndex),
  };
  const updatedDestinationColumn = {
    ...destinationColumn,
    cards: [
      ...destinationColumn.cards.slice(0, toIndex),
      { ...card },
      ...destinationColumn.cards.slice(toIndex),
    ],
  };

  return board.map((column) => {
    if (column.id === sourceColumnId) {
      return updatedSourceColumn;
    }

    if (column.id === destinationColumnId) {
      return updatedDestinationColumn;
    }

    return column;
  });
}

export function KanbanBoard() {
  const [board, setBoard] = useState(largeTestBoard);

  const onCreateCard = (card: KanbanCard, columnId: string) => {
    const updatedBoard = board.map((column) => {
      if (column.id === columnId) {
        return { ...column, cards: [...column.cards, card] };
      }

      return column;
    });

    setBoard(updatedBoard);
  };

  const onColumnUpdate = (updatedList: KanbanList) => {
    const updatedBoard = board.map((column) =>
      column.id === updatedList.id ? updatedList : column
    );
    setBoard(updatedBoard);
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // card dropped outside droppable
    if (!destination) {
      return;
    }

    // card dropped same place
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceId = source.droppableId;
    const destinationId = destination.droppableId;

    const insideTheSameColumn = sourceId === destinationId;
    if (insideTheSameColumn) {
      // Перемещение внутри одной колонки
      const column = board.find((column) => column.id === sourceId);
      if (column) {
        const reorderedList = listReorder(
          column,
          source.index,
          destination.index
        );
        const updatedBoard = board.map((item) =>
          item.id === sourceId ? reorderedList : item
        );
        setBoard(updatedBoard);
      }
    } else {
      // Перемещение между колонками
      const updatedBoard = cardMove(
        board,
        sourceId,
        destinationId,
        source.index,
        destination.index
      );
      setBoard(updatedBoard);
    }
  };

  return (
    <section className={cn(containerStyles, styles.section)}>
      <header className={styles.headerSection}>
        <h1 className={styles.title}>Sprint #1</h1>
      </header>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className={cn(styles.board, customScrollStyles)}>
          {board.map((column) => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              cards={column.cards}
              onUpdate={onColumnUpdate}
            >
              <KanbanCreateCard
                onCreate={(card) => onCreateCard(card, column.id)}
              />
            </KanbanColumn>
          ))}
        </div>
      </DragDropContext>
    </section>
  );
}

function KanbanColumn({
  title,
  id,
  cards,
  children,
  onUpdate,
}: {
  title: string;
  id: string;
  cards: KanbanCard[];
  children?: React.ReactNode;
  onUpdate: (updatedList: KanbanList) => void;
}) {
  const onCardEdit = (updatedCard: KanbanCard) => {
    const updatedCards = cards.map((card) =>
      card.id === updatedCard.id ? updatedCard : card
    );
    onUpdate({ id, title, cards: updatedCards });
  };

  const onCardDelete = (cardId: string) => {
    const updatedCards = cards.filter((card) => card.id !== cardId);
    onUpdate({ id, title, cards: updatedCards });
  };

  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          className={styles.column}
          {...provided.droppableProps}
        >
          <p className={styles.columnTitle}>{title}</p>
          <div className={styles.list}>
            {cards.map(({ id: cardId, title: cardTitle }, index) => (
              <KanbanCard
                key={cardId}
                id={cardId}
                index={index}
                title={cardTitle}
                onEdit={onCardEdit}
                onDelete={() => onCardDelete(cardId)}
              />
            ))}
            {provided.placeholder}
            {children}
          </div>
        </div>
      )}
    </Droppable>
  );
}

function KanbanCard({
  id,
  index,
  title,
  onEdit,
  onDelete,
}: {
  id: string;
  index: number;
  title: string;
  onEdit: (card: KanbanCard) => void;
  onDelete: () => void;
}) {
  const [editTitle, setEditTitle] = useState(title);
  const [editMode, setEditMode] = useState(false);

  const onReset = () => {
    setEditTitle(title);
    setEditMode(false);
  };

  const onEditFinished = () => {
    onEdit({ id, title: editTitle });
    onReset();
  };

  if (editMode) {
    return (
      <div className={styles.item}>
        <Textarea value={editTitle} onValue={setEditTitle} />
        <Group gap="xs" mt="sm">
          <ActionIcon onClick={onEditFinished}>
            <IconCheck size={14} />
          </ActionIcon>
          <ActionIcon onClick={onReset}>
            <IconX size={14} />
          </ActionIcon>
        </Group>
      </div>
    );
  }

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            styles.item,
            snapshot.isDragging ? styles.dragging : null
          )}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <p className={styles.itemText}>{title}</p>
            <Group gap="xs">
              <ActionIcon onClick={() => setEditMode(true)}>
                <IconPencil size={14} />
              </ActionIcon>
              <ActionIcon onClick={() => onDelete()}>
                <IconTrash size={14} />
              </ActionIcon>
            </Group>
          </div>
        </div>
      )}
    </Draggable>
  );
}

function KanbanCreateCard({
  onCreate,
}: {
  onCreate: (card: KanbanCard) => void;
}) {
  const [title, setTitle] = useState("");

  const onReset = () => {
    setTitle("");
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onCreate({ id: nanoid(), title });
    onReset();
  };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <Textarea
        value={title}
        onValue={setTitle}
        placeholder="Start making new card here"
      />
      <Button type="submit">Add card</Button>
    </form>
  );
}
