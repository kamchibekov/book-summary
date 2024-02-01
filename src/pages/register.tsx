import { Flex, View, Text, ActionButton, Heading, Image } from "@adobe/react-spectrum";
import React from "react";
import { Navigate } from "react-router-dom";
import { signInWithGoogle } from "../components/auth";
import Constants from "../constants"
import Strings from "../strings"
import URL from "../routes"

// import Logo from "../../public/icons/icon-192x192.png"

const RegisterPage = () => {

    return <Flex direction="column" height="100vh" gap="size-100" justifyContent="center" alignItems="center">
        <View
            borderWidth="thin"
            borderColor="gray-300"
            borderRadius="medium"
            padding="size-100"
        >
            <Flex
                direction="row"
                gap="size-100"
                height="size-800"
                alignItems="center"
            >
                <img
                    src={URL.Icon}
                    alt={Strings.app_logo_text}
                    style={{
                        maxHeight: "100%",
                        borderRadius: "6px"
                    }}
                />
                <Heading level={1}>{Strings.APP_NAME}</Heading>
            </Flex>
        </View>
        <Flex
            marginTop="size-200"
            justifyContent="center"
        >
            <ActionButton onPress={handleSignIn}>
                <Text>{Strings.sign_in_google}</Text>
            </ActionButton>
        </Flex>
    </Flex>
}

export default RegisterPage;

// Example usage
async function handleSignIn() {
    try {
        const user = await signInWithGoogle();
        // Do something with the user object (e.g., update UI)
    } catch (error) {
        // Handle sign-in error
    }
}