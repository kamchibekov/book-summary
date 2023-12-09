import React, { useState } from "react";
import { Button, View, Grid, Heading, Text, Flex } from '@adobe/react-spectrum';
import ChevronRight from "@spectrum-icons/workflow/ChevronRight";
import ChevronLeft from "@spectrum-icons/workflow/ChevronLeft";


const MultiPageContent = ({ content, initialPage = 0 }) => {
    const [currentPage, setCurrentPage] = useState(initialPage);

    const handlePrevClick = () => setCurrentPage(currentPage - 1);
    const handleNextClick = () => setCurrentPage(currentPage + 1);

    const pages = Object.entries(content).map(([key, value]) => <Grid
        columns="1fr"
        rowGap="size-100"

    >
        <View padding="size-300" paddingBottom="size-0"><Heading level={3}>{key}</Heading></View>
        <View padding="size-300" UNSAFE_style={{fontSize: '1rem'}}>
            <Text>{value as React.ReactNode}</Text>
        </View>
    </Grid>
    )

    return (
        <Grid
            height="100%"
            UNSAFE_style={{ overflow: "auto" }}
        >
            <View>
                {pages[currentPage]}
            </View>
            <Flex
                justifyContent="space-evenly"
                marginTop="size-100">
                {currentPage > 0 && (
                    <Button variant="secondary" onPress={handlePrevClick}>
                        <ChevronLeft />
                    </Button>
                )}
                {currentPage < pages.length - 1 && (
                    <Button variant="secondary" onPress={handleNextClick}>
                        <ChevronRight />
                    </Button>
                )}
            </Flex>
        </Grid>
    );
};

export default MultiPageContent;