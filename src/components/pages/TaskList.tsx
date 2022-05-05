import { Button, List, Loader, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Link, useParams } from 'react-router-dom';
import { TrashX } from 'tabler-icons-react';
import invariant from 'tiny-invariant';

import { useTasksApi } from '../../hooks/useTasks';

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

  const { useFetchTaskList, useAddTask, useDeleteTask } = useTasksApi();

  const { data: tasks, isLoading, isError } = useFetchTaskList(taskListId);

  const createTask = useAddTask(taskListId);

  const submitHandler = async (values: FormValues) => {
    try {
      await createTask.mutateAsync({
        id: Math.random().toString(),
        title: values.title,
      });
    } catch (e) {
      console.warn(e);
    }
  };

  const deleteTask = useDeleteTask(taskListId);

  const deleteHandler = async (taskId: string) => {
    try {
      await deleteTask.mutateAsync({ taskId });
    } catch (e) {
      console.warn(e);
    }
  };

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
              <Button compact onClick={() => deleteHandler(task.id)}>
                <TrashX size={12} />
              </Button>
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
