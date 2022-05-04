import { Loader, Text, Title } from '@mantine/core';
import { useParams } from 'react-router-dom';
import invariant from 'tiny-invariant';

import { useTasksApi } from '../../hooks/useTasks';

export const TaskDetail = () => {
  const { taskListId, taskId } = useParams();
  invariant(taskListId, 'taskListId is required');
  invariant(taskId, 'taskId is required');

  const { useFetchTasks } = useTasksApi();
  const { data: task, isLoading, isError } = useFetchTasks(taskListId, taskId);

  if (isLoading) return <Loader />;
  if (isError) return <div>Error</div>;

  return (
    <div>
      <Title order={2}>TaskDetail {taskId}</Title>
      <Text>{task.title}</Text>
    </div>
  );
};
