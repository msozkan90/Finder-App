import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import api from "../../services/api";
import styled from "styled-components";
import { TextField, Button, Container, Typography } from "@material-ui/core";
import { FaArrowLeft } from "react-icons/fa";
import MapPicker from "../../components/MapPicker/MapPicker";

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

const Register = () => {
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
          Register
        </Typography>
        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            avatarImages: [""],
            bio: "",
            location: { type: "Point", coordinates: [0, 0] },
          }}
          validationSchema={Yup.object({
            name: Yup.string().required("Required"),
            email: Yup.string()
              .email("Invalid email address")
              .required("Required"),
            password: Yup.string().required("Required"),
            avatarImages: Yup.array()
              .of(Yup.string().url("Must be a valid URL").required("Required"))
              .required("Required"),
            bio: Yup.string().required("Required"),
            location: Yup.object().shape({
              coordinates: Yup.array()
                .of(Yup.number().required("Required"))
                .required("Required"),
            }),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const response = await api.post("/users/register", values);
              navigate("/login");
            } catch (error) {
              console.error("Register error:", error);
            }
            setSubmitting(false);
          }}
        >
          {({ handleSubmit, isSubmitting, setFieldValue }) => (
            <StyledForm onSubmit={handleSubmit}>
              <Field name="name" component={CustomTextField} label="Name" />
              <ErrorMessage name="name" component="div" />

              <Field name="email" component={CustomTextField} label="Email" />
              <ErrorMessage name="email" component="div" />

              <Field
                name="password"
                component={CustomTextField}
                label="Password"
                type="password"
              />
              <ErrorMessage name="password" component="div" />

              <Field
                name="avatarImages[0]"
                component={CustomTextField}
                label="Avatar Image URL"
              />
              <ErrorMessage name="avatarImages[0]" component="div" />

              <Field name="bio" component={CustomTextField} label="Bio" />
              <ErrorMessage name="bio" component="div" />

              <MapPicker setFieldValue={setFieldValue} initialPosition={[39.91558235822735, 32.840331997722394]} />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                Register
              </Button>
            </StyledForm>
          )}
        </Formik>
      </Container>
    </>
  );
};

export default Register;
