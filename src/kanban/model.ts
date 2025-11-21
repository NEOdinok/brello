import { nanoid } from "nanoid";
import { createEvent, createStore } from "effector";

export type KanbanList = {
  id: string;
  title: string;
  cards: KanbanCard[];
};

export type KanbanCard = {
  id: string;
  title: string;
};

export type KanbanCardForm = Pick<KanbanCard, "title">;

export type KanbanBoard = KanbanList[];

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

export const mockBoard: KanbanList[] = [
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

export const boardUpdate = createEvent<KanbanBoard>();
export const cardCreateClicked = createEvent<{
  card: KanbanCardForm;
  columnId: string;
}>();
export const cardEditClicked = createEvent<{
  card: KanbanCardForm;
  columnId: string;
  cardId: string;
}>();
export const cardDeleteClicked = createEvent<{
  columnId: string;
  cardId: string;
}>();
export const cardMoved = createEvent<{
  fromColumnId: string;
  toColumnId: string;
  fromIndex: number;
  toIndex: number;
}>();
const cardMovedWithinTheColumn = cardMoved.filter({
  fn: ({ fromColumnId, toColumnId }) => fromColumnId === toColumnId,
});
const cardMovedToAnotherColumn = cardMoved.filter({
  fn: ({ fromColumnId, toColumnId }) => fromColumnId !== toColumnId,
});

export const $board = createStore<KanbanBoard>(mockBoard);

$board.on(boardUpdate, (_, board) => board);
$board.on(cardCreateClicked, (board, { card, columnId }) => {
  const updateBoard = board.map((column) => {
    if (column.id === columnId) {
      const newCard = { ...card, id: nanoid() };
      return { ...column, cards: [...column.cards, newCard] };
    }

    return column;
  });

  return updateBoard;
});
$board.on(cardEditClicked, (board, { columnId, cardId, card }) => {
  const updatedBoard = board.map((column) => {
    if (column.id === columnId) {
      const updatedCards = column.cards.map((existingCard) => {
        if (existingCard.id === cardId) {
          return { ...existingCard, ...card };
        }

        return existingCard;
      });

      return { ...column, cards: updatedCards };
    }

    return column;
  });

  return updatedBoard;
});

$board.on(cardDeleteClicked, (board, { columnId, cardId }) => {
  const updatedBoard = board.map((column) => {
    if (column.id === columnId) {
      const updatedCards = column.cards.filter((card) => card.id !== cardId);
      return { ...column, cards: updatedCards };
    }

    return column;
  });

  return updatedBoard;
});

$board.on(
  cardMovedWithinTheColumn,
  (board, { fromColumnId, fromIndex, toIndex }) => {
    const updatedBoard = board.map((column) => {
      if (column.id === fromColumnId) {
        const updatedList = listReorder(column, fromIndex, toIndex);
        return updatedList;
      }

      return column;
    });

    return updatedBoard;
  }
);

$board.on(
  cardMovedToAnotherColumn,
  (board, { fromColumnId, toColumnId, fromIndex, toIndex }) => {
    return cardMove(board, fromColumnId, toColumnId, fromIndex, toIndex);
  }
);

function cardMove(
  board: KanbanBoard,
  sourceColumnId: string,
  destinationColumnId: string,
  fromIndex: number,
  toIndex: number
): KanbanBoard {
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
