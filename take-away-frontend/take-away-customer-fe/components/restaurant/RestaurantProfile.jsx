import classes from "../../styles/RestaurantProfile.module.css";
import CarouselContainer from "../carousel/Carousel";
import AuthContext from "../../stores/authContext";
import { useEffect, useContext, useState } from "react";
import { useRouter } from "next/dist/client/router";
import axios from "axios";
import Item from "./item";

const RestaurantProfile = ({ ownerId }) => {
  const [menu, setMenu] = useState(null);
  const token = useContext(AuthContext);
  const router = useRouter();
  const logout = () => {
    window.localStorage.removeItem("userToken");
    router.reload();
  };

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
    const getMenu = async () => {
      try {
        const res = await axios.get(
          `https://take-away-backend.vercel.app/menu/${ownerId}`
        );

        setMenu(res.data);
      } catch (e) {
        console.log(e);
      }
    };
    getMenu();
  }, []);
  return (
    <div className={classes["resto-profile"]}>
      <div>
        <CarouselContainer ownerId={ownerId} />
      </div>
      <div className={classes.menuBg}>
        {menu
          ? menu.map((item) => {
              return (
                // eslint-disable-next-line react/jsx-key
                <Item key={item.id} token={token} item={item} />
              );
            })
          : null}
      </div>
    </div>
  );
};

export default RestaurantProfile;
