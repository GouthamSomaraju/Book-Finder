import { ArrowLeft, Book, Calendar, Globe, Heart, Tag, User, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookData } from "./BookCard";

interface BookDetailProps {
  book: BookData;
  isFavorite: boolean;
  onToggleFavorite: (book: BookData) => void;
  onBack: () => void;
}

export const BookDetail = ({ book, isFavorite, onToggleFavorite, onBack }: BookDetailProps) => {
  const coverUrl = book.cover_i 
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
    : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onBack}
              className="hover:bg-muted"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Results
            </Button>
            
            <Button
              variant={isFavorite ? "default" : "outline"}
              onClick={() => onToggleFavorite(book)}
              className={isFavorite ? "bg-accent hover:bg-accent/90" : ""}
            >
              <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
              {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Book Cover */}
            <div className="md:col-span-1">
              <Card className="overflow-hidden shadow-book">
                <CardContent className="p-0">
                  <div className="aspect-[3/4] bg-muted flex items-center justify-center">
                    {coverUrl ? (
                      <img 
                        src={coverUrl} 
                        alt={`Cover of ${book.title}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`text-muted-foreground ${coverUrl ? 'hidden' : ''}`}>
                      <Book className="w-16 h-16 mb-2" />
                      <p className="text-sm text-center">No Cover Available</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Book Information */}
            <div className="md:col-span-2 space-y-6">
              {/* Title and Basic Info */}
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-4">
                  {book.title || "Untitled"}
                </h1>
                
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  {book.author_name && book.author_name.length > 0 && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <span className="text-muted-foreground">Author(s):</span>
                        <p className="font-medium">{book.author_name.join(", ")}</p>
                      </div>
                    </div>
                  )}
                  
                  {book.first_publish_year && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <span className="text-muted-foreground">First Published:</span>
                        <p className="font-medium">{book.first_publish_year}</p>
                      </div>
                    </div>
                  )}
                  
                  {book.publisher && book.publisher.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <span className="text-muted-foreground">Publisher(s):</span>
                        <p className="font-medium">{book.publisher.slice(0, 3).join(", ")}</p>
                      </div>
                    </div>
                  )}
                  
                  {book.language && book.language.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <span className="text-muted-foreground">Language(s):</span>
                        <p className="font-medium">{book.language.slice(0, 5).join(", ").toUpperCase()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Subjects */}
              {book.subject && book.subject.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    <h3 className="font-semibold text-foreground">Subjects</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {book.subject.slice(0, 12).map((subject, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="bg-secondary hover:bg-secondary/80 transition-colors"
                      >
                        {subject}
                      </Badge>
                    ))}
                    {book.subject.length > 12 && (
                      <Badge variant="outline" className="text-muted-foreground">
                        +{book.subject.length - 12} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* ISBN Information */}
              {book.isbn && book.isbn.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mb-3">ISBN Numbers</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {book.isbn.slice(0, 6).map((isbn, index) => (
                      <div key={index} className="text-sm bg-muted rounded p-2">
                        <span className="text-muted-foreground">ISBN:</span>
                        <br />
                        <span className="font-mono text-xs">{isbn}</span>
                      </div>
                    ))}
                  </div>
                  {book.isbn.length > 6 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      +{book.isbn.length - 6} more ISBN numbers available
                    </p>
                  )}
                </div>
              )}

              {/* External Links */}
              <div className="pt-4">
                <h3 className="font-semibold text-foreground mb-3">Find This Book</h3>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    asChild
                    className="hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <a 
                      href={`https://openlibrary.org${book.key}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on Open Library
                    </a>
                  </Button>
                  
                  {book.isbn && book.isbn[0] && (
                    <>
                      <Button
                        variant="outline"
                        asChild
                        className="hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        <a 
                          href={`https://www.worldcat.org/isbn/${book.isbn[0]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Find in Library
                        </a>
                      </Button>
                      
                      <Button
                        variant="outline"
                        asChild
                        className="hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        <a 
                          href={`https://www.amazon.com/s?k=${book.isbn[0]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Buy Online
                        </a>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};