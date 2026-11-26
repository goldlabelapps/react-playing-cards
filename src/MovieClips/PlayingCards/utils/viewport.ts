export interface Viewport {
  width: number;
  height: number;
  orientation: 'landscape' | 'portrait';
  ratio: number;
}

export const getViewport = (): Viewport => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return { width: 0, height: 0, orientation: 'landscape', ratio: 1 };
  }

  const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  const orientation = vh > vw ? 'portrait' : 'landscape';
  const ratio = vh === 0 ? 1 : vw / vh;

  return {
    width: vw,
    height: vh,
    orientation,
    ratio,
  };
};
