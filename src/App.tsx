import './App.css';
import { useApi } from './hooks/useApi';
import { tasksRepository } from './repositories/tasksRepository';

function App() {
  const { data: tasks } = useApi(
    ['taskLists', { maxResult: 5 }],
    async (params, token) =>
      tasksRepository.getTaskLists({ maxResults: params.maxResult }, token),
  );
  console.log(tasks);

  return <div className="App">login</div>;
}

export default App;
