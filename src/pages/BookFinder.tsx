import { useState } from "react";
import { BookOpen, Heart, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { SearchBox } from "@/components/BookFinder/SearchBox";
import { BookCard, BookData } from "@/components/BookFinder/BookCard";
import { BookDetail } from "@/components/BookFinder/BookDetail";
import { FavoritesList } from "@/components/BookFinder/FavoritesList";

import { useBookSearch } from "@/hooks/useBookSearch";
import { useFavorites } from "@/hooks/useFavorites";

type View = "search" | "favorites" | "detail";

const BookFinder = () => {
  const [currentView, setCurrentView] = useState<View>("search");
  const [selectedBook, setSelectedBook] = useState<BookData | null>(null);
  
  const { 
    books, 
    isLoading, 
    error, 
    totalResults, 
    currentQuery, 
    searchBooks, 
    clearResults 
  } = useBookSearch();
  
  const {
    favorites,
    isFavorite,
    toggleFavorite,
    clearAllFavorites,
  } = useFavorites();

  const handleViewDetails = (book: BookData) => {
    setSelectedBook(book);
    setCurrentView("detail");
  };

  const handleBackToResults = () => {
    setCurrentView("search");
    setSelectedBook(null);
  };

  const handleToggleFavorite = (book: BookData) => {
    toggleFavorite(book);
  };

  // Render book detail view
  if (currentView === "detail" && selectedBook) {
    return (
      <BookDetail
        book={selectedBook}
        isFavorite={isFavorite(selectedBook)}
        onToggleFavorite={handleToggleFavorite}
        onBack={handleBackToResults}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="bg-gradient-hero text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm">
                <BookOpen className="w-12 h-12" />
              </div>
            </div>
            
            <h1 className="text-5xl font-bold mb-4">
              Discover Amazing Books
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Search millions of books, build your reading list, and find your next great read
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
                <Search className="w-4 h-4" />
                <span>Smart Search</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
                <Heart className="w-4 h-4" />
                <span>Personal Library</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
                <Sparkles className="w-4 h-4" />
                <span>Rich Details</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <Tabs value={currentView} onValueChange={(value) => setCurrentView(value as View)}>
          <div className="flex justify-center mb-8">
            <TabsList className="bg-card shadow-elevated border-0">
              <TabsTrigger value="search" className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Search Books
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                My Reading List
                {favorites.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-2 text-xs">
                    {favorites.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="search" className="space-y-8">
            {/* Search Interface */}
            <div id="search">
              <SearchBox onSearch={searchBooks} isLoading={isLoading} />
            </div>

            {/* Search Results */}
            {error && (
              <Alert className="max-w-4xl mx-auto border-destructive/20 bg-destructive/5">
                <AlertDescription className="text-destructive">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {currentQuery && !isLoading && !error && (
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      Search Results for "{currentQuery}"
                    </h2>
                    <p className="text-muted-foreground">
                      Found {totalResults.toLocaleString()} book{totalResults !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <Button variant="outline" onClick={clearResults}>
                    Clear Results
                  </Button>
                </div>

                {books.length === 0 && !isLoading ? (
                  <Card className="text-center py-12 shadow-card border-0">
                    <CardContent>
                      <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-foreground mb-2">No books found</h3>
                      <p className="text-muted-foreground">
                        Try adjusting your search terms or filters.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {books.map((book) => (
                      <BookCard
                        key={book.key}
                        book={book}
                        isFavorite={isFavorite(book)}
                        onToggleFavorite={handleToggleFavorite}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="max-w-4xl mx-auto">
                <div className="grid gap-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Card key={i} className="shadow-card border-0">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="w-16 h-24 bg-muted rounded-md animate-pulse"></div>
                          <div className="flex-1 space-y-3">
                            <div className="h-4 bg-muted rounded animate-pulse"></div>
                            <div className="h-3 bg-muted rounded animate-pulse w-3/4"></div>
                            <div className="flex gap-2">
                              <div className="h-5 bg-muted rounded animate-pulse w-16"></div>
                              <div className="h-5 bg-muted rounded animate-pulse w-20"></div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Welcome Message */}
            {!currentQuery && !isLoading && (
              <div className="max-w-2xl mx-auto text-center py-12">
                <BookOpen className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Start Your Book Discovery Journey
                </h2>
                <p className="text-muted-foreground mb-8">
                  Use the search box above to find books by title, author, subject, or ISBN. 
                  Build your personal reading list and discover your next favorite book!
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="p-4 bg-card rounded-lg shadow-card border-0">
                    <Search className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="font-medium">Smart Search</p>
                    <p className="text-muted-foreground text-xs">Multiple search types</p>
                  </div>
                  <div className="p-4 bg-card rounded-lg shadow-card border-0">
                    <Heart className="w-6 h-6 text-accent mx-auto mb-2" />
                    <p className="font-medium">Save Favorites</p>
                    <p className="text-muted-foreground text-xs">Build your library</p>
                  </div>
                  <div className="p-4 bg-card rounded-lg shadow-card border-0">
                    <BookOpen className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="font-medium">Rich Details</p>
                    <p className="text-muted-foreground text-xs">Full book info</p>
                  </div>
                  <div className="p-4 bg-card rounded-lg shadow-card border-0">
                    <Sparkles className="w-6 h-6 text-accent mx-auto mb-2" />
                    <p className="font-medium">Find & Buy</p>
                    <p className="text-muted-foreground text-xs">Library & store links</p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="favorites" className="max-w-4xl mx-auto">
            <FavoritesList
              favorites={favorites}
              onRemoveFavorite={handleToggleFavorite}
              onViewDetails={handleViewDetails}
              onClearAll={clearAllFavorites}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="mt-20 border-t bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              Powered by{" "}
              <a 
                href="https://openlibrary.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Open Library
              </a>
              {" "}• Built for book lovers everywhere
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BookFinder;