import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export type SearchType = "title" | "author" | "subject" | "isbn";

interface SearchFilters {
  type: SearchType;
  language?: string;
  yearFrom?: number;
  yearTo?: number;
}

interface SearchBoxProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  isLoading?: boolean;
}

export const SearchBox = ({ onSearch, isLoading }: SearchBoxProps) => {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("title");
  const [showFilters, setShowFilters] = useState(false);
  const [language, setLanguage] = useState<string>("");
  const [yearFrom, setYearFrom] = useState<string>("");
  const [yearTo, setYearTo] = useState<string>("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    const filters: SearchFilters = {
      type: searchType,
      ...(language && { language }),
      ...(yearFrom && { yearFrom: parseInt(yearFrom) }),
      ...(yearTo && { yearTo: parseInt(yearTo) }),
    };
    
    onSearch(query.trim(), filters);
  };

  const clearFilters = () => {
    setLanguage("");
    setYearFrom("");
    setYearTo("");
  };

  const hasActiveFilters = language || yearFrom || yearTo;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Search Bar */}
      <form onSubmit={handleSearch} className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder={`Search books by ${searchType}...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-4 h-12 text-base bg-card border-0 shadow-card focus:shadow-elevated transition-shadow"
              disabled={isLoading}
            />
          </div>
          
          <Select value={searchType} onValueChange={(value: SearchType) => setSearchType(value)}>
            <SelectTrigger className="w-32 h-12 bg-card border-0 shadow-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="author">Author</SelectItem>
              <SelectItem value="subject">Subject</SelectItem>
              <SelectItem value="isbn">ISBN</SelectItem>
            </SelectContent>
          </Select>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={`h-12 w-12 border-0 shadow-card transition-colors ${
              showFilters || hasActiveFilters 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-card hover:bg-muted'
            }`}
          >
            <Filter className="w-4 h-4" />
          </Button>

          <Button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="h-12 px-6 bg-gradient-primary hover:opacity-90 transition-opacity shadow-card"
          >
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </div>
      </form>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="mt-4 p-4 bg-card rounded-lg shadow-card border-0 animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-foreground">Advanced Filters</h3>
            {hasActiveFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-3 h-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Language
              </label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Any language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any language</SelectItem>
                  <SelectItem value="eng">English</SelectItem>
                  <SelectItem value="spa">Spanish</SelectItem>
                  <SelectItem value="fre">French</SelectItem>
                  <SelectItem value="ger">German</SelectItem>
                  <SelectItem value="ita">Italian</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                From Year
              </label>
              <Input
                type="number"
                placeholder="e.g. 2000"
                value={yearFrom}
                onChange={(e) => setYearFrom(e.target.value)}
                min="1000"
                max="2024"
                className="bg-background"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                To Year
              </label>
              <Input
                type="number"
                placeholder="e.g. 2024"
                value={yearTo}
                onChange={(e) => setYearTo(e.target.value)}
                min="1000"
                max="2024"
                className="bg-background"
              />
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-3 pt-3 border-t">
              <div className="flex flex-wrap gap-2">
                {language && (
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    Language: {language.toUpperCase()}
                  </Badge>
                )}
                {yearFrom && (
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    From: {yearFrom}
                  </Badge>
                )}
                {yearTo && (
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    To: {yearTo}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};