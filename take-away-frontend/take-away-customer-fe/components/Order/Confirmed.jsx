import classes from "../../styles/Confirmed.module.css";
import { useEffect, useContext, useState } from "react";
import axios from "axios";
import { useRouter } from "next/dist/client/router";
import AuthContext from "../../stores/authContext";
import Link from "next/link";
const Confirmed = () => {
  const router = useRouter();

  const [list, setList] = useState(null);
  const [total, setTotal] = useState(null);
  const token = useContext(AuthContext);

  const getOrders = async () => {
    try {
      const res = await axios.get(
        "https://take-away-backend.vercel.app/order/customerOrders",
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      setList(res.data);
      var l = res.data;
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    if (token) {
      router.push("/orderStatus");
    } else {
      router.push("/login");
    }

    getOrders();
  }, []);
  const cancelOrders = async (id) => {
    try {
      const res = await axios.get(
        `https://take-away-backend.vercel.app/order/cancel/${id}`,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      if (res.status == 200) {
        getOrders();
      }
    } catch (e) {
      console.log(e);
    }
  };

  if (list) {
    list.map((item) => {
      item.orders.map((order) => {
        // console.log(order.completed, "order");
      });
    });
  }
  return (
    <div className={classes.confirmed}>
      {/* <h2>Your Orders</h2> */}
      <h2>Your Order Details:</h2>
      {list
        ? list.map((item) => {
            var t = 0;
            item.orders.map((item) => {
              // parseInt
              t += item.item.cost * item.quantity;
            });
            return (
              <>
                {item.orders.map((item) => {
                  return (
                    <div className={classes.box} key={item._id}>
                      <div
                        style={{
                          display: "flex",
                          width: "90%",
                          justifyContent: "space-between",
                        }}
                      >
                        <p className={classes.status}>
                          {/* {orderStatus} */}
                          {item.status == "processing" && (
                            <p>
                              Order Has been taken .. Restaurant Has To Accept.
                              Waiting for Confirmation
                            </p>
                          )}
                          {item.status == "completed" && (
                            <p>Your Order Has been Completed</p>
                          )}
                          {item.status == "cancelled" && (
                            <p>Order has been cancelled</p>
                          )}
                        </p>
                        {item.status == "completed" ? (
                          <Link href="/feedback">
                            <button
                              style={{
                                fontFamily: "800",
                                marginTop: "30px",
                                height: "30px",
                                border: "1px solid black",
                                backgroundColor: "#E2F6FB",
                              }}
                            >
                              Give your feedback here
                            </button>
                          </Link>
                        ) : null}
                      </div>
                      <div style={{ margin: "auto" }} className={classes.auto}>
                        <div className={classes.resto}>
                          <h3>{item.restaurant.name}</h3>
                          <h3 className={classes.time}>
                            Time to pick food:{item.time}
                          </h3>
                          <p className={classes.itemName}>{item.item.name}</p>
                          <p className={classes.qty}>
                            quantity : {item.quantity}
                          </p>
                          <p style={{ marginTop: "-8px" }}>
                            Amount:
                            <span
                              style={{ fontWeight: "700", marginLeft: "5px" }}
                            >
                              £{item.item.cost * item.quantity}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className={classes.cancel}>
                  <h3 style={{ fontSize: "19px" }}>
                    Total Amount:{" "}
                    <span style={{ color: "#6D0F0F" }}> £ {t}</span>
                  </h3>

                  {!item.cancelled && !item.completed ? (
                    <>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          cancelOrders(item._id);
                        }}
                      >
                        Cancel Order
                      </button>
                    </>
                  ) : item.completed ? (
                    <button disabled>Order completed</button>
                  ) : (
                    <button disabled>Order Cancelled</button>
                  )}
                </div>
              </>
            );
          })
        : null}
    </div>
  );
};

export default Confirmed;
