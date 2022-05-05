import { tasksRepository } from '../repositories/tasksRepository';
import { useApi, useOptimisticMutation, usePrefetch } from './useApi';

import type { Task } from '../types/tasks';

export const useTasksApi = () => {
  const useFetchTaskLists = (maxResults?: number) =>
    useApi(['taskLists', { maxResults }], async ({ maxResults }, token) =>
      tasksRepository.getTaskLists({ maxResults }, token),
    );

  const useFetchTaskList = (taskListId: string) =>
    useApi(
      ['tasks', { taskListId }],
      async ({ taskListId }, token) =>
        tasksRepository.getTasks({ taskListId }, token),
      { enabled: !!taskListId },
    );

  const useFetchTasks = (taskListId: string, taskId: string) =>
    useApi(
      ['task', { taskListId, taskId }],
      async (params, token) => tasksRepository.getTask(params, token),
      { enabled: !!taskId && !!taskListId },
    );

  const useAddTask = (taskListId: string) =>
    useOptimisticMutation<Partial<Task>, Task, Task[]>(
      ['tasks', { taskListId }],
      async (params, token) =>
        tasksRepository.createTask({ ...params, taskListId }, token),
      (oldData, newData) => [newData, ...oldData],
    );

  const useDeleteTask = (taskListId: string) =>
    useOptimisticMutation<{ taskId: string }, { taskId: string }, Task[]>(
      ['tasks', { taskListId }],
      async (params, token) =>
        tasksRepository.deleteTask({ ...params, taskListId }, token),
      (oldData, params) => [
        ...oldData.filter(({ id }) => id !== params.taskId),
      ],
    );

  const usePrefetchTask = (taskListId: string, taskId: string) =>
    usePrefetch(['task', { taskListId, taskId }], async (params, token) =>
      tasksRepository.getTask(params, token),
    );

  return {
    useFetchTaskLists,
    useFetchTaskList,
    useFetchTasks,
    useAddTask,
    useDeleteTask,
    usePrefetchTask,
  };
};
