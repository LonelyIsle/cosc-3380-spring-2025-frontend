import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ConfigContext = createContext();
export const useConfig = () => useContext(ConfigContext);
const getToken = () => localStorage.getItem("token");
const URL_PATH = `${import.meta.env.VITE_API_URL}`;

export function ConfigProvider({ children }) {
  // State to hold configuration data and loading status
  const [config, setConfig] = useState(null);
  const [configLoaded, setConfigLoaded] = useState(false);

  // Fetch configuration (GET config)
  const fetchConfig = async () => {
    setConfigLoaded(false);
    try {
      const res = await axios.get(`${URL_PATH}/config`);
      setConfig(res.data.data);
    } catch (err) {
      console.error("Failed to fetch configuration:", err);
    } finally {
      setConfigLoaded(true);
    }
  };

  // Prepare authorization header using the token from localStorage
  const token = getToken();
  const authHeader = { headers: { Authorization: token } };

  // Update configuration (PATCH config)
  const updateConfig = async (data) => {
    try {
      const res = await axios.patch(`${URL_PATH}/config`, data, authHeader);
      setConfig(res.data.data);
      return res.data.data;
    } catch (err) {
      console.error("Failed to update configuration:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return (
    <ConfigContext.Provider
      value={{
        config,
        configLoaded,
        fetchConfig,
        updateConfig,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

export default ConfigContext;
