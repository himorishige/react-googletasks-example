import { Container, Title, Header } from '@mantine/core';
import { Routes, Route } from 'react-router-dom';

import { Home } from './components/pages/Home';
import { TaskDetail } from './components/pages/TaskDetail';
import { TaskList } from './components/pages/TaskList';

export const App = () => {
  return (
    <>
      <Header height={60}>
        <Container>
          <Title order={1}>Google Tasks</Title>
        </Container>
      </Header>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="lists/:taskListId/tasks" element={<TaskList />} />
          <Route
            path="lists/:taskListId/tasks/:taskId"
            element={<TaskDetail />}
          />
        </Route>
      </Routes>
    </>
  );
};
