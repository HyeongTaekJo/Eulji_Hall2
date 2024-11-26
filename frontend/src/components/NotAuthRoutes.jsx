import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

/* eslint-disable react/prop-types */
const NotAuthRoutes = ({isAuth}) => {
  //console.log('NotAuthRoutes' + isAuth )
  return (
    //isAuth가 true Navigate, 아니면 Outlet
    isAuth ? <Navigate to={'/'} /> : <Outlet/>
  ) //로그인 됬으면 접근 못하게하고 아니면 해당 경로페이지 불러오기
}

export default NotAuthRoutes
