import { List, Loader, Title } from '@mantine/core';
import { useParams } from 'react-router-dom';
import invariant from 'tiny-invariant';

import { useApi } from '../../hooks/useApi';
import { tasksRepository } from '../../repositories/tasksRepository';

export const TaskList = () => {
  const { taskListId } = useParams();
  invariant(taskListId, 'taskListId is required');

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
    </div>
  );
};
