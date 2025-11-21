import { useState } from "react";
import { cardDeleteClicked, cardEditClicked, cardMoved } from "./model";

import { useUnit } from "effector-react";
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

import { Button } from "../button";
import { customScrollStyles } from "../custom-scroll";
import { Textarea } from "../textarea";
import styles from "./styles.module.css";
import { $board, cardCreateClicked, type KanbanCard } from "./model";

export function KanbanBoard() {
  const [board, onCardMove] = useUnit([$board, cardMoved]);

  const handleDragEnd = ({ source, destination }: DropResult) => {
    if (!destination) {
      // Dropped outside droppable
      return;
    }

    const fromColumnId = source.droppableId;
    const toColumnId = destination.droppableId;
    const fromIndex = source.index;
    const toIndex = destination.index;

    onCardMove({ fromColumnId, toColumnId, fromIndex, toIndex });
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
            >
              <KanbanCreateCard columnId={column.id} />
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
}: {
  title: string;
  id: string;
  cards: KanbanCard[];
  children?: React.ReactNode;
}) {
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
                columnId={id}
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
  columnId,
}: {
  id: string;
  index: number;
  title: string;
  columnId: string;
}) {
  const [onCardEdit, onCardDelete] = useUnit([
    cardEditClicked,
    cardDeleteClicked,
  ]);
  const [editTitle, setEditTitle] = useState(title);
  const [editMode, setEditMode] = useState(false);

  const onCancel = () => {
    setEditMode(false);
  };

  const startEdit = () => {
    setEditTitle(title);
    setEditMode(true);
  };

  const onEditFinished = () => {
    onCardEdit({ columnId, cardId: id, card: { title: editTitle } });
    setEditMode(false);
  };

  const onDelete = () => {
    onCardDelete({ columnId, cardId: id });
  };

  if (editMode) {
    return (
      <div className={styles.item}>
        <Textarea value={editTitle} onValue={setEditTitle} />
        <Group gap="xs" mt="sm">
          <ActionIcon onClick={onEditFinished}>
            <IconCheck size={14} />
          </ActionIcon>
          <ActionIcon onClick={onCancel}>
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
              <ActionIcon onClick={() => startEdit()}>
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

function KanbanCreateCard({ columnId }: { columnId: string }) {
  const [onCreateCard] = useUnit([cardCreateClicked]);
  const [title, setTitle] = useState("");

  const onReset = () => {
    setTitle("");
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onCreateCard({ columnId, card: { title } });
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
