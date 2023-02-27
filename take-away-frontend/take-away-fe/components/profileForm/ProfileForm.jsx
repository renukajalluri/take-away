import classes from "../../styles/ProfileForm.module.css";
import { useRouter } from "next/dist/client/router";
import { useFormik } from "formik";
import { useEffect, useContext, useState } from "react";
import AuthContext from "../../stores/authContext";
import "rc-time-picker/assets/index.css";
import TimePicker from "rc-time-picker";
import moment from "moment";

import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowUp } from "@fortawesome/free-solid-svg-icons";
import * as Yup from "yup";
import ImageUploading from "react-images-uploading";
import axios from "axios";
import OwnerForm from "./OwnerForm";
import MenuForm from "./MenuForm";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Calendar } from "primereact/calendar";

const validationSchema = Yup.object({
  restoName: Yup.string().required("Required"),
  restoNo: Yup.string().required("Number should be valid"),
  restoAddress: Yup.string().required("Required"),
  restoLocation: Yup.string().required("Required"),
  // restoOpening: Yup.string().required("Required"),
  // restoClosing: Yup.string().required("Required"),
});

const ProfileForm = () => {
  const token = useContext(AuthContext);
  const router = useRouter();
  const [banner, setBanner] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initial, setInitial] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [time, setTime] = useState(null);
  const [selectedTime, setSelectedTime] = useState("10:00");
  const [openingTime, setOpeningTime] = useState(null);
  const [closingTime, setClosingTime] = useState(null);
  const showSecond = false;
  const handleClose = () => {
    setBackdrop(false);
  };
  const handleToggle = () => {
    setBackdrop(!open);
  };

  const maxNumber = 3;
  const str = showSecond ? "HH:mm:ss" : "HH:mm";

  const openingTimesonChange = (value) => {
    if (value) {
      const timeString = value.format("HH:mm");
      setOpeningTime(timeString);
    } else {
      setOpeningTime(null);
    }
  };
  const closingTimesonChange = (value) => {
    if (value) {
      const timeString = value.format("HH:mm");
      setClosingTime(timeString);
    } else {
      setClosingTime(null);
    }
  };
  const onChange = (imageList, addUpdateIndex) => {
    var temp = imageList?.map((img) => {
      if (img.data_url) {
        return img.data_url;
      }
      return img;
    });
    setBanner(temp);
  };

  useEffect(() => {
    if (token) {
      router.push("/profile");
    } else {
      router.push("/");
    }
    async function getRestaurantDetails() {
      try {
        setLoading(false);
        const response = await axios.get(
          "https://take-away-backend.vercel.app/restaurant/restaurantDetails",
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
          setOpeningTime(data.opening_time);
          setClosingTime(data.closing_time);
          setInitial(JSON.stringify(data));
          const parse = JSON.parse(initial);
          setBanner(parse.banners.map((b) => b));
          setLoading(true);
        } else {
          setLoading(true);
        }
      } catch (e) {
        console.log(e);
      }
    }
    getRestaurantDetails();
  }, [initial]);

  const onSubmit = async (values) => {
    setLoading(true);
    const restoFormData = {
      name: values.restoName,
      phone: values.restoNo,
      address: values.restoAddress,
      location: values.restoLocation,
      closing_time: closingTime,
      opening_time: openingTime,
      banners: banner,
    };
    try {
      const response = await axios.post(
        "https://take-away-backend.vercel.app/restaurant/restaurantDetails",
        JSON.stringify(restoFormData),
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      getRestaurantDetails();
      // setLoading(false)
    } catch (error) {
      console.log(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      restoName: initial ? JSON.parse(initial).name : "",
      restoNo: initial ? JSON.parse(initial).phone : "",
      restoAddress: initial ? JSON.parse(initial).address : "",
      restoLocation: initial ? JSON.parse(initial).location : "",
      // restoOpening: initial ? JSON.parse(initial).opening_time : "",
      // restoClosing: initial ? JSON.parse(initial).closing_time : "",
      // restoBanners:initial?JSON.parse(initial).banners:"",
      // ownerNo:"",
      // ownerName:"",
      // itemName:"",
      // itemDesc:"",
      // itemCost:"",
      // itemImg:"",
      // yes:"",
      // no:""
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
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  } else {
    return (
      <div className={classes.profile}>
        <h1>Restaurant Information </h1>
        <form onSubmit={formik.handleSubmit}>
          <div className={classes["resto-details"]}>
            <h1>Restaurant Details</h1>

            <div className={classes.grid}>
              {/* resto name */}
              <div className={classes["form-control"]}>
                <label htmlFor="restoName">Restaurant Name</label>
                <input
                  type="text"
                  name="restoName"
                  id="restoName"
                  placeholder="Restaurant Name"
                  onChange={formik.handleChange}
                  value={formik.values.restoName}
                  onBlur={formik.handleBlur}
                  onFocus={formik.handleToggle}
                />
                {formik.touched.restoName && formik.errors.restoName ? (
                  <p className={classes.error}>{formik.errors.restoName}</p>
                ) : null}
              </div>
              {/* resto-number */}
              <div className={classes["form-control"]}>
                <label htmlFor="restoNo">Restaurant Phone Number</label>
                <input
                  type="text"
                  name="restoNo"
                  id="restoNo"
                  placeholder="Restaurant Phone Number"
                  onChange={formik.handleChange}
                  value={formik.values.restoNo}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.restoNo && formik.errors.restoNo ? (
                  <p className={classes.error}>{formik.errors.restoNo}</p>
                ) : null}
              </div>

              {/* resto-address */}
              <div className={classes["form-address"]}>
                <label htmlFor="restoAddress">Restaurant Address</label>
                <input
                  type="text"
                  name="restoAddress"
                  id="restoAddress"
                  placeholder="Restaurant Address"
                  onChange={formik.handleChange}
                  value={formik.values.restoAddress}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.restoAddress && formik.errors.restoAddress ? (
                  <p className={classes.error}>{formik.errors.restoAddress}</p>
                ) : null}
              </div>

              {/* resto location */}
              <div className={classes["form-control"]}>
                <label htmlFor="restoLocation">Restaurant Location</label>
                <input
                  type="text"
                  name="restoLocation"
                  id="restoLocation"
                  placeholder="Restaurant Location"
                  onChange={formik.handleChange}
                  value={formik.values.restoLocation}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.restoLocation && formik.errors.restoLocation ? (
                  <p className={classes.error}>{formik.errors.restoLocation}</p>
                ) : null}
              </div>

              {/* resto opening-timings */}

              <div className={classes["form-control"]}>
                <label htmlFor="calendar-timeonly" className="restoClosing">
                  Restaurant Opening Timings{" "}
                </label>
                <TimePicker
                  style={{ width: "100%" }}
                  showSecond={showSecond}
                  // defaultValue={moment()}
                  value={openingTime ? moment(openingTime, "HH:mm") : null}
                  className="xxx"
                  onChange={openingTimesonChange}
                />
              </div>

              {/* resto closing timings */}
              <div className={classes["form-control"]}>
                <label htmlFor="restoClosing">Restaurant Closing Timings</label>
                <TimePicker
                  style={{ width: "100%" }}
                  showSecond={showSecond}
                  // defaultValue={moment()}
                  value={closingTime ? moment(closingTime, "HH:mm") : null}
                  className="xxx"
                  onChange={closingTimesonChange}
                />
                {/* <input
                  type="text"
                  name="restoClosing"
                  id="restoClosing"
                  placeholder="Restaurant Closing Timings"
                  onChange={formik.handleChange}
                  value={formik.values.restoClosing}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.restoClosing && formik.errors.restoClosing ? (
                  <p className={classes.error}>{formik.errors.restoClosing}</p>
                ) : null} */}
              </div>

              {/* resto banners */}
              {/* {banner.length} */}
              <div className={classes["form-control"]}>
                <label htmlFor="banner">Banners</label>
                <ImageUploading
                  multiple
                  // name={restoBanners}
                  required
                  value={banner}
                  onChange={onChange}
                  maxNumber={maxNumber}
                  dataURLKey="data_url"
                  maxFileSize={1100000000000}
                  acceptType={["jpg", "svg", "png", "jpeg"]}
                >
                  {({
                    imageList,
                    onImageUpload,
                    onImageRemoveAll,
                    onImageUpdate,
                    onImageRemove,
                    isDragging,
                    dragProps,
                  }) => (
                    <div>
                      <button
                        type="button"
                        className={classes.banner}
                        onClick={onImageUpload}
                        {...dragProps}
                      >
                        Select Banners{" "}
                        <span>
                          <FontAwesomeIcon icon={faCircleArrowUp} />
                        </span>
                      </button>

                      {banner.length >= 1 ? (
                        <button
                          type="button"
                          className={classes.remove}
                          onClick={onImageRemoveAll}
                        >
                          Remove all images
                        </button>
                      ) : null}
                      {banner.map((image, index) => (
                        <div key={index}>
                          {banner.length > maxNumber ? (
                            <p>Max : 3 images</p>
                          ) : (
                            ""
                          )}
                          <div className={classes["image-item"]}>
                            <img src={image} alt="" width="100" />
                          </div>
                          <div className={classes["image-item__btn-wrapper"]}>
                            <button
                              type="button"
                              onClick={() => {
                                onImageUpdate(index);
                              }}
                            >
                              Update
                            </button>
                            <button
                              type="button"
                              onClick={() => onImageRemove(index)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ImageUploading>
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
                {/* || formik.initialTouched */}
              </div>
            </div>
          </div>
        </form>

        <OwnerForm> </OwnerForm>

        <MenuForm></MenuForm>
      </div>
    );
  }
};

export default ProfileForm;
