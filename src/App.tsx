import { Container, Title, Header, Loader } from '@mantine/core';
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import { Home } from './components/pages/Home';

const TaskList = lazy(() =>
  import('./components/pages/TaskList').then((module) => ({
    default: module.TaskList,
  })),
);

const TaskDetail = lazy(() =>
  import('./components/pages/TaskDetail').then((module) => ({
    default: module.TaskDetail,
  })),
);

export const App = () => {
  return (
    <>
      <Header height={60}>
        <Container>
          <Title order={1}>Google Tasks</Title>
        </Container>
      </Header>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense
              fallback={
                <Container p={16}>
                  <Loader />
                </Container>
              }
            >
              <Home />
            </Suspense>
          }
        >
          <Route
            path="lists/:taskListId/tasks"
            element={
              <Suspense fallback={<Loader />}>
                <TaskList />
              </Suspense>
            }
          />
          <Route
            path="lists/:taskListId/tasks/:taskId"
            element={
              <Suspense fallback={<Loader />}>
                <TaskDetail />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </>
  );
};
