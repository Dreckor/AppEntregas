import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';
import { ConfigProvider } from 'antd'; 


if (process.env.NODE_ENV === 'production') disableReactDevTools();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#19bf66', 
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
