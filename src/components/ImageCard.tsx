import React, { useContext, useEffect, useState } from "react";
import { View, Image, Heading, Text, Button, Grid, Flex } from "@adobe/react-spectrum";
import { DashboardContext } from "../contexts";
import Constants from "../constants";
import { Book } from "../types";
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

const ImageCard = ({ index, book, token }) => {
    const { setSelectedAction, setSelectedSummary } = useContext(DashboardContext)
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
        setSelectedAction(Constants.SUMMARY_CONTENT)
        setSelectedSummary(index)
    }

    return (
        <View
            borderWidth="thin"
            borderColor="dark"
            borderRadius="medium"
            padding="size-100">

            <Grid
                areas={[
                    'sidebar content',
                ]}
                columns={['1fr', '3fr']}
                gap="size-100">
                <View backgroundColor="blue-600" gridArea="sidebar">
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
                            Read
                        </Button>
                    </View>
                </Grid>
            </Grid>
        </View>

    );
};

export default ImageCard;