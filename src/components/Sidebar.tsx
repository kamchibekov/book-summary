import React, { useContext, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Book from "@mui/icons-material/Book";
import BookmarkSingle from "@mui/icons-material/Bookmarks";
import LibraryBooks from "@mui/icons-material/LibraryBooks";
import Logout from '@mui/icons-material/Logout';
import Box from "@mui/material/Box";
import Strings from "../config/strings";
import Constants from "../config/constants";
import { Link } from 'react-router-dom';
import URL from "../config/routes";
import { DashboardContext } from "../contexts";
import { signOut } from "../api/auth.api";


const Sidebar = ({ isSidebarOpen, drawerToggle }: { isSidebarOpen: boolean, drawerToggle: () => void }) => {
    const { user } = useContext(DashboardContext);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuClick = (event: React.MouseEvent<HTMLLIElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleAction = async () => {
        await signOut();
        window.location.reload();
    };

    return (
        <>
            <Drawer
                // variant="persistent"
                open={isSidebarOpen}
                onClose={drawerToggle}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
                    <List>
                        <ListItem component={Link} to={URL.Dashboard} sx={{ color: 'inherit' }} onClick={drawerToggle}>
                            <ListItemIcon>
                                <Book />
                            </ListItemIcon>
                            <ListItemText primary={Strings.todaysBlink} />
                        </ListItem>
                        <ListItem component={Link} to={URL.Library} sx={{ color: 'inherit' }} onClick={drawerToggle}>
                            <ListItemIcon>
                                <LibraryBooks />
                            </ListItemIcon>
                            <ListItemText primary={Strings.library} />
                        </ListItem>
                        <ListItem component={Link} to={URL.Highlights} sx={{ color: 'inherit' }} onClick={drawerToggle}>
                            <ListItemIcon>
                                <BookmarkSingle />
                            </ListItemIcon>
                            <ListItemText primary={Strings.highlights} />
                        </ListItem>
                        { /* make this an anchor to show menu on click */}
                    </List>
                </Box>

                <List>
                    <Divider />
                    <ListItem onClick={handleMenuClick}>
                        <ListItemIcon>
                            <Avatar alt={user?.displayName as string} src={user?.photoURL as string} />
                        </ListItemIcon>
                        <ListItemText primary={user?.displayName} />
                    </ListItem>
                </List>
            </Drawer>
            <React.Fragment>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    keepMounted
                >
                    {/* <Divider /> */}
                    <MenuItem onClick={handleAction}>
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Logout</ListItemText>
                    </MenuItem>
                </Menu>
            </React.Fragment>
        </>
    );
};


export default Sidebar;