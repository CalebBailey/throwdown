import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { FiSettings, FiHome, FiGrid, FiUsers } from 'react-icons/fi';

interface LayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
}

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
`;

const Header = styled.header`
  background-color: ${props => props.theme.colors.primary};
  padding: ${props => props.theme.space.md};
  box-shadow: ${props => props.theme.shadows.md};
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Logo = styled.div`
  font-family: ${props => props.theme.fonts.headings};
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: 800;
  color: ${props => props.theme.colors.highlight};
`;

const Navigation = styled.nav`
  display: flex;
  gap: ${props => props.theme.space.lg};
`;

const NavItem = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.space.xs};
  color: ${props => props.$active ? props.theme.colors.highlight : props.theme.colors.text};
  text-decoration: none;
  padding: ${props => `${props.theme.space.xs} ${props.theme.space.sm}`};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: ${props => props.$active ? props.theme.colors.highlight : props.theme.colors.text};
  }
  
  svg {
    font-size: 1.2em;
  }
`;

const Main = styled.main`
  flex: 1;
  padding: ${props => props.theme.space.lg};
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const Footer = styled.footer`
  background-color: ${props => props.theme.colors.primary};
  padding: ${props => props.theme.space.md};
  text-align: center;
  font-size: ${props => props.theme.fontSizes.sm};
  color: rgba(255, 255, 255, 0.6);
`;

export const Layout: React.FC<LayoutProps> = ({ children, hideNav = false }) => {
  const location = useLocation();
  
  const isActive = (path: string): boolean => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    return location.pathname.startsWith(path) && path !== '/';
  };

  return (
    <LayoutContainer>
      {!hideNav && (
        <Header>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Logo>THROWDOWN</Logo>
          </Link>
          <Navigation>
            <NavItem to="/" $active={isActive('/')}>
              <FiHome />
              Home
            </NavItem>
            <NavItem to="/games" $active={isActive('/games')}>
              <FiGrid />
              Games
            </NavItem>
            <NavItem to="/players" $active={isActive('/players')}>
              <FiUsers />
              Players
            </NavItem>
            <NavItem to="/settings" $active={isActive('/settings')}>
              <FiSettings />
              Settings
            </NavItem>
          </Navigation>
        </Header>
      )}
      <Main>{children}</Main>
      <Footer>ThrowDown Darts App &copy; {new Date().getFullYear()}</Footer>
    </LayoutContainer>
  );
};

export default Layout;