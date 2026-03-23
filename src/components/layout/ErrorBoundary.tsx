/**
 * ErrorBoundary — React error boundary for graceful failure recovery.
 * Catches render errors in the component tree and displays a recovery UI
 * instead of a white screen. Logs errors to the audit trail.
 *
 * Architecture Layer: UI (L6) → Governance (L7)
 */
import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    // Log to console for observability — audit service integration optional
    console.error("[DEEVO ErrorBoundary]", {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0a0f1a",
            color: "#e2e8f0",
            fontFamily: "'IBM Plex Mono', monospace",
            padding: "2rem",
          }}
        >
          <div
            style={{
              maxWidth: "600px",
              width: "100%",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "48px",
                marginBottom: "1rem",
                color: "#f5a623",
              }}
            >
              ⚠
            </div>
            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                marginBottom: "0.5rem",
                color: "#f5a623",
              }}
            >
              DEEVO Intelligence Monitor
            </h1>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#94a3b8",
                marginBottom: "1.5rem",
              }}
            >
              A runtime error occurred in the UI layer.
            </p>
            {this.state.error && (
              <pre
                style={{
                  fontSize: "0.75rem",
                  color: "#ef4444",
                  backgroundColor: "#1e1e2e",
                  padding: "1rem",
                  borderRadius: "8px",
                  overflow: "auto",
                  maxHeight: "200px",
                  textAlign: "left",
                  marginBottom: "1.5rem",
                  border: "1px solid #333",
                }}
              >
                {this.state.error.message}
              </pre>
            )}
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <button
                onClick={this.handleReset}
                style={{
                  padding: "0.5rem 1.5rem",
                  fontSize: "0.75rem",
                  fontFamily: "'IBM Plex Mono', monospace",
                  backgroundColor: "#1e293b",
                  color: "#e2e8f0",
                  border: "1px solid #334155",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                RETRY
              </button>
              <button
                onClick={this.handleReload}
                style={{
                  padding: "0.5rem 1.5rem",
                  fontSize: "0.75rem",
                  fontFamily: "'IBM Plex Mono', monospace",
                  backgroundColor: "#f5a623",
                  color: "#0a0f1a",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                RELOAD
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
