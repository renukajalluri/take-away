import classes from "../../styles/AuthForm.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";
import AuthContext from "../../stores/authContext";
import * as React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { green } from "@mui/material/colors";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "45%",
  left: "65%",
  transform: "translate(-50%, -50%)",
  width: 400,
  borderRadius: "20px",
  bgcolor: "background.paper",
  boxShadow: 23,
  p: 4,
};

const initialValues = {
  name: "",
  email: "",
  password: "",
  phone: "",
  street: "",
  door: "",
  postCode: "",
  city: "",
  // address:""
};

const validationSchema = Yup.object({
  name: Yup.string().required("Required"),
  email: Yup.string().email("Invalid Email Format").required("Required"),
  password: Yup.string().required("Required"),
  password: Yup.string().required("Required"),
  phone: Yup.string().required("Required"),
  street: Yup.string().required("Required"),
  door: Yup.string().required("Required"),
  postCode: Yup.string().required("Required"),
  city: Yup.string().required("Required"),
});
const SignupForm = () => {
  const token = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [verified, setVerified] = useState("");
  const [success, setSuccess] = React.useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (token) {
      router.push("/restaurant");
    }
  }, []);

  const timer = React.useRef();

  const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      "&:hover": {
        bgcolor: green[700],
      },
    }),
  };
  const handleButtonClick = () => {
    setOpen(true);
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      timer.current = window.setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 2000);
    }
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => setModalOpen(false);
  const onSubmit = async (values, actions) => {
    // setLoading(true)
    const formData = {
      name: values.name,
      email: values.email,
      address: {
        phone: values.phone,
        street: values.street,
        doorNum: values.door,
        postCode: values.postCode,
        city: values.city,
      },
      password: values.password,
    };
    try {
      const response = await axios.post(
        "https://take-away-backend.vercel.app/auth/customer/signUp",
        JSON.stringify(formData),
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      );
      setData(response?.data);
      setModalOpen(false);
    } catch (error) {
      if (error.response?.status === 404) {
        setEmailErr("User already exists");
      } else if (error.response?.status === 500) {
        setEmailErr("Something Went wrong");
      } else {
        setSuccess("Successfull");
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
        "https://take-away-backend.vercel.app/auth/customer/verifyOtp",
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
        setVerified("Successfully");
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
      <div className={classes.logo}>
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

            {/* address */}
            <div className={classes["form-control"]}>
              {/* <label htmlFor='address'>Add Address</label> */}
              <button type="button" onClick={handleModalOpen}>
                Add Address
              </button>
            </div>

            <Modal
              open={modalOpen}
              onClose={handleModalClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <form onSubmit={formik.handleSubmit}>
                  <div className={classes["form-control"]}>
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      placeholder="Phone Number"
                      onChange={formik.handleChange}
                      value={formik.values.phone}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.phone && formik.errors.phone ? (
                      <p className={classes.error}>{formik.errors.phone}</p>
                    ) : null}
                  </div>

                  <div className={classes["form-control"]}>
                    <label htmlFor="street">Street Name</label>
                    <input
                      type="text"
                      name="street"
                      id="street"
                      placeholder="Street Name"
                      onChange={formik.handleChange}
                      value={formik.values.street}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.street && formik.errors.street ? (
                      <p className={classes.error}>{formik.errors.street}</p>
                    ) : null}
                  </div>

                  <div className={classes["form-control"]}>
                    <label htmlFor="door">Door Number</label>
                    <input
                      type="text"
                      name="door"
                      id="door"
                      placeholder="Door Number"
                      onChange={formik.handleChange}
                      value={formik.values.door}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.door && formik.errors.door ? (
                      <p className={classes.error}>{formik.errors.door}</p>
                    ) : null}
                  </div>

                  <div className={classes["form-control"]}>
                    <label htmlFor="postCode">Post Code</label>
                    <input
                      type="text"
                      name="postCode"
                      id="postCode"
                      placeholder="Post Code"
                      onChange={formik.handleChange}
                      value={formik.values.postCode}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.postCode && formik.errors.postCode ? (
                      <p className={classes.error}>{formik.errors.postCode}</p>
                    ) : null}
                  </div>

                  <div className={classes["form-control"]}>
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      name="city"
                      id="city"
                      placeholder="City"
                      onChange={formik.handleChange}
                      value={formik.values.city}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.city && formik.errors.city ? (
                      <p className={classes.error}>{formik.errors.city}</p>
                    ) : null}
                  </div>

                  <div className={classes["modal-save"]}>
                    <button
                      type="submit"
                      disabled={!formik.isValid || formik.isSubmitting}
                      onClick={handleModalOpen}
                      onSubmit={onSubmit}
                    >
                      Save
                    </button>
                  </div>
                </form>
              </Box>
            </Modal>

            <div className={classes.ca}>
              <button
                onClick={handleButtonClick}
                onSubmit={onSubmit}
                disabled={!formik.isValid || formik.isSubmitting}
                className={classes.button}
                type="submit"
              >
                Create Account
              </button>
              {loading && (
                <CircularProgress
                  size={24}
                  sx={{
                    color: green[500],
                    position: "absolute",
                    //   top: '50%',
                    //   left: '50%',
                    //   marginTop: '-12px',
                    marginLeft: "0px",
                  }}
                />
              )}
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
