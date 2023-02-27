import classes from "../../styles/Cart.module.css";
import { useEffect, useContext, useState } from "react";
import axios from "axios";

const Item = ({ token, item, total }) => {
  const [quantity, setQuantity] = useState(0);
  const addItem = async () => {
    try {
      const res = await axios.get(
        `https://take-away-backend.vercel.app/order/increase/${item.menu._id}`,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      setQuantity(quantity + 1);
      total(item.menu.cost);
    } catch (e) {
      console.log(e);
    }
  };
  const removeItem = async () => {
    try {
      const res = await axios.get(
        `https://take-away-backend.vercel.app/order/decrease/${item.menu._id}`,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      setQuantity(quantity - 1);
      total(-item.menu.cost);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    const getItem = async () => {
      try {
        const res = await axios.get(
          `https://take-away-backend.vercel.app/order/cart/${item.menu._id}`,
          {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );
        if (res.data) {
          setQuantity(res.data.quantity);
        }
      } catch (e) {
        console.log(e);
      }
    };
    getItem();
  }, []);

  return (
    <>
      {quantity == 0 ? null : (
        <div className={classes.box}>
          <div className={classes.resto}>
            <h5>{item.restaurant.name} </h5>
            <div className={classes["menu-item"]}>
              <h6>{item.menu.name}</h6>
              <h6 className={classes.quantity}>x &nbsp;{quantity}</h6>
            </div>
            <h7>£ {item.menu.cost * quantity}</h7>
          </div>

          <div className={classes["in-de"]}>
            <button onClick={addItem}>+</button>
            <button onClick={removeItem}>-</button>
          </div>
        </div>
      )}
    </>
  );
};
export default Item;
