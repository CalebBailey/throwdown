import React from 'react';
import styled, { css } from 'styled-components';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: React.ReactNode;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const StyledButton = styled.button<Omit<ButtonProps, 'children'>>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.space.sm};
  font-family: ${props => props.theme.fonts.primary};
  font-weight: 600;
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  
  ${props => props.fullWidth && css`
    width: 100%;
  `}
  
  /* Size variants */
  ${props => {
    switch(props.size) {
      case 'small':
        return css`
          padding: ${props.theme.space.xs} ${props.theme.space.md};
          font-size: ${props.theme.fontSizes.sm};
        `;
      case 'large':
        return css`
          padding: ${props.theme.space.md} ${props.theme.space.lg};
          font-size: ${props.theme.fontSizes.lg};
        `;
      default: // medium
        return css`
          padding: ${props.theme.space.sm} ${props.theme.space.md};
          font-size: ${props.theme.fontSizes.md};
        `;
    }
  }}
  
  /* Style variants */
  ${props => {
    switch(props.variant) {
      case 'secondary':
        return css`
          background-color: ${props.theme.colors.accent};
          color: ${props.theme.colors.text};
          border: none;
          
          &:hover {
            background-color: ${props.theme.colors.lightAccent};
          }
          
          &:active {
            transform: translateY(1px);
          }
          
          &:disabled {
            background-color: ${props.theme.colors.secondary};
            opacity: 0.6;
            cursor: not-allowed;
          }
        `;
      case 'outline':
        return css`
          background-color: transparent;
          color: ${props.theme.colors.text};
          border: 2px solid ${props.theme.colors.text};
          
          &:hover {
            background-color: rgba(255, 255, 255, 0.1);
          }
          
          &:active {
            transform: translateY(1px);
          }
          
          &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        `;
      case 'text':
        return css`
          background-color: transparent;
          color: ${props.theme.colors.text};
          border: none;
          
          &:hover {
            background-color: rgba(255, 255, 255, 0.1);
          }
          
          &:active {
            transform: translateY(1px);
          }
          
          &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        `;
      default: // primary
        return css`
          background-color: ${props.theme.colors.highlight};
          color: ${props.theme.colors.text};
          border: none;
          
          &:hover {
            background-color: #D1324D; /* Darker shade of highlight */
          }
          
          &:active {
            transform: translateY(1px);
          }
          
          &:disabled {
            background-color: ${props.theme.colors.highlight};
            opacity: 0.6;
            cursor: not-allowed;
          }
        `;
    }
  }}
`;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  children,
  startIcon,
  endIcon,
  ...rest
}) => {
  return (
    <StyledButton 
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      {...rest}
    >
      {startIcon && <span className="start-icon">{startIcon}</span>}
      {children}
      {endIcon && <span className="end-icon">{endIcon}</span>}
    </StyledButton>
  );
};

export default Button;