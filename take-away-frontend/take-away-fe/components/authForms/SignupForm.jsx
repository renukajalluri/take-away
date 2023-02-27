import classes from "../../styles/AuthForm.module.css";
import { useFormik } from "formik";
import logo from "../../public/logo1.svg";

import * as Yup from "yup";
import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";
import AuthContext from "../../stores/authContext";

const initialValues = {
  name: "",
  email: "",
  password: "",
};

const validationSchema = Yup.object({
  name: Yup.string().required("Required"),
  email: Yup.string().email("Invalid Email Format").required("Required"),
  password: Yup.string().required("Required"),
});
const SignupForm = () => {
  const token = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (token) {
      router.push("/profile");
    }
  });

  const onSubmit = async (values, actions) => {
    setLoading(true);
    const formData = {
      email: values.email,
      password: values.password,
    };
    try {
      const response = await axios.post(
        "https://take-away-backend.vercel.app/auth/signup",
        JSON.stringify(formData),
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      );
      setData(response?.data);
    } catch (error) {
      if (error.response?.status === 400) {
        setEmailErr("User already exists");
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    actions.resetForm();

    setLoading(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const sendOtp = async () => {
    const otpVerify = {
      email: data.email,
      otp: emailOtp,
    };

    try {
      setLoading(true);
      setOpen(true);
      const response = await axios.post(
        "https://take-away-backend.vercel.app/auth/verifyOtp",
        JSON.stringify(otpVerify),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      router.push("/login");
    } catch (error) {
      if (error.response?.status === 500) {
        setEmailErr("Something went wrong please try again ");
      } else if (error.response?.status === 401) {
        setEmailErr("Wrong Otp");
      } else {
        setSuccess("Successfully");
      }
    }
    setLoading(false);
  };

  const pushToLogin = () => {
    router.push("/login");
  };

  const formik = useFormik({
    initialValues,
    onSubmit,

    validationSchema,
  });

  return (
    <div className={classes.grid}>
      <div
        // style={{
        //   backgroundImg: `url(${logo.src})`,
        //   width: '100%',
        //   maxHeight: 'fit-content',
        //   height: '713px',
        // }}
        className={classes.logo}
      >
        <h1>Foodie Hunter</h1>
        <p>Delicious Food for you</p>
      </div>
      {data ? (
        <div className={classes.otp}>
          <input
            onChange={(e) => {
              setEmailOtp(e.target.value);
            }}
            type="text"
            placeholder="Enter Otp"
          />
          <button onClick={sendOtp}>Verify OTP</button>
          {emailErr ? (
            <Snackbar
              onClose={handleClose}
              autoHideDuration={2000}
              open={open}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <Alert severity="error">{emailErr}</Alert>
            </Snackbar>
          ) : (
            <Snackbar
              onClose={handleClose}
              autoHideDuration={2000}
              open={open}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <Alert severity="success">Verified</Alert>
            </Snackbar>
          )}
        </div>
      ) : (
        <div className={classes.form}>
          {emailErr ? (
            <Snackbar
              onClose={handleClose}
              autoHideDuration={2000}
              open={open}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <Alert severity="error">{emailErr}</Alert>
            </Snackbar>
          ) : (
            <Snackbar
              onClose={handleClose}
              autoHideDuration={2000}
              open={open}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <Alert severity="success">Successfull</Alert>
            </Snackbar>
          )}

          <h1>Sign Up</h1>
          <form onSubmit={formik.handleSubmit}>
            {/* name */}
            <div className={classes["form-control"]}>
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Full Name"
                onChange={formik.handleChange}
                value={formik.values.name}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name ? (
                <p className={classes.error}>{formik.errors.name}</p>
              ) : null}
            </div>

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
                onClick={() => setOpen(true)}
                onSubmit={onSubmit}
                disabled={!formik.isValid || formik.isSubmitting}
                className={classes.button}
                type="submit"
              >
                Create Account
              </button>
            </div>
          </form>

          <div className={classes.account}>
            <span className={classes.span}>
              Already Have An Account?{" "}
              <button onClick={pushToLogin} className={classes.login}>
                Login
              </button>{" "}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupForm;
