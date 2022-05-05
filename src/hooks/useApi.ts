import { useMutation, useQuery, useQueryClient } from 'react-query';

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

export const useOptimisticMutation = <TVariables, TData, TContext>(
  queryKey: [string, Record<string, unknown>?],
  fetcher: (params: TVariables, token: string) => Promise<TData | void>,
  updater?: ((oldData: TContext, newData: TData) => TContext) | undefined,
  options?: Omit<
    UseMutationOptions<
      TData | void,
      unknown,
      TVariables | TData | TContext,
      unknown
    >,
    'onMutate' | 'onError' | 'onSettled'
  >,
) => {
  const { accessToken } = useAuthGuardContext();

  const queryClient = useQueryClient();

  return useMutation(
    async (params) => {
      return await fetcher(params as TVariables, accessToken || '');
    },
    {
      onMutate: async (data) => {
        await queryClient.cancelQueries(queryKey);

        const previousData = queryClient.getQueryData<TContext>(queryKey);

        queryClient.setQueryData<TContext>(queryKey, (oldData) => {
          return updater && oldData
            ? updater(oldData, data as TData)
            : (data as TContext);
        });

        return previousData;
      },
      onError: (err, _, context) => {
        queryClient.setQueryData(queryKey, context);
        console.warn(err);
      },
      onSettled: () => {
        queryClient.invalidateQueries(queryKey);
      },
      ...options,
    },
  );
};

export const useGenericMutation = <TVariables, TData, TContext>(
  fetcher: (params: TVariables, token: string) => Promise<TData>,
  options?: UseMutationOptions<TData, unknown, TVariables, TContext>,
) => {
  const { accessToken } = useAuthGuardContext();

  return useMutation(
    async (params: TVariables) => {
      return await fetcher(params, accessToken || '');
    },
    { ...options },
  );
};
