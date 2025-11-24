import React from 'react';
import styled from 'styled-components';

interface CardProps {
  children: React.ReactNode;
  elevation?: 'low' | 'medium' | 'high';
  clickable?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  className?: string;
}

const StyledCard = styled.div<{
  elevation?: 'low' | 'medium' | 'high';
  $clickable?: boolean;
  $fullWidth?: boolean;
}>`
  background-color: ${props => props.theme.colors.secondary};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.space.lg};
  color: ${props => props.theme.colors.text};
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  /* Elevation variants */
  ${props => {
    switch(props.elevation) {
      case 'low':
        return `box-shadow: ${props.theme.shadows.sm};`;
      case 'high':
        return `box-shadow: ${props.theme.shadows.lg};`;
      default: // medium
        return `box-shadow: ${props.theme.shadows.md};`;
    }
  }}
  
  ${props => props.$clickable && `
    cursor: pointer;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: ${props.theme.shadows.lg};
    }
    
    &:active {
      transform: translateY(-2px);
    }
  `}
`;

const CardHeader = styled.div`
  margin-bottom: ${props => props.theme.space.md};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: ${props => props.theme.space.md};
`;

const CardTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.xl};
  margin-bottom: ${props => props.theme.space.xs};
`;

const CardSubtitle = styled.p`
  font-size: ${props => props.theme.fontSizes.md};
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
`;

const CardContent = styled.div`
  /* Content styling */
`;

const CardFooter = styled.div`
  margin-top: ${props => props.theme.space.md};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: ${props => props.theme.space.md};
  display: flex;
  justify-content: flex-end;
`;

export const Card: React.FC<CardProps> & {
  Header: typeof CardHeader;
  Title: typeof CardTitle;
  Subtitle: typeof CardSubtitle;
  Content: typeof CardContent;
  Footer: typeof CardFooter;
} = ({
  children,
  elevation = 'medium',
  clickable = false,
  fullWidth = false,
  onClick,
  className,
}) => {
  return (
    <StyledCard
      elevation={elevation}
      $clickable={clickable}
      $fullWidth={fullWidth}
      onClick={onClick}
      className={className}
    >
      {children}
    </StyledCard>
  );
};

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Subtitle = CardSubtitle;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;