import { useMutation, useQuery } from 'react-query';

import { useAuthGuardContext } from '../providers/AuthGuard';

import type { UseQueryOptions, UseMutationOptions } from 'react-query';

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

export const useMutateWrapper = <TVariables, TData>(
  fetcher: (params: TVariables, token: string) => Promise<TData>,
  options?: UseMutationOptions<TData, unknown, TVariables, unknown>,
) => {
  const { accessToken } = useAuthGuardContext();

  return useMutation(async (params: TVariables) => {
    await fetcher(params, accessToken || ''),
      {
        ...options,
      };
  });
};
