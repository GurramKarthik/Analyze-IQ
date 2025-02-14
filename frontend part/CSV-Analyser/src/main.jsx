import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { RouterProvider, createBrowserRouter} from 'react-router-dom'
import Dashboard from './components/Dashboard/Dashboard.jsx';
import Chat from './components/Chat/Chat.jsx';
import Files from './components/Files/Files.jsx';
import Home from './components/Home/Home.jsx';
import "./index.css"
import Signup from './components/Auth/Signup.jsx';
import Login from './components/Auth/Login.jsx';
import Authentication from './components/Auth/Authentication.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,  
    children: [
      { index: true , element: <Home /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'chat', element: <Chat /> },
      { path: 'files', element: <Files /> },
    ],
  },
  { path: '/auth', 
    element: <Authentication />,
    children:[ 
      {path:"signup" , element:<Signup/>},
      { path:"login", element:<Login/> }
    ],
   },
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
      <RouterProvider router={router}/>
  </StrictMode>
)
