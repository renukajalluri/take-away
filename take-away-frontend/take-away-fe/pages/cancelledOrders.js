import Header from "../components/header/Header"
import SideNavbar from "../components/navbar/SideNavbar"
import CancelledOrders from "../components/Orders/CancelledOrders"
import classes from "../styles/ProfileForm.module.css"
const CancelledOrderPage = ()=>{
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
       <CancelledOrders></CancelledOrders>
       </div>
  </div>
  </div>
    )
}

export default CancelledOrderPage