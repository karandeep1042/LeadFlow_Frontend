import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { logout } from './redux/slices/authSlice';
import { setOnUnauthorizedCallback } from './services/api/axiosInstance';
import './index.css';
import App from './App.jsx';

// Wire up unauthorized session eviction without hard window reload
setOnUnauthorizedCallback(() => {
  store.dispatch(logout());
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);


