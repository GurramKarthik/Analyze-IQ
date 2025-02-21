import * as React from 'react';
import { extendTheme, styled } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import HomeIcon from '@mui/icons-material/Home';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout, ThemeSwitcher } from '@toolpad/core/DashboardLayout';
import {  useNavigate } from 'react-router-dom';
import { PageContainer } from '@toolpad/core/PageContainer';
import ChatIcon from '@mui/icons-material/Chat';
import PersonIcon from '@mui/icons-material/Person';
import { Button } from '@mui/material';
import FileBtn from './utils/Button';




const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'home',
    title: 'Home',
    icon: <HomeIcon />,
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'chat',
    title: 'Interact',
    icon: <ChatIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Analytics',
  },
  {
    segment: 'files',
    title: 'Files',
    icon: <BarChartIcon />,
    children: [
      {
        segment: 'file1',
        title: 'file 1',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'file2',
        title: 'file 2',
        icon: <DescriptionIcon />,
      },
    ],
  },
];




const Skeleton = styled('div')(({ theme, height }) => ({
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  height,
  content: '" "',
}));


const Navbar = () =>{
  return(
    <>
      <FileBtn color={"warning"}/>
      <ThemeSwitcher/>
    </>
  )
}




export default function Layout( {children}) {


  const [session, setSession] = React.useState({
    user: {
      name: 'Gurram Karthik',
      email: 'karthik@gmail.com',
      image: <PersonIcon/>,
    },
  });

  const authentication = React.useMemo(() => {
    return {
      signIn: () => {
        setSession({
          user: {
            name: 'Gurram Karthik',
            email: 'karthik@gmail.com',
            image: <PersonIcon/>,
          },
        });
      },
      signOut: () => {
        setSession(null);
      },
    };
  }, []);

  const navigate = useNavigate();
  
  return (
    <AppProvider   
    navigation={NAVIGATION.map((item) => 
      item.segment
        ? { ...item, onClick: () => navigate(`/${item.segment}`) } 
        : item
    )}
      branding={{
        logo: <img src="https://mui.com/static/logo.png" alt="MUI logo" />,
        title: 'AnalyzeIQ',
        homeUrl: '/',
      }}
      
      authentication={authentication}
      session={session}

    >
      <DashboardLayout
        slots={{
          toolbarActions:Navbar,
        }}
      >
        <PageContainer>
          {children}
        </PageContainer>
      </DashboardLayout>
    </AppProvider>

  );
}
