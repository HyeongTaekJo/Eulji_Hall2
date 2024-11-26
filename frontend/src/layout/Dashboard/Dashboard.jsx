import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import DateRangeIcon from '@mui/icons-material/DateRange';
import HistoryIcon from '@mui/icons-material/History';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import EventIcon from '@mui/icons-material/Layers';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authUser, logoutUser } from '../../store/thunkFunctions';

const BRANDING = {
  logo: (
    <img
      src={`/mark.jpg`}
      alt="mark logo"
      style={{ width: 'auto', height: '120px' }}
    />
  ),
  title: '을지회관',
};

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function Dashboard(props) {
  const { window } = props;
  const [session, setSession] = useState({ user: null });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuth = useSelector((state) => state.user?.isAuth);
  const userData = useSelector((state) => state.user.userData);
  const { pathname } = useLocation();

  useEffect(() => {
    if (isAuth) {
      dispatch(authUser());
      setSession({
        user: {
          name: userData.name,
          email: userData.email,
          image: userData.image,
        },
      });
    }
  }, [isAuth, pathname, dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      navigate('/login');
    });
  };

  const authentication = useMemo(() => ({
    signIn: () => {
      navigate('/login');
    },
    signOut: () => {
      setSession(null);
      handleLogout();
    },
  }), [navigate, handleLogout]);

  // Define NAVIGATION with conditional rendering based on isAuth
  const NAVIGATION = [
    {
      kind: 'header',
      title: '사용자 구간',
    },
    {
      segment: '',
      title: '예약하기',
      icon: <EventIcon  />,
    },
    {
      segment: 'reservationSearch',
      title: '예약내역 확인',
      icon: <HistoryIcon  />,
    },
    // ...(isAuth
    //   ? [] // isAuth가 true일 경우 '회원가입' 메뉴는 표시하지 않음
    //   : [
    //       {
    //         segment: 'register',
    //         title: '회원가입',
    //         icon: <PersonAddIcon />,
    //       },
    //     ]
    // ),
    {
      kind: 'divider',
    },
    ...(isAuth
      ? [
          {
            kind: 'header',
            title: '관리자 구간',
          },
          {
            segment: 'ReservationListGridPage',
            title: '예약내역 조회',
            icon: <HistoryIcon   />,
          },
          {
            segment: 'CalendarPage',
            title: '캘린더',
            icon: <DateRangeIcon />,
          },
          
        ]
      : []),
  ];

  return (
    <AppProvider
      branding={BRANDING}
      session={session}
      authentication={authentication}
      navigation={NAVIGATION}
      theme={demoTheme}
      window={window}
    >
      <DashboardLayout defaultSidebarCollapsed>
        <Outlet />
      </DashboardLayout>
    </AppProvider>
  );
}

Dashboard.propTypes = {
  window: PropTypes.func,
};

export default Dashboard;
