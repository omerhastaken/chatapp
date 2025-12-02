import React, { useState } from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import { Chats } from './Chats'; 

export const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <HomeContainer>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <ContentArea isOpen={isSidebarOpen}>
        <Chats isOpen={isSidebarOpen} />
      </ContentArea>
    </HomeContainer>
  );
};

const HomeContainer = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
`;

const ContentArea = styled.div`
  flex: 1;
  margin-left: ${props => props.isOpen ? '300px' : '0'};
  transition: margin-left 0.3s ease-in-out;
  background-image: url('/bg-chat-2.jpg');
  background-size: cover;
`;