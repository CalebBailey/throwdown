import React from 'react';
import styled from 'styled-components';
import { FiArrowLeft } from 'react-icons/fi';
import Layout from '../shared/Layout';
import Button from '../shared/Button';

interface GameLayoutProps {
  title: string;
  children: React.ReactNode;
  onExitGame: () => void;
}

const HeaderBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.space.md};
  background-color: rgba(30, 30, 30, 0.5);
  padding: ${props => props.theme.space.sm} ${props => props.theme.space.md};
  border-radius: ${props => props.theme.borderRadius.md};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.space.xs} ${props => props.theme.space.sm};
    margin-bottom: ${props => props.theme.space.sm};
  }
`;

const Title = styled.h1`
  color: ${props => props.theme.colours.text};
  margin: 0;
  font-size: ${props => props.theme.fontSizes.xxl};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: ${props => props.theme.fontSizes.xl};
  }
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

export const GameLayout: React.FC<GameLayoutProps> = ({ title, children, onExitGame }) => {
  return (
    <Layout>
      <Container>
        <HeaderBar>
          <Title>{title}</Title>
          <Button
            variant="text"
            startIcon={<FiArrowLeft />}
            onClick={onExitGame}
          >
            Exit Game
          </Button>
        </HeaderBar>
        {children}
      </Container>
    </Layout>
  );
};
