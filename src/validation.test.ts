import { describe, expect, it } from 'vitest';
import { validateArticle } from './validation';
import { ArticleInput } from './types';

const VALID: ArticleInput = {
  title: 'Timbre rare 1920',
  description:
    'Un timbre en excellent état, provenance certifiée, description suffisamment longue.',
  price: 42,
  shippingCost: 5,
  category: 'timbres',
};

describe('validateArticle', () => {
  it('accepte une annonce conforme', () => {
    expect(validateArticle(VALID)).toEqual({});
  });

  it('exige une description d\'au moins 50 caractères', () => {
    expect(
      validateArticle({ ...VALID, description: 'trop court' }).description,
    ).toBe('La description doit contenir au moins 50 caractères.');
  });

  it('refuse un prix nul ou non numérique', () => {
    expect(validateArticle({ ...VALID, price: 0 }).price).toBeDefined();
    expect(validateArticle({ ...VALID, price: NaN }).price).toBeDefined();
  });

  it('refuse une catégorie inconnue', () => {
    expect(
      validateArticle({ ...VALID, category: 'voitures' }).category,
    ).toBe('Choisissez une catégorie.');
  });
});
