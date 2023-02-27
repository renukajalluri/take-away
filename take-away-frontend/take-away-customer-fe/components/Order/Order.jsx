import classes from "../../styles/Order.module.css";
import AddresForm from "./addressForm";
import styles from "../../styles/AuthForm.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useContext, useState } from "react";
import axios from "axios";
import { useRouter } from "next/dist/client/router";
import AuthContext from "../../stores/authContext";
import { setRequestMeta } from "next/dist/server/request-meta";

const Order = () => {
  const router = useRouter();
  const token = useContext(AuthContext);
  const [list, setList] = useState(null);
  const [res, setRes] = useState(null);
  const [time, setTime] = useState(20);
  const [address, setAddress] = useState(null);
  //   const [phone,setPhone] = useState("")
  //   const [street,setStreet] = useState("")
  //   const [doorNum,setDoorNum] = useState("")
  //   const [postCode,setPostCode] = useState("")
  //   const [city,setCity] = useState("")
  const extractRestaurant = (cart) => {
    var temp = [];
    cart.map((a) => {
      var res = JSON.stringify(a.restaurant);
      if (!temp.includes(res)) {
        temp.push(res);
      }
    });
    setRes(temp);
  };
  useEffect(() => {
    // if(!token){
    //     router.push("/login")
    //   }
    const getCart = async () => {
      try {
        const res = await axios.get(
          "https://take-away-backend.vercel.app/order/carts/items",
          {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );
        setList(res.data);
        extractRestaurant(res.data);
      } catch (e) {
        console.log(e);
      }
    };
    if (token) {
      getCart();
    }

    const getAddress = async () => {
      try {
        const data = await axios.get(
          "https://take-away-backend.vercel.app/restaurant/customerUser/customer",
          {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );
        const res = data.data.address;
        if (res) {
          setAddress(res[0]);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getAddress();
  }, []);

  const onSubmit = async (values) => {
    try {
      const res = await axios.post(
        "https://take-away-backend.vercel.app/order",
        {
          address: values,
          carts: list,
          // time: time
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      router.push("/restaurant");
    } catch (e) {
      console.log(e);
    }
  };

  const validationSchema = Yup.object({
    phone: Yup.string().required("Required"),
    street: Yup.string().required("Required"),
    door: Yup.string().required("Required"),
    postCode: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
  });
  const initialValues = {
    phone: address ? address.phone : "",
    street: address ? address.street : "",
    door: address ? address.doorNum : "",
    postCode: address ? address.postCode : "",
    city: address ? address.city : "",
    // address:""
  };
  const formik = useFormik({
    initialValues,
    onSubmit,
    enableReinitialize: true,
    validationSchema,
  });
  return (
    <div className={classes.order}>
      <h1>Address</h1>
      <form onSubmit={formik.handleSubmit}>
        <div className={classes["address-form"]}>
          <div className={styles["form-control"]}>
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
              <p className={styles.error}>{formik.errors.phone}</p>
            ) : null}
          </div>

          <div className={styles["form-control"]}>
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
              <p className={styles.error}>{formik.errors.street}</p>
            ) : null}
          </div>

          <div className={styles["form-control"]}>
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
              <p className={styles.error}>{formik.errors.door}</p>
            ) : null}
          </div>

          <div className={styles["form-control"]}>
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
              <p className={styles.error}>{formik.errors.postCode}</p>
            ) : null}
          </div>

          <div className={styles["form-control"]}>
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
              <p className={styles.error}>{formik.errors.city}</p>
            ) : null}
          </div>
        </div>
        <div className={classes.method}>
          <h1>Payment Method</h1>
          <div className={classes.methodInput}>
            {/* checked */}
            <input name="method" type="radio" />
            <label htmlFor="method">Cash On Delivery</label>
          </div>
        </div>
        <div className={classes.resto}>
          <h1>Your Ordered Restaurants</h1>
          {res
            ? res.map((item) => {
                var rest = JSON.parse(item);
                return (
                  // eslint-disable-next-line react/jsx-key
                  <div className={classes.flex}>
                    <h2>{rest.name}</h2>
                    <span className={classes["time-input"]}>
                      <h2>How many minutes it will take to pick the food</h2>
                      <input
                        type="number"
                        min="20"
                        step="5"
                        name={rest._id}
                        placeholder="20"
                        onChange={formik.handleChange}
                        // value={formik.values.phone}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.phone && formik.errors.phone ? (
                        <p className={styles.error}>{formik.errors.phone}</p>
                      ) : null}
                      {/* <input value ={time} onChange={e=>setTime(e.target.value)} step="10" min="20" type="number" />minutes */}
                    </span>
                  </div>
                );
              })
            : null}
        </div>
        <div className={classes.btn}>
          <button type="submit" onClick={onSubmit}>
            Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default Order;
