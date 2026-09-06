// No-op unless VITE_PLAUSIBLE_DOMAIN is set — see .env.example.
export function initAnalytics() {
  const domain = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
  if (!domain) return;

  const script = document.createElement('script');
  script.defer = true;
  script.dataset.domain = domain;
  script.src = 'https://plausible.io/js/script.js';
  document.head.appendChild(script);
}
