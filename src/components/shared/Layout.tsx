import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiGrid, FiUsers, FiMenu, FiX } from 'react-icons/fi';

interface LayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
}

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  position: relative;
  flex: 1;
`;

const Header = styled.header`
  background-color: ${props => props.theme.colours.primary};
  padding: ${props => props.theme.space.md};
  box-shadow: ${props => props.theme.shadows.md};
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
  flex-shrink: 0;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.space.sm} ${props => props.theme.space.md};
  }
`;

const Logo = styled.div`
  font-family: ${props => props.theme.fonts.headings};
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: 800;
  color: ${props => props.theme.colours.highlight};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: ${props => props.theme.fontSizes.lg};
  }
`;

const Navigation = styled.nav<{ $isOpen: boolean }>`
  display: flex;
  gap: ${props => props.theme.space.lg};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    position: fixed;
    top: 0;
    right: ${props => props.$isOpen ? '0' : '-70%'};
    flex-direction: column;
    background-color: ${props => props.theme.colours.secondary};
    height: 100vh;
    width: 70%;
    padding: ${props => props.theme.space.xl};
    z-index: 20;
    transition: right 0.3s ease;
    box-shadow: ${props => props.$isOpen ? props.theme.shadows.lg : 'none'};
  }
`;

const NavItem = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.space.xs};
  color: ${props => props.$active ? props.theme.colours.highlight : props.theme.colours.text};
  text-decoration: none;
  padding: ${props => `${props.theme.space.xs} ${props.theme.space.sm}`};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: ${props => props.$active ? props.theme.colours.highlight : props.theme.colours.text};
  }
  
  svg {
    font-size: 1.2em;
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: ${props => props.theme.space.md};
    font-size: ${props => props.theme.fontSizes.lg};
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${props => props.theme.colours.text};
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 30;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  display: ${props => props.$isOpen ? 'block' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 15;
`;

const Main = styled.main`
  flex: 1;
  padding: ${props => props.theme.space.lg};
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  overflow-y: auto;
  overflow-x: hidden;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: ${props => props.theme.space.md};
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.space.md} ${props => props.theme.space.sm};
  }
`;

export const Layout: React.FC<LayoutProps> = ({ children, hideNav = false }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isActive = (path: string): boolean => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    return location.pathname.startsWith(path) && path !== '/';
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <LayoutContainer>
      {!hideNav && (
        <Header>
          <Link to="/" className="no-decoration">
            <Logo>THROWDOWN</Logo>
          </Link>
          <MenuButton onClick={toggleMenu}>
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </MenuButton>
          <Overlay $isOpen={isMenuOpen} onClick={closeMenu} />
          <Navigation $isOpen={isMenuOpen}>
            <NavItem to="/" $active={isActive('/')} onClick={closeMenu}>
              <FiHome />
              Home
            </NavItem>
            <NavItem to="/games" $active={isActive('/games')} onClick={closeMenu}>
              <FiGrid />
              Games
            </NavItem>
            <NavItem to="/players" $active={isActive('/players')} onClick={closeMenu}>
              <FiUsers />
              Players
            </NavItem>
            {/* <NavItem to="/settings" $active={isActive('/settings')} onClick={closeMenu}>
              <FiSettings />
              Settings
            </NavItem> */}
          </Navigation>
        </Header>
      )}
      <Main>{children}</Main>
      {/* {!hideNav && (
        <Footer>ThrowDown Darts App &copy; {new Date().getFullYear()}</Footer>
      )} */}
    </LayoutContainer>
  );
};

export default Layout;