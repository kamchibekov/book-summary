import { createContext } from "react";
import { DashboardContextInterface } from "./interface/DashboardContextInterface";
import Constants from "./constants";
import { Book } from "./types";

export const DashboardContext = createContext<DashboardContextInterface>({
  selectedAction: Constants.SIDEBAR_TODAY,
  setSelectedAction: (action: string) => {},
  summary: null,
  setSummary: (book: Book) => {},
});
