import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Article } from '../types';
import { SellPage } from './SellPage';

const VALID_DESCRIPTION =
  'Un timbre en excellent état, provenance certifiée, description suffisamment longue.';

const SUBMITTED_ARTICLE: Article = {
  id: 'a1',
  title: 'Timbre rare 1920',
  description: VALID_DESCRIPTION,
  price: '42.00',
  shippingCost: '5.00',
  category: 'timbres',
  status: 'DRAFT',
  rejectionReason: null,
  createdAt: '2026-10-15T10:00:00.000Z',
};

function fillValidForm() {
  fireEvent.change(screen.getByLabelText('Titre'), {
    target: { value: 'Timbre rare 1920' },
  });
  fireEvent.change(screen.getByLabelText('Description'), {
    target: { value: VALID_DESCRIPTION },
  });
  fireEvent.change(screen.getByLabelText('Prix (€)'), {
    target: { value: '42' },
  });
  fireEvent.change(screen.getByLabelText('Frais de port (€)'), {
    target: { value: '5' },
  });
  fireEvent.change(screen.getByLabelText('Catégorie'), {
    target: { value: 'timbres' },
  });
}

describe('SellPage', () => {
  it("affiche les erreurs et n'envoie rien si le formulaire est invalide", async () => {
    const publish = vi.fn();
    render(<SellPage getToken={async () => 'token'} publish={publish} />);

    fireEvent.click(screen.getByRole('button', { name: "Publier l'article" }));

    expect(
      await screen.findByText('Le titre doit contenir entre 3 et 120 caractères.'),
    ).toBeInTheDocument();
    expect(publish).not.toHaveBeenCalled();
  });

  it('publie avec le jeton et des montants numériques', async () => {
    const publish = vi.fn().mockResolvedValue({});
    render(<SellPage getToken={async () => 'token'} publish={publish} />);
    fillValidForm();

    fireEvent.click(screen.getByRole('button', { name: "Publier l'article" }));

    expect(await screen.findByRole('status')).toHaveTextContent(
      'Article soumis',
    );
    expect(publish).toHaveBeenCalledWith('token', {
      title: 'Timbre rare 1920',
      description: VALID_DESCRIPTION,
      price: 42,
      shippingCost: 5,
      category: 'timbres',
    });
  });

  it('signale une session expirée sans appeler l\'API', async () => {
    const publish = vi.fn();
    render(<SellPage getToken={async () => undefined} publish={publish} />);
    fillValidForm();

    fireEvent.click(screen.getByRole('button', { name: "Publier l'article" }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Votre session a expiré',
    );
    expect(publish).not.toHaveBeenCalled();
  });

  it("affiche le message d'erreur renvoyé par l'API", async () => {
    const publish = vi
      .fn()
      .mockRejectedValue(new Error('Rôle insuffisant pour cette action'));
    render(<SellPage getToken={async () => 'token'} publish={publish} />);
    fillValidForm();

    fireEvent.click(screen.getByRole('button', { name: "Publier l'article" }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Rôle insuffisant pour cette action',
    );
  });

  it('suit le statut de l\'article soumis', async () => {
    const publish = vi.fn().mockResolvedValue(SUBMITTED_ARTICLE);
    const loadArticle = vi
      .fn()
      .mockResolvedValue({ ...SUBMITTED_ARTICLE, status: 'PUBLISHED' });
    render(
      <SellPage
        getToken={async () => 'token'}
        publish={publish}
        loadArticle={loadArticle}
      />,
    );
    fillValidForm();

    fireEvent.click(screen.getByRole('button', { name: "Publier l'article" }));

    expect(await screen.findByText('Statut : Publié')).toBeInTheDocument();
    expect(loadArticle).toHaveBeenCalledWith('a1');
  });
});
