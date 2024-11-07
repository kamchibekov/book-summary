import React, { useContext, useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import { signOut } from '../api/auth.api'
import Logout from '@mui/icons-material/Logout';
import { DashboardContext } from '../contexts';

const Profile = () => {

    const { user }: { user: any } = useContext(DashboardContext)

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleAction = async () => {
        await signOut();
    };

    return (
        <Button
            onClick={(e) => setAnchorEl(e.currentTarget)}
            startIcon={<Avatar src={user.photoURL} alt={user.displayName} />}
        >
            {<Typography>&nbsp;{user.displayName}</Typography>}
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <Divider />
                <MenuItem onClick={handleAction}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                </MenuItem>
            </Menu>
        </Button>
    );
};

export default Profile;