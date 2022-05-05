import { Button, Grid, Loader, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
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

  const { data: tasks, isLoading, isError } = useFetchTaskList(taskListId);

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
    } catch (e) {
      console.warn(e);
    }
  };

  const updateTask = useUpdateTask(taskListId);

  const completeHandler = useCallback(
    async (taskId: string, params: Partial<Task>) => {
      try {
        await updateTask.mutateAsync({ taskId, ...params });
      } catch (e) {
        console.warn(e);
      }
    },
    [updateTask],
  );

  const deleteTask = useDeleteTask(taskListId);

  const deleteHandler = useCallback(
    async (taskId: string) => {
      try {
        await deleteTask.mutateAsync({ taskId });
      } catch (e) {
        console.warn(e);
      }
    },
    [deleteTask],
  );

  if (isLoading) return <Loader />;
  if (isError) return <div>Error</div>;

  return (
    <>
      <Stack>
        <Stack spacing="sm">
          {tasks &&
            tasks.map((task) => (
              <TaskListItem
                key={task.id}
                taskListId={taskListId}
                task={task}
                deleteHandler={deleteHandler}
                completeHandler={completeHandler}
                isDeleting={deleteTask.isLoading}
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
