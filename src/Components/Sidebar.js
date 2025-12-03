import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { db, auth } from "../firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import { signOut } from "firebase/auth";

const Sidebar = ({ isOpen, toggleSidebar, user, onSelectUser }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUsers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <MobileOverlay isOpen={isOpen} onClick={toggleSidebar} />

      <GlassContainer isOpen={isOpen}>
        <Header>
          <UserInfo>
            <WelcomeText>Priva 👋</WelcomeText>
            <UserName>{user?.displayName?.split(" ")[0]}</UserName>
          </UserInfo>
          <CloseBtn onClick={toggleSidebar}>&times;</CloseBtn>
        </Header>

        <SearchWrapper>
          <SearchInput placeholder="Kişilerde ara..." />
        </SearchWrapper>

        <ChatList>
          {users
            .filter((u) => u.id !== user?.uid)
            .map((u) => (
              <GlassItem key={u.id} onClick={() => onSelectUser(u)}>
                <Avatar
                  src={
                    u.photoURL ||
                    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                  }
                />
                <Info>
                  <Name>{u.displayName}</Name>
                  <Email>{u.email}</Email>
                </Info>
              </GlassItem>
            ))}
        </ChatList>

        <Footer>
          <LogoutBtn onClick={() => signOut(auth)}>Çıkış Yap</LogoutBtn>
        </Footer>
      </GlassContainer>
    </>
  );
};

const GlassContainer = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 320px;
  background: rgba(30, 30, 30, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  z-index: 2000;
  padding: 25px;
  box-sizing: border-box;
  transform: ${(props) =>
    props.isOpen ? "translateX(0)" : "translateX(-100%)"};
  transition: transform 0.3s ease-in-out;

  @media (max-width: 768px) {
    width: 85%;
    max-width: 320px;
  }
`;

const MobileOverlay = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: ${(props) => (props.isOpen ? "block" : "none")};
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 1999;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
`;
const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;
const WelcomeText = styled.span`
  font-size: 0.8rem;
  color: #00a884;
  font-weight: bold;
  letter-spacing: 1px;
  text-transform: uppercase;
`;
const UserName = styled.h2`
  color: white;
  margin: 0;
  font-size: 1.5rem;
`;

const CloseBtn = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const SearchWrapper = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 16px;
  padding: 2px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 20px;
`;
const SearchInput = styled.input`
  width: 100%;
  padding: 12px 15px;
  border-radius: 14px;
  border: none;
  background: transparent;
  color: white;
  outline: none;
  box-sizing: border-box;
`;

const ChatList = styled.div`
  flex: 1;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const GlassItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 16px;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;

const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  margin-right: 15px;
  object-fit: cover;
  background: #333;
`;
const Info = styled.div`
  overflow: hidden;
`;
const Name = styled.h4`
  color: white;
  margin: 0;
  font-size: 1rem;
`;
const Email = styled.p`
  color: rgba(255, 255, 255, 0.5);
  margin: 4px 0 0;
  font-size: 0.8rem;
`;

const Footer = styled.div`
  padding-top: 20px;
`;
const LogoutBtn = styled.button`
  width: 100%;
  padding: 12px;
  background: rgba(255, 75, 75, 0.15);
  color: #ff6b6b;
  border: 1px solid rgba(255, 75, 75, 0.2);
  border-radius: 14px;
  cursor: pointer;
  &:hover {
    background: rgba(255, 75, 75, 0.25);
  }
`;

export default Sidebar;
