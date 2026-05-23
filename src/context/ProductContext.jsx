import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../utils/storage';

const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    setProducts(await getProducts());
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = async (product) => {
    await addProduct(product);
    await refresh();
  };

  const update = async (id, updates) => {
    await updateProduct(id, updates);
    await refresh();
  };

  const remove = async (id) => {
    await deleteProduct(id);
    await refresh();
  };

  return (
    <ProductContext.Provider value={{ products, add, update, remove, refresh, loading }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProduct must be used within ProductProvider');
  return ctx;
};
