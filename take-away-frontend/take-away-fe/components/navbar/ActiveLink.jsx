import { shadows } from "@mui/system";
import { withRouter } from "next/router";


const ActiveLink = ({router,href,children})=>{
    const handleClick = (event)=>{
        event.preventDefault()
        router.push(href)
    }

    const isCurrentPath = router.pathname ===href || router.asPath == href
    return (
        <div>
            <a href={href} onClick={handleClick}
             style={{
                paddingTop:"10px",
                paddingBottom:"10px",
                paddingLeft:"10px",
                paddingRight:"10px",
                // backgroundColor:isCurrentPath?"#FEFE7D ":"",
                border:isCurrentPath?"1px solid black":"",
                fontSize:"23px",
                boxShadow:isCurrentPath ? "10px 5px 100px rgba(0,0,0,0.1)":"",
                color:"black"
             }}
            >
                {children}
            </a>

        </div>
    )
}

export default withRouter(ActiveLink)