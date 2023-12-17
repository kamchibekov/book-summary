import React, { useState, useEffect, useMemo } from "react";
import { Navigate } from "react-router-dom";
import URL from "../routes"
import { Flex, Divider, Content, Grid } from '@adobe/react-spectrum';
import Sidebar from "../components/Sidebar";
import ImageCard from "../components/ImageCard";
import MultiPageContent from "../components/MultiPageContent";
import Constants from "../constants";
import { DashboardContext } from '../contexts'
import { DashboardContextInterface } from "../interface/DashboardContextInterface";
import { fetchBook, setBookFinished, getLibraryBooks } from '../firease/books.api'
import { Book } from "../types";
import { ToastQueue } from "@react-spectrum/toast";
import Highlights from "../components/Highlights";

const Dashboard = ({ user }) => {
  // Check if the user is authenticated
  if (!user) {
    // Redirect to the login page if not authenticated
    return <Navigate to={URL.Register} />;
  }

  const [selectedAction, setSelectedAction] = useState<string>(Constants.SIDEBAR_TODAY);
  // book fetch
  const [summary, setSummary] = useState<null | Book>(null);
  const [book, setBook] = useState<null | Book>(null);
  // library fetch
  const [libraryBooks, setLibraryBooks] = useState<Book[]>([]);
  const [hasFetchedLibraryBooks, setHasFetchedLibraryBooks] = useState<boolean>(false);

  // Reading state
  const [isReading, setIsReading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUnfinishedBooks = async () => {
      const fetchedBook = await fetchBook(user);
      setBook(fetchedBook);
    };

    fetchUnfinishedBooks();
  }, [user]);

  useEffect(() => {
    const fetchLibraryBooks = async () => {
      const libraryBooksData = await getLibraryBooks(user);
      setLibraryBooks(libraryBooksData);
      setHasFetchedLibraryBooks(true);
    };

    if (selectedAction === Constants.SIDEBAR_LIBRARY && !hasFetchedLibraryBooks) {
      console.log("Library fetched")
      fetchLibraryBooks();
    }

  }, [user, selectedAction]);

  const moveBookToLibrary = async () => {

    if (book === null || isReading === false) {
      console.log("Not reading")
      return
    }

    setIsReading(false)

    const nextBook = await setBookFinished(user, book);

    // Check next book and if there is than add message to toast Next summary is ready!
    if (nextBook) {
      ToastQueue.positive('Next summary is ready!', { timeout: 2000 })
    } else
      ToastQueue.positive('Well done! Summary moved to library. ', { timeout: 2000 })

    // Remove the book from the 'books' array
    // Set next book
    setBook(nextBook)

    // Add the book to the 'libraryBooks' array
    const updatedLibraryBooks = [...libraryBooks, book];

    // Update state
    // setBooks(updatedBooks);
    setLibraryBooks(updatedLibraryBooks);

  };


  const memoedContents = useMemo(() => {

    // @TODO handle this case later
    // console.log("memo invoke")

    return {
      [Constants.SIDEBAR_TODAY]: <Grid
        UNSAFE_style={{ overflow: "auto" }}
        height="100%"
        gap="size-100"
      >
        {book !== null ? <ImageCard book={book} onRead={setIsReading} /> : <></>}
      </Grid>,
      [Constants.SIDEBAR_LIBRARY]: <Grid
        UNSAFE_style={{ overflow: "auto" }}
        height="100%"
        gap="size-100"
      >
        {libraryBooks.map((book, index) => (
          <ImageCard key={index} book={book} onRead={setIsReading} />
        ))}
      </Grid>,
      [Constants.SIDEBAR_HIGHLIGHTS]: <Highlights />,
      [Constants.SUMMARY_CONTENT]: <MultiPageContent setFinishedCallback={moveBookToLibrary} />
    };
  }, [summary, libraryBooks, book]);


  // @TODO selectedAction change is causing re-render
  const contextValue: DashboardContextInterface = {
    selectedAction,
    setSelectedAction,
    summary,
    setSummary,
    user
  }

  return (
    <Flex height="100vh">
      <DashboardContext.Provider value={contextValue}>
        <Sidebar user={user} />
        <Divider orientation="vertical" size="M" />
        <Content UNSAFE_style={{ width: "100%" }}>
          {memoedContents[selectedAction]}
        </Content>
      </DashboardContext.Provider>
    </Flex>
  );
};


export default Dashboard;
