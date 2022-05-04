import { tasksRepository } from '../repositories/tasksRepository';
import { useApi } from './useApi';

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

  return { useFetchTaskLists, useFetchTaskList, useFetchTasks };
};
