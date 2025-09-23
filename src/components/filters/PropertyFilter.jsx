import React, { useState } from 'react';
import { MagnifyingGlassIcon, MapPinIcon, HomeIcon } from '@heroicons/react/24/outline';
import { PROPERTY_TYPES, KENYA_LOCATIONS } from '../../utils/constants';

const SearchBar = ({ 
  initialQuery = '', 
  initialType = '', 
  initialLocation = '', 
  onSearch, 
  compact = false 
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [propertyType, setPropertyType] = useState(initialType);
  const [location, setLocation] = useState(initialLocation);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      query: query.trim(),
      type: propertyType,
      location: location
    });
  };

  const handleQuickSearch = (searchType, value) => {
    if (searchType === 'location') {
      setLocation(value);
      onSearch({
        query: query.trim(),
        type: propertyType,
        location: value
      });
    } else if (searchType === 'type') {
      setPropertyType(value);
      onSearch({
        query: query.trim(),
        type: value,
        location: location
      });
    }
  };

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search properties, locations..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">All Types</option>
          <option value={PROPERTY_TYPES.APARTMENT}>Apartment</option>
          <option value={PROPERTY_TYPES.HOUSE}>House</option>
          <option value={PROPERTY_TYPES.STUDIO}>Studio</option>
          <option value={PROPERTY_TYPES.COMMERCIAL}>Commercial</option>
        </select>
        
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">All Locations</option>
          {KENYA_LOCATIONS.COUNTIES.map(county => (
            <option key={county} value={county.toLowerCase()}>{county}</option>
          ))}
        </select>
        
        <button
          type="submit"
          className="btn-primary px-6 py-2"
        >
          Search
        </button>
      </form>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Search Input */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What are you looking for?
          </label>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by property name, location, or features..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
            />
          </div>
        </div>

        {/* Property Type and Location Selects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Type
            </label>
            <div className="relative">
              <HomeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
              >
                <option value="">All Property Types</option>
                <option value={PROPERTY_TYPES.APARTMENT}>Apartment</option>
                <option value={PROPERTY_TYPES.HOUSE}>House</option>
                <option value={PROPERTY_TYPES.STUDIO}>Studio</option>
                <option value={PROPERTY_TYPES.COMMERCIAL}>Commercial Space</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <div className="relative">
              <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
              >
                <option value="">All Locations</option>
                <optgroup label="Major Cities">
                  {KENYA_LOCATIONS.COUNTIES.slice(0, 5).map(county => (
                    <option key={county} value={county.toLowerCase()}>{county}</option>
                  ))}
                </optgroup>
                <optgroup label="Other Counties">
                  {KENYA_LOCATIONS.COUNTIES.slice(5).map(county => (
                    <option key={county} value={county.toLowerCase()}>{county}</option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Search Buttons */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Popular Searches</h4>
          
          {/* Popular Locations */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Popular Locations:</p>
            <div className="flex flex-wrap gap-2">
              {['nairobi', 'mombasa', 'kisumu', 'nakuru'].map(loc => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => handleQuickSearch('location', loc)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    location === loc
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {loc.charAt(0).toUpperCase() + loc.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Popular Property Types */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Popular Types:</p>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'apartment', label: 'Apartments' },
                { value: 'house', label: 'Houses' },
                { value: 'studio', label: 'Studios' }
              ].map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleQuickSearch('type', type.value)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    propertyType === type.value
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="w-full btn-primary text-lg py-3"
        >
          <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
          Search Properties
        </button>
      </form>

      {/* Recent Searches (if applicable) */}
      {initialQuery || initialType || initialLocation ? (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">Current Search:</p>
          <div className="flex flex-wrap gap-2">
            {initialQuery && (
              <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                "{initialQuery}"
              </span>
            )}
            {initialType && (
              <span className="px-2 py-1 bg-secondary-100 text-secondary-800 text-xs rounded-full">
                {initialType}
              </span>
            )}
            {initialLocation && (
              <span className="px-2 py-1 bg-accent-100 text-accent-800 text-xs rounded-full">
                {initialLocation}
              </span>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SearchBar;