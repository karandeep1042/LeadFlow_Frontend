// Simple customizable toast helper
export const showToast = {
  success: (msg) => {
    console.log(`[SUCCESS]: ${msg}`);
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('app-toast', { detail: { type: 'success', message: msg } }));
    }
  },
  error: (msg) => {
    console.error(`[ERROR]: ${msg}`);
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('app-toast', { detail: { type: 'error', message: msg } }));
    }
  },
  info: (msg) => {
    console.info(`[INFO]: ${msg}`);
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('app-toast', { detail: { type: 'info', message: msg } }));
    }
  },
  warning: (msg) => {
    console.warn(`[WARNING]: ${msg}`);
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('app-toast', { detail: { type: 'warning', message: msg } }));
    }
  }
};
