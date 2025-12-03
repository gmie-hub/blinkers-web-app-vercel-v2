import { number, ref, string } from 'yup';


export const validator = {
  password: string()
    .required('Password is required')
    .max(20, 'Password must have a maximum length of 20 characters')
    .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}/, 'Password must have Upper case, Lower case and number '),
  confirmPassword: string()
    .required('confirm password is required')
    .oneOf([ref('password')], 'Passwords must match')
    .required('confirm password is required'),
  aboutBusiness: string().required('Business description is required'),
  businessName: string().required('Business name  is required'),
  category: string().required('Category is required'),
  businessAddress: string().required('Business address is required'),
  phoneNumber: number().required('Phone number is required'),
  email: string().email('Invalid email address').required('Email Address  is required'),
  faceBook: string().url('The Facebook URL must be valid'),
  instagram: string().url('The Instagram URL must be valid'),
  whatsapp: string().matches(
    /^https:\/\/wa\.me\/[0-9]{7,20}$/,
    'The WhatsApp URL must follow the format https://wa.me/ followed by a valid phone number',
  ),
  website: string().url('The website must be a valid URL').required('Website is required'),
  reason: string().required('Reason for rejection is required'),
  Message: string().required('Message is required'),

  otp: number()
    .required('OTP is required')
    .test('len', 'OTP must be exactly 6 digits', (val) => {
      if (val === undefined || val === null) return false; // Handle undefined or null case
      return String(val).length === 6;
    })
    .test('is-numeric', 'OTP must be exactly 6 numeric digits', (val) => {
      if (val === undefined || val === null) return false; // Handle undefined or null case
      return /^\d{6}$/.test(String(val));
    }),
};
