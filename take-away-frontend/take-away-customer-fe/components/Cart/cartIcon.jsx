import classes from "../../styles/Cart.module.css";
import { useEffect, useContext, useState } from "react";
import axios from "axios";
import Link from "next/link";
const Icon = () => {
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const getItem = async () => {
      try {
        const res = await axios.get(
          "https://take-away-backend.vercel.app/order/carts/items",
          {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
              Authorization: window.localStorage.getItem("userToken"),
            },
          }
        );
        if (res.data) {
          setQuantity(res.data.length);
        }
      } catch (e) {
        console.log(e);
      }
    };
    getItem();
  }, []);

  return (
    <>
      <Link href={"/cart"}>
        <div style={styles.nav}>
          <div style={styles.cartIconContainer}>
            <img
              style={styles.cartIcon}
              src="https://cdn-icons-png.flaticon.com/512/1170/1170678.png"
              alt="cart-icon"
            />
            <span style={styles.cartCount}>{quantity}</span>
          </div>
        </div>
      </Link>
    </>
  );
};

const styles = {
  cartIcon: {
    height: 32,
    marginRight: 20,
  },
  nav: {
    height: 70,
    cursor: "pointer",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  cartIconContainer: {
    position: "relative",
  },
  cartCount: {
    background: "yellow",
    borderRadius: "50%",
    padding: "0px 8px",
    position: "absolute",
    right: "5px",
    top: -9,
  },
};
export default Icon;
