import { useState, useCallback } from "react";
import { BookData } from "@/components/BookFinder/BookCard";
import { SearchType } from "@/components/BookFinder/SearchBox";

interface SearchFilters {
  type: SearchType;
  language?: string;
  yearFrom?: number;
  yearTo?: number;
}

interface UseBookSearchResult {
  books: BookData[];
  isLoading: boolean;
  error: string | null;
  totalResults: number;
  currentQuery: string;
  searchBooks: (query: string, filters: SearchFilters) => Promise<void>;
  clearResults: () => void;
}

const BOOKS_PER_PAGE = 20;

export const useBookSearch = (): UseBookSearchResult => {
  const [books, setBooks] = useState<BookData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [currentQuery, setCurrentQuery] = useState("");

  const searchBooks = useCallback(async (query: string, filters: SearchFilters) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setCurrentQuery(query);

    try {
      // Build search URL based on search type
      let searchUrl = "https://openlibrary.org/search.json?";
      const params = new URLSearchParams();

      // Set search parameter based on type
      switch (filters.type) {
        case "title":
          params.append("title", query);
          break;
        case "author":
          params.append("author", query);
          break;
        case "subject":
          params.append("subject", query);
          break;
        case "isbn":
          params.append("isbn", query);
          break;
        default:
          params.append("q", query);
      }

      // Add filters
      if (filters.language) {
        params.append("language", filters.language);
      }

      if (filters.yearFrom || filters.yearTo) {
        let yearFilter = "";
        if (filters.yearFrom && filters.yearTo) {
          yearFilter = `[${filters.yearFrom} TO ${filters.yearTo}]`;
        } else if (filters.yearFrom) {
          yearFilter = `[${filters.yearFrom} TO *]`;
        } else if (filters.yearTo) {
          yearFilter = `[* TO ${filters.yearTo}]`;
        }
        if (yearFilter) {
          params.append("first_publish_year", yearFilter);
        }
      }

      // Set response fields and limits
      params.append("fields", "key,title,author_name,first_publish_year,cover_i,subject,isbn,publisher,language");
      params.append("limit", BOOKS_PER_PAGE.toString());

      const response = await fetch(searchUrl + params.toString());
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.docs) {
        setBooks(data.docs);
        setTotalResults(data.numFound || data.docs.length);
      } else {
        throw new Error("Invalid response format from Open Library");
      }

    } catch (err) {
      console.error("Book search error:", err);
      setError(
        err instanceof Error 
          ? err.message 
          : "An error occurred while searching for books. Please try again."
      );
      setBooks([]);
      setTotalResults(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setBooks([]);
    setError(null);
    setTotalResults(0);
    setCurrentQuery("");
  }, []);

  return {
    books,
    isLoading,
    error,
    totalResults,
    currentQuery,
    searchBooks,
    clearResults,
  };
};