import { Book } from "../types";

export interface DashboardContextInterface {
  selectedAction: string;
  setSelectedAction: (action: string) => void;
  summary: Book | null;
  setSummary: (book: Book) => void;
}
