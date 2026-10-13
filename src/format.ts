import { CATEGORIES } from './categories';

const euro = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

export function formatEuro(amount: string | number): string {
  return euro.format(Number(amount));
}

export function categoryLabel(value: string): string {
  return CATEGORIES.find((category) => category.value === value)?.label ?? value;
}
