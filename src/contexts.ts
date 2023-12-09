import { createContext } from "react";
import { DashboardContextInterface } from "./interface/DashboardContextInterface";
import Constants from "./constants";

export const DashboardContext = createContext<DashboardContextInterface>({
  selectedAction: Constants.SIDEBAR_TODAY,
  setSelectedAction: (action: string) => {},
  selectedSummary: null,
  setSelectedSummary: (index: number) => {},
});
