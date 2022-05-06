import { showNotification } from '@mantine/notifications';
import { QueryClient } from 'react-query';

function queryErrorHandler(error: unknown): void {
  // error is type unknown because in js, anything can be an error (e.g. throw(5))
  const id = 'react-query-error';
  const title =
    error instanceof Error ? error.message : 'error connecting to server';

  console.warn(id, title);

  // some toast message
  showNotification({
    id,
    title: id,
    message: title,
    autoClose: 3000,
    color: 'red',
  });
}

export function generateQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        onError: queryErrorHandler,
        retry: false,
        staleTime: 300000,
        cacheTime: 300000,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
      },
      mutations: {
        onError: queryErrorHandler,
      },
    },
  });
}

export const queryClient = generateQueryClient();
