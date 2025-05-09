import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { motion } from 'framer-motion';

// Icons
import { 
  MagnifyingGlassIcon, 
  ShoppingCartIcon, 
  HeartIcon, 
  UserIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { currentUser, userRole, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Check if user has scrolled down
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  // Function to get navigation links based on user role
  const getNavLinks = () => {
    const commonLinks = [
      { name: 'Home', path: '/' },
      { name: 'Books', path: '/books' },
      { name: 'Categories', path: '/categories' }
    ];
    
    if (!currentUser) return commonLinks;
    
    if (userRole === 'admin') {
      return [
        ...commonLinks,
        { name: 'Admin', path: '/admin' }
      ];
    }
    
    if (userRole === 'author') {
      return [
        ...commonLinks,
        { name: 'My Books', path: '/author/books' },
        { name: 'Orders', path: '/author/orders' }
      ];
    }
    
    return commonLinks;
  };
  
  const navLinks = getNavLinks();
  
  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Nav Links */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-primary-600">
                BookHaven
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === link.path
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Search, Cart, and User Actions */}
          <div className="hidden md:flex items-center">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="relative mr-4">
              <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input w-64 pl-10"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </form>
            
            {/* Cart Icon */}
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-primary-500">
              <ShoppingCartIcon className="h-6 w-6" />
              {getCartItemCount() > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-primary-500 rounded-full">
                  {getCartItemCount()}
                </span>
              )}
            </Link>
            
            {/* Wishlist Icon */}
            <Link to="/wishlist" className="p-2 text-gray-600 hover:text-primary-500">
              <HeartIcon className="h-6 w-6" />
            </Link>
            
            {/* User Menu */}
            {currentUser ? (
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <button
                    onClick={() => navigate('/profile')}
                    className="flex items-center p-2 text-gray-600 hover:text-primary-500"
                  >
                    <UserIcon className="h-6 w-6 mr-1" />
                    <span className="text-sm font-medium">
                      {currentUser.displayName || 'Profile'}
                    </span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="ml-4 btn-outline"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="btn-outline">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-primary-500 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div 
          className="md:hidden bg-white shadow-lg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === link.path
                    ? 'bg-primary-50 text-primary-500'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          {/* Mobile Search Form */}
          <div className="px-4 py-3 border-t border-gray-200">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input w-full pl-10"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </form>
          </div>
          
          {/* Mobile Cart, Wishlist, and User Actions */}
          <div className="px-4 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <Link 
                to="/cart" 
                className="flex items-center py-2 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingCartIcon className="h-6 w-6 mr-2" />
                <span>Cart ({getCartItemCount()})</span>
              </Link>
              
              <Link 
                to="/wishlist" 
                className="flex items-center py-2 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <HeartIcon className="h-6 w-6 mr-2" />
                <span>Wishlist</span>
              </Link>
            </div>
          </div>
          
          {/* Mobile User Menu */}
          <div className="px-4 py-3 border-t border-gray-200">
            {currentUser ? (
              <div className="space-y-2">
                <div className="flex items-center">
                  <UserIcon className="h-6 w-6 mr-2 text-gray-500" />
                  <span className="text-sm font-medium">
                    {currentUser.displayName || currentUser.email}
                  </span>
                </div>
                <div className="flex flex-col space-y-2">
                  <Link
                    to="/profile"
                    className="btn-outline w-full text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="btn-primary w-full"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  to="/login"
                  className="btn-outline w-full text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary w-full text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;