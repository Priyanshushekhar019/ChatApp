import React, { useState, useEffect } from 'react'
import SignUp from './components/SignUp'
import Login from './components/Login'
import HomePage from './components/HomePage'
import { Toaster } from 'react-hot-toast'
import { useSelector, useDispatch } from 'react-redux'
import io from 'socket.io-client'
import { setSocket, setOnlineUsers } from './redux/socketSlice'
import { BASE_URL } from './config'

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const { authUser } = useSelector(store => store.user);
  const { socket } = useSelector(store => store.socket);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    
    // Listen for custom pushState / replaceState calls
    const originalPushState = window.history.pushState;
    window.history.pushState = function(...args) {
      originalPushState.apply(this, args);
      handleLocationChange();
    };

    const originalReplaceState = window.history.replaceState;
    window.history.replaceState = function(...args) {
      originalReplaceState.apply(this, args);
      handleLocationChange();
    };

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);

  // Establish socket connection when user is authenticated
  useEffect(() => {
    if (authUser) {
      const socketInstance = io(BASE_URL, {
        query: {
          userId: authUser._id
        }
      });
      dispatch(setSocket(socketInstance));

      socketInstance.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      return () => {
        socketInstance.close();
        dispatch(setSocket(null));
      };
    } else {
      if (socket) {
        socket.close();
        dispatch(setSocket(null));
      }
    }
  }, [authUser]);

  // Route guarding / render logic
  if (authUser) {
    // If authenticated, show the core Chat dashboard (HomePage)
    return (
      <div className="p-4 h-screen flex items-center justify-center">
        <HomePage />
        <Toaster position="top-center" />
      </div>
    );
  }

  // If not authenticated, restrict views to SignUp or Login
  if (currentPath === '/signup') {
    return (
      <div className="auth-container">
        <SignUp />
        <Toaster position="top-center" />
      </div>
    );
  }

  // Default to Login if not authenticated
  return (
    <div className="auth-container">
      <Login />
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
