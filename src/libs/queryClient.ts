import { QueryClient } from 'react-query';

export function generateQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 300000,
        cacheTime: 300000,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
      },
      mutations: {},
    },
  });
}

export const queryClient = generateQueryClient();
