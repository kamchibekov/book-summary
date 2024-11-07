import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';

interface HeaderProps {
    drawerToggle: () => void
}

const Header = ({ drawerToggle }: HeaderProps) => {

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar
                position="static"
                sx={{
                    // width: { sm: `calc(100% - ${isSidebarOpen ? drawerWidth : 0}px)` },
                    // ml: { sm: `${isSidebarOpen ? drawerWidth : 0}px` },
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    // transition: 'width 0.2s ease-in-out, margin-left 0.2s ease-in-out',
                }}
            >
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={drawerToggle}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Header;