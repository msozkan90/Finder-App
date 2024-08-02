import React, { useState, useEffect } from "react";
import api from "../../services/api";
import {
  Container,
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
} from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Notification from "../../components/Notification/Notification";

const token = localStorage.getItem("token");

const Feed = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // current page state
  const [totalPages, setTotalPages] = useState(1); // total pages state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNearbyUsers = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        const response = await api.post(
          "users/nearby",
          {
            coordinates: user.location.coordinates,
            maxDistance: 300000,
            page: page, // add page to the request payload
            limit: 10, // number of users per page
          },
          { headers: { Authorization: `${token}` } }
        );
        setUsers(response.data.users); // assuming response.data.users is the array of users
        setTotalPages(response.data.totalPages); // assuming response.data.totalPages is the total number of pages
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyUsers();
  }, [page]); // re-fetch users when page changes

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error}</Typography>;

  return (
    <>
      <div style={{ margin: 15 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
          startIcon={<FaArrowLeft sx={{ color: "white" }} />}
        >
          Back To Home
        </Button>
      </div>
      <Notification />
      <Container maxWidth="sm">
        <Typography variant="h4" component="h1" gutterBottom>
          Nearby Users
        </Typography>
        {users.map((user) => (
          <Card key={user._id} style={{ marginBottom: "1rem" }}>
            <CardContent>
              <Typography variant="h5">{user.name}</Typography>
              <Typography variant="body2">{user.bio}</Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleLike(user._id)}
              >
                Like
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleDislike(user._id)}
              >
                Dislike
              </Button>
            </CardActions>
          </Card>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
          <Button
            variant="contained"
            color="primary"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <Typography variant="body1">
            Page {page} of {totalPages}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </Container>
    </>
  );
};

const handleLike = (userId) => {
  api
    .post(
      "/users/like",
      { likedUserId: userId },
      { headers: { Authorization: `${token}` } }
    )
    .then((response) => console.log(response.data))
    .catch((error) => console.error("Error liking user:", error));
};

const handleDislike = (userId) => {
  api
    .post(
      "/users/dislike",
      { dislikedUserId: userId },
      { headers: { Authorization: `${token}` } }
    )
    .then((response) => console.log(response.data))
    .catch((error) => console.error("Error disliking user:", error));
};

export default Feed;
