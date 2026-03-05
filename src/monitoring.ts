import * as Sentry from "@sentry/react"

// Initialize error monitoring
// In production: set VITE_SENTRY_DSN to your Sentry project DSN
export function initMonitoring() {
  const dsn = import.meta.env.VITE_SENTRY_DSN
  if (!dsn) return

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    // Capture 10% of transactions for performance monitoring
    tracesSampleRate: 0.1,
    // Only send errors in production
    enabled: import.meta.env.PROD,
  })
}

// Error boundary component for React
export const ErrorBoundary = Sentry.ErrorBoundary
