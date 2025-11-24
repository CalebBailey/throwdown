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

const StyledButton = styled.button<{
  $variant?: ButtonVariant;
  $size?: ButtonSize;
  $fullWidth?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.space.sm};
  font-family: ${props => props.theme.fonts.primary};
  font-weight: 600;
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  touch-action: manipulation; /* Improves touch interactions */
  
  ${props => props.$fullWidth && css`
    width: 100%;
  `}
  
  /* Size variants */
  ${props => {
    switch(props.$size) {
      case 'small':
        return css`
          padding: ${props.theme.space.xs} ${props.theme.space.md};
          font-size: ${props.theme.fontSizes.sm};
          
          @media (max-width: ${props.theme.breakpoints.mobile}) {
            padding: calc(${props.theme.space.xs} + 2px) ${props.theme.space.md};
            min-height: 36px; /* Ensures better touch target */
          }
        `;
      case 'large':
        return css`
          padding: ${props.theme.space.md} ${props.theme.space.lg};
          font-size: ${props.theme.fontSizes.lg};
          
          @media (max-width: ${props.theme.breakpoints.mobile}) {
            padding: ${props.theme.space.sm} ${props.theme.space.lg};
          }
          
          @media (max-height: 600px) and (orientation: landscape) {
            padding: ${props.theme.space.sm} ${props.theme.space.md};
            font-size: ${props.theme.fontSizes.md};
          }
        `;
      default: // medium
        return css`
          padding: ${props.theme.space.sm} ${props.theme.space.md};
          font-size: ${props.theme.fontSizes.md};
          
          @media (max-width: ${props.theme.breakpoints.mobile}) {
            min-height: 40px; /* Ensures better touch target */
          }
        `;
    }
  }}
  
  /* Style variants */
  ${props => {
    switch(props.$variant) {
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
            transform: none;
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
            transform: none;
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
            transform: none;
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
            transform: none;
          }
        `;
    }
  }}
  
  /* Icon spacing adjustments */
  .start-icon {
    margin-right: 2px;
    display: flex;
    align-items: center;
  }
  
  .end-icon {
    margin-left: 2px;
    display: flex;
    align-items: center;
  }
  
  /* Mobile touch states */
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    &:active {
      opacity: 0.8;
    }
  }
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
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      {...rest}
    >
      {startIcon && <span className="start-icon">{startIcon}</span>}
      {children}
      {endIcon && <span className="end-icon">{endIcon}</span>}
    </StyledButton>
  );
};

export default Button;