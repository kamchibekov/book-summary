export interface DashboardContextInterface {
  selectedAction: string;
  setSelectedAction: (action: string) => void;
  selectedSummary: number | null;
  setSelectedSummary: (index: number) => void;
}
