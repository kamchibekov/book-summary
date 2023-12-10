import React, { useState, useEffect, useMemo } from "react";
import { Navigate } from "react-router-dom";
import URL from "../routes"
import { Flex, Divider, Content, Grid, Text } from '@adobe/react-spectrum';
import Sidebar from "../components/Sidebar";
import ImageCard from "../components/ImageCard";
import MultiPageContent from "../components/MultiPageContent";
import Constants from "../constants";
import { DashboardContext } from '../contexts'
import { DashboardContextInterface } from "../interface/DashboardContextInterface";
import { getUnfinishedBooks } from '../firease/booksApi'
import { Book } from "../types";

const Dashboard = ({ user }) => {
  // Check if the user is authenticated
  if (!user) {
    // Redirect to the login page if not authenticated
    return <Navigate to={URL.Register} />;
  }
  const [selectedAction, setSelectedAction] = useState<string>(Constants.SIDEBAR_TODAY);
  const [selectedSummary, setSelectedSummary] = useState<null | number>(null);
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchUnfinishedBooks = async () => {
      const books = await getUnfinishedBooks(user);
      setBooks(books);
    };

    fetchUnfinishedBooks();
  }, [user]);

  console.log("unfinishedBooks:", books)
  console.log("user:", user)

  const memoedContents = useMemo(() => {

    let summary = <></>

    if (selectedSummary !== null) {
      const data = JSON.parse(books[selectedSummary]['summary'])
      summary = <MultiPageContent content={data} />
    }

    return {
      [Constants.SIDEBAR_TODAY]: <Grid
        UNSAFE_style={{ overflow: "auto" }}
        height="100%"
        gap="size-100"
      >
        {books.map((book, index) => (
          <ImageCard key={index} index={index} book={book} token={user.getIdTokenResult()} />
        ))}
      </Grid>,
      [Constants.SIDEBAR_LIBRARY]: <Text>My Library</Text>,
      [Constants.SIDEBAR_HIGHLIGHTS]: <Text>Highlights</Text>,
      [Constants.SUMMARY_CONTENT]: summary
    };
  }, [selectedSummary, books]);


  const contextValue: DashboardContextInterface = {
    selectedAction,
    setSelectedAction,
    selectedSummary,
    setSelectedSummary
  }

  return (
    <Flex height="100vh">
      <DashboardContext.Provider value={contextValue}>
        <Sidebar user={user} />
        <Divider orientation="vertical" size="M" />
        <Content>
          {memoedContents[selectedAction]}
        </Content>
      </DashboardContext.Provider>

    </Flex>
  );
};


export default Dashboard;
