import React, { useContext, useEffect, useState } from "react";
import { View, Image, Heading, Text, Button, Grid, Flex } from "@adobe/react-spectrum";
import { DashboardContext } from "../contexts";
import Constants from "../constants";
import { Book } from "../types";
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

const ImageCard = ({ book, onRead }) => {
    const { selectedAction, setSelectedAction, setSummary, summary } = useContext(DashboardContext)
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        const storage = getStorage();
        const imageRef = ref(storage, book.image_url);

        getDownloadURL(imageRef)
            .then((url) => {
                setImageUrl(url);
            })
            .catch((error) => {

                console.error(error);
            });
    }, []);

    const handleContentChange = () => {

        if (selectedAction === Constants.SIDEBAR_TODAY) {
            onRead(true)
            console.log("reading")
        } else {
            onRead(false)
            console.log("library reading")
        }

        setSummary(book)
        setSelectedAction(Constants.SUMMARY_CONTENT)
    }

    return (
        <View
            borderWidth="thin"
            borderColor="dark"
            borderRadius="medium"
            padding="size-100">

            <Grid
                areas={[
                    'image content',
                ]}
                columns={['1fr', '3fr']}
                gap="size-100">
                <View backgroundColor="blue-600" gridArea="image">
                    <Image
                        src={imageUrl}
                        alt={book.title}
                    />
                </View>
                <Grid
                    areas={['header', 'description', 'footer']}
                    columns={['1fr']}
                    rows={['auto', '1fr', 'auto']}
                    height="100%"
                    gap="size-100"
                >
                    <View gridArea="header">
                        <View>
                            <Heading level={3}>
                                {book.title}
                            </Heading>
                            <View marginTop="-10px"
                                UNSAFE_style={{ color: 'grey' }}>
                                <Text>by {book.author}</Text>
                            </View>
                        </View>
                    </View>

                    <View gridArea="description">
                        <Text>{book.description}</Text>
                    </View>

                    <View gridArea="footer">
                        <Button variant="secondary" onPress={handleContentChange}>
                            {book.id === summary?.id ? "Continue reading" : "Read"}
                        </Button>
                    </View>
                </Grid>
            </Grid>
        </View>

    );
};

export default ImageCard;