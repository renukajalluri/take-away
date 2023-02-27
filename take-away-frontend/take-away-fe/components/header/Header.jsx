import classes from "../../styles/Header.module.css";

import { useRouter } from "next/dist/client/router";
const Header = () => {
  const router = useRouter();
  const logout = () => {
    window.localStorage.removeItem("userToken");
    router.reload();
  };
  return (
    <div className={classes.header}>
      <h1>Foodie Hunter</h1>
      <button onClick={logout}>Log Out</button>
    </div>
  );
};

export default Header;
