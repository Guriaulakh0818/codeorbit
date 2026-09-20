import confetti from 'canvas-confetti';

/**
 * Safe, fail-proof confetti trigger that works in both ESM, CJS, and browser environments
 * @param {Object} options
 */
export const triggerConfetti = (options = {}) => {
  try {
    const defaultOptions = {
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    };
    const merged = { ...defaultOptions, ...options };

    if (typeof confetti === 'function') {
      confetti(merged);
    } else if (confetti && typeof confetti.default === 'function') {
      confetti.default(merged);
    } else if (typeof window !== 'undefined' && typeof window.confetti === 'function') {
      window.confetti(merged);
    }
  } catch (e) {
    // Silently ignore animation error if canvas is not supported
  }
};

export default triggerConfetti;
