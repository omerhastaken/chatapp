import React from "react";
import styled, { keyframes } from "styled-components";
import { auth, provider, db } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export const Login = () => {
  const signIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(
        doc(db, "users", user.uid),
        {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          lastSeen: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      alert("Giriş Hatası: " + error.message);
    }
  };

  return (
    <Container>
      <BackgroundCircle1 />
      <BackgroundCircle2 />
      <LoginCard>
        <LogoContainer>
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="privaGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#00A884" />
                <stop offset="100%" stopColor="#005C4B" />
              </linearGradient>
            </defs>
            <path
              d="M50 5 C25 5, 10 20, 10 45 C10 75, 50 95, 50 95 C50 95, 90 75, 90 45 C90 20, 75 5, 50 5 Z"
              fill="url(#privaGradient)"
            />
            <path
              d="M50 28 C39 28, 30 35, 30 45 C30 55, 39 62, 50 62 C52 62, 54 61.5, 56 61 L64 65 L62 57 C67 54, 70 50, 70 45 C70 35, 61 28, 50 28 Z"
              fill="white"
            />
            <circle cx="43" cy="45" r="2" fill="#005C4B" />
            <circle cx="50" cy="45" r="2" fill="#005C4B" />
            <circle cx="57" cy="45" r="2" fill="#005C4B" />
          </svg>
        </LogoContainer>

        <Title>Priva</Title>
        <Subtitle>Gizli. Güvenli. Senin.</Subtitle>

        <LoginButton onClick={signIn}>
          <GoogleIcon viewBox="0 0 48 48">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
          </GoogleIcon>
          Google ile Giriş Yap
        </LoginButton>

        <FooterText>
          <LockIcon>🔒</LockIcon> Uçtan Uca Şifreli Bağlantı
        </FooterText>
      </LoginCard>
    </Container>
  );
};

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0% { transform: translate(0, 0); }
  50% { transform: translate(10px, 15px); }
  100% { transform: translate(0, 0); }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #0b0b0b;
  position: relative;
  overflow: hidden;
  font-family: "Segoe UI", Helvetica, Arial, sans-serif;
`;

const BackgroundCircle1 = styled.div`
  position: absolute;
  top: -10%;
  left: -10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(
    circle,
    rgba(0, 168, 132, 0.15) 0%,
    rgba(0, 0, 0, 0) 70%
  );
  border-radius: 50%;
  animation: ${float} 12s infinite ease-in-out;
`;

const BackgroundCircle2 = styled.div`
  position: absolute;
  bottom: -10%;
  right: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(
    circle,
    rgba(0, 92, 75, 0.15) 0%,
    rgba(0, 0, 0, 0) 70%
  );
  border-radius: 50%;
  animation: ${float} 15s infinite ease-in-out reverse;
`;

const LoginCard = styled.div`
  width: 100%;
  max-width: 380px;
  padding: 50px 30px;
  background: rgba(25, 25, 25, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  text-align: center;
  animation: ${fadeIn} 1s cubic-bezier(0.2, 0.8, 0.2, 1);
  z-index: 10;
  margin: 20px;

  @media (max-width: 768pxpx) {
    padding: 30px 20px;
    margin: 15px; 
    border-radius: 20px;
  }
`;

const LogoContainer = styled.div`
  width: 90px;
  height: 90px;
  margin: 0 auto 25px;
  filter: drop-shadow(0 0 15px rgba(0, 168, 132, 0.3));

  svg {
    width: 100%;
    height: 100%;
  }
`;

const Title = styled.h1`
  color: white;
  margin: 0 0 5px;
  font-size: 2.2rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  background: linear-gradient(to right, #fff, #bbb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const Subtitle = styled.p`
  color: #888;
  margin-bottom: 45px;
  font-size: 1rem;
  font-weight: 400;
  letter-spacing: 0.5px;
`;

const LoginButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background-color: white;
  color: #111;
  border: none;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    background-color: #f0f0f0;
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }
`;

const GoogleIcon = styled.svg`
  width: 22px;
  height: 22px;
  margin-right: 12px;
`;

const FooterText = styled.div`
  margin-top: 35px;
  color: #444;
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const LockIcon = styled.span`
  font-size: 0.9rem;
`;
