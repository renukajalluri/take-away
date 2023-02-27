import Header from "../components/header/Header"
import SideNavbar from "../components/navbar/SideNavbar"
import Order from "../components/Orders/Order"
import classes from "../styles/ProfileForm.module.css"
const OrderPage = ()=>{
    return (
        <div className={classes["page"]}>
          <div className={classes.header}>
        <Header></Header>
        </div>
        <div className={classes["layout-grid"]}>

         <div className={classes.navbar}>
          
         <SideNavbar/>
         </div>
         <div className={classes.scroll}>
       <Order></Order>
       </div>
  </div>
  </div>
    )
}

export default OrderPage