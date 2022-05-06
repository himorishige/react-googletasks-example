export type TaskList = {
  kind: string;
  id: string;
  etag: string;
  title: string;
  updated: string;
  selfLink: string;
};

export type TaskListsResponse = {
  kind: string;
  etag: string;
  items: TaskList[];
};

export type Task = {
  kind?: string;
  id: string;
  etag?: string;
  title: string;
  updated?: string;
  selfLink?: string;
  parent?: string;
  position?: string;
  notes?: string;
  status?: 'needsAction' | 'completed';
  due?: string;
  completed?: string;
  deleted?: boolean;
  hidden?: boolean;
  links?: Link[];
};

type Link = {
  type: string;
  description: string;
  link: string;
};

export type TasksResponse = {
  kind: string;
  etag: string;
  nextPageToken: string;
  items: Task[];
};
