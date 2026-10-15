import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Article } from '../types';
import { ArticleStatus } from './ArticleStatus';

const BASE_ARTICLE: Article = {
  id: 'a1',
  title: 'Timbre rare 1920',
  description: 'Un timbre en excellent état, provenance certifiée.',
  price: '42.00',
  shippingCost: '5.00',
  category: 'timbres',
  status: 'DRAFT',
  rejectionReason: null,
  createdAt: '2026-10-15T10:00:00.000Z',
};

describe('ArticleStatus', () => {
  it('suit le contrôle jusqu’à la publication', async () => {
    const loadArticle = vi
      .fn()
      .mockResolvedValueOnce({ ...BASE_ARTICLE, status: 'DRAFT' })
      .mockResolvedValueOnce({ ...BASE_ARTICLE, status: 'PUBLISHED' });
    render(
      <ArticleStatus articleId="a1" loadArticle={loadArticle} pollDelayMs={1} />,
    );

    expect(await screen.findByText('Statut : Publié')).toBeInTheDocument();
    expect(loadArticle).toHaveBeenCalledTimes(2);
    expect(loadArticle).toHaveBeenCalledWith('a1');
  });

  it('affiche le motif de refus sans relancer le suivi', async () => {
    const loadArticle = vi.fn().mockResolvedValue({
      ...BASE_ARTICLE,
      status: 'REJECTED',
      rejectionReason: 'Prix hors seuil',
    });
    render(
      <ArticleStatus articleId="a1" loadArticle={loadArticle} pollDelayMs={1} />,
    );

    expect(await screen.findByText('Statut : Refusé')).toBeInTheDocument();
    expect(screen.getByText('Motif : Prix hors seuil')).toBeInTheDocument();
    expect(loadArticle).toHaveBeenCalledTimes(1);
  });

  it('signale une erreur de récupération', async () => {
    const loadArticle = vi.fn().mockRejectedValue(new Error('réseau'));
    render(<ArticleStatus articleId="a1" loadArticle={loadArticle} />);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      "Impossible de récupérer le statut de l'article.",
    );
  });
});
