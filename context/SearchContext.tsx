// context/SearchContext.tsx

import React, { useState, createContext, ReactNode } from 'react';

interface SearchContextState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchContext = createContext<SearchContextState>({
  searchQuery: '',
  setSearchQuery: () => {},
});

// Define the props interface for the provider
interface SearchProviderProps {
  children: ReactNode; // This will allow any valid React children
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const value = { searchQuery, setSearchQuery };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};

export default SearchContext;
