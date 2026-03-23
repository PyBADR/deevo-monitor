import { AppShell } from "./components/layout/AppShell";
import { ErrorBoundary } from "./components/layout/ErrorBoundary";
import PDPLBanner from "./components/compliance/PDPLBanner";

export function App() {
  return (
    <ErrorBoundary>
      <AppShell />
      <PDPLBanner />
    </ErrorBoundary>
  );
}
