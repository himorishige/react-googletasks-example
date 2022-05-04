import { api } from '../utils/api';

import type { TaskList, TaskListsResponse } from '../types/tasks';

export type GetTaskListsParams = {
  maxResults?: number;
  pageToken?: string;
};

interface TasksRepository {
  getTaskLists: (
    params?: GetTaskListsParams,
    token?: string,
  ) => Promise<TaskList[]>;
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
};
