import React, { useState, useContext, useEffect, useRef, createContext } from "react";
import { Button, View, Grid, Heading, Flex } from '@adobe/react-spectrum';
import ChevronRight from "@spectrum-icons/workflow/ChevronRight";
import ChevronLeft from "@spectrum-icons/workflow/ChevronLeft";
import { DashboardContext } from "../contexts";
import TextSelection from "./TextSelection";
import { saveHighlight } from "../firease/highlights.api";
import { Highlight } from "../types";

const MultiPageContent = ({ setFinishedCallback, initialPage = 0 }) => {
    const { summary } = useContext(DashboardContext)
    const { user } = useContext(DashboardContext);

    if (summary === null) return <></>

    const [currentPage, setCurrentPage] = useState(initialPage);
    const data = JSON.parse(summary['summary'])
    const currentPageRef = useRef(currentPage);
    const [selection, setSelection] = useState<Selection | null>(null);

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

    const handleMouseUp = (text: string) => {
        const selection = window.getSelection();
        const selected = selection?.toString().trim() || "";

        // Normalize strings by removing whitespace and non-printable characters
        const normalizedText = text.replace(/\s+/g, ' ').trim();
        const normalizedSelected = selected.replace(/\s+/g, ' ').trim();

        if (selected && normalizedText.includes(normalizedSelected)) {
            setSelection(selection);
        } else {
            setSelection(null);
        }
    };

    const handleSaveHighlight = (highlight: Highlight) => {
        saveHighlight(user, highlight)
        setSelection(null)
    }

    const pages = Object.entries(data).map(([key, value]) => <Grid
        columns="1fr"
        rowGap="size-100"

    >
        <View padding="size-300" paddingBottom="size-0"><Heading level={3}>{key}</Heading></View>
        <View
            paddingStart="size-300"
            paddingEnd="size-300"
            paddingBottom="size-300"
            UNSAFE_style={{ fontSize: '1rem', fontFamily: '"Comic Sans MS", Impact, Handlee, fantasy' }}>
            <p onMouseUp={() => handleMouseUp(value as string)}>{value as React.ReactNode}</p>
            {selection && (<TextSelection selection={selection} callback={handleSaveHighlight} />)}
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