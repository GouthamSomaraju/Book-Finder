import { Book, BookOpen, Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface BookData {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  subject?: string[];
  isbn?: string[];
  publisher?: string[];
  language?: string[];
}

interface BookCardProps {
  book: BookData;
  isFavorite?: boolean;
  onToggleFavorite: (book: BookData) => void;
  onViewDetails: (book: BookData) => void;
}

export const BookCard = ({ book, isFavorite, onToggleFavorite, onViewDetails }: BookCardProps) => {
  const coverUrl = book.cover_i 
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : null;

  const displayTitle = book.title || "Untitled";
  const displayAuthors = book.author_name?.slice(0, 2).join(", ") || "Unknown Author";
  const displayYear = book.first_publish_year || "Year Unknown";
  const displaySubjects = book.subject?.slice(0, 3) || [];

  return (
    <Card className="group hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 bg-card border-0 shadow-card overflow-hidden">
      <CardContent className="p-0">
        <div className="flex gap-4 p-4">
          {/* Book Cover */}
          <div className="flex-shrink-0 w-16 h-24 bg-muted rounded-md overflow-hidden shadow-sm">
            {coverUrl ? (
              <img 
                src={coverUrl} 
                alt={`Cover of ${displayTitle}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`w-full h-full flex items-center justify-center bg-muted ${coverUrl ? 'hidden' : ''}`}>
              <Book className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>

          {/* Book Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-sm text-foreground line-clamp-2 leading-tight">
                {displayTitle}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleFavorite(book)}
                className={`flex-shrink-0 p-1 h-auto hover:scale-110 transition-transform ${
                  isFavorite ? 'text-accent' : 'text-muted-foreground'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
            </div>

            <div className="space-y-1 text-xs text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span className="truncate">{displayAuthors}</span>
              </div>
              <div className="text-xs">{displayYear}</div>
            </div>

            {/* Subjects */}
            {displaySubjects.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {displaySubjects.map((subject, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="text-xs px-2 py-0 h-5 bg-secondary text-secondary-foreground"
                  >
                    {subject}
                  </Badge>
                ))}
              </div>
            )}

            {/* Actions */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(book)}
              className="w-full text-xs h-7 border-primary/20 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <BookOpen className="w-3 h-3 mr-1" />
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};