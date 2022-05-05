import { Button, List, Loader, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { TrashX } from 'tabler-icons-react';
import invariant from 'tiny-invariant';

import { useTasksApi } from '../../hooks/useTasks';

import type { Task } from '../../types/tasks';
import type { FC } from 'react';

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

  const { useFetchTaskList, useAddTask, useDeleteTask, usePrefetchTask } =
    useTasksApi();

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
    <div>
      <Title order={2}>TaskList {taskListId}</Title>

      <List>
        {tasks &&
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              taskListId={taskListId}
              task={task}
              deleteHandler={deleteHandler}
              isDeleting={deleteTask.isLoading}
              isCreating={createTask.isLoading}
              usePrefetchTask={usePrefetchTask}
            />
          ))}
      </List>

      <form onSubmit={form.onSubmit((values) => submitHandler(values))}>
        <TextInput required label="title" {...form.getInputProps('title')} />
        <Button type="submit" disabled={createTask.isLoading}>
          Add task
        </Button>
      </form>
    </div>
  );
};

type TaskItemProps = {
  taskListId: string;
  task: Pick<Task, 'id' | 'title'>;
  deleteHandler: (taskId: string) => Promise<void>;
  isDeleting: boolean;
  isCreating: boolean;
  usePrefetchTask: (taskListId: string, taskId: string) => () => void;
};

const TaskItem: FC<TaskItemProps> = ({
  taskListId,
  task,
  deleteHandler,
  isCreating,
  isDeleting,
  usePrefetchTask,
}) => {
  const prefetchTask = usePrefetchTask(taskListId, task.id);

  const prefetchHandler = () => {
    prefetchTask();
  };

  return (
    <List.Item key={task.id}>
      <Link to={`${task.id}`}>{task.title}</Link>
      <Button
        compact
        onClick={() => deleteHandler(task.id)}
        disabled={isCreating || isDeleting}
      >
        <TrashX size={12} />
      </Button>
      <Button compact onClick={prefetchHandler}>
        Prefetch
      </Button>
    </List.Item>
  );
};
