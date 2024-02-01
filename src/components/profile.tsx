import React, { useContext } from 'react';
import { Avatar, Text, Menu, MenuTrigger, Item, ActionButton, Key } from '@adobe/react-spectrum';
import { signOut } from './auth'
import LogOutIcon from "@spectrum-icons/workflow/LogOut";
import { DashboardContext } from '../contexts';

const Profile = ({ isSidebarOpen }) => {

    const { user }: { user: any } = useContext(DashboardContext)

    const handleAction = async (key: Key) => {
        if (key === "logout") {
            await signOut();
        }
    };

    return (
        <MenuTrigger shouldFlip>
            <ActionButton
                isQuiet
                alignSelf="center"
            >
                <Avatar src={user.photoURL} alt={user.displayName} size="600" />
                {isSidebarOpen ? <Text>&nbsp;{user.displayName}</Text> : ''}

            </ActionButton>
            <Menu onAction={handleAction}>
                <Item key="logout" textValue="logout">
                    <LogOutIcon />
                    <Text>Log out</Text>
                </Item>
            </Menu>
        </MenuTrigger>
    );
};

export default Profile;
