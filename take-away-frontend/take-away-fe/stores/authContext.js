import { createContext,  } from "react";
import {useEffect,useState} from "react"



const AuthContext = createContext({
    // user:null,
   token:null
    
})

export const AuthContextProvider = ({children})=>{
  const [token,setToken] = useState("")
    useEffect(()=>{
        if(window.localStorage.userToken){
        //   setUser(window.localStorage.getItem("user"))
          setToken(window.localStorage.getItem("userToken"))
        }
      })

    // const [user,setUser] = useState("");
 
    return(
        <AuthContext.Provider value={token}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext