import { createContext } from 'react';
import Constants from './config/constants';
import { Book, HighlightInfo } from './config/types';
import { User } from 'firebase/auth';

// Context for the dashboard
export interface DashboardContextInterface {
  readingBook: Book | null;
  setReadingBook: (book: Book) => void;
  user: User;
}

export const DashboardContext = createContext<DashboardContextInterface>({
  readingBook: null,
  setReadingBook: (book: Book) => {},
  user: {} as User,
});
