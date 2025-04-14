import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CategoryContext = createContext();
export const useCategory = () => useContext(CategoryContext);
const getToken = () => localStorage.getItem("token");
const URL_PATH = `${import.meta.env.VITE_API_URL}`;

export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${URL_PATH}/category`);
      console.log(res)
      const mapped = res.data.data.rows
        .filter((c) => c.is_deleted !== 1)
        .map((c) => ({
          id: c.id,
          name: c.name,
          description: c.description,
          created_at: c.created_at,
          updated_at: c.updated_at,
        }));
      setCategories(mapped);
      console.log(mapped)
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setCategoriesLoaded(true);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const token = getToken();
  const authHeader = { headers: { Authorization: token } };

  const updateSelectedCategories = (categoryIds) => {
    setSelectedCategoryIds(categoryIds);
  };

  const addCategory = async (data) => {
    const res = await axios.post(`${URL_PATH}/category`, data, authHeader);
    fetchCategories();
    return res.data.data;
  };

  const updateCategory = async (id, data) => {
    const res = await axios.patch(
      `${URL_PATH}/category/${id}`,
      data,
      authHeader,
    );
    fetchCategories();
    return res.data.data;
  };

  const deleteCategory = async (id) => {
    await axios.delete(`${URL_PATH}/category/${id}`, authHeader);
    fetchCategories();
  };

  const getCategory = (id) => categories.find((c) => c.id === id);

  return (
    <CategoryContext.Provider
      value={{
        categories,
        categoriesLoaded,
        selectedCategoryIds,
        setSelectedCategoryIds,
        fetchCategories,
        updateSelectedCategories,
        addCategory,
        updateCategory,
        deleteCategory,
        getCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}
