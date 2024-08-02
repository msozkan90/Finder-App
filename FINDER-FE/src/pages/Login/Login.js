import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import api from "../../services/api";
import styled from "styled-components";
import { FaArrowLeft } from 'react-icons/fa';
import { TextField, Button, Container, Typography } from "@material-ui/core";
import socket from "../../services/socket";

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

const Login = () => {
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
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email("Invalid email address")
            .required("Required"),
          password: Yup.string().required("Required"),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const response = await api.post("/users/login", values);
            localStorage.setItem("token", response.data.token);
            const user =  response.data.user
            localStorage.setItem("user", JSON.stringify(user));

            if (user) {
              console.log("INDEX USERID : ", user._id);
              socket.emit("register", user._id);
            }
            navigate("/profile");
          } catch (error) {
            console.error("Login error:", error);
          }
          setSubmitting(false);
        }}
      >
        {({ handleSubmit, isSubmitting }) => (
          <StyledForm onSubmit={handleSubmit}>
            <Field name="email" component={CustomTextField} label="Email" />
            <ErrorMessage name="email" component="div" />

            <Field
              name="password"
              component={CustomTextField}
              label="Password"
              type="password"
            />
            <ErrorMessage name="password" component="div" />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
            >
              Login
            </Button>
          </StyledForm>
        )}
      </Formik>
    </Container>
    </>
  );
};

export default Login;
