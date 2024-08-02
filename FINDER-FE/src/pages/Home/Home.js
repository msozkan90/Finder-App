import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Notification from "../../components/Notification/Notification";
import styled from "styled-components";
import { Button } from "@material-ui/core";
import api from "../../services/api";

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: ${(props) => props.theme.colors.background};
`;

const Title = styled.h1`
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 2rem;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1rem;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const Home = () => {
  const [loginStatus, setLoginStatus] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const fetchProfile = async () => {
        try {
          const response = await api.get("/users/get/profile", {
            headers: { Authorization: token },
          });
          setLoginStatus(true);
        } catch (error) {
          console.error("Profile fetch error:", error);
          setLoginStatus(false);
        }
      };

      fetchProfile();
    }
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLoginStatus(false);
  };

  return (
    <HomeContainer>
      <Title>Welcome to the User App</Title>
      <Notification />
      <Nav>
        {loginStatus ? (
          <>
            <StyledLink to="/profile">
              <Button variant="contained" color="primary">
                Profile
              </Button>
            </StyledLink>
            <StyledLink to="/search">
              <Button variant="contained" color="secondary">
                Search
              </Button>
            </StyledLink>
            <StyledLink to="/feed">
              <Button variant="contained" color="primary">
                Feed
              </Button>
            </StyledLink>
            <Button variant="contained" color="secondary" onClick={() => handleLogout()}>
                Logout
              </Button>
          </>
        ) : (
          <>
            <StyledLink to="/login">
              <Button variant="contained" color="primary">
                Login
              </Button>
            </StyledLink>
            <StyledLink to="/register">
              <Button variant="contained" color="secondary">
                Register
              </Button>
            </StyledLink>
          </>
        )}
      </Nav>
    </HomeContainer>
  );
};

export default Home;
