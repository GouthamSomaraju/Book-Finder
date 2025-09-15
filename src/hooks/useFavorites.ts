import { useState, useEffect, useCallback } from "react";
import { BookData } from "@/components/BookFinder/BookCard";

const FAVORITES_STORAGE_KEY = "bookfinder_favorites";

interface UseFavoritesResult {
  favorites: BookData[];
  isFavorite: (book: BookData) => boolean;
  addFavorite: (book: BookData) => void;
  removeFavorite: (book: BookData) => void;
  toggleFavorite: (book: BookData) => void;
  clearAllFavorites: () => void;
}

export const useFavorites = (): UseFavoritesResult => {
  const [favorites, setFavorites] = useState<BookData[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        const parsedFavorites = JSON.parse(stored);
        if (Array.isArray(parsedFavorites)) {
          setFavorites(parsedFavorites);
        }
      }
    } catch (error) {
      console.error("Error loading favorites from storage:", error);
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error("Error saving favorites to storage:", error);
    }
  }, [favorites]);

  const isFavorite = useCallback((book: BookData): boolean => {
    return favorites.some(fav => fav.key === book.key);
  }, [favorites]);

  const addFavorite = useCallback((book: BookData) => {
    setFavorites(prev => {
      // Check if already exists
      if (prev.some(fav => fav.key === book.key)) {
        return prev;
      }
      return [...prev, book];
    });
  }, []);

  const removeFavorite = useCallback((book: BookData) => {
    setFavorites(prev => prev.filter(fav => fav.key !== book.key));
  }, []);

  const toggleFavorite = useCallback((book: BookData) => {
    if (isFavorite(book)) {
      removeFavorite(book);
    } else {
      addFavorite(book);
    }
  }, [isFavorite, addFavorite, removeFavorite]);

  const clearAllFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return {
    favorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearAllFavorites,
  };
};