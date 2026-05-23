import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  getNews, addNews, updateNews, deleteNews, toggleNewsStatus,
  getPublishedNews, getNewsBySlug, getNewsById
} from '../utils/storage';

const NewsContext = createContext(null);

export const NewsProvider = ({ children }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    setNews(await getNews());
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleAdd = useCallback(async (item) => {
    const added = await addNews(item);
    await refresh();
    return added;
  }, [refresh]);

  const handleUpdate = useCallback(async (id, updates) => {
    await updateNews(id, updates);
    await refresh();
  }, [refresh]);

  const handleDelete = useCallback(async (id) => {
    await deleteNews(id);
    await refresh();
  }, [refresh]);

  const handleToggle = useCallback(async (id) => {
    await toggleNewsStatus(id);
    await refresh();
  }, [refresh]);

  const published = news
    .filter(n => n.status === 'published')
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const drafts = news.filter(n => n.status === 'draft');

  return (
    <NewsContext.Provider value={{
      news, published, drafts, refresh, loading,
      addNews: handleAdd,
      updateNews: handleUpdate,
      deleteNews: handleDelete,
      toggleStatus: handleToggle,
      getBySlug: getNewsBySlug,
      getById: getNewsById,
      getPublished: getPublishedNews,
    }}>
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => {
  const ctx = useContext(NewsContext);
  if (!ctx) throw new Error('useNews must be used within NewsProvider');
  return ctx;
};
