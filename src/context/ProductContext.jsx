import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ProductContext = createContext();
export const useProduct = () => useContext(ProductContext);
const getToken = () => localStorage.getItem("token");

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [productsLoaded, setProductsLoaded] = useState(false);

  const fetchProducts = async (categoryIds = []) => {
    setProductsLoaded(false);
    let url = `${import.meta.env.VITE_API_URL}/product`;
    if (categoryIds.length > 0) {
      url += `?category_id=[${categoryIds.join(",")}]`;
    }

    try {
      const res = await axios.get(url);
      const mapped = res.data.data.rows.map((p) => ({
        ...p,
        price: parseFloat(p.price),
        category: p.category?.map((c) => c.name) || [],
        image: p.image
          ? `data:image/${p.image_extension};base64,${p.image}`
          : "",
      }));
      setProducts(mapped);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setProductsLoaded(true);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getProduct = (id) => products.find((p) => p.id === parseInt(id));
  const getProductArray = () => products;

  const token = getToken();
  const authHeader = { headers: { Authorization: token } };

  const addProduct = async (data) => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/product`, data, authHeader);
    fetchProducts(); // refresh after add
    return res.data.data;
  };

  const updateProduct = async (id, data) => {
    const res = await axios.patch(`${import.meta.env.VITE_API_URL}/product/${id}`, data, authHeader);
    fetchProducts(); // refresh after update
    return res.data.data;
  };

  const deleteProduct = async (id) => {
    await axios.delete(`${import.meta.env.VITE_API_URL}/product/${id}`, authHeader);
    fetchProducts();
  };

  const uploadProductImage = async (id, file) => {
    const formData = new FormData();
    formData.append("image", file);
    await axios.patch(`${import.meta.env.VITE_API_URL}/product/${id}/image`, formData, {
      ...authHeader,
      "Content-Type": "multipart/form-data",
    });
    fetchProducts();
  };

  const restockProduct = async (id, quantity) => {
    await axios.patch(
      `${import.meta.env.VITE_API_URL}/product/${id}/restock`,
      { quantity },
      authHeader
    );
    fetchProducts();
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        productsLoaded,
        fetchProducts,
        getProduct,
        getProductArray,
        addProduct,
        updateProduct,
        deleteProduct,
        uploadProductImage,
        restockProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}
