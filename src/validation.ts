import { CATEGORIES } from './categories';
import { ArticleInput } from './types';

export const MIN_DESCRIPTION_LENGTH = 50;

export type FieldErrors = Partial<Record<keyof ArticleInput, string>>;

export function validateArticle(input: ArticleInput): FieldErrors {
  const errors: FieldErrors = {};
  if (input.title.length < 3 || input.title.length > 120) {
    errors.title = 'Le titre doit contenir entre 3 et 120 caractères.';
  }
  if (input.description.length < MIN_DESCRIPTION_LENGTH) {
    errors.description = `La description doit contenir au moins ${MIN_DESCRIPTION_LENGTH} caractères.`;
  }
  if (!(input.price > 0)) {
    errors.price = 'Le prix doit être supérieur à 0.';
  }
  if (!(input.shippingCost > 0)) {
    errors.shippingCost = 'Les frais de port doivent être supérieurs à 0.';
  }
  if (!CATEGORIES.some((category) => category.value === input.category)) {
    errors.category = 'Choisissez une catégorie.';
  }
  return errors;
}
