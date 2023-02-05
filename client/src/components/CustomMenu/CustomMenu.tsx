import React, { ReactNode } from 'react';
import { Menu } from '@mui/material';

interface CustomMenuProps {
  children?: ReactNode;
  open: boolean;
  anchorEl?: HTMLElement;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  onClose?: () => void;
}

export function CustomMenu({ children, open, anchorEl, onClick, onClose }: CustomMenuProps) {
  return (
    <Menu
      open={open}
      anchorEl={anchorEl}
      onClick={onClick}
      onClose={onClose}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 12px rgba(0,0,0,0.2))',
          mt: 1.5,
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      {children}
    </Menu>
  );
}
