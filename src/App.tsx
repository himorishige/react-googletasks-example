import { Title } from '@mantine/core';
import { Routes, Route, Link } from 'react-router-dom';

import { Home } from './components/pages/Home';
import { TaskList } from './components/pages/TaskList';

function App() {
  return (
    <div className="App">
      <Title order={1}>
        <Link to="/">Tasks</Link>
      </Title>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="lists">
          <Route path=":taskListId/tasks" element={<TaskList />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
