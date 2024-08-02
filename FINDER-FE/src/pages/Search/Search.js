import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import api from "../../services/api";
import LikeButton from "../../components/LikeButton/LikeButton";
import styled from "styled-components";
import {
  TextField,
  Button,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Notification from "../../components/Notification/Notification";

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StyledField = styled(Field)`
  width: 100%;
`;

const CustomTextField = ({ field, form, ...props }) => {
  return (
    <TextField
      {...field}
      {...props}
      variant="outlined"
      fullWidth
      error={Boolean(form.errors[field.name] && form.touched[field.name])}
      helperText={
        form.errors[field.name] && form.touched[field.name]
          ? form.errors[field.name]
          : ""
      }
    />
  );
};

const Search = () => {
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
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
          Search Users
        </Typography>
        <Formik
          initialValues={{ query: "" }}
          validationSchema={Yup.object({
            query: Yup.string().required("Required"),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const token = localStorage.getItem("token");
              const response = await api.post(
                "/users/search",
                { query: values.query },
                { headers: { Authorization: `${token}` } }
              );
              setResults(response.data);
            } catch (error) {
              console.error("Search error:", error);
            }
            setSubmitting(false);
          }}
        >
          {({ handleSubmit, isSubmitting }) => (
            <StyledForm onSubmit={handleSubmit}>
              <StyledField
                name="query"
                type="text"
                component={CustomTextField}
                label="Search"
                variant="outlined"
                fullWidth
              />
              <ErrorMessage name="query" component="div" />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                Search
              </Button>
            </StyledForm>
          )}
        </Formik>
        <List>
          {results.map((user) => (
            <ListItem key={user._id}>
              <ListItemText primary={user.name} secondary={user.bio} />
              <LikeButton likedUserId={user._id} />
            </ListItem>
          ))}
        </List>
      </Container>
    </>
  );
};

export default Search;
