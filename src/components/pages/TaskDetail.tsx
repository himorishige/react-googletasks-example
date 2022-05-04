import { Loader, Text, Title } from '@mantine/core';
import { useParams } from 'react-router-dom';
import invariant from 'tiny-invariant';

import { useApi } from '../../hooks/useApi';
import { tasksRepository } from '../../repositories/tasksRepository';

export const TaskDetail = () => {
  const { taskListId, taskId } = useParams();
  invariant(taskListId, 'taskListId is required');
  invariant(taskId, 'taskId is required');

  const {
    data: task,
    isLoading,
    isError,
  } = useApi(
    ['task', { taskListId, taskId }],
    async (params, token) => tasksRepository.getTask(params, token),
    { enabled: !!taskId && !!taskListId },
  );

  if (isLoading) return <Loader />;
  if (isError) return <div>Error</div>;

  return (
    <div>
      <Title order={2}>TaskDetail {taskId}</Title>
      <Text>{task.title}</Text>
    </div>
  );
};
