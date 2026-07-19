import { Outlet, useLocation } from 'react-router';
import { useEffect } from 'react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/footer';

export function MarketingLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[var(--surface-base)]">
      <Navigation />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
