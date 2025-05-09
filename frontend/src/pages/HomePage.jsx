import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/config';
import BookCard from '../components/ui/BookCard';
import CategoryFilter from '../components/ui/CategoryFilter';
import { ArrowRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// Mock data for demonstration
const MOCK_FEATURED_BOOKS = [
  {
    id: '1',
    title: 'The Silent Echo',
    author: 'Emily Johnson',
    coverImage: 'https://images.pexels.com/photos/1765033/pexels-photo-1765033.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    price: 14.99,
    rating: 4.5,
    reviewCount: 128,
    badge: 'Bestseller',
    categories: ['Mystery', 'Thriller','Romantic'],
    description: 'A gripping tale of secrets and revelations in a small coastal town.'
  },
  {
    id: '2',
    title: 'Beyond the Horizon',
    author: 'Michael Adams',
    coverImage: 'https://images.pexels.com/photos/1126355/pexels-photo-1126355.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    price: 12.99,
    rating: 4.2,
    reviewCount: 89,
    badge: 'New',
    categories: ['Sci-Fi', 'Adventure'],
    description: 'An epic journey through space and time that challenges the very fabric of reality.'
  },
  {
    id: '3',
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
    id: '4',
    title: 'The Art of Simplicity',
    author: 'David Chen',
    coverImage: 'https://images.pexels.com/photos/1148399/pexels-photo-1148399.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    price: 19.99,
    rating: 4.8,
    reviewCount: 212,
    categories: ['Self-Help', 'Mindfulness'],
    description: 'Transform your life by embracing minimalism and finding joy in the simple things.'
  }
];

const MOCK_CATEGORIES = [
  'Fiction', 'Non-Fiction', 'Mystery', 'Thriller', 'Romance', 'Sci-Fi', 
  'Fantasy', 'Horror', 'Biography', 'History', 'Self-Help', 'Business',
  'Science', 'Technology', 'Art', 'Cooking', 'Travel', 'Children'
];

const HomePage = () => {
  const [featuredBooks, setFeaturedBooks] = useState(MOCK_FEATURED_BOOKS);
  const [newReleases, setNewReleases] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Load books from Firestore (not implemented yet, using mock data)
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, this would fetch from Firestore
        // For now, use mock data
        
        // Simulate loading delay
        setTimeout(() => {
          setNewReleases(MOCK_FEATURED_BOOKS.slice(0, 3));
          setBestSellers(MOCK_FEATURED_BOOKS.slice(1, 4));
          setLoading(false);
        }, 800);
        
      } catch (error) {
        console.error('Error fetching books:', error);
        setLoading(false);
      }
    };
    
    fetchBooks();
  }, []);
  
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };
  
  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section 
        className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Books background"
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Discover and Support Independent Authors
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Find your next favorite book directly from the creators who poured their heart into every page.
          </motion.p>
          
          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <form onSubmit={handleSearch} className="relative text-left">
              <input
                type="text"
                placeholder="Search by title, author, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input w-full pl-12 py-4 text-gray-900 rounded-full shadow-lg"
              />
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary rounded-full py-2"
              >
                Search
              </button>
            </form>
          </motion.div>
          
          <motion.div 
            className="mt-6 flex flex-wrap justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <span className="text-sm opacity-80">Popular searches:</span>
            {['Fantasy', 'Mystery', 'Romance', 'Science Fiction', 'Biography'].map((tag) => (
              <Link 
                key={tag} 
                to={`/search?q=${tag}`}
                className="text-sm bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-full transition-colors"
              >
                {tag}
              </Link>
            ))}
          </motion.div>
        </div>
      </motion.section>
      
      {/* Featured Books Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <motion.h2 
              className="text-3xl font-bold text-gray-800"
              variants={fadeInUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              Featured Books
            </motion.h2>
            
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <CategoryFilter
                categories={categories}
                selectedCategories={selectedCategories}
                onChange={setSelectedCategories}
              />
            </motion.div>
          </div>
          
          {loading ? (
            <div className="flex justify-center my-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {featuredBooks.map(book => (
                <motion.div key={book.id} variants={fadeInUp}>
                  <BookCard book={book} />
                </motion.div>
              ))}
            </motion.div>
          )}
          
          <motion.div 
            className="text-center mt-8"
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <Link to="/books" className="btn-outline inline-flex items-center">
              <span>Browse all books</span>
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Become an Author Section */}
      <motion.section 
        className="py-16 px-4 sm:px-6 lg:px-8 bg-accent-50"
        variants={fadeInUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <motion.img 
              src="https://images.pexels.com/photos/3767407/pexels-photo-3767407.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
              alt="Author writing"
              className="rounded-lg shadow-lg max-w-full h-auto"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          <div className="md:w-1/2 md:pl-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Are You an Author?</h2>
            <p className="text-lg text-gray-700 mb-6">
              Join our community of independent authors and share your stories with readers worldwide. 
              Publish your books, build your audience, and earn from your passion.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'Keep 70% of your book sales revenue',
                'Maintain complete creative control',
                'Publish in multiple formats',
                'Access detailed analytics and reader insights',
                'Connect directly with your readers'
              ].map((item, index) => (
                <motion.li 
                  key={index} 
                  className="flex items-start"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <svg className="h-5 w-5 text-accent-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/publish" className="btn-primary text-center">
                Start Publishing
              </Link>
              <Link to="/author-faq" className="btn-outline text-center">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </motion.section>
      
      {/* New Releases Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-3xl font-bold text-gray-800 mb-8"
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            New Releases
          </motion.h2>
          
          {loading ? (
            <div className="flex justify-center my-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {newReleases.map(book => (
                <motion.div key={book.id} variants={fadeInUp}>
                  <BookCard book={book} />
                </motion.div>
              ))}
            </motion.div>
          )}
          
          <motion.div 
            className="text-center mt-8"
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <Link to="/new-releases" className="btn-outline inline-flex items-center">
              <span>View all new releases</span>
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Bestsellers Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-3xl font-bold text-gray-800 mb-8"
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            Bestsellers
          </motion.h2>
          
          {loading ? (
            <div className="flex justify-center my-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {bestSellers.map(book => (
                <motion.div key={book.id} variants={fadeInUp}>
                  <BookCard book={book} />
                </motion.div>
              ))}
            </motion.div>
          )}
          
          <motion.div 
            className="text-center mt-8"
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <Link to="/bestsellers" className="btn-outline inline-flex items-center">
              <span>View all bestsellers</span>
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">What Our Community Says</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join thousands of readers and authors who have found their literary home on BookHaven.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {[
              {
                name: 'Jennifer Lee',
                role: 'Author',
                image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
                quote: "BookHaven changed my life as an author. I've connected with readers worldwide and built a sustainable income from my passion."
              },
              {
                name: 'Mark Thompson',
                role: 'Reader',
                image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
                quote: 'I love discovering new voices on BookHaven. The quality of independent books here has completely changed my reading habits.'
              },
              {
                name: 'Sophia Rodriguez',
                role: 'Author',
                image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
                quote: 'The direct connection with my readers has been invaluable. BookHaven gives me control over my work while handling all the technical details.'
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
                variants={fadeInUp}
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full object-cover mr-4" 
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">{testimonial.quote}</p>
                <div className="mt-4 flex text-accent-500">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2 
            className="text-3xl font-bold mb-4"
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            Stay Updated with BookHaven
          </motion.h2>
          
          <motion.p 
            className="text-lg opacity-90 mb-8 max-w-2xl mx-auto"
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            Subscribe to our newsletter for book recommendations, author interviews, and exclusive deals.
          </motion.p>
          
          <motion.form 
            className="max-w-md mx-auto flex flex-col sm:flex-row gap-2"
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <input
              type="email"
              placeholder="Your email address"
              className="input flex-grow text-gray-800"
              required
            />
            <button type="submit" className="btn-accent w-full sm:w-auto flex-shrink-0">
              Subscribe
            </button>
          </motion.form>
          
          <motion.p 
            className="text-sm opacity-75 mt-4"
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            We respect your privacy. Unsubscribe at any time.
          </motion.p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;