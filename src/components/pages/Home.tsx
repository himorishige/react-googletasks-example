import { List, Title, Loader } from '@mantine/core';
import { Link } from 'react-router-dom';

import { useApi } from '../../hooks/useApi';
import { tasksRepository } from '../../repositories/tasksRepository';

export const Home = () => {
  const {
    data: taskLists,
    isLoading,
    isError,
  } = useApi(['taskLists', { maxResults: 5 }], async ({ maxResults }, token) =>
    tasksRepository.getTaskLists({ maxResults }, token),
  );

  if (isLoading) return <Loader />;
  if (isError) return <div>Error</div>;

  return (
    <div>
      <Title order={2}>Home</Title>

      <List>
        {taskLists &&
          taskLists.map((taskList) => (
            <List.Item key={taskList.id}>
              <Link to={`lists/${taskList.id}/tasks`}>{taskList.title}</Link>
            </List.Item>
          ))}
      </List>
    </div>
  );
};
