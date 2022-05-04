import './App.css';
import { useApi } from './hooks/useApi';
import { tasksRepository } from './repositories/tasksRepository';

function App() {
  const { data: tasks } = useApi(
    ['taskLists', { maxResults: 5 }],
    async ({ maxResults }, token) =>
      tasksRepository.getTaskLists({ maxResults }, token),
  );
  console.log(tasks);

  return <div className="App">login</div>;
}

export default App;
