import { Heart, BookOpen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookData } from "./BookCard";
import { Badge } from "@/components/ui/badge";

interface FavoritesListProps {
  favorites: BookData[];
  onRemoveFavorite: (book: BookData) => void;
  onViewDetails: (book: BookData) => void;
  onClearAll: () => void;
}

export const FavoritesList = ({ 
  favorites, 
  onRemoveFavorite, 
  onViewDetails, 
  onClearAll 
}: FavoritesListProps) => {
  if (favorites.length === 0) {
    return (
      <Card className="text-center py-12 shadow-card border-0">
        <CardContent>
          <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No favorites yet</h3>
          <p className="text-muted-foreground mb-6">
            Start searching for books and add them to your reading list!
          </p>
          <Button variant="outline" asChild>
            <a href="#search">Start Searching Books</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-accent fill-current" />
          <h2 className="text-2xl font-bold text-foreground">My Reading List</h2>
          <Badge variant="secondary" className="ml-2">
            {favorites.length} book{favorites.length !== 1 ? 's' : ''}
          </Badge>
        </div>
        
        {favorites.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {/* Favorites Grid */}
      <div className="grid gap-4">
        {favorites.map((book) => (
          <Card key={book.key} className="hover:shadow-elevated transition-shadow shadow-card border-0">
            <CardContent className="p-4">
              <div className="flex gap-4">
                {/* Book Cover */}
                <div className="flex-shrink-0 w-20 h-28 bg-muted rounded-md overflow-hidden shadow-sm">
                  {book.cover_i ? (
                    <img 
                      src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                      alt={`Cover of ${book.title}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full flex items-center justify-center bg-muted ${book.cover_i ? 'hidden' : ''}`}>
                    <BookOpen className="w-8 h-8 text-muted-foreground" />
                  </div>
                </div>

                {/* Book Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground line-clamp-2 leading-tight mb-1">
                        {book.title || "Untitled"}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        by {book.author_name?.slice(0, 2).join(", ") || "Unknown Author"}
                      </p>
                      {book.first_publish_year && (
                        <p className="text-xs text-muted-foreground">
                          Published: {book.first_publish_year}
                        </p>
                      )}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveFavorite(book)}
                      className="flex-shrink-0 text-destructive hover:bg-destructive/10"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </Button>
                  </div>

                  {/* Subjects */}
                  {book.subject && book.subject.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {book.subject.slice(0, 3).map((subject, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="text-xs px-2 py-0 h-5"
                        >
                          {subject}
                        </Badge>
                      ))}
                      {book.subject.length > 3 && (
                        <Badge variant="outline" className="text-xs px-2 py-0 h-5">
                          +{book.subject.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(book)}
                      className="text-xs hover:bg-primary hover:text-primary-foreground"
                    >
                      <BookOpen className="w-3 h-3 mr-1" />
                      View Details
                    </Button>
                    
                    {book.isbn && book.isbn[0] && (
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        <a 
                          href={`https://www.worldcat.org/isbn/${book.isbn[0]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Find in Library
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};