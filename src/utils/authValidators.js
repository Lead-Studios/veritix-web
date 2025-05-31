import * as yup from "yup";

// Sign Up Schema
export const signUpSchema = yup.object().shape({
  firstName: yup.string().required("First name is required").min(2, "First name must be at least 2 characters"),

  lastName: yup.string().required("Last name is required").min(2, "Last name must be at least 2 characters"),

  userName: yup.string().required("Username is required").min(3, "Username must be at least 3 characters"),

  email: yup.string().required("Email is required").email("Please enter a valid email address"),

  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});

// Sign In Schema
export const signInSchema = yup.object().shape({
  email: yup.string().required("Email is required").email("Please enter a valid email address"),

  password: yup.string().required("Password is required").min(8, "Password must be at least 8 characters"),
});

// Contact Form Schema
export const contactFormSchema = yup.object().shape({
  name: yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),

  email: yup.string().required("Email is required").email("Please enter a valid email address"),

  subject: yup.string().required("Subject is required").min(2, "Subject must be at least 2 characters"),

  message: yup.string().required("Message is required").min(10, "Message must be at least 10 characters"),
});

// Forgot Password Schema
export const forgotPasswordSchema = yup.object().shape({
  email: yup.string().required("Email is required").email("Please enter a valid email address"),
});
// Reset Password Schema
export const resetPasswordSchema = yup.object().shape({
  new_password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  confirm_password: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("new_password"), null], "Passwords must match"),
});
