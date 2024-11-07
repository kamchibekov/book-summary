import React, { useState, useContext, useEffect, useRef } from "react";
import IconButton from "@mui/material/IconButton";
import Grid from '@mui/material/Unstable_Grid2';
import Typography from "@mui/material/Typography";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import Box from "@mui/material/Box";
import { DashboardContext } from "../contexts";
import TextSelection from "./TextSelection";
import { saveHighlight } from "../api/highlights.api";
import { HighlightText } from "../config/types";
import { useTheme } from "@mui/material/styles";
import { setBookFinished } from "../api/books.api";
import Button from "@mui/material/Button";
import Strings from "../config/strings";
import { useAlert } from "../providers/AlertProvider";

interface Props {
    showSaveButton?: boolean;
}

function MultiPageContent({ showSaveButton = true }: Props) {
    const theme = useTheme();
    const { readingBook, user } = useContext(DashboardContext)

    if (readingBook === null) return <></>

    const { pushAlert } = useAlert();

    const [currentPage, setCurrentPage] = useState(0);
    const data = JSON.parse(readingBook['summary'])
    const [selection, setSelection] = useState<Selection | null>(null);

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

    const handleSaveHighlight = (highlightText: HighlightText) => {
        saveHighlight(user, highlightText, readingBook)
        setSelection(null)
    }

    const handleFinishRead = () => {
        setBookFinished(user, readingBook.id)
        pushAlert('success', Strings.marked_finished);
    }

    const pages = Object.entries(data).map(([key, value]) => (
        <Box key={key} whiteSpace='pre-wrap'>
            <Typography variant="h6" align="center">{key}</Typography>
            <br />
            <Box
                onMouseUp={() => handleMouseUp(value as string)}
                sx={{ fontSize: '1.125rem', lineHeight: '1.625rem', color: theme.palette.mode === 'dark' ? theme.palette.text.secondary : '#3a4649' }}
            >
                {value as React.ReactNode}
            </Box>
            {selection && (
                <TextSelection
                    selection={selection}
                    saveHighlight={handleSaveHighlight}
                />
            )}
        </Box>
    ));

    return (
        <Grid container mt={2} mb={2}>
            {pages[currentPage]}
            <Box sx={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }} mt={2}>
                {currentPage > 0 && (
                    <IconButton aria-label="delete" size="small" onClick={() => setCurrentPage(currentPage - 1)}>
                        <ChevronLeft />
                    </IconButton>
                )}
                {currentPage < pages.length - 1 && (
                    <IconButton aria-label="delete" size="small" onClick={() => setCurrentPage(currentPage + 1)}>
                        <ChevronRight />
                    </IconButton>
                )}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'start', width: '100%' }} mt={4}>
                <Typography variant="h6" color={theme.palette.text.secondary}>
                    {currentPage + 1}/{pages.length}
                </Typography>
            </Box>
            {showSaveButton && currentPage === pages.length - 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'end', width: '100%' }} mt={4}>
                    <Button variant="contained" onClick={handleFinishRead}>
                        {Strings.set_finished}
                    </Button>
                </Box>
            )}
        </Grid>
    );
};

export default MultiPageContent;