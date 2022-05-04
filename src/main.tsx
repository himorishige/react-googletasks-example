import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import App from './App';
import './index.css';
import { queryClient } from './libs/queryClient';
import { AuthGuard } from './providers/AuthGuard';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthGuard>
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AuthGuard>
  </React.StrictMode>,
);
