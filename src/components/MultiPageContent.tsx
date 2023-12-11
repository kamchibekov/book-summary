import React, { useState, useContext, useEffect, useRef } from "react";
import { Button, View, Grid, Heading, Text, Flex } from '@adobe/react-spectrum';
import ChevronRight from "@spectrum-icons/workflow/ChevronRight";
import ChevronLeft from "@spectrum-icons/workflow/ChevronLeft";
import { DashboardContext } from "../contexts";

const MultiPageContent = ({ setFinishedCallback, initialPage = 0 }) => {
    const { summary } = useContext(DashboardContext)
    if (summary === null) return <></>

    const [currentPage, setCurrentPage] = useState(initialPage);
    const [isToasted, setIsToasted] = useState(false);
    const data = JSON.parse(summary['summary'])
    const currentPageRef = useRef(currentPage);

    useEffect(() => {
        currentPageRef.current = Math.max(currentPage, currentPageRef.current);

    }, [currentPage]);
    useEffect(() => {
        // Your component did mount logic here

        return () => {

            console.log("paging: ", currentPageRef.current, pages.length - 1)

            // Your component will unmount logic here
            if (currentPageRef.current >= pages.length - 1) {
                // set book finished on last page
                console.log("call finish read un unmount");
                setFinishedCallback();
            }

            console.log('Component is unmounted');
        };
    }, []);


    const pages = Object.entries(data).map(([key, value]) => <Grid
        columns="1fr"
        rowGap="size-100"

    >
        <View padding="size-300" paddingBottom="size-0"><Heading level={3}>{key}</Heading></View>
        <View padding="size-300" UNSAFE_style={{ fontSize: '1rem' }}>
            <Text>{value as React.ReactNode}</Text>
        </View>
    </Grid>
    )

    const handlePrevClick = () => setCurrentPage(currentPage - 1);

    const handleNextClick = () => {
        setCurrentPage((prevPage) => {
            const newPage = prevPage + 1;
            return newPage;
        });
    };


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