import classes from "../../styles/RestaurantProfile.module.css";
import { useEffect, useContext, useState } from "react";
import axios from "axios";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";

const Item = ({ token, item }) => {
  const [quantity, setQuantity] = useState(0);
  const router = useRouter();

  const addItem = async (quant) => {
    try {
      const res = await axios.post(
        "https://take-away-backend.vercel.app/order/cart",
        {
          menu: item._id,
          quantity: quant,
          restaurant: item.restaurant,
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      // router.push('/cart')
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    const getItem = async () => {
      try {
        const res = await axios.get(
          `https://take-away-backend.vercel.app/order/cart/${item._id}`,
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
      {item.available ? (
        <div className={classes["resto-menu"]}>
          <div className={classes.box}>
            <div className={classes["item-details"]}>
              <div className={classes["item"]}>
                <span className={classes["item-img"]}>
                  <img width="100px" src={item.image} alt="" />
                </span>
                <div className={classes["item-fields"]}>
                  <span className={classes.itemName}>{item.name}</span>
                  <span className={classes.itemDesc}>{item.description}</span>
                  <span className={classes.amount}>£{item.cost}</span>
                </div>
              </div>
              <div className={classes["item-quantity"]}>
                <div className={classes["add"]}>
                  <span>
                    {/* <h6 className={classes['item-add']}>Add</h6> */}
                  </span>
                  <input
                    style={{ marginTop: "20px" }}
                    value={quantity}
                    onChange={(e) => {
                      setQuantity(e.target.value);
                    }}
                    min="0"
                    type="number"
                    placeholder="0"
                  />
                  {/* changed */}
                  <button
                    style={{
                      marginLeft: "5px",
                      border: "1px solid black",
                      backgroundColor: "white",
                    }}
                    onClick={() => addItem(quantity)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};
export default Item;
