import { useApi } from '../../hooks/useApi';
import { tasksRepository } from '../../repositories/tasksRepository';

export const Home = () => {
  const { data: tasks } = useApi(
    ['taskLists', { maxResults: 5 }],
    async ({ maxResults }, token) =>
      tasksRepository.getTaskLists({ maxResults }, token),
  );
  console.log(tasks);
  return <div>Home</div>;
};
