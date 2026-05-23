import { createContext, useContext, useState, useCallback } from 'react';
import {
  getNews, addNews, updateNews, deleteNews, toggleNewsStatus,
  getPublishedNews, getNewsBySlug, getNewsById
} from '../utils/storage';

const NewsContext = createContext(null);

export const NewsProvider = ({ children }) => {
  const [news, setNews] = useState(() => getNews());

  const refresh = useCallback(() => setNews(getNews()), []);

  const handleAdd = useCallback((item) => {
    const added = addNews(item);
    refresh();
    return added;
  }, [refresh]);

  const handleUpdate = useCallback((id, updates) => {
    updateNews(id, updates);
    refresh();
  }, [refresh]);

  const handleDelete = useCallback((id) => {
    deleteNews(id);
    refresh();
  }, [refresh]);

  const handleToggle = useCallback((id) => {
    toggleNewsStatus(id);
    refresh();
  }, [refresh]);

  const published = news
    .filter(n => n.status === 'published')
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const drafts = news.filter(n => n.status === 'draft');

  return (
    <NewsContext.Provider value={{
      news, published, drafts, refresh,
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
