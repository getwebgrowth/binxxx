'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, X, Check, Loader2 } from 'lucide-react';

export default function SearchableDropdown({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Search...',
  isMulti = false,
  showFlags = false,
  isRemote = false,
  remoteType = 'bank',
  remoteCountry = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [remoteOptions, setRemoteOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch dynamic suggestions from API if isRemote is active
  useEffect(() => {
    if (!isRemote) return;
    if (!isOpen) return;

    let active = true;
    const fetchOptions = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/suggest-filters?type=${remoteType}&search=${encodeURIComponent(search)}&country=${encodeURIComponent(remoteCountry)}`);
        const data = await res.json();
        if (active) {
          setRemoteOptions(data.suggestions || []);
        }
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    const timer = setTimeout(fetchOptions, 200);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [isOpen, search, isRemote, remoteType, remoteCountry]);

  // Determine source options list
  const displayOptions = isRemote ? remoteOptions : options.filter(option => {
    const text = typeof option === 'string' ? option : option.name || option.label || '';
    return text.toLowerCase().includes(search.toLowerCase());
  });

  const handleSelect = (option) => {
    const val = typeof option === 'string' ? option : option.value || option.name || '';
    if (isMulti) {
      const currentValues = Array.isArray(value) ? value : [];
      if (currentValues.includes(val)) {
        onChange(currentValues.filter(v => v !== val));
      } else {
        onChange([...currentValues, val]);
      }
    } else {
      onChange(val);
      setIsOpen(false);
    }
  };

  const removeTag = (valToRemove) => {
    if (isMulti) {
      const currentValues = Array.isArray(value) ? value : [];
      onChange(currentValues.filter(v => v !== valToRemove));
    } else {
      onChange('');
    }
  };

  const renderSelectedDisplay = () => {
    if (isMulti) {
      const currentValues = Array.isArray(value) ? value : [];
      if (currentValues.length === 0) return <span className="text-gray-400 dark:text-gray-500 text-xs">All Levels</span>;
      return (
        <div className="flex flex-wrap gap-1.5 max-h-[36px] overflow-y-auto custom-scrollbar">
          {currentValues.map(v => (
            <span
              key={v}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-[10px] font-bold rounded-md border border-gray-200 dark:border-gray-700"
            >
              {v}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(v);
                }}
                className="hover:text-red-500 text-gray-400 transition-colors"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
        </div>
      );
    } else {
      if (!value) return <span className="text-gray-400 dark:text-gray-500 text-xs">Select {label}...</span>;
      
      if (showFlags) {
        const optionObj = options.find(o => o.name === value || o.code === value);
        if (optionObj) {
          return (
            <span className="flex items-center gap-2 text-xs text-gray-800 dark:text-gray-200 font-medium">
              <span className="text-base leading-none">{optionObj.flag}</span>
              {optionObj.name}
            </span>
          );
        }
      }
      return <span className="text-xs text-gray-800 dark:text-gray-200 font-medium">{value}</span>;
    }
  };

  return (
    <div className={`group relative flex flex-col ${isOpen ? 'z-30' : 'z-10'}`} ref={dropdownRef}>
      <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors">
        {label}
      </label>
      
      {/* Clickable selector box */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="premium-input relative w-full min-h-[42px] p-2.5 pl-4 pr-14 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-950 flex items-center justify-between cursor-pointer focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-400 hover:border-gray-300 dark:hover:border-gray-700 transition-all select-none shadow-sm"
      >
        <div className="flex-grow overflow-hidden text-left">
          {renderSelectedDisplay()}
        </div>
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
          {(!isMulti && value) && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(value);
                }}
                className="p-1 rounded-lg hover:bg-gray-150 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors pointer-events-auto flex items-center justify-center"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="w-[1px] h-4 bg-gray-200 dark:bg-gray-800" />
            </>
          )}
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin" />
          ) : (
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500' : ''}`} />
          )}
        </div>
      </div>

      {/* Expanded dropdown panel */}
      {isOpen && (
        <div className="absolute top-[calc(100%+6px)] left-0 right-0 z-50 glass-panel border border-gray-100 dark:border-gray-800 shadow-xl bg-white/95 dark:bg-gray-950/95 overflow-hidden animate-fade-up max-h-[320px] flex flex-col">
          {/* Search bar inside panel */}
          <div className="p-3 border-b border-gray-100 dark:border-gray-850 flex items-center gap-2 bg-gray-50/50 dark:bg-gray-900/50">
            <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={placeholder}
              className="w-full bg-transparent border-none text-xs text-gray-850 dark:text-gray-150 focus:outline-none focus:ring-0 placeholder-gray-400"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Options list */}
          <div className="flex-grow overflow-y-auto py-1 custom-scrollbar">
            {loading && displayOptions.length === 0 ? (
              <div className="p-4 text-center text-xs text-gray-400 dark:text-gray-500 flex items-center justify-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                Loading...
              </div>
            ) : displayOptions.length === 0 ? (
              <div className="p-4 text-center text-xs text-gray-400 dark:text-gray-500">
                No matching results
              </div>
            ) : (
              displayOptions.map((option, idx) => {
                const text = typeof option === 'string' ? option : option.name || option.label || '';
                const code = typeof option === 'string' ? option : option.value || option.name || '';
                
                const isSelected = isMulti
                  ? (Array.isArray(value) && value.includes(code))
                  : value === code;

                return (
                  <div
                    key={idx}
                    onClick={() => handleSelect(option)}
                    className={`px-4 py-2.5 text-xs flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-50/70 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      {isMulti && (
                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'border-gray-300 dark:border-gray-700'
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                      )}
                      
                      {showFlags && typeof option !== 'string' && (
                        <span className="text-base leading-none flex-shrink-0">{option.flag}</span>
                      )}
                      
                      <span className="truncate">{text}</span>
                    </div>

                    {(!isMulti && isSelected) && (
                      <Check className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
