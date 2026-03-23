import { ErrorBoundary } from "./components/layout/ErrorBoundary";
import PDPLBanner from "./components/compliance/PDPLBanner";
import DecisionShell from "./components/decision/DecisionShell";

export function App() {
  return (
    <ErrorBoundary>
      <DecisionShell />
      <PDPLBanner />
    </ErrorBoundary>
  );
}
