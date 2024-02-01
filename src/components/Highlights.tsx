import React, { useContext, useEffect, useState } from "react";
import { Grid, Image, Text, View, Heading, Flex, ActionButton, Well, Button } from "@adobe/react-spectrum";
import Delete from "@spectrum-icons/workflow/Delete";
import { BookHighlight } from "../types";
import { getHighlights, deleteHighlight } from "../firease/highlights.api";
import { DashboardContext } from "../contexts";
import { ToastQueue } from "@react-spectrum/toast";
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import ChevronDown from "@spectrum-icons/workflow/ChevronDown";

// create highlight using adobe react spectrum
const Highlights = () => {

    const { user } = useContext(DashboardContext)
    const [highlights, setHighlights] = useState<BookHighlight[]>([]);
    const [currentKey, setCurrentKey] = useState<null | string>(null);
    const [isLastPage, setIsLastPage] = useState<string | boolean | undefined>(false);
    
    // get highlights
    useEffect(() => {
        const storage = getStorage();

        (async () => {
            const { groupedHighlights, isLastPage } = await getHighlights(user, currentKey);
            const highlightsWithImage = await Promise.all(
                groupedHighlights.map(async (highlight) => {
                    const imageRef = ref(storage, highlight.book_image_url);
                    const url = await getDownloadURL(imageRef);
                    return { ...highlight, book_image_url: url };
                })
            );

            // Regroup and set highlights
            setHighlights((prevHighlights) => {
                const updatedHighlights = [...prevHighlights];

                highlightsWithImage.forEach((newHighlight) => {
                    const existingBookIndex = updatedHighlights.findIndex(
                        (book) => book.book_id === newHighlight.book_id
                    );

                    if (existingBookIndex !== -1) {
                        // Book exists, merge the highlights
                        updatedHighlights[existingBookIndex].highlights.push(...newHighlight.highlights);
                    } else {
                        // Book doesn't exist, add the entire book with highlights
                        updatedHighlights.push(newHighlight);
                    }
                });

                return updatedHighlights;
            });

            // Set last page or last highlight
            setIsLastPage(isLastPage);

            console.log("highlights fetched", groupedHighlights, isLastPage)
        })();
    }, [currentKey])

    // delete highlight
    const handleDelete = (book_id: string, id: string) => {
        console.log("deleting highlight", id)
        deleteHighlight(user, id);

        setHighlights(prevHighlights => {
            // find book index
            const index = prevHighlights.findIndex(bookHighlight => bookHighlight.book_id === book_id);
            // remove highlight from book highlights
            const updatedBookHighlights = [...prevHighlights];
            updatedBookHighlights[index].highlights = updatedBookHighlights[index].highlights.filter(
                highlight => highlight.id !== id
            )
            return updatedBookHighlights;
        });

        ToastQueue.negative("Highlight deleted", { timeout: 1000 })
    }

    const handleNextClick = () => {
        if (typeof isLastPage === 'string')
            setCurrentKey(isLastPage);
    };

    return (
        <Grid
            UNSAFE_style={{ overflow: "auto" }}
            height="100%"
            gap="size-100"
        >
            {highlights.map((bookHighlight: BookHighlight) =>
                <View
                    key={bookHighlight.book_id}
                    borderBottomWidth={highlights.length - 1 === highlights.indexOf(bookHighlight) ? undefined : "thin"}
                    borderColor="dark"
                    padding="size-200">
                    <Grid
                        areas={[
                            'image content',
                        ]}
                        columns={['auto', '1fr']}
                        gap="size-100">
                        <Image
                            gridArea="image"
                            src={bookHighlight.book_image_url}
                            alt={bookHighlight.book_title}
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
                                        {bookHighlight.book_title}
                                    </Heading>
                                    <View UNSAFE_style={{ color: 'grey' }}>
                                        <Text>by {bookHighlight.book_author}</Text>
                                    </View>
                                </Flex>
                            </View>

                            <Grid gridArea="content">
                                {bookHighlight.highlights.map((highlight, i) =>
                                    <Grid
                                        key={i}
                                        columns={['1fr', 'auto']}
                                        gap="size-100"
                                        alignItems="center"
                                    >
                                        <Well>{highlight.text}</Well>
                                        <View>
                                            <ActionButton onPress={() => handleDelete(bookHighlight.book_id, highlight.id as string)}>
                                                <Delete />
                                            </ActionButton>
                                        </View>
                                    </Grid>
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                </View>
            )}
            <Flex
                justifyContent="space-evenly"
                marginTop="size-100">
                {isLastPage !== true && (
                    <Button variant="secondary" onPress={handleNextClick}>
                        <ChevronDown />
                    </Button>
                )}
            </Flex>
        </Grid>
    );
};

export default Highlights;
