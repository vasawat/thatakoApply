import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import env from "../assets/enviroments";

export const StudentContext = createContext();

export const StudentProvider = ({ children }) => {

  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState()
  const [userHaveToken, setUserHaveToken] = useState(false);
 
  const handleResize = () => {
    if (window.innerWidth < 900) {
        setIsMobile(true)
    } else {
        setIsMobile(false)
    }
  }

  const isTokenExpired = (token) => {
    if (!token) return true;
    const payload = atob(token.split(".")[1]);
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime; 
  };
  
  const checkToken = () => {
    const token = localStorage.getItem("token");
    if (token) {    
      if (isTokenExpired(token)) {
        setUserHaveToken(false);
        localStorage.removeItem("token");
        navigate("/");
        console.log("Token has expired");
      } else {
        setUserHaveToken(true);
        console.log("Token is still valid");
      }
      
      console.log("Token exists:", userHaveToken);
    } else {
      setUserHaveToken(false);
      console.log("No token found");
    }
  };
  
  
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    setTimeout(() => {
      checkToken();
    }, 1800000);
  // eslint-disable-next-line  
  }, []);


  return (
    <StudentContext.Provider value={{
      isMobile,
      userHaveToken
    }}>{children}</StudentContext.Provider>
  );
};