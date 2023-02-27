import classes from "../../styles/ProfileForm.module.css";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import AuthContext from "../../stores/authContext";
import { useEffect, useContext, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const validationSchema = Yup.object({
  ownerNo: Yup.string().required("Number should be valid"),
  ownerName: Yup.string().required("Required"),
});

const OwnerForm = () => {
  const token = useContext(AuthContext);
  const [initial, setInitial] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleClose = () => {
    setBackdrop(false);
  };
  const handleToggle = () => {
    setBackdrop(!open);
  };

  useEffect(() => {
    setLoading(false);
    async function getOwnerDetails() {
      try {
        setLoading(false);
        const response = await axios.get(
          "https://take-away-backend.vercel.app/restaurant/ownerDetails",
          {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );

        const data = response.data;
        if (data) {
          setInitial(JSON.stringify(data));
          setLoading(true);
        } else {
          setLoading(true);
        }
      } catch (e) {
        console.log(e);
      }
    }
    getOwnerDetails();
  }, [initial]);

  const onSubmit = async (values, actions) => {
    setLoading(true);
    const restoFormData = {
      phone: values.ownerNo,
      full_name: values.ownerName,
    };
    try {
      setLoading(true);
      const response = await axios.post(
        "https://take-away-backend.vercel.app/restaurant/ownerDetails",
        JSON.stringify(restoFormData),
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      // getOwnerDetails()
      setLoading(true);
    } catch (error) {
      console.log(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      ownerNo: initial ? JSON.parse(initial).phone : "",
      ownerName: initial ? JSON.parse(initial).full_name : "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
  });
  if (!loading) {
    return (
      <Backdrop sx={{ color: "#fff" }} open onClick={handleClose}>
        <CircularProgress style={{ color: "yellow" }} />
      </Backdrop>
    );
  } else {
    return (
      <div>
        <form onSubmit={formik.handleSubmit}>
          {/* Restaurant Owner Details */}

          <div className={classes["owner-details"]}>
            <h1>Restaurant Information </h1>
            <div className={classes.grid}>
              <div className={classes["form-control"]}>
                <label htmlFor="ownerNo">Restaurant Owner Phone Number</label>
                <input
                  type="text"
                  name="ownerNo"
                  id="ownerNo"
                  placeholder="Phone Number"
                  onChange={formik.handleChange}
                  value={formik.values.ownerNo}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.ownerNo && formik.errors.ownerNo ? (
                  <p className={classes.error}>{formik.errors.ownerNo}</p>
                ) : null}
              </div>

              <div className={classes["form-control"]}>
                <label htmlFor="ownerName">Restaurant Owner Full Name</label>
                <input
                  type="text"
                  name="ownerName"
                  id="ownerName"
                  placeholder="Full Name"
                  onChange={formik.handleChange}
                  value={formik.values.ownerName}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.ownerName && formik.errors.ownerName ? (
                  <p className={classes.error}>{formik.errors.ownerName}</p>
                ) : null}
              </div>
              <div></div>

              {/* save button */}
              <div className={classes.button}>
                <button
                  type="submit"
                  disabled={
                    !formik.isValid || formik.isSubmitting || !formik.dirty
                  }
                  onSubmit={onSubmit}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
};

export default OwnerForm;
