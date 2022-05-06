import { ActionIcon, Checkbox, Grid, Group, Paper, Text } from '@mantine/core';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { TrashX } from 'tabler-icons-react';

import type { Task } from '../../../types/tasks';
import type { FC } from 'react';

type Props = {
  taskListId: string;
  task: Pick<Task, 'id' | 'title' | 'status'>;
  deleteHandler: (taskId: string) => Promise<void>;
  completeHandler: (params: Task) => Promise<void>;
  isDeleting: boolean;
  isCreating: boolean;
  usePrefetchTask: (taskListId: string, taskId: string) => () => void;
};

export const TaskListItem: FC<Props> = ({
  taskListId,
  task,
  deleteHandler,
  completeHandler,
  isCreating,
  isDeleting,
  usePrefetchTask,
}) => {
  const prefetched = useRef<boolean>();
  const prefetchTask = usePrefetchTask(taskListId, task.id);

  return (
    <Paper
      shadow="xs"
      p="md"
      onMouseEnter={() => {
        if (!prefetched.current) {
          prefetchTask();
          prefetched.current = true;
        }
      }}
    >
      <Grid grow justify="space-between" align="center">
        <Grid.Col span={1}>
          <Checkbox
            defaultChecked={task.status === 'completed' ? true : false}
            onChange={() =>
              completeHandler({
                id: task.id,
                title: task.title,
                status:
                  task.status === 'completed' ? 'needsAction' : 'completed',
              })
            }
          />
        </Grid.Col>
        <Grid.Col span={10}>
          <Text variant="link" component={Link} to={`${task.id}`}>
            {task.title}
          </Text>
        </Grid.Col>
        <Grid.Col span={1}>
          <Group position="center">
            <ActionIcon
              title="delete"
              onClick={() => deleteHandler(task.id)}
              loading={isDeleting || isCreating}
              color="red"
              variant="light"
            >
              <TrashX />
            </ActionIcon>
          </Group>
        </Grid.Col>
      </Grid>
    </Paper>
  );
};
