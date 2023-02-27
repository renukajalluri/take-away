import '../styles/globals.css'
// import {useEffect,useState} from "react"
import { AuthContextProvider } from '../stores/authContext'
function MyApp({ Component, pageProps }) {

 
  return (
   <AuthContextProvider>
  <Component {...pageProps} />
  </AuthContextProvider>

  )
}

export default MyApp
