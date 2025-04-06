import { Articles } from "@prisma/client";
import React, { Dispatch, createContext, useContext, useState } from "react";


// Define the type for your store data
type StoreData = {
    articles: Articles[] | null | undefined;
    setArticles: Dispatch<React.SetStateAction<Articles[] | null | undefined>>;
};

// Create a context for your store
const StoreContext = createContext<StoreData | undefined>(undefined);

// Create a custom hook to access the store
export const useArticlesStore = (): StoreData => {
    const store = useContext(StoreContext);
    if (!store) {
        throw new Error("useStore must be used within a StoreProvider");
    }
    return store;
};

interface StoreProviderProps {
    children: React.ReactNode;
}

// Create a provider component to wrap your app with the store
export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
    const [articles, setArticles] = useState<Articles[] | null | undefined>(undefined);

    const store: StoreData = {
        articles,
        setArticles,
    };

    return (
        <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    );
};
