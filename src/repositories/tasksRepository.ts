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

export type GetTaskParams = {
  taskListId: string;
  taskId: string;
};

export type CreateTaskParams = { taskListId: string } & Partial<Task>;

interface TasksRepository {
  getTaskLists: (
    params?: GetTaskListsParams,
    token?: string,
  ) => Promise<TaskList[]>;
  getTasks: (params: GetTasksParams, token: string) => Promise<TaskList[]>;
  getTask: (params: GetTaskParams, token: string) => Promise<Task>;
  createTask: (params: CreateTaskParams, token: string) => Promise<Task>;
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

  getTask: async (params: GetTaskParams, token: string): Promise<Task> => {
    const response = await api.get<Task>(
      `https://tasks.googleapis.com/tasks/v1/lists/${params.taskListId}/tasks/${params.taskId}`,
      {
        ...params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  },

  createTask: async (
    params: CreateTaskParams,
    token: string,
  ): Promise<Task> => {
    // for optimistic ui sample
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const response = await api.post<Task>(
      `https://tasks.googleapis.com/tasks/v1/lists/${params.taskListId}/tasks`,
      {
        title: params.title,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json;charset=utf-8',
        },
      },
    );
    return response.data;
  },
};
