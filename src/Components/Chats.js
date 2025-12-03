import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import CryptoJS from "crypto-js";

export const Chats = ({ isOpen, selectedUser, currentUser, toggleSidebar }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const endOfMessagesRef = useRef(null);
  const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

  const encryptMessage = (text) =>
    CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
  const decryptMessage = (cipherText) => {
    try {
      const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
      return bytes.toString(CryptoJS.enc.Utf8) || cipherText;
    } catch (e) {
      return cipherText;
    }
  };

  const chatId =
    selectedUser && currentUser
      ? currentUser.uid > selectedUser.id
        ? currentUser.uid + selectedUser.id
        : selectedUser.id + currentUser.uid
      : null;

  useEffect(() => {
    if (!chatId) return;
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, [chatId]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input || !chatId) return;
    await addDoc(collection(db, "chats", chatId, "messages"), {
      text: encryptMessage(input),
      sender: currentUser.uid,
      timestamp: serverTimestamp(),
    });
    setInput("");
  };

  if (!selectedUser) {
    return (
      <ChatLayout>
        {!isOpen && <MenuBtn onClick={toggleSidebar}>☰</MenuBtn>}
        <EmptyState>
          <GlassTitle>Priva</GlassTitle>
          <p>Güvenli sohbet için birini seç.</p>
        </EmptyState>
      </ChatLayout>
    );
  }

  return (
    <ChatLayout>
      <HeaderContainer>
        <HeaderGlass>
          {!isOpen && (
            <MenuBtnInside onClick={toggleSidebar}>
              <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
              </svg>
            </MenuBtnInside>
          )}

          <HeaderAvatar
            src={selectedUser.photoURL}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";
            }}
          />
          <HeaderInfo>
            <h4>{selectedUser.displayName}</h4>
            <Badge>🔒 Uçtan Uca Şifreli</Badge>
          </HeaderInfo>
        </HeaderGlass>
      </HeaderContainer>
      <MessageArea>
        {messages.map((msg) => (
          <Bubble key={msg.id} isMe={msg.sender === currentUser.uid}>
            <p>{decryptMessage(msg.text)}</p>
            <Time>
              {msg.timestamp
                ? new Date(msg.timestamp.toDate()).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </Time>
          </Bubble>
        ))}
        <div ref={endOfMessagesRef} />
      </MessageArea>
      <InputContainer isOpen={isOpen}>
        <InputGlass as="form">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Bir şeyler yaz..."
          />
          <SendBtn type="submit" onClick={sendMessage}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
            </svg>
          </SendBtn>
        </InputGlass>
      </InputContainer>
    </ChatLayout>
  );
};


const ChatLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  position: relative;
`;

const MenuBtn = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 50;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1.5rem;
  width: 45px;
  height: 45px;
  border-radius: 12px;
  cursor: pointer;
  backdrop-filter: blur(5px);
  display: grid;
  place-items: center;
`;

const MenuBtnInside = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  margin-right: 15px;
  display: flex;
  align-items: center;
  &:hover {
    opacity: 0.8;
  }
`;

const HeaderContainer = styled.div`
 position: fixed;
  top: 8px;
  right: 0;
  z-index: 100;
  padding: 0 20px;
  box-sizing: border-box;
  transition: left 0.3s ease, width 0.3s ease;
  left: ${props => props.isOpen ? '320px' : '0'};
  width: ${props => props.isOpen ? 'calc(100% - 320px)' : '100%'};

  @media (max-width: 768px) {
    left: 0 !important;
    width: 100% !important;
    padding: 0 10px;
  }
`;

const HeaderGlass = styled.div`
  width: 100%;
  height: 70px;
  background: rgba(40, 40, 40, 0.85);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  box-sizing: border-box;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

const HeaderAvatar = styled.img`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  margin-right: 15px;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;
const HeaderInfo = styled.div`
  h4 {
    margin: 0;
    color: white;
    font-weight: 600;
  }
`;
const Badge = styled.span`
  font-size: 0.7rem;
  color: #00a884;
  background: rgba(0, 168, 132, 0.15);
  padding: 2px 8px;
  border-radius: 6px;
`;

const MessageArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 151px 20px 100px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  @media (max-width: 768px) {
    padding-top: 155px;
  }
`;

const Bubble = styled.div`
  max-width: 70%;
  padding: 12px 18px;
  color: white;
  font-size: 0.95rem;
  line-height: 1.5;
  align-self: ${(props) => (props.isMe ? "flex-end" : "flex-start")};
  background: ${(props) =>
    props.isMe
      ? "linear-gradient(135deg, rgba(0, 168, 132, 0.9), rgba(0, 143, 111, 0.9))"
      : "rgba(50, 50, 50, 0.85)"};
  backdrop-filter: blur(5px);
  border-radius: 20px;
  border-bottom-right-radius: ${(props) => (props.isMe ? "4px" : "20px")};
  border-bottom-left-radius: ${(props) => (props.isMe ? "20px" : "4px")};
  word-wrap: break-word;
`;
const Time = styled.span`
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.7);
  display: block;
  text-align: right;
  margin-top: 4px;
`;

const InputContainer = styled.div`
  position: fixed;
  bottom: 10px;
  z-index: 20;
  box-sizing: border-box;
  padding: 0 20px;
  left: ${(props) => (props.isOpen ? "320px" : "0")};
  width: ${(props) => (props.isOpen ? "calc(100% - 320px)" : "100%")};
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    left: 0;
    width: 100%;
    padding: 0 15px;
  }
`;

const InputGlass = styled.div`
  width: 100%;
  height: 60px;
  background: rgba(40, 40, 40, 0.85);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  display: flex;
  align-items: center;
  padding: 0 10px 0 25px;
  box-sizing: border-box;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

const Input = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 1rem;
  color: white;
`;
const SendBtn = styled.button`
  background: #00a884;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  display: grid;
  place-items: center;
  cursor: pointer;
`;

const EmptyState = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
`;
const GlassTitle = styled.h1`
  font-size: 4rem;
  margin: 0;
  background: linear-gradient(135deg, #fff, #aaa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 20px rgba(0, 168, 132, 0.3));
`;
