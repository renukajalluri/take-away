import { useEffect, useContext, useState } from "react";
import AuthContext from "../../stores/authContext";
import { useRouter } from "next/dist/client/router";
import classes from "../../styles/Restaurant.module.css";
import Rating from "@mui/material/Rating";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import axios from "axios";
import Link from "next/link";
import { faL } from "@fortawesome/free-solid-svg-icons";
import Icon from "../Cart/cartIcon";

const Restaurant = () => {
  const token = useContext(AuthContext);
  const router = useRouter();
  const [value, setValue] = useState(4);
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filteredList, setFilteredList] = useState(null);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [username, setUserName] = useState("");

  const handleClose = () => {
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen(!open);
  };

  const logout = () => {
    window.localStorage.removeItem("userToken");
    router.reload();
  };
  useEffect(() => {
    if (token) {
      router.push("/restaurant");
    } else {
      router.push("/login");
    }
    const chnageTime = (time) => {
      var d = new Date();
      var parts = time.match(/(\d+)\:(\d+) (\w+)/),
        hours = /am/i.test(parts[3])
          ? parseInt(parts[1], 10)
          : parseInt(parts[1], 10) + 12,
        minutes = parseInt(parts[2], 10);
      d.setHours(hours);
      d.setMinutes(minutes);
      return d;
    };
    const getRes = async () => {
      try {
        setLoading(false);
        const res = await axios.get(
          "http://localhost:4000/restaurant/restaurants"
        );
        if (res) {
          let data = res.data;

          const currentTime = new Date().toLocaleTimeString("en-US", {
            hour12: false,
            hour: "numeric",
            minute: "numeric",
          });
          const filteredRestaurants = data.filter((restaurant) => {
            const [openingHour, openingMinute] =
              restaurant.opening_time.split(":");
            const [closingHour, closingMinute] =
              restaurant.closing_time.split(":");
            const [currentHour, currentMinute] = currentTime.split(":");
            return (
              currentHour > openingHour ||
              (currentHour == openingHour &&
                currentMinute >= openingMinute &&
                currentHour < closingHour) ||
              (currentHour == closingHour && currentMinute < closingMinute)
            );
          });

          setList(filteredRestaurants);
          setFilteredList(filteredRestaurants);
          setLoading(true);
        } else {
          setLoading(false);
        }
      } catch (e) {
        setLoading(false);
        console.log(e);
      }
    };
    getRes();

    const getUsername = async () => {
      try {
        const data = await axios.get(
          "http://localhost:4000/restaurant/customerUser/customer",
          {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );
        const res = data.data;
        if (res) {
          setUserName(res.name);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUsername();
  }, []);

  const filter = (search) => {
    if (search != "") {
      const newList = list.filter((l) => {
        setLoading(false);
        return Object.values(l).join(" ").toLowerCase().includes(search);
      });
      setFilteredList(newList);
      setLoading(true);
    } else {
      setFilteredList(list);
      setLoading(true);
      setList(list);
    }
  };
  if (!loading) {
    return (
      <Backdrop sx={{ color: "#fff" }} open onClick={handleClose}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  } else {
    return (
      <div className={classes["landing-page"]}>
        <div className={classes.banner}>
          <div className={classes.header}>
            {/* <div>
              <h1 className={classes.username}>{username}</h1>
            </div> */}
            <div className={classes.orders}>
              <Link href={"/orderStatus"}>
                <a>Your Orders</a>
              </Link>
            </div>
            <div className={classes.icon}>
              <Icon />
            </div>
            <div className={classes.logout}>
              <button onClick={logout}>Logout</button>
            </div>
          </div>
          <div className={classes.container}>
            <h1>Foodie Hunter</h1>
            <p>Delicious food for you</p>
            <div className={classes.search}>
              <input
                onChange={(e) => {
                  filter(e.target.value);
                }}
                type="text"
                name="names"
                list="names"
                placeholder="Search for restaurant"
                autoComplete="off"
              />
              <datalist id="names">
                <option>leicester</option>
                <option>london</option>
                <option>birmingham</option>
              </datalist>
            </div>
          </div>
        </div>

        {/* </div> */}
        <div className={classes["top-resto"]}>
          <h1> Restaurants</h1>
          <div className={classes.grid}>
            {filteredList
              ? filteredList.map((res) => {
                  return (
                    <Link key={res._id} href={`/restaurant/${res.owner}`}>
                      <a>
                        <div className={classes.card}>
                          <div className={classes["item-details"]}>
                            <div className={classes["item"]}>
                              <span className={classes["item-img"]}>
                                <img
                                  src={res.banners[0]}
                                  alt=""
                                  width="250px"
                                  height="250px"
                                />
                              </span>
                              <div className={classes["item-fields"]}>
                                <span className={classes.itemName}>
                                  {res.name}
                                </span>
                                <span className={classes.rating}>
                                  4.5
                                  <Rating
                                    className={classes["rating-comp"]}
                                    name="read-only"
                                    value={value}
                                    readOnly
                                  />
                                </span>
                                <div className={classes.flex}>
                                  <span className={classes.opened}>Opened</span>
                                  <span className={classes.distance}>3km</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </a>
                    </Link>
                  );
                })
              : null}
          </div>
        </div>
      </div>
    );
  }
};

export default Restaurant;
