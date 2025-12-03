import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { Login } from "./Components/Login";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import Sidebar from "./Components/Sidebar";
import { Chats } from "./Components/Chats";

function App() {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) setUser(authUser);
      else {
        setUser(null);
        setSelectedUser(null);
      }
    });

    const handleResize = () => {
      if (window.innerWidth <= 768) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      unsubscribe();
      window.removeEventListener("resize", handleResize);
    };
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
            onSelectUser={(u) => {
              setSelectedUser(u);
              if (window.innerWidth <= 768) setIsSidebarOpen(false);
            }}
          />

          <ContentArea isOpen={isSidebarOpen}>
            <Chats
              isOpen={isSidebarOpen}
              selectedUser={selectedUser}
              currentUser={user}
              toggleSidebar={toggleSidebar}
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

const AppContainer = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  position: fixed;
  inset: 0;
  height: 100dvh;
  overflow: hidden;
  background-color: #050505;
`;

const ContentArea = styled.div`
  flex: 1;
  height: 100%;
  position: relative;
  z-index: 1;
  transition: margin-left 0.3s ease;
  margin-left: ${(props) => (props.isOpen ? "320px" : "0px")};

  @media (max-width: 768px) {
    margin-left: 0 !important;
    width: 100%;
  }
`;

const BackgroundCircle1 = styled.div`
  position: absolute;
  top: -10%;
  left: -10%;
  width: 50vw;
  height: 50vw;
  background: radial-gradient(
    circle,
    rgba(0, 168, 132, 0.25) 0%,
    rgba(0, 0, 0, 0) 70%
  );
  border-radius: 50%;
  filter: blur(50px);
  animation: ${float} 15s infinite ease-in-out;
  z-index: 0;
`;

const BackgroundCircle2 = styled.div`
  position: absolute;
  bottom: -10%;
  right: -10%;
  width: 60vw;
  height: 60vw;
  background: radial-gradient(
    circle,
    rgba(0, 92, 75, 0.25) 0%,
    rgba(0, 0, 0, 0) 70%
  );
  border-radius: 50%;
  filter: blur(70px);
  animation: ${float} 20s infinite ease-in-out reverse;
  z-index: 0;
`;

const BackgroundOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, transparent 0%, #000 120%);
  z-index: 0;
  pointer-events: none;
`;

export default App;
