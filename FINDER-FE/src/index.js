import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import socket from './services/socket'; // socket import


const root = ReactDOM.createRoot(document.getElementById('root'));


const RootComponent = () => {
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (token) {
      if (user) {
        console.log("INDEX USERID : ", user._id);
        socket.emit('register', user._id);
      }
    }
  }, []);

  return <App />;
};

root.render(
  <React.StrictMode>
    <RootComponent />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
