import classes from "../../styles/AuthForm.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";
import AuthContext from "../../stores/authContext";

const initialValues = {
  email: "",
  password: "",
};

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid Email Format").required("Required"),
  password: Yup.string().required("Required"),
});
const LoginForm = () => {
  const token = useContext(AuthContext);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [userError, setUserError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (token) {
      router.push("/restaurant");
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async (values, actions) => {
    const formData = {
      email: values.email,
      password: values.password,
    };
    try {
      setLoading(true);
      const response = await axios.post(
        "https://take-away-backend.vercel.app/auth/customer/login",
        JSON.stringify(formData),
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      );
      window.localStorage.setItem(
        "userToken",
        `bearer ${response?.data.accessToken}`
      );

      router.push("/restaurant");
    } catch (error) {
      if (error.response?.status == 401) {
        setSuccess("");
        setUserError("Please check email and password");
      } else if (error.response?.status == 400) {
        setSuccess("");
        setUserError("User is not verified");
      } else if (error.response?.status == 500) {
        setSuccess("");
        setUserError("Something went wrong");
      } else {
        setUserError("");
        setSuccess("Logged In");
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));
    actions.resetForm();
  };

  const formik = useFormik({
    initialValues,
    onSubmit,

    validationSchema,
  });

  const pushToSignup = () => {
    router.push("/");
  };
  return (
    <div className={classes.grid}>
      <div className={classes.logo}>
        <h1>Foodie Hunter</h1>
        <p>Delicious Food for you</p>
      </div>

      <div className={classes.form}>
        <h1>Log In</h1>
        <form onSubmit={formik.handleSubmit}>
          {/* email */}
          <div className={classes["form-control"]}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              onChange={formik.handleChange}
              value={formik.values.email}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email ? (
              <p className={classes.error}>{formik.errors.email}</p>
            ) : null}
          </div>

          {/* password */}
          <div className={classes["form-control"]}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              onChange={formik.handleChange}
              value={formik.values.password}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password ? (
              <p className={classes.error}>{formik.errors.password}</p>
            ) : null}
          </div>
          <div className={classes.ca}>
            <button
              disabled={!formik.isValid || formik.isSubmitting}
              onClick={() => setOpen(true)}
              className={classes.button}
              type="submit"
            >
              Login
            </button>
          </div>
        </form>
        {userError ? (
          <Snackbar
            autoHideDuration={2000}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <Alert severity="error">{userError}</Alert>
          </Snackbar>
        ) : (
          <Snackbar
            autoHideDuration={2000}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <Alert severity="success">Logged In Successfully</Alert>
          </Snackbar>
        )}
        <div className={classes.account}>
          <span className={classes.span}>
            Not have an account?{" "}
            <button className={classes.login} onClick={pushToSignup}>
              Create Account
            </button>{" "}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
