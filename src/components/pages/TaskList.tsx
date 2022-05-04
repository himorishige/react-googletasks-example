import { Button, List, Loader, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useQueryClient } from 'react-query';
import { Link, useParams } from 'react-router-dom';
import invariant from 'tiny-invariant';

import { useMutateWrapper } from '../../hooks/useApi';
import { useTasksApi } from '../../hooks/useTasks';
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

  const createTask = useMutateWrapper<Partial<Task>, Task[]>(
    async (params, token) =>
      tasksRepository.createTask({ ...params, taskListId }, token),
    {
      onMutate: async (params) => {
        await queryClient.cancelQueries(['tasks', { taskListId }]);

        const previousTasks = queryClient.getQueryData<Task[]>([
          'tasks',
          { taskListId },
        ]);

        if (previousTasks) {
          queryClient.setQueryData<Partial<Task>[]>(
            ['tasks', { taskListId }],
            [{ title: params.title }, ...previousTasks],
          );
        }

        return previousTasks;
      },
      onError: (error, _, context) => {
        if (context && context.length > 0) {
          queryClient.setQueryData<Task[]>(['tasks', { taskListId }], context);
        }
        console.log(error);
      },
      onSettled: () => {
        queryClient.invalidateQueries(['tasks', { taskListId }]);
      },
    },
  );

  type FormValues = typeof form.values;
  const submitHandler = (values: FormValues) => {
    createTask.mutate({ title: values.title });
  };

  const { useFetchTaskList } = useTasksApi();
  const { data: tasks, isLoading, isError } = useFetchTaskList(taskListId);

  if (isLoading) return <Loader />;
  if (isError) return <div>Error</div>;

  return (
    <div>
      <Title order={2}>TaskList {taskListId}</Title>

      <List>
        {tasks &&
          tasks.map((task) => (
            <List.Item key={task.id}>
              <Link to={`${task.id}`}>{task.title}</Link>
            </List.Item>
          ))}
      </List>

      <form onSubmit={form.onSubmit((values) => submitHandler(values))}>
        <TextInput required label="title" {...form.getInputProps('title')} />
        <Button type="submit">Add task</Button>
      </form>
    </div>
  );
};
