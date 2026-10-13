import { ChangeEvent, FormEvent, ReactNode, useState } from 'react';
import { createArticle } from '../api';
import { CATEGORIES } from '../categories';
import { ArticleInput } from '../types';
import { FieldErrors, validateArticle } from '../validation';

interface SellPageProps {
  getToken: () => Promise<string | undefined>;
  publish?: (token: string, input: ArticleInput) => Promise<unknown>;
}

interface FormState {
  title: string;
  description: string;
  price: string;
  shippingCost: string;
  category: string;
}

interface Feedback {
  kind: 'success' | 'error';
  message: string;
}

const EMPTY_FORM: FormState = {
  title: '',
  description: '',
  price: '',
  shippingCost: '',
  category: CATEGORIES[0].value,
};

const publishArticle = (token: string, input: ArticleInput) =>
  createArticle(token, input);

function toInput(form: FormState): ArticleInput {
  return {
    title: form.title,
    description: form.description,
    price: Number(form.price),
    shippingCost: Number(form.shippingCost),
    category: form.category,
  };
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children}
      {error && (
        <p id={`${id}-error`} className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}

export function SellPage({ getToken, publish = publishArticle }: SellPageProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  function update(field: keyof FormState) {
    return (
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => setForm((current) => ({ ...current, [field]: event.target.value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = toInput(form);
    const fieldErrors = validateArticle(input);
    setErrors(fieldErrors);
    setFeedback(null);
    if (Object.keys(fieldErrors).length > 0) {
      return;
    }

    setSending(true);
    try {
      const token = await getToken();
      if (!token) {
        setFeedback({
          kind: 'error',
          message: 'Votre session a expiré. Reconnectez-vous pour publier.',
        });
        return;
      }
      await publish(token, input);
      setForm(EMPTY_FORM);
      setFeedback({
        kind: 'success',
        message: 'Article soumis. Il sera publié après contrôle automatique.',
      });
    } catch (error) {
      setFeedback({
        kind: 'error',
        message:
          error instanceof Error ? error.message : 'La publication a échoué.',
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <section aria-labelledby="sell-title">
      <h2 id="sell-title">Publier un article</h2>
      <form noValidate onSubmit={handleSubmit}>
        <Field id="title" label="Titre" error={errors.title}>
          <input
            id="title"
            type="text"
            value={form.title}
            onChange={update('title')}
            aria-invalid={errors.title ? true : undefined}
            aria-describedby={errors.title ? 'title-error' : undefined}
          />
        </Field>
        <Field id="description" label="Description" error={errors.description}>
          <textarea
            id="description"
            rows={6}
            value={form.description}
            onChange={update('description')}
            aria-invalid={errors.description ? true : undefined}
            aria-describedby={errors.description ? 'description-error' : undefined}
          />
        </Field>
        <Field id="price" label="Prix (€)" error={errors.price}>
          <input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={update('price')}
            aria-invalid={errors.price ? true : undefined}
            aria-describedby={errors.price ? 'price-error' : undefined}
          />
        </Field>
        <Field
          id="shippingCost"
          label="Frais de port (€)"
          error={errors.shippingCost}
        >
          <input
            id="shippingCost"
            type="number"
            min="0"
            step="0.01"
            value={form.shippingCost}
            onChange={update('shippingCost')}
            aria-invalid={errors.shippingCost ? true : undefined}
            aria-describedby={
              errors.shippingCost ? 'shippingCost-error' : undefined
            }
          />
        </Field>
        <Field id="category" label="Catégorie" error={errors.category}>
          <select
            id="category"
            value={form.category}
            onChange={update('category')}
            aria-invalid={errors.category ? true : undefined}
            aria-describedby={errors.category ? 'category-error' : undefined}
          >
            {CATEGORIES.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </Field>
        <button type="submit" disabled={sending}>
          {sending ? 'Envoi en cours…' : "Publier l'article"}
        </button>
      </form>
      {feedback && (
        <p role={feedback.kind === 'error' ? 'alert' : 'status'}>
          {feedback.message}
        </p>
      )}
    </section>
  );
}
