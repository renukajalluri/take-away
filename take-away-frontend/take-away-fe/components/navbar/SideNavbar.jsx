import classes from "../../styles/SideNavbar.module.css"
import ActiveLink from "./ActiveLink";

const SideNavbar  = ()=>{

  
return(

    <div className={classes.sidebar}>
        <div className={classes.links}>

<div className={classes.profileLink}>
      <ActiveLink href="/profile">
        <b> Profile</b>
      
      </ActiveLink>
      </div>

      <div className={classes.profileLink}>
      <ActiveLink href="/orders">
        <b> Orders</b>
      
      </ActiveLink>
      </div>

      <div className={classes.profileLink}>
      <ActiveLink href="/processingOrders">
        <b>Processing Orders</b>
      
      </ActiveLink>
      </div>
      
      <div className={classes.profileLink}>
      <ActiveLink href="/completedOrders">
     <b>Completed Orders</b> 
      </ActiveLink>
      </div>

      <div className={classes.profileLink}>
      <ActiveLink href="/cancelledOrders">
      <b> Cancelled Orders </b>
      </ActiveLink>
      </div>

        
</div>
    </div>
)

}


export default SideNavbar