import { api } from '../utils/api';

import type {
  Task,
  TaskList,
  TaskListsResponse,
  TasksResponse,
} from '../types/tasks';

export type GetTaskListsParams = {
  maxResults?: number;
  pageToken?: string;
};

export type GetTasksParams = {
  taskListId: string;
};

interface TasksRepository {
  getTaskLists: (
    params?: GetTaskListsParams,
    token?: string,
  ) => Promise<TaskList[]>;
  getTasks: (params: GetTasksParams, token: string) => Promise<TaskList[]>;
}

export const tasksRepository: TasksRepository = {
  getTaskLists: async (
    params?: GetTaskListsParams,
    token?: string,
  ): Promise<TaskList[]> => {
    const response = await api.get<TaskListsResponse>(
      'https://tasks.googleapis.com/tasks/v1/users/@me/lists',
      {
        ...params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data.items;
  },

  getTasks: async (params: GetTasksParams, token: string): Promise<Task[]> => {
    const response = await api.get<TasksResponse>(
      `https://tasks.googleapis.com/tasks/v1/lists/${params.taskListId}/tasks`,
      {
        ...params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data.items;
  },
};
