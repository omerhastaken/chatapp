import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components"; // keyframes eklemeyi unutma
import { Login } from "./Components/Login";
import { auth } from "./firebase"; 
import { onAuthStateChanged } from "firebase/auth";

import Sidebar from "./Components/Sidebar";
import { Chats } from "./Components/Chats";

function App() {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) setUser(authUser);
      else { setUser(null); setSelectedUser(null); }
    });
    return () => unsubscribe();
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="App">
      {!user ? (
        <Login />
      ) : (
        <AppContainer>
          <BackgroundCircle1 />
          <BackgroundCircle2 />
          <BackgroundOverlay />

          <Sidebar 
            user={user} 
            isOpen={isSidebarOpen} 
            toggleSidebar={toggleSidebar} 
            onSelectUser={(u) => setSelectedUser(u)} 
          />

          <ContentArea isOpen={isSidebarOpen}>
              <Chats 
                isOpen={isSidebarOpen} 
                selectedUser={selectedUser} 
                currentUser={user} 
              />
          </ContentArea>
        </AppContainer>
      )}
    </div>
  );
}


const float = keyframes`
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
`;

const pulse = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 0.6; }
  100% { opacity: 0.3; }
`;


const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background-color: #050505;
`;

const BackgroundCircle1 = styled.div`
  position: absolute;
  top: -10%;
  left: -10%;
  width: 50vw;
  height: 50vw;
  background: radial-gradient(circle, rgba(0, 168, 132, 0.25) 0%, rgba(0,0,0,0) 70%);
  border-radius: 50%;
  filter: blur(40px);
  animation: ${float} 15s infinite ease-in-out;
  z-index: 0;
`;

const BackgroundCircle2 = styled.div`
  position: absolute;
  bottom: -10%;
  right: -10%;
  width: 60vw;
  height: 60vw;
  background: radial-gradient(circle, rgba(0, 92, 75, 0.25) 0%, rgba(0,0,0,0) 70%);
  border-radius: 50%;
  filter: blur(60px);
  animation: ${float} 20s infinite ease-in-out reverse;
  z-index: 0;
`;

const BackgroundOverlay = styled.div`
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: radial-gradient(circle at center, transparent 0%, #000 130%);
  z-index: 0;
  pointer-events: none;
`;

const ContentArea = styled.div`
  flex: 1;
  height: 100vh;
  margin-left: ${props => props.isOpen ? '320px' : '0px'};
  width: ${props => props.isOpen ? 'calc(100% - 320px)' : '100%'};
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  z-index: 1;
`;

export default App;