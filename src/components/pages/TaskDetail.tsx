import { Divider, Paper, Text, Title } from '@mantine/core';
import { useParams } from 'react-router-dom';
import invariant from 'tiny-invariant';

import { useTasksApi } from '../../hooks/useTasks';

export const TaskDetail = () => {
  const { taskListId, taskId } = useParams();
  invariant(taskListId, 'taskListId is required');
  invariant(taskId, 'taskId is required');

  const { useFetchTask } = useTasksApi();
  const { data: task } = useFetchTask(taskListId, taskId);

  return (
    <Paper>
      <Title order={2} pb={8}>
        {task?.title}
      </Title>
      <Divider py={8} />
      <Text>状態：{task?.status}</Text>
      {task?.updated && (
        <Text>更新日：{new Date(task.updated).toLocaleString()}</Text>
      )}
    </Paper>
  );
};
