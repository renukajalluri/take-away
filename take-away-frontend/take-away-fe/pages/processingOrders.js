import Header from "../components/header/Header"
import SideNavbar from "../components/navbar/SideNavbar"
import ProcessingOrders from "../components/Orders/ProcessingOrders"
import classes from "../styles/ProfileForm.module.css"
const ProcessingOrderPage = ()=>{
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
       <ProcessingOrders></ProcessingOrders>
       </div>
  </div>
  </div>
    )
}

export default ProcessingOrderPage