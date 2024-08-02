import * as Yup from 'yup';

export const LoginSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Required'),
  password: Yup.string().required('Required')
});

export const RegisterSchema = Yup.object({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email address').required('Required'),
  password: Yup.string().required('Required'),
  bio: Yup.string().required('Required'),
  latitude: Yup.number().required('Required'),
  longitude: Yup.number().required('Required')
});

export const ProfileSchema = Yup.object({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email address').required('Required'),
  bio: Yup.string().required('Required'),
  latitude: Yup.number().required('Required'),
  longitude: Yup.number().required('Required')
});
