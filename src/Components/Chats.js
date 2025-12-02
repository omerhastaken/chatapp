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

export const Chats = ({ isOpen, selectedUser, currentUser }) => {
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
    setTimeout(() => {
      endOfMessagesRef.current?.scrollIntoView({ behavior: "auto" });
    }, 100);
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
        <EmptyState>
          <GlassTitle>Priva</GlassTitle>
          <p>Güvenli sohbet için birini seç.</p>
        </EmptyState>
      </ChatLayout>
    );
  }

  return (
    <ChatLayout>
      <HeaderContainer isOpen={isOpen}>
        <HeaderGlass>
          <UserSection>
            <HeaderAvatar
              src={selectedUser.photoURL}
              referrerPolicy="no-referrer"
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
          </UserSection>
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
  height: 110vh;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
`;

const HeaderContainer = styled.div`
  flex: 0 0 auto;
  width: 100%;
  box-sizing: border-box;
  padding-top: 100px;
  padding-bottom: 10px;
  padding-right: 60px;
  padding-left: ${(props) => (props.isOpen ? "55px" : "90px")};
  transition: padding-left 0.3s ease;

  z-index: 10;

  @media (max-width: 768px) {
    display: ${(props) => (props.isOpen ? "none" : "block")};
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
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
`;


const MessageArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const InputContainer = styled.div`
  flex: 0 0 auto;
  width: 100%;
  box-sizing: border-box;
  padding-top: 10px;
  padding-bottom: 15px; 
  padding-right: 50px;
  padding-left: ${(props) => (props.isOpen ? "55px" : "100px")};
  transition: padding-left 0.3s ease;
  z-index: 10;

    @media (max-width: 768px) {
    display: ${(props) => (props.isOpen ? "10px" : "90px")};
    form {
      display: ${(props) => (props.isOpen ? "none" : "90px")};
    }
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
  padding: 0 10px 0 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
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
  display: flex;
  flex-direction: column;
  h4 {
    margin: 0;
    color: white;
    font-weight: 600;
    font-size: 1rem;
  }
`;
const Badge = styled.span`
  font-size: 0.7rem;
  color: #00a884;
  font-weight: 500;
  margin-top: 2px;
  background: rgba(0, 168, 132, 0.1);
  padding: 2px 8px;
  border-radius: 6px;
  width: fit-content;
`;
const Bubble = styled.div`
  max-width: 70%;
  padding: 12px 18px;
  position: relative;
  word-wrap: break-word;
  color: white;
  font-size: 0.95rem;
  line-height: 1.5;
  align-self: ${(props) => (props.isMe ? "flex-end" : "flex-start")};
  background: ${(props) =>
    props.isMe
      ? "linear-gradient(135deg, #00A884 0%, #008f6f 100%)"
      : "rgba(50, 50, 50, 0.8)"};
  backdrop-filter: blur(5px);
  border: 1px solid
    ${(props) =>
      props.isMe ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)"};
  border-radius: 20px;
  border-bottom-right-radius: ${(props) => (props.isMe ? "4px" : "20px")};
  border-bottom-left-radius: ${(props) => (props.isMe ? "20px" : "4px")};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;
const Time = styled.span`
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.7);
  display: block;
  text-align: right;
  margin-top: 4px;
`;
const Input = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 1rem;
  color: white;
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
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
  transition: 0.2s;
  &:hover {
    transform: scale(1.05);
    background: #00c49a;
  }
  margin-left: 10px;
`;
const EmptyState = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  h1 {
    font-size: 3rem;
    margin-bottom: 10px;
  }
  p {
    font-size: 1.1rem;
    opacity: 0.7;
  }
`;
const GlassTitle = styled.h1`
  font-size: 4rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #fff 0%, #aaa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 20px rgba(0, 168, 132, 0.3));
`;