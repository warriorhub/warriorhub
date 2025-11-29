import * as Yup from 'yup';

export const AddStuffSchema = Yup.object({
  name: Yup.string().required(),
  quantity: Yup.number().positive().required(),
  condition: Yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  owner: Yup.string().required(),
});

export const EditStuffSchema = Yup.object({
  id: Yup.number().required(),
  name: Yup.string().required(),
  quantity: Yup.number().positive().required(),
  condition: Yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  owner: Yup.string().required(),
});

// Allows admins to edit User roles
export const EditUserSchema = Yup.object({
  id: Yup.number().required(),
  email: Yup.string().email().required('Email is required'),
  role: Yup.string().oneOf(['USER', 'ORGANIZER', 'ADMIN']).required('Role is required'),
});

// Validation for @hawaii.edu sign-in
export const SignUpSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required')
    .test(
      'is-hawaii-edu',
      'Email must end with @hawaii.edu',
      (value) => value?.endsWith('@hawaii.edu') ?? false,
    ),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});
