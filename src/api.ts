import { config } from './config';
import { Article, ArticleInput } from './types';

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function parseResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return (await response.json()) as T;
  }
  const body = (await response.json().catch(() => ({}))) as {
    message?: string | string[];
  };
  const message = Array.isArray(body.message)
    ? body.message.join(' ')
    : body.message;
  throw new ApiError(message ?? `Erreur ${response.status}`, response.status);
}

export async function fetchPublishedArticles(): Promise<Article[]> {
  const response = await fetch(`${config.apiUrl}/articles?status=published`);
  return parseResponse<Article[]>(response);
}

export async function fetchArticle(id: string): Promise<Article> {
  const response = await fetch(
    `${config.apiUrl}/articles/${encodeURIComponent(id)}`,
  );
  return parseResponse<Article>(response);
}

export async function createArticle(
  token: string,
  input: ArticleInput,
): Promise<Article> {
  const response = await fetch(`${config.apiUrl}/articles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });
  return parseResponse<Article>(response);
}
