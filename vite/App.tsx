import { useState, useEffect } from 'react';
import { LandingPage } from './pages/LandingPage';
import { ExamplesPage } from './pages/ExamplesPage';
import { SoundboardPage } from './pages/SoundboardPage';

export default function App() {
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigate = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', path);
      setCurrentPath(path);
    }
  };

  // Match /sounds or /soundboard routes
  if (currentPath.startsWith('/sounds') || currentPath.startsWith('/soundboard')) {
    return <SoundboardPage onNavigate={navigate} />;
  }

  // Match /examples and /examples/* routes
  const isExamplesRoute = currentPath.startsWith('/examples');

  if (isExamplesRoute) {
    return <ExamplesPage onNavigate={navigate} />;
  }

  // Default stripped-down landing page with Flash animation
  return <LandingPage onNavigate={navigate} />;
}
