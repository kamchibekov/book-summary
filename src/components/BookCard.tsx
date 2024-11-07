import React, { useContext, useEffect, useState } from "react";
import { Link } from 'react-router-dom';
// imort separate components
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import { DashboardContext } from "../contexts";
import { Book } from "../config/types";
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

interface BookCardProps {
    book: Book;
    url: string;
}

const BookCard = ({ book, url }: BookCardProps) => {
    const { readingBook, setReadingBook } = useContext(DashboardContext);
    const [imageUrl, setImageUrl] = useState('');
    const storage = getStorage();

    useEffect(() => {
        if (!book.image_url) return; // Don't proceed if image_url is not set

        const imageRef = ref(storage, book.image_url);

        getDownloadURL(imageRef)
            .then((url) => {
                setImageUrl(url);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [book.image_url]);

    return (
        <Grid container spacing={2} mt={2}>
            <Grid xs={12} md={3} sm={4}>
                <img src={imageUrl} alt={book.title} />
            </Grid>
            <Grid xs={12} md={9} sm={8}>
                <Box sx={{ p: 1 }}>
                    <Typography gutterBottom variant="h5" component="div">
                        {book.title}
                        <Typography variant="subtitle1" color="text.secondary" component="div">
                            by {book.author}
                        </Typography>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {book.description}
                    </Typography>
                </Box>
                <Box>
                    <Button
                        variant="text"
                        onClick={() => setReadingBook(book)}
                        component={Link}
                        to={url.replace(':bookTitle', toUrlFriendly(book.title))}>
                        {book.id === readingBook?.id ? "Continue reading" : "Read"}
                    </Button>
                </Box>
            </Grid>
        </Grid>
    );
};

export default BookCard;

function toUrlFriendly(title: string): string {
    // Replace spaces with dashes
    let urlFriendlyText = title.replace(/\s+/g, '-');

    // Remove special characters
    urlFriendlyText = urlFriendlyText.replace(/[^\w\s-]/g, '');

    // Convert to lowercase
    urlFriendlyText = urlFriendlyText.toLowerCase();

    return urlFriendlyText;
}