import { useEffect, useState } from 'react';
import { fetchPublishedArticles } from '../api';
import { categoryLabel, formatEuro } from '../format';
import { Article } from '../types';

interface CatalogPageProps {
  loadArticles?: () => Promise<Article[]>;
}

const loadPublished = () => fetchPublishedArticles();

export function CatalogPage({ loadArticles = loadPublished }: CatalogPageProps) {
  const [articles, setArticles] = useState<Article[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    loadArticles()
      .then((data) => {
        if (active) setArticles(data);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, [loadArticles]);

  if (failed) {
    return <p role="alert">Impossible de charger le catalogue.</p>;
  }
  if (articles === null) {
    return <p role="status">Chargement du catalogue…</p>;
  }
  if (articles.length === 0) {
    return <p>Aucun article publié pour le moment.</p>;
  }

  return (
    <section aria-labelledby="catalog-title">
      <h2 id="catalog-title">Catalogue</h2>
      <ul className="article-list">
        {articles.map((article) => (
          <li key={article.id}>
            <h3>{article.title}</h3>
            <p>{article.description}</p>
            <p>
              Prix : {formatEuro(article.price)} · Frais de port :{' '}
              {formatEuro(article.shippingCost)}
            </p>
            <p>Catégorie : {categoryLabel(article.category)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
