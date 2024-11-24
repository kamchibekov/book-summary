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
import RuoteEnum from "../config/routes";
import TodaysBook from "../components/TodaysBook";
import LibraryPage from "./Library.page";
import HighlightsPage from "./Highlights.page";
import BookHighlights from "../components/BookHighlights";
import NotFoundPage from "./NotFound.page";

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
            <Route path={RuoteEnum.Dashboard} element={<TodaysBook />} />
            <Route path={RuoteEnum.Library}>
              <Route index element={<LibraryPage />} />
            </Route>
            <Route path={RuoteEnum.Highlights}>
              <Route index element={<HighlightsPage />} />
              <Route path={RuoteEnum.BookHighlights} element={<BookHighlights />} />
            </Route>
            <Route path={RuoteEnum.Book} element={<MultiPageContent />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Container>
      </DashboardContext.Provider>
    </Box>
  );
};


export default DashboardPage;