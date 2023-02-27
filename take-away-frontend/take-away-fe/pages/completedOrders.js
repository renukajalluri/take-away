import Header from "../components/header/Header"
import SideNavbar from "../components/navbar/SideNavbar"
import CompletedOrders from "../components/Orders/CompletedOrders"
import classes from "../styles/ProfileForm.module.css"
const CompletedOrderPage = ()=>{
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
       <CompletedOrders></CompletedOrders>
       </div>
  </div>
  </div>
    )
}

export default CompletedOrderPage