import { useEffect, useState } from 'react';
import { getToken, initAuth, login } from './auth';
import { CatalogPage } from './components/CatalogPage';
import { SellPage } from './components/SellPage';

type View = 'catalog' | 'sell';

export function App() {
  const [view, setView] = useState<View>('catalog');
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    initAuth()
      .then(setAuthenticated)
      .catch(() => setAuthError(true));
  }, []);

  function openSell() {
    if (authenticated) {
      setView('sell');
      return;
    }
    void login();
  }

  return (
    <>
      <header>
        <h1>Collector.shop</h1>
        <nav aria-label="Navigation principale">
          <button
            type="button"
            aria-pressed={view === 'catalog'}
            onClick={() => setView('catalog')}
          >
            Catalogue
          </button>
          <button
            type="button"
            aria-pressed={view === 'sell'}
            onClick={openSell}
          >
            Espace vendeur
          </button>
        </nav>
      </header>
      <main>
        {authError && (
          <p role="alert">Le service d'authentification est indisponible.</p>
        )}
        {view === 'catalog' ? (
          <CatalogPage />
        ) : (
          <SellPage getToken={getToken} />
        )}
      </main>
    </>
  );
}
