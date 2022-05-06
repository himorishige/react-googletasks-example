import { NotificationsProvider } from '@mantine/notifications';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter } from 'react-router-dom';

import { App } from './App';
import { queryClient } from './libs/queryClient';
import { AuthGuard } from './providers/AuthGuard';

const ErrorFallback = () => {
  return (
    <div>
      <h2>Ooops, something went wrong :( </h2>
      <button
        onClick={(): void => window.location.assign(window.location.origin)}
      >
        Refresh
      </button>
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AuthGuard>
        <NotificationsProvider limit={5}>
          <BrowserRouter>
            <QueryClientProvider client={queryClient}>
              <App />
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
          </BrowserRouter>
        </NotificationsProvider>
      </AuthGuard>
    </ErrorBoundary>
  </React.StrictMode>,
);
