// No-op unless VITE_SENTRY_DSN is set — see .env.example.
export function initErrorTracking() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) return;

  import('@sentry/browser').then(({ init, browserTracingIntegration }) => {
    init({
      dsn,
      integrations: [browserTracingIntegration()],
      tracesSampleRate: 0.2,
      environment: import.meta.env.MODE
    });
  });
}
