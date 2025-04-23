import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiSearchLine } from 'react-icons/ri';
import { allCourses, Course } from '../../data/CentralizedCourseData';

interface SearchAutocompleteProps {
  isMobile?: boolean;
}

const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({ isMobile = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Array<{_id: string, title: string, category: string}>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filteredSuggestions = allCourses
      .filter(course => {
        // Search in title/name
        if (course.title.toLowerCase().includes(query) || 
            course.name.toLowerCase().includes(query)) {
          return true;
        }
        
        // Search in description
        if (course.description.toLowerCase().includes(query)) {
          return true;
        }
        
        // Search in category
        if (course.category && course.category.toLowerCase().includes(query)) {
          return true;
        }
        
        return false;
      })
      .slice(0, 5) // Limit to 5 suggestions
      .map(course => ({
        _id: course._id,
        title: course.title,
        category: course.category
      }));

    setSuggestions(filteredSuggestions);
    setShowSuggestions(true);
  }, [searchQuery]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search-results?query=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    navigate(`/search-results?query=${encodeURIComponent(suggestion)}`);
    setShowSuggestions(false);
  };

  const handleBlur = () => {
    // Small delay to allow clicking on suggestions
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const handleFocus = () => {
    if (searchQuery.trim() !== '') {
      setShowSuggestions(true);
    }
  };

  return (
    <div className={`relative ${isMobile ? 'w-full' : 'flex-1'}`}>
      <div className={`searchIcon absolute left-0 flex justify-center items-center ${isMobile ? 'h-8 w-10' : 'h-10 w-12'}`}>
        <RiSearchLine className={`icon ${isMobile ? '' : 'mt-2 text-xl'}`} />
      </div>
      <input
        className={`searchBar pl-12 border ${isMobile ? 'w-full' : 'w-full md:w-96'} border-gray-300 rounded-full ${isMobile ? 'h-10' : 'h-12 text-lg'} focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent`}
        placeholder="Search for anything"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleSearch}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full md:w-96 mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <ul>
            {suggestions.map((suggestion) => (
              <li 
                key={suggestion._id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSuggestionClick(suggestion.title)}
              >
                <div className="font-medium">{suggestion.title}</div>
                <div className="text-sm text-gray-600">{suggestion.category}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete; 