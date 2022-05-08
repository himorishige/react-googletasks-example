import { Button, Grid, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { SquarePlus } from 'tabler-icons-react';
import invariant from 'tiny-invariant';

import { useTasksApi } from '../../hooks/useTasks';
import { TaskListItem } from '../models/tasks/TaskListItem';

import type { Task } from '../../types/tasks';

export const TaskList = () => {
  const { taskListId } = useParams();
  invariant(taskListId, 'taskListId is required');

  const form = useForm({
    initialValues: {
      title: '',
    },
    validate: {
      title: (value) => (value.length > 0 ? null : 'Title is required'),
    },
  });

  type FormValues = typeof form.values;

  const {
    useFetchTaskList,
    useAddTask,
    useUpdateTask,
    useDeleteTask,
    usePrefetchTask,
  } = useTasksApi();

  const { data: tasks } = useFetchTaskList(taskListId);

  const createTask = useAddTask(taskListId);

  const submitHandler = async (values: FormValues) => {
    try {
      await createTask.mutateAsync(
        {
          id: Math.random().toString(),
          title: values.title,
        },
        {
          onSuccess: () => form.reset(),
        },
      );
    } catch (error) {
      console.warn(error);

      const message =
        error instanceof Error ? error.message : 'error connecting to server';

      showNotification({
        title: `Cannot add the task: ${values.title}`,
        message,
        autoClose: 3000,
        color: 'red',
      });
    }
  };

  const updateTask = useUpdateTask(taskListId);

  const completeHandler = useCallback(
    async (params: Task) => {
      try {
        await updateTask.mutateAsync({ ...params });
      } catch (error) {
        console.warn(error);

        const message =
          error instanceof Error ? error.message : 'error connecting to server';

        showNotification({
          title: `Cannot complete the task: ${params.title}`,
          message,
          autoClose: 3000,
          color: 'red',
        });
      }
    },
    [updateTask],
  );

  const deleteTask = useDeleteTask(taskListId);

  const deleteHandler = useCallback(
    async (taskId: string) => {
      try {
        await deleteTask.mutateAsync({ id: taskId });
      } catch (error) {
        console.warn(error);

        const message =
          error instanceof Error ? error.message : 'error connecting to server';

        showNotification({
          title: `Cannot delete the task: ${taskId}`,
          message,
          autoClose: 3000,
          color: 'red',
        });
      }
    },
    [deleteTask],
  );

  return (
    <>
      <Stack>
        <Stack spacing="sm">
          {!!tasks &&
            tasks.map((task) => (
              <TaskListItem
                key={task.id}
                taskListId={taskListId}
                task={task}
                deleteHandler={deleteHandler}
                completeHandler={completeHandler}
                isCreating={createTask.isLoading}
                usePrefetchTask={usePrefetchTask}
              />
            ))}
        </Stack>

        <form onSubmit={form.onSubmit((values) => submitHandler(values))}>
          <Grid grow gutter="sm">
            <Grid.Col span={9}>
              <TextInput
                required
                {...form.getInputProps('title')}
                placeholder="タスクを登録"
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <Button
                type="submit"
                fullWidth
                leftIcon={<SquarePlus />}
                loading={createTask.isLoading}
              >
                Add task
              </Button>
            </Grid.Col>
          </Grid>
        </form>
      </Stack>
    </>
  );
};
