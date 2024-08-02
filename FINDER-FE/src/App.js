import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Profile from './pages/Profile/Profile';
import Search from './pages/Search/Search';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { CssBaseline } from '@material-ui/core';
import Feed from './pages/Feed/Feed';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;
  }
`;

const theme = {
  colors: {
    primary: '#6200ea',
    secondary: '#03dac6',
    background: '#f5f5f5',
    text: '#333',
  },
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<Search />} />
          <Route path="/feed" element={<Feed />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
