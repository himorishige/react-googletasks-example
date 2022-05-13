import { tasksRepository } from '../repositories/tasksRepository';
import {
  useApi,
  useGenericMutation,
  useOptimisticMutation,
  usePrefetch,
} from './useApi';

import type { Task } from '../types/tasks';

export const useTasksApi = () => {
  const useFetchTaskLists = (maxResults?: number) =>
    useApi(
      ['taskLists', { maxResults }],
      async ({ maxResults }, token) =>
        tasksRepository.getTaskLists({ maxResults }, token),
      // {
      //   select: ({ data }) =>
      //     data.map((taskList) => ({
      //       id: taskList.id,
      //       title: taskList.title,
      //     })),
      // },
    );

  const useFetchTaskList = (taskListId: string) =>
    useApi(
      ['tasks', { taskListId }],
      async ({ taskListId }, token) =>
        tasksRepository.getTasks({ taskListId }, token),
      {
        enabled: !!taskListId,
        // select: (data) =>
        //   data.map((task) => ({
        //     id: task.id,
        //     title: task.title,
        //     status: task.status,
        //   })),
      },
    );

  const useFetchTask = (taskListId: string, taskId: string) =>
    useApi(
      ['task', { taskListId, taskId }],
      async (params, token) => tasksRepository.getTask(params, token),
      {
        enabled: !!taskId && !!taskListId,
      },
    );

  const useAddTask = (taskListId: string) =>
    useOptimisticMutation<Task, Task, Task[]>(
      ['tasks', { taskListId }],
      async (params, token) =>
        tasksRepository.createTask({ ...params, taskListId }, token),
      (oldData, newData) => [newData, ...oldData],
    );

  const useGenericAddTask = (taskListId: string) =>
    useGenericMutation<Pick<Task, 'title'>, Task, Task[]>(
      async (params, token) =>
        tasksRepository.createTask({ ...params, taskListId }, token),
    );

  const useUpdateTask = (taskListId: string) =>
    useOptimisticMutation<Task, Task, Task[]>(
      ['tasks', { taskListId }],
      async (params, token) =>
        tasksRepository.updateTask({ ...params, taskListId }, token),
      (oldData, params) => {
        return [
          ...oldData.map((task) => {
            if (task.id === params.id) {
              return { ...task, ...params };
            } else {
              return task;
            }
          }),
        ];
      },
    );

  const useDeleteTask = (taskListId: string) =>
    useOptimisticMutation<Pick<Task, 'id'>, void, Task[]>(
      ['tasks', { taskListId }],
      async ({ id }, token) =>
        tasksRepository.deleteTask({ taskListId, taskId: id }, token),
      (oldData, params) => [...oldData.filter(({ id }) => id !== params.id)],
    );

  const usePrefetchTask = (taskListId: string, taskId: string) =>
    usePrefetch(['task', { taskListId, taskId }], async (params, token) =>
      tasksRepository.getTask(params, token),
    );

  return {
    useFetchTaskLists,
    useFetchTaskList,
    useFetchTask,
    useAddTask,
    useGenericAddTask,
    useUpdateTask,
    useDeleteTask,
    usePrefetchTask,
  };
};
