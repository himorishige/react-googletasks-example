import { Button, List, Loader, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import invariant from 'tiny-invariant';

import { useApi, useMutateWrapper } from '../../hooks/useApi';
import { tasksRepository } from '../../repositories/tasksRepository';

import type { Task } from '../../types/tasks';

export const TaskList = () => {
  const { taskListId } = useParams();
  invariant(taskListId, 'taskListId is required');

  const queryClient = useQueryClient();

  const form = useForm({
    initialValues: {
      title: '',
    },
    validate: {
      title: (value) => (value.length > 0 ? null : 'Title is required'),
    },
  });

  const { mutate } = useMutateWrapper<Partial<Task>, Task>(
    async (params, token) =>
      tasksRepository.createTask({ ...params, taskListId }, token),
  );

  type FormValues = typeof form.values;
  const submitHandler = (values: FormValues) => {
    mutate(
      { title: values.title },
      {
        onSuccess: () =>
          queryClient.invalidateQueries(['tasks', { taskListId }]),
        onSettled: () => form.reset(),
      },
    );
  };

  const {
    data: tasks,
    isLoading,
    isError,
  } = useApi(
    ['tasks', { taskListId }],
    async ({ taskListId }, token) =>
      tasksRepository.getTasks({ taskListId }, token),
    { enabled: !!taskListId },
  );

  if (isLoading) return <Loader />;
  if (isError) return <div>Error</div>;

  return (
    <div>
      <Title order={2}>TaskList {taskListId}</Title>

      <List>
        {tasks &&
          tasks.map((task) => (
            <List.Item key={task.id}>{task.title}</List.Item>
          ))}
      </List>

      <form onSubmit={form.onSubmit((values) => submitHandler(values))}>
        <TextInput required label="title" {...form.getInputProps('title')} />
        <Button type="submit">Add task</Button>
      </form>
    </div>
  );
};
