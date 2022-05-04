import { useMutation, useQuery } from 'react-query';

import { useAuthGuardContext } from '../providers/AuthGuard';

import type {
  UseQueryOptions,
  UseMutationResult,
  UseMutationOptions,
} from 'react-query';

export const useApi = <
  TQueryKey extends [string, Record<string, unknown>?],
  TQueryFnData,
  TError,
  TData = TQueryFnData,
>(
  queryKey: TQueryKey,
  fetcher: (params: TQueryKey[1], token: string) => Promise<TQueryFnData>,
  options?: Omit<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    'queryKey' | 'queryFn'
  >,
) => {
  const { accessToken } = useAuthGuardContext();

  return useQuery({
    queryKey,
    queryFn: async () => {
      return fetcher(queryKey[1], accessToken || '');
    },
    ...options,
  });
};

export const useMutateWrapper = <T>(
  fetcher: (params: T, token: string) => Promise<T>,
  options?: UseMutationOptions<void, unknown, T, unknown>,
): UseMutationResult<void, unknown, T, unknown> => {
  const { accessToken } = useAuthGuardContext();

  return useMutation(async (params: T) => {
    await fetcher(params, accessToken || '');
  }, options);
};
