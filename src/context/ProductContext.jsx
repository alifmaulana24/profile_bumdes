import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../utils/storage';

const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  const refresh = useCallback(() => {
    setProducts(getProducts());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = (product) => {
    addProduct(product);
    refresh();
  };

  const update = (id, updates) => {
    updateProduct(id, updates);
    refresh();
  };

  const remove = (id) => {
    deleteProduct(id);
    refresh();
  };

  return (
    <ProductContext.Provider value={{ products, add, update, remove, refresh }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProduct must be used within ProductProvider');
  return ctx;
};
