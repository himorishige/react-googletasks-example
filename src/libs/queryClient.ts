import { QueryClient } from 'react-query';

export function generateQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {},
      mutations: {},
    },
  });
}

export const queryClient = generateQueryClient();
