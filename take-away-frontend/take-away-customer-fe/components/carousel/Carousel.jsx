import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useContext, useState } from "react";
import { useRouter } from "next/dist/client/router";
import axios from "axios";

const CarouselContainer = ({ ownerId }) => {
  const [banner, setBanner] = useState(null);
  // const token = useContext(AuthContext)
  useEffect(() => {
    // if(!token){
    //     router.push("/login")
    //   }
    const getMenu = async () => {
      try {
        const res = await axios.get(
          `https://take-away-backend.vercel.app/restaurant/restaurantDetails/${ownerId}`,
          {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
            },
          }
        );

        setBanner(res.data.banners);
      } catch (e) {
        console.log(e);
      }
    };
    getMenu();
  }, []);

  return banner ? (
    <Carousel controls={false}>
      {banner.map((img) => {
        return (
          <Carousel.Item key={img} interval={2000}>
            <img
              className="d-block w-100 img"
              src={img}
              //   alt="First slide"
            />
          </Carousel.Item>
        );
      })}
    </Carousel>
  ) : (
    <Backdrop sx={{ color: "#fff" }} open>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default CarouselContainer;
