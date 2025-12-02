import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { db, auth } from "../firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import { signOut } from "firebase/auth";

export const SIDEBAR_WIDTH = "300px";

const Sidebar = ({ isOpen, toggleSidebar, user, onSelectUser }) => { 
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "users")); 
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUsers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth).catch((error) => alert(error.message));
  };

  return (
    <>
      <GlassContainer isOpen={isOpen}>
        <Header>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <WelcomeText>Priva 👋</WelcomeText>
            <UserName>{user?.displayName?.split(" ")[0]}</UserName>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <GlassButton onClick={handleLogout}>Çıkış</GlassButton>
            <CloseBtn onClick={toggleSidebar}>&times;</CloseBtn>
          </div>
        </Header>

        <SearchWrapper>
           <SearchInput placeholder="Kişilerde ara..." />
        </SearchWrapper>

        <ChatList>
          {users.filter(u => u.id !== user?.uid).map((u) => (
            <GlassItem key={u.id} onClick={() => onSelectUser(u)}>
              <Avatar 
                src={u.photoURL} 
                referrerPolicy="no-referrer"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"; }}
              />
              <Info>
                <h4>{u.displayName || "İsimsiz"}</h4>
                <p>{u.email}</p>
              </Info>
            </GlassItem>
          ))}
        </ChatList>
      </GlassContainer>
      
      {!isOpen && <FloatingMenuBtn onClick={toggleSidebar}>☰</FloatingMenuBtn>}
    </>
  );
};

const GlassContainer = styled.div`
  position: fixed; top: 10px; left: 10px; bottom: 10px;
  width: ${SIDEBAR_WIDTH};
  border-radius: 24px;
  background: rgba(30, 30, 30, 0.65);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  transform: ${(props) => (props.isOpen ? "translateX(0)" : "translateX(-120%)")};
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  z-index: 1000;
  display: flex; flex-direction: column; padding: 25px; color: white;
`;

const Header = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 25px;
`;

const WelcomeText = styled.span`
  font-size: 0.8rem; color: #00A884; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;
`;

const UserName = styled.h3`
  margin: 0; font-size: 1.5rem; font-weight: 700; color: #fff;
`;

const GlassButton = styled.button`
  background: rgba(255, 75, 75, 0.2); color: #ff6b6b;
  border: 1px solid rgba(255, 75, 75, 0.1);
  padding: 6px 12px; border-radius: 12px; font-weight: 600; cursor: pointer; transition: 0.2s;
  &:hover { background: rgba(255, 75, 75, 0.3); }
`;

const CloseBtn = styled.button`
  background: rgba(255,255,255,0.1); width: 32px; height: 32px; border-radius: 50%;
  border: none; color: white; font-size: 1.2rem; cursor: pointer; display: grid; place-items: center;
  &:hover { background: rgba(255,255,255,0.2); }
`;

const FloatingMenuBtn = styled.button`
  position: fixed; top: 20px; left: 20px; z-index: 50;
  background: rgba(20, 20, 20, 0.6); backdrop-filter: blur(10px);
  color: white; border: 1px solid rgba(255,255,255,0.1);
  width: 45px; height: 45px; border-radius: 14px;
  font-size: 1.4rem; cursor: pointer; transition: 0.2s;
  &:hover { transform: scale(1.05); background: rgba(20, 20, 20, 0.8); }
`;

const SearchWrapper = styled.div`
  background: rgba(0, 0, 0, 0.3); border-radius: 16px; padding: 2px;
  border: 1px solid rgba(255,255,255,0.05); margin-bottom: 20px;
`;

const SearchInput = styled.input`
  width: 100%; padding: 12px 15px; border-radius: 14px; border: none;
  background: transparent; color: white; outline: none; font-size: 0.95rem;
  &::placeholder { color: rgba(255,255,255,0.4); }
`;

const ChatList = styled.div`
  flex: 1; overflow-y: auto;
  scrollbar-width: none; &::-webkit-scrollbar { display: none; }
`;

const GlassItem = styled.div`
  display: flex; align-items: center; padding: 12px; margin-bottom: 8px;
  border-radius: 16px; cursor: pointer; transition: all 0.2s;
  &:hover { background: rgba(255,255,255,0.08); transform: translateX(5px); }
`;

const Avatar = styled.img`
  width: 48px; height: 48px; border-radius: 14px;
  margin-right: 15px; object-fit: cover;
  background: #333; border: 2px solid rgba(255,255,255,0.1);
`;

const Info = styled.div`
  display: flex; flex-direction: column; overflow: hidden;
  h4 { margin: 0; font-size: 1rem; color: #fff; font-weight: 500; }
  p { margin: 0; color: rgba(255,255,255,0.5); font-size: 0.8rem; margin-top: 4px; }
`;

export default Sidebar;