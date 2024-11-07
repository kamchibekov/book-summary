import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Box from '@mui/material/Box';
import Container from "@mui/material/Container";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MultiPageContent from "../components/MultiPageContent";
import { DashboardContextInterface, DashboardContext } from '../contexts'
import { Book, HighlightInfo } from "../config/types";
import { User } from "firebase/auth";
import URL from "../config/routes";
import TodaysBook from "../components/TodaysBook";
import LibraryPage from "./Library.page";
import HighlightsPage from "./Highlights.page";
import BookHighlights from "../components/BookHighlights";

function DashboardPage({ user }: { user: User }) {

  // Reading state
  const [readingBook, setReadingBook] = useState<Book | null>(null);

  // Highlight state
  const [highlightInfo, setHighlightInfo] = useState<HighlightInfo | null>(null);

  // Drawer
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const drawerWidth = 240;
  const drawerToggle = () => setIsSidebarOpen(!isSidebarOpen);

  const contextValue: DashboardContextInterface = {
    readingBook,
    setReadingBook,
    user,
    highlightInfo,
    setHighlightInfo
  }

  return (
    <Box>
      <DashboardContext.Provider value={contextValue}>
        <Header drawerToggle={drawerToggle} />
        <Sidebar isSidebarOpen={isSidebarOpen} drawerToggle={drawerToggle} />
        <Container>
          <Routes>
            <Route path={URL.Dashboard} element={<TodaysBook />} />
            <Route path={URL.Library} element={<LibraryPage />} />
            <Route path={URL.LibraryBook} element={<MultiPageContent showSaveButton={false} />} />
            <Route path={URL.Highlights} element={<HighlightsPage />} />
            <Route path={URL.Book} element={<MultiPageContent />} />
            <Route path={URL.BookHighlights} element={<BookHighlights />} />
          </Routes>
        </Container>
      </DashboardContext.Provider>
    </Box>
  );
};


export default DashboardPage;