import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import BookCard from '../components/ui/BookCard';
import toast from 'react-hot-toast';

// Icons
import { 
  ShoppingCartIcon, 
  HeartIcon,
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon 
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

// Mock data for demonstration
const MOCK_BOOK = {
  id: '1',
  title: 'The Silent Echo',
  author: 'Emily Johnson',
  authorId: 'author123',
  coverImage: 'https://images.pexels.com/photos/1765033/pexels-photo-1765033.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  images: [
    'https://images.pexels.com/photos/1765033/pexels-photo-1765033.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    'https://images.pexels.com/photos/1005012/pexels-photo-1005012.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/3747139/pexels-photo-3747139.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  ],
  price: 14.99,
  rating: 4.5,
  reviewCount: 128,
  categories: ['Mystery', 'Thriller', 'Suspense'],
  description: `
    A gripping tale of secrets and revelations in a small coastal town. When journalist Maya Roberts returns to her hometown to investigate a series of mysterious disappearances, she uncovers a web of deception that has been carefully maintained for decades.
    
    As she digs deeper, Maya realizes that the town's idyllic facade hides dark secrets that someone will do anything to protect. With time running out and danger closing in, Maya must confront her own past and the truth about her family's connection to the disappearances.
    
    The Silent Echo is a page-turning thriller that explores the power of silence, the weight of guilt, and the courage it takes to face the truth, no matter how painful.
  `,
  pageCount: 342,
  publishDate: '2023-02-15',
  language: 'English',
  isbn: '978-1234567890',
  reviews: [
    {
      id: 'r1',
      user: 'Robert Smith',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      rating: 5,
      date: '2023-03-10',
      content: "One of the best thrillers I've read this year. The plot twists kept me guessing until the very end."
    },
    {
      id: 'r2',
      user: 'Sarah Thompson',
      avatar: 'https://images.pexels.com/photos/1758845/pexels-photo-1758845.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      rating: 4,
      date: '2023-02-28',
      content: 'Great character development and atmosphere. The coastal town setting really comes alive in Johnson\'s writing.'
    },
    {
      id: 'r3',
      user: 'Michael Chen',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      rating: 5,
      date: '2023-02-22',
      content: 'Absolutely couldn\'t put it down! Finished it in one sitting and immediately wanted to read it again to catch all the clues I missed.'
    }
  ]
};

const MOCK_SIMILAR_BOOKS = [
  {
    id: '2',
    title: 'Whispers in the Dark',
    author: 'Sarah Williams',
    coverImage: 'https://images.pexels.com/photos/5834/nature-grass-leaf-green.jpg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    price: 11.99,
    rating: 4.7,
    reviewCount: 156,
    categories: ['Horror', 'Supernatural'],
    description: 'A chilling collection of short stories that will keep you up at night.'
  },
  {
    id: '3',
    title: 'Beyond the Horizon',
    author: 'Michael Adams',
    coverImage: 'https://images.pexels.com/photos/1126355/pexels-photo-1126355.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    price: 12.99,
    rating: 4.2,
    reviewCount: 89,
    categories: ['Sci-Fi', 'Adventure'],
    description: 'An epic journey through space and time that challenges the very fabric of reality.'
  },
  {
    id: '4',
    title: 'The Last Detective',
    author: 'Emily Johnson',
    coverImage: 'https://images.pexels.com/photos/1148399/pexels-photo-1148399.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    price: 13.99,
    rating: 4.3,
    reviewCount: 112,
    categories: ['Mystery', 'Crime'],
    description: 'A retired detective takes on one last case that brings him face to face with his greatest fears.'
  }
];

const BookDetailPage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { addToCart, addToWishlist, removeFromWishlist, wishlist } = useCart();
  
  const [book, setBook] = useState(null);
  const [similarBooks, setSimilarBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviewContent, setReviewContent] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [isInWishlist, setIsInWishlist] = useState(false);
  
  // Check if book is in wishlist
  useEffect(() => {
    if (wishlist.length > 0 && book) {
      setIsInWishlist(wishlist.some(item => item.id === book.id));
    }
  }, [wishlist, book]);
  
  // Fetch book details from Firestore (using mock data for now)
  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, this would fetch from Firestore
        // For now, use mock data
        
        // Simulate loading delay
        setTimeout(() => {
          setBook(MOCK_BOOK);
          setSimilarBooks(MOCK_SIMILAR_BOOKS);
          setLoading(false);
        }, 800);
        
      } catch (error) {
        console.error('Error fetching book:', error);
        setLoading(false);
      }
    };
    
    fetchBook();
  }, [id]);
  
  // Handle quantity change
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (book) {
      addToCart(book, quantity);
      toast.success(`Added "${book.title}" to cart!`);
    }
  };
  
  // Handle wishlist toggle
  const handleWishlistToggle = () => {
    if (book) {
      if (isInWishlist) {
        removeFromWishlist(book.id);
        setIsInWishlist(false);
        toast.success(`Removed "${book.title}" from wishlist`);
      } else {
        addToWishlist(book);
        setIsInWishlist(true);
        toast.success(`Added "${book.title}" to wishlist!`);
      }
    }
  };
  
  // Handle review submission
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('Please log in to leave a review');
      return;
    }
    
    if (!reviewContent.trim()) {
      toast.error('Please enter review content');
      return;
    }
    
    // In a real implementation, this would send to Firestore
    toast.success('Review submitted successfully!');
    setReviewContent('');
    setReviewRating(5);
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  // If book not found
  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-20 px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Book Not Found</h2>
        <p className="text-gray-600 mb-8">The book you are looking for does not exist or has been removed.</p>
        <Link to="/books" className="btn-primary">
          Browse Books
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link to="/" className="hover:text-primary-500 transition-colors">
                Home
              </Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <Link to="/books" className="hover:text-primary-500 transition-colors">
                Books
              </Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <Link to={`/categories/${book.categories[0]}`} className="hover:text-primary-500 transition-colors">
                {book.categories[0]}
              </Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <span className="text-gray-700 font-medium">{book.title}</span>
            </li>
          </ol>
        </nav>
        
        {/* Book Details Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Left Column - Images */}
            <div className="md:w-2/5 p-6">
              <motion.div 
                className="relative aspect-[3/4] overflow-hidden rounded-lg mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src={book.images[activeImage]} 
                  alt={book.title} 
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation Arrows */}
                {book.images.length > 1 && (
                  <>
                    <button 
                      onClick={() => setActiveImage((activeImage - 1 + book.images.length) % book.images.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeftIcon className="h-5 w-5 text-gray-700" />
                    </button>
                    <button 
                      onClick={() => setActiveImage((activeImage + 1) % book.images.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRightIcon className="h-5 w-5 text-gray-700" />
                    </button>
                  </>
                )}
              </motion.div>
              
              {/* Thumbnail Images */}
              {book.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {book.images.map((image, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`w-16 h-20 rounded-md overflow-hidden flex-shrink-0 ${
                        activeImage === index ? 'ring-2 ring-primary-500' : 'opacity-70'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <img 
                        src={image} 
                        alt={`${book.title} - Image ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Right Column - Book Info */}
            <div className="md:w-3/5 p-6 md:border-l border-gray-200 flex flex-col">
              <div className="mb-4">
                <div className="flex flex-wrap items-start justify-between">
                  <h1 className="text-3xl font-bold text-gray-800 mb-1">{book.title}</h1>
                  <button
                    onClick={handleWishlistToggle}
                    className="p-2 text-gray-500 hover:text-accent-500 transition-colors"
                    aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    {isInWishlist ? (
                      <HeartSolidIcon className="h-6 w-6 text-accent-500" />
                    ) : (
                      <HeartIcon className="h-6 w-6" />
                    )}
                  </button>
                </div>
                
                <Link 
                  to={`/author/${book.authorId}`}
                  className="text-lg text-primary-600 hover:text-primary-700 transition-colors"
                >
                  {book.author}
                </Link>
                
                {/* Rating Stars */}
                <div className="flex items-center mt-2">
                  <div className="flex text-accent-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarSolidIcon 
                        key={star}
                        className={`h-5 w-5 ${
                          star <= Math.floor(book.rating) ? 'text-accent-500' : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {book.rating.toFixed(1)} ({book.reviewCount} reviews)
                  </span>
                </div>
              </div>
              
              {/* Price and Add to Cart */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold text-primary-600">${book.price.toFixed(2)}</span>
                  <span className="ml-2 text-sm text-gray-500">+ Free shipping</span>
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <div className="flex items-center">
                    <label htmlFor="quantity" className="mr-2 text-sm text-gray-700">Qty:</label>
                    <input
                      type="number"
                      id="quantity"
                      min="1"
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="input w-16 py-1 px-2"
                    />
                  </div>
                  
                  <button
                    onClick={handleAddToCart}
                    className="btn-primary flex items-center justify-center"
                  >
                    <ShoppingCartIcon className="h-5 w-5 mr-2" />
                    Add to Cart
                  </button>
                  
                  <button
                    onClick={handleWishlistToggle}
                    className="btn-outline flex items-center justify-center"
                  >
                    {isInWishlist ? (
                      <>
                        <HeartSolidIcon className="h-5 w-5 mr-2 text-accent-500" />
                        Remove from Wishlist
                      </>
                    ) : (
                      <>
                        <HeartIcon className="h-5 w-5 mr-2" />
                        Add to Wishlist
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Categories */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {book.categories.map((category, index) => (
                    <Link
                      key={index}
                      to={`/categories/${category}`}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Book Details */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Book Details</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div className="text-gray-600">Pages</div>
                  <div>{book.pageCount}</div>
                  
                  <div className="text-gray-600">Published</div>
                  <div>{book.publishDate}</div>
                  
                  <div className="text-gray-600">Language</div>
                  <div>{book.language}</div>
                  
                  <div className="text-gray-600">ISBN</div>
                  <div>{book.isbn}</div>
                </div>
              </div>
              
              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">About this book</h3>
                <p className="text-gray-600 whitespace-pre-line">{book.description}</p>
              </div>
            </div>
          </div>
          
          {/* Reviews Section */}
          <div className="border-t border-gray-200 px-6 py-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Reviews</h2>
            
            {/* Add a Review Form */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Add a Review</h3>
              
              {!currentUser ? (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-gray-600 mb-4">Please log in to leave a review</p>
                  <Link to="/login" className="btn-primary">
                    Log In
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                      Rating
                    </label>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-1"
                        >
                          {star <= reviewRating ? (
                            <StarSolidIcon className="h-6 w-6 text-accent-500" />
                          ) : (
                            <StarIcon className="h-6 w-6 text-gray-300" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Review
                    </label>
                    <textarea
                      id="review"
                      rows="4"
                      value={reviewContent}
                      onChange={(e) => setReviewContent(e.target.value)}
                      className="input w-full"
                      placeholder="Share your thoughts about this book..."
                    ></textarea>
                  </div>
                  
                  <div>
                    <button type="submit" className="btn-primary">
                      Submit Review
                    </button>
                  </div>
                </form>
              )}
            </div>
            
            {/* Reviews List */}
            {book.reviews && book.reviews.length > 0 ? (
              <div className="space-y-6">
                {book.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                    <div className="flex items-start">
                      <img 
                        src={review.avatar} 
                        alt={review.user}
                        className="h-10 w-10 rounded-full mr-4" 
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-lg font-medium text-gray-800">{review.user}</h4>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        
                        <div className="flex text-accent-500 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarSolidIcon 
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating ? 'text-accent-500' : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                        
                        <p className="text-gray-600">{review.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No reviews yet. Be the first to review this book!
              </div>
            )}
          </div>
        </div>
        
        {/* Similar Books Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">You Might Also Like</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BookDetailPage;