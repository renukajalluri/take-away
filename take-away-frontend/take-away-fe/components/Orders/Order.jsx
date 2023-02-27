import classes from "../../styles/Order.module.css";
import axios from "axios";
import { useEffect, useContext, useState } from "react";
import AuthContext from "../../stores/authContext";
import { useRouter } from "next/dist/client/router";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 23,
  p: 4,
};

const OrderCard = ({ order, orders, total, items, getOrders }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const token = useContext(AuthContext);

  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else {
      router.push("/orders");
    }
  }, []);

  const acceptOrder = async (order, token) => {
    try {
      const res = await axios.get(
        `https://take-away-backend.vercel.app/order/accept/processing/${order}`,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      getOrders();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div key={order._id} className={classes.box}>
      <div className={classes.flex}>
        <h3>{orders[0].customer.name}</h3>
        <h5>
          Order amount: <span className={classes.color}>£{total}</span>
        </h5>
      </div>

      <div className={classes.second}>
        <div className={classes.flex}>
          <h5>No.of items:{items}</h5>
          <h5>Time: {orders[0].time}</h5>
        </div>
      </div>

      <div className={classes.flex}>
        <div className={classes["menu-btn"]}>
          <button onClick={handleOpen}>See Menu</button>
        </div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            {orders.map((ord) => {
              return (
                <div key={ord.id} className={classes.modalBox}>
                  <div className={classes["item-details"]}>
                    <div className={classes["item"]}>
                      <span className={classes["item-img"]}>
                        <img width="100px" src={ord.item.image} alt="" />
                      </span>
                      <div className={classes["item-fields"]}>
                        <span className={classes.itemName}>
                          {ord.item.name}
                        </span>
                        <span className={classes.itemDesc}>
                          {ord.item.description}
                        </span>
                        <span className={classes.amount}>
                          £{ord.item.cost} x {ord.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </Box>
        </Modal>
        <div className={classes["acc-dec-btn"]}>
          <button
            onClick={(e) => {
              e.preventDefault();
              acceptOrder(order, token);
            }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

const Order = () => {
  const router = useRouter();
  const [list, setList] = useState(null);
  const [customerOrders, setCustomerOrders] = useState(null);

  const token = useContext(AuthContext);

  const extractOrder = (list) => {
    var temp = [];
    list.map((item) => {
      var order = item.customerOrder;
      if (!temp.includes(order)) {
        temp.push(order);
      }
    });
    setCustomerOrders(temp);
  };
  const getOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/order/owners/processing",
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      setList(res.data);
      extractOrder(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else {
      router.push("/orders");
    }
    getOrders();
  }, []);
  return (
    <div className={classes.order}>
      <h1>Orders</h1>
      {customerOrders
        ? customerOrders.map((order) => {
            var orders = list.filter((item) => {
              return item.customerOrder == order;
            });
            var total = 0;
            var items = 0;
            for (let i in orders) {
              total =
                total + parseInt(orders[i].item.cost) * orders[i].quantity;
              items = items + orders[i].quantity;
            }

            return (
              <>
                <OrderCard
                  order={order}
                  orders={orders}
                  total={total}
                  items={items}
                  getOrders={getOrders}
                />
              </>
            );
          })
        : null}
    </div>
  );
};

export default Order;
