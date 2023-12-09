import React from 'react';
import { Avatar, Text, Menu, MenuTrigger, Item, ActionButton } from '@adobe/react-spectrum';
import { signOut } from './auth'
import LogOutIcon from "@spectrum-icons/workflow/LogOut";

const Profile = ({ user, isSidebarOpen }) => {

    const handleAction = async (key) => {
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

async function handleSignOut() {
    try {
        await signOut();
        // Do something after sign-out (e.g., update UI)
    } catch (error) {
        // Handle sign-out error
    }
}

export default Profile;
