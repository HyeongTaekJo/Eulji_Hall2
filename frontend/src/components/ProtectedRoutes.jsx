import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

/* eslint-disable react/prop-types */
const ProtectedRoutes = ({isAuth}) => {
  return (
    //isAuth가 true이면 outlet, 아니면 Navigate
    isAuth ? <Outlet/> : <Navigate to={'/login'}/>
  )
}


export default ProtectedRoutes
