import ProfileForm from "../components/profileForm/ProfileForm";
import classes from "../styles/ProfileForm.module.css"
import SideNavbar from "../components/navbar/SideNavbar";
import Header from "../components/header/Header"

const ProfileFormPage = ()=>{
    return(
      <div className={classes["page"]}>
<div className={classes.header}>
        <Header></Header>
        </div>

        <div className={classes["layout-grid"]}>
          <div className={classes.navbar}>
          
         <SideNavbar/>
         </div>
       
         <div className={classes.scroll}>
       <ProfileForm></ProfileForm>
       </div>
  </div>
  </div>
    )
    
}


export default ProfileFormPage