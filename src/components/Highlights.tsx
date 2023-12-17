import React, { useContext, useEffect, useState } from "react";
import { Grid, Image, Text, View, Heading, Flex, ActionButton, Well } from "@adobe/react-spectrum";
import Delete from "@spectrum-icons/workflow/Delete";
import { Highlight } from "../types";
import { getHighlights, deleteHighlight } from "../firease/highlights.api";
import { DashboardContext } from "../contexts";
import { ToastQueue } from "@react-spectrum/toast";
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

// create highlight using adobe react spectrum
const Highlights = () => {

    const { user } = useContext(DashboardContext)
    const [highlights, setHighlights] = useState<Highlight[]>([]);

    // get highlights
    useEffect(() => {
        const storage = getStorage();

        (async () => {
            const highlights = await getHighlights(user);
            const highlightsWithImage = await Promise.all(
                highlights.map(async (highlight) => {
                    const imageRef = ref(storage, highlight.book_image_url);
                    const url = await getDownloadURL(imageRef);
                    return { ...highlight, book_image_url: url };
                })
            );
            setHighlights(highlightsWithImage);
            console.log("highlights fetched", highlights)
        })();
    }, [user])

    // delete highlight
    const handleDelete = (id: string) => {
        console.log("deleting highlight", id)
        deleteHighlight(user, id);
        setHighlights(highlights.filter(highlight => highlight.id !== id));
        ToastQueue.negative("Highlight deleted", { timeout: 1000 })
    }

    return (
        <Grid
            UNSAFE_style={{ overflow: "auto" }}
            height="100%"
            gap="size-100"
        >
            {highlights.map((highlight: Highlight) =>
                <View
                    key={highlight.id}
                    borderBottomWidth={highlights.length - 1 === highlights.indexOf(highlight) ? undefined : "thin"}
                    borderColor="dark"
                    padding="size-200">
                    <Grid
                        areas={[
                            'image content actions',
                        ]}
                        columns={['auto', '1fr', 'auto']}
                        gap="size-100">
                        <Image
                            gridArea="image"
                            src={highlight.book_image_url}
                            alt={highlight.book_title}
                            UNSAFE_style={
                                {
                                    width: '100%',
                                    height: '100%',
                                    maxHeight: '138px'
                                }}
                        />
                        <Grid
                            areas={['header', 'content']}
                            columns={['1fr']}
                            rows={['auto', '1fr']}
                            height="100%"
                            gap="size-100"
                        >
                            <View gridArea="header">
                                <Flex alignItems="center" gap="size-100">
                                    <Heading level={3} margin="size-0">
                                        {highlight.book_title}
                                    </Heading>
                                    <View UNSAFE_style={{ color: 'grey' }}>
                                        <Text>by {highlight.book_author}</Text>
                                    </View>
                                </Flex>
                            </View>

                            <View gridArea="content">
                                <Well>{highlight.text}</Well>
                            </View>
                        </Grid>
                        <View gridArea="actions">
                            <ActionButton onPress={() => handleDelete(highlight.id as string)}>
                                <Delete />
                            </ActionButton>
                        </View>
                    </Grid>
                </View>
            )}
        </Grid>
    );
};

export default Highlights;
