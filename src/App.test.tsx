import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';
import { login } from './auth';

vi.mock('./auth', () => ({
  initAuth: vi.fn(async () => false),
  getToken: vi.fn(async () => undefined),
  login: vi.fn(async () => undefined),
}));

vi.mock('./api', () => ({
  fetchPublishedArticles: vi.fn(async () => []),
  createArticle: vi.fn(),
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('affiche le catalogue public par défaut', async () => {
    render(<App />);

    expect(
      await screen.findByText('Aucun article publié pour le moment.'),
    ).toBeInTheDocument();
  });

  it("lance la connexion Keycloak depuis l'espace vendeur si l'utilisateur n'est pas connecté", () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Espace vendeur' }));

    expect(login).toHaveBeenCalledTimes(1);
  });
});
