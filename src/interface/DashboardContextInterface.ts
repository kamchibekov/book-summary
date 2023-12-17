import { Book } from "../types";
import { User } from "firebase/auth";

export interface DashboardContextInterface {
  selectedAction: string;
  setSelectedAction: (action: string) => void;
  summary: Book | null;
  setSummary: (book: Book) => void;
  user: User | null;
}
