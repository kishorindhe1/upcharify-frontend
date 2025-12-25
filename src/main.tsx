import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { NuqsAdapter } from 'nuqs/adapters/react-router/v6'; // or /v7
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NuqsAdapter>
    <App />
    </NuqsAdapter>
  </React.StrictMode>
);
