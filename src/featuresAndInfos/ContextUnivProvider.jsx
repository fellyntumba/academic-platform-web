import { createContext, useContext, useEffect, useState } from "react";
import { getContext } from "./contextService";

const ContextUniv = createContext();

export const ContextUnivProvider = ({ children }) => {
  const [infoUniv, setInfoUniv] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContext = async () => {
      const data = await getContext();
      setInfoUniv(data);
      setLoading(false);
    };

    loadContext();
  }, []);

  return (
    <ContextUniv.Provider value={{ infoUniv, loading }}>
      {children}
    </ContextUniv.Provider>
  );
};

export const useContextUniv = () => useContext(ContextUniv);

