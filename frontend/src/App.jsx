import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';  // ToastContainer 추가
import 'react-toastify/dist/ReactToastify.css';   // CSS 파일도 추가
import { useDispatch, useSelector } from 'react-redux';
import { authUser } from './store/thunkFunctions';
import ReservationForm from './pages/LandingPage/ReservationForm';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import Footer from './layout/Footer/Footer';
import ProtectedRoutes from './components/ProtectedRoutes';
import NotAuthRoutes from './components/NotAuthRoutes';
import NavBar from './layout/NavBar/NavBar';
import Dashboard from './layout/Dashboard/Dashboard';
import ReservationListPage from './pages/ReservationListPage/ReservationListPage';
import ReservationSearchPage from './pages/ReservationSearchPage/ReservationSearchPage';
import ReservationListGridPage from './pages/ReservationListGridPage/ReservationListGridPage';
import CalendarPage from './pages/CalendarPage/CalendarPage';
import FindPasswordPage from './pages/FindPasswordPage/FindPasswordPage';

function Layout() {
  return(  //flex-col은 Navbar, main, Footer가 세로로 한줄씩 된다 수직, 가로 축이 바뀜
    <div className='flex flex-col h-screen justify-between'> 
      <ToastContainer //react-toastify의 알림의 위치를 지정하기 위해서 최상위 컴포넌트를 설정
        position='bottom-right'
        theme='light'
        pauseOnHover
        autoClose={1500}
        style={{ whiteSpace: 'nowrap' }}
      />
      <Dashboard>
        <main className='mb-auto w-10/12 max-w-4xl mx-auto'>
          <Outlet/>
        </main>
      </Dashboard>
    </div>
  )
}

function App() {
  //로그인 인증이 되어 있는지 확인하는 것
  //로그인이 되어 있고 토큰 기간이 유효하다면 isAuth가 true일 것이다.
  //페이지 이동시, 리덕스 store에 있는 isAuth를 확인한다.
  const dispatch = useDispatch();
  const isAuth = useSelector(state => state.user?.isAuth);
  const {pathname} = useLocation();

  useEffect(() => {
    if(isAuth){
      dispatch(authUser());
    }
  },[isAuth, pathname, dispatch]) 
  //dispatch는 일관성을 위해서 넣어준 것
  //pathname는 페이지 이동뿐만아니라 새로고침도 포함

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* 예약하기,예약내역죠회 */}
        <Route index element={<ReservationForm />} />
        <Route path="/reservationList" element={<ReservationListPage  />} />
        <Route path="/reservationSearch" element={<ReservationSearchPage  />} />

        {/* 로그인한 사람만 갈 수 있는 경로 */}
        <Route element={<ProtectedRoutes isAuth={isAuth}/>}>
          {/* <Route path="/protected" element={<ProtectedPage />} /> */}
          <Route path="/ReservationListGridPage" element={<ReservationListGridPage/>}/>
          <Route path="/CalendarPage" element={<CalendarPage/>}/>
        </Route>

        {/* 로그인한 사람은 갈 수 없는 경로 */}
        <Route element={<NotAuthRoutes isAuth={isAuth}/>}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/findPassword" element={<FindPasswordPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
