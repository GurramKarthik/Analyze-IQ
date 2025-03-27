
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
import {Provider} from "react-redux"
import { store } from './Store/index.js';
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";



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
  {path:'/auth', element:<Authentication/>}
]);

export const persistor = persistStore(store)

createRoot(document.getElementById('root')).render(
  
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router}/>
      </PersistGate>
    </Provider>
  
)
