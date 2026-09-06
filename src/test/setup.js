import '@testing-library/jest-dom/vitest';

// jsdom doesn't implement matchMedia; several components/hooks
// (usePrefersReducedMotion, theme queries) call it at render time.
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false
  });
}

// jsdom doesn't implement <dialog> show/close behavior; the site's modals
// all rely on the native showModal()/close() API.
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  };
}

// jsdom doesn't implement scrollIntoView; the Command Center's keyboard
// navigation calls it to keep the selected result in view.
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = function () {};
}
