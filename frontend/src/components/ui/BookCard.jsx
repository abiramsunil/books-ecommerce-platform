import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

const BookCard = ({ book }) => {
  const { addToCart, addToWishlist, removeFromWishlist, wishlist } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  
  const isInWishlist = wishlist.some(item => item.id === book.id);
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(book, 1);
    toast.success('Added to cart!');
  };
  
  const handleWishlistToggle = (e) => {
    e.preventDefault();
    if (isInWishlist) {
      removeFromWishlist(book.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(book);
      toast.success('Added to wishlist!');
    }
  };
  
  return (
    <motion.div 
      className="card card-hover h-full flex flex-col"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/books/${book.id}`} className="flex flex-col h-full">
        {/* Book Cover with Overlay Actions */}
        <div className="relative overflow-hidden">
          <img 
            src={book.coverImage} 
            alt={book.title}
            className="w-full h-64 object-cover transition-transform duration-300"
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
          />
          
          {/* Actions Overlay */}
          <div 
            className={`absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center gap-4 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <button
              onClick={handleAddToCart}
              className="p-2 bg-white rounded-full text-primary-500 hover:bg-primary-50 transition-colors"
              aria-label="Add to cart"
            >
              <ShoppingCartIcon className="h-6 w-6" />
            </button>
            <button
              onClick={handleWishlistToggle}
              className="p-2 bg-white rounded-full text-primary-500 hover:bg-primary-50 transition-colors"
              aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {isInWishlist ? (
                <HeartSolidIcon className="h-6 w-6 text-accent-500" />
              ) : (
                <HeartIcon className="h-6 w-6" />
              )}
            </button>
          </div>
          
          {/* Book Badge (New, Bestseller, etc.) */}
          {book.badge && (
            <div className="absolute top-2 right-2">
              <span className={`badge ${
                book.badge === 'New' ? 'bg-teal-500 text-white' : 
                book.badge === 'Bestseller' ? 'bg-accent-500 text-white' : 
                'bg-primary-500 text-white'
              }`}>
                {book.badge}
              </span>
            </div>
          )}
        </div>
        
        {/* Book Info */}
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{book.title}</h3>
          </div>
          <p className="text-sm text-gray-600 mt-1">{book.author}</p>
          
          {/* Categories Tags */}
          {book.categories && book.categories.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {book.categories.slice(0, 2).map((category, index) => (
                <span 
                  key={index} 
                  className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                >
                  {category}
                </span>
              ))}
              {book.categories.length > 2 && (
                <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                  +{book.categories.length - 2}
                </span>
              )}
            </div>
          )}
          
          {/* Description Preview */}
          {book.description && (
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">{book.description}</p>
          )}
          
          <div className="mt-auto pt-4 flex justify-between items-center">
            <span className="text-lg font-bold text-primary-600">${book.price.toFixed(2)}</span>
            <div className="flex items-center">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    className={`h-4 w-4 ${i < Math.floor(book.rating || 0) ? 'text-accent-500' : 'text-gray-300'}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-1">({book.reviewCount || 0})</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default BookCard;