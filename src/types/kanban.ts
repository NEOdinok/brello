type KanbanBoard = KanbanList[];

type KanbanList = {
  id: string;
  title: string;
  cards: KanbanCard[];
};

type KanbanCard = {
  id: string;
  title: string;
};

export { type KanbanBoard, type KanbanList, type KanbanCard };
