import { Loader, Container, Button, Group, Stack, Box } from '@mantine/core';
import { Link, Outlet, useParams } from 'react-router-dom';

import { useTasksApi } from '../../hooks/useTasks';

export const Home = () => {
  const { taskListId } = useParams();

  const { useFetchTaskLists } = useTasksApi();

  const { data: taskLists, isLoading, isError } = useFetchTaskLists();

  if (isLoading) return <Loader />;
  if (isError) return <div>Error</div>;

  return (
    <Container p={16}>
      <Stack>
        <Group direction="row">
          {taskLists &&
            taskLists.map((taskList) => (
              <Button
                key={taskList.id}
                component={Link}
                to={`lists/${taskList.id}/tasks`}
                variant={taskList.id === taskListId ? 'filled' : 'light'}
              >
                {taskList.title}
              </Button>
            ))}
        </Group>

        <Box>
          <Outlet />
        </Box>
      </Stack>
    </Container>
  );
};
