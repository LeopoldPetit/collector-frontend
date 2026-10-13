import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CatalogPage } from './CatalogPage';
import { Article } from '../types';

const article: Article = {
  id: 'art-1',
  title: 'Timbre rare 1920',
  description:
    'Un timbre en excellent état, provenance certifiée, description suffisamment longue.',
  price: '42.00',
  shippingCost: '5.00',
  category: 'timbres',
  status: 'PUBLISHED',
  createdAt: '2026-10-13T08:00:00.000Z',
};

describe('CatalogPage', () => {
  it('affiche les articles publiés avec prix et catégorie', async () => {
    render(<CatalogPage loadArticles={async () => [article]} />);

    expect(
      await screen.findByRole('heading', { name: 'Timbre rare 1920' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/42,00\s€/)).toBeInTheDocument();
    expect(screen.getByText('Catégorie : Timbres')).toBeInTheDocument();
  });

  it('indique un catalogue vide', async () => {
    render(<CatalogPage loadArticles={async () => []} />);

    expect(
      await screen.findByText('Aucun article publié pour le moment.'),
    ).toBeInTheDocument();
  });

  it("affiche une erreur si le chargement échoue", async () => {
    render(
      <CatalogPage loadArticles={() => Promise.reject(new Error('API down'))} />,
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Impossible de charger le catalogue.',
    );
  });
});
