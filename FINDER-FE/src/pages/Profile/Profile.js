import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import api from "../../services/api";
import styled from "styled-components";
import { TextField, Button, Container, Typography } from "@material-ui/core";
import { FaArrowLeft } from 'react-icons/fa';
import MapPicker from "../../components/MapPicker/MapPicker"; // MapPicker import
import Notification from "../../components/Notification/Notification";

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

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/users/get/profile", {
          headers: { Authorization: token },
        });
        setProfile(response.data);
      } catch (error) {
        console.error("Profile fetch error:", error);
      }
    };

    fetchProfile();
  }, [token]);

  if (!profile) return <div>Loading...</div>;

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
          Profile
        </Typography>
        <Formik
          initialValues={{
            name: profile.name || "",
            email: profile.email || "",
            bio: profile.bio || "",
            location: {
              coordinates: [
                profile.location.coordinates[0] || 0,
                profile.location.coordinates[1] || 0,
              ],
            },
          }}
          validationSchema={Yup.object({
            name: Yup.string().required("Required"),
            email: Yup.string()
              .email("Invalid email address")
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
              await api.put(
                "/users/profile",
                {
                  ...values,
                  location: {
                    type: "Point",
                    coordinates: values.location.coordinates,
                  },
                },
                { headers: { Authorization: `${token}` } }
              );
              navigate("/profile");
            } catch (error) {
              console.error("Profile update error:", error);
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

              <Field name="bio" component={CustomTextField} label="Bio" />
              <ErrorMessage name="bio" component="div" />

              <MapPicker
                setFieldValue={setFieldValue}
                initialPosition={[
                  profile.location.coordinates[0],
                  profile.location.coordinates[1],
                ]}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                Update Profile
              </Button>
            </StyledForm>
          )}
        </Formik>
      </Container>
    </>
  );
};

export default Profile;
