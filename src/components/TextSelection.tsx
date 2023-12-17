import React, { useContext } from 'react';
import { View, ActionButton, Text } from '@adobe/react-spectrum';
import BookmarkSingle from '@spectrum-icons/workflow/BookmarkSingle';
import { ToastQueue } from '@react-spectrum/toast';
import { DashboardContext } from '../contexts';
import { Book, Highlight } from '../types';

const TextSelection = ({ selection, callback }) => {
    const { summary } = useContext(DashboardContext)

    const handleIconClick = () => {
        ToastQueue.positive('Highlight added!', { timeout: 1000 });
        if (summary) {
            const highlight: Highlight = {
                text: selection.toString().trim(),
                book_id: summary?.id,
                book_title: summary?.title,
                book_author: summary?.author,
                book_image_url: summary?.image_url,

            };
            callback(highlight);
        }
    };

    const positionIcon = () => {
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            const iconTop = rect.top + window.scrollY - 30; // Adjust as needed
            const iconLeft = rect.left + window.scrollX + rect.width / 2 - 15; // Adjust as needed
            return { top: iconTop, left: iconLeft };
        }
    };

    return (
        <View UNSAFE_style={{ position: 'absolute', ...positionIcon() }}>
            <ActionButton onPress={handleIconClick}>
                <BookmarkSingle />
                <Text>Highlight</Text>
            </ActionButton>
        </View>
    );
};

export default TextSelection;
