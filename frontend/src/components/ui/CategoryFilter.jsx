import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const CategoryFilter = ({ categories, selectedCategories, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleCategoryToggle = (category) => {
    const newSelected = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    onChange(newSelected);
  };
  
  const handleClearAll = () => {
    onChange([]);
  };
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-outline flex items-center space-x-1"
      >
        <span>Categories</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDownIcon className="h-4 w-4" />
        </motion.div>
      </button>
      
      {selectedCategories.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {selectedCategories.map(category => (
            <span 
              key={category}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
            >
              {category}
              <button
                onClick={() => handleCategoryToggle(category)}
                className="ml-1 h-4 w-4 rounded-full flex items-center justify-center bg-primary-200 text-primary-800 hover:bg-primary-300"
              >
                &times;
              </button>
            </span>
          ))}
          <button
            onClick={handleClearAll}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            Clear all
          </button>
        </div>
      )}
      
      {isOpen && (
        <motion.div
          className="absolute z-10 mt-2 w-56 bg-white rounded-md shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <div className="py-1 max-h-60 overflow-y-auto">
            {categories.map(category => (
              <div
                key={category}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <input
                  type="checkbox"
                  id={`category-${category}`}
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryToggle(category)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label
                  htmlFor={`category-${category}`}
                  className="ml-2 block text-sm text-gray-900"
                >
                  {category}
                </label>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CategoryFilter;