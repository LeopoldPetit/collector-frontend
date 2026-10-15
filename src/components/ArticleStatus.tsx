import { useEffect, useState } from 'react';
import { fetchArticle } from '../api';
import { statusLabel } from '../format';
import { Article } from '../types';

interface ArticleStatusProps {
  articleId: string;
  loadArticle?: (id: string) => Promise<Article>;
  pollDelayMs?: number;
}

const PENDING_STATUSES = ['DRAFT', 'PENDING'];
const MAX_POLLS = 20;
const POLL_DELAY_MS = 3000;

export function ArticleStatus({
  articleId,
  loadArticle = fetchArticle,
  pollDelayMs = POLL_DELAY_MS,
}: ArticleStatusProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [failed, setFailed] = useState(false);
  const [polls, setPolls] = useState(0);

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    loadArticle(articleId)
      .then((data) => {
        if (!active) return;
        setArticle(data);
        if (PENDING_STATUSES.includes(data.status) && polls < MAX_POLLS) {
          timer = setTimeout(() => setPolls((count) => count + 1), pollDelayMs);
        }
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [articleId, loadArticle, pollDelayMs, polls]);

  if (failed) {
    return <p role="alert">Impossible de récupérer le statut de l'article.</p>;
  }
  if (article === null) {
    return <p>Vérification du statut…</p>;
  }

  return (
    <section aria-labelledby="article-status-title">
      <h3 id="article-status-title">Suivi de l'article</h3>
      <p>Statut : {statusLabel(article.status)}</p>
      {article.status === 'REJECTED' && article.rejectionReason && (
        <p>Motif : {article.rejectionReason}</p>
      )}
      {PENDING_STATUSES.includes(article.status) && polls >= MAX_POLLS && (
        <p>Le contrôle prend plus de temps que prévu. Revenez plus tard.</p>
      )}
    </section>
  );
}
