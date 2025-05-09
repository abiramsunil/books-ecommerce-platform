import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  TrashIcon, 
  MinusIcon, 
  PlusIcon,
  ShoppingCartIcon,
  HeartIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  
  // Calculate subtotal, tax, and total
  const subtotal = getCartTotal();
  const tax = subtotal * 0.05; // Assuming 5% tax
  const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
  const total = subtotal + tax + shipping - discount;
  
  // Handle quantity change
  const handleQuantityChange = (bookId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(bookId, newQuantity);
  };
  
  // Handle remove item from cart
  const handleRemoveItem = (bookId) => {
    removeFromCart(bookId);
    toast.success('Item removed from cart');
  };
  
  // Handle coupon code application
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }
    
    // Mock coupon codes for demonstration
    const coupons = {
      'WELCOME10': { type: 'percentage', value: 10 },
      'SAVE5': { type: 'fixed', value: 5 },
      'BOOKS20': { type: 'percentage', value: 20 }
    };
    
    const coupon = coupons[couponCode.toUpperCase()];
    
    if (coupon) {
      if (coupon.type === 'percentage') {
        const discountAmount = (subtotal * coupon.value) / 100;
        setDiscount(discountAmount);
        toast.success(`${coupon.value}% discount applied!`);
      } else {
        setDiscount(coupon.value);
        toast.success(`$${coupon.value} discount applied!`);
      }
    } else {
      toast.error('Invalid coupon code');
    }
  };
  
  // Handle checkout
  const handleCheckout = () => {
    if (!currentUser) {
      toast.error('Please log in to checkout');
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate checkout process
    setTimeout(() => {
      clearCart();
      setIsProcessing(false);
      navigate('/checkout/success');
    }, 2000);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };
  
  // Empty cart state
  if (cart.length === 0) {
    return (
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-lg shadow-md"
          >
            <div className="flex justify-center mb-6">
              <ShoppingCartIcon className="h-20 w-20 text-gray-300" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Looks like you haven't added any books to your cart yet.</p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
              <Link to="/books" className="btn-primary inline-flex items-center justify-center">
                <ShoppingCartIcon className="h-5 w-5 mr-2" />
                Browse Books
              </Link>
              <Link to="/wishlist" className="btn-outline inline-flex items-center justify-center">
                <HeartIcon className="h-5 w-5 mr-2" />
                View Wishlist
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
          <Link 
            to="/books" 
            className="text-primary-600 hover:text-primary-700 inline-flex items-center"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Continue Shopping
          </Link>
        </div>
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Cart Items */}
          <motion.div 
            className="lg:col-span-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 lg:mb-0">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th scope="col" className="px-6 py-3 text-right">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cart.map((item) => (
                    <motion.tr key={item.id} variants={itemVariants}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-16 w-12 flex-shrink-0">
                            <Link to={`/books/${item.id}`}>
                              <img 
                                src={item.coverImage} 
                                alt={item.title}
                                className="h-full w-full object-cover" 
                              />
                            </Link>
                          </div>
                          <div className="ml-4">
                            <Link 
                              to={`/books/${item.id}`}
                              className="text-sm font-medium text-gray-900 hover:text-primary-600"
                            >
                              {item.title}
                            </Link>
                            <div className="text-sm text-gray-500">{item.author}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                            disabled={item.quantity <= 1}
                          >
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                            className="mx-2 w-12 text-center input py-1 px-1"
                          />
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                          aria-label="Remove item"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
          
          {/* Order Summary */}
          <motion.div 
            className="lg:col-span-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-800">Order Summary</h2>
              </div>
              
              <div className="px-6 py-4 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-800">${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (5%)</span>
                  <span className="text-gray-800">${tax.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-800">
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-success-500">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between font-bold">
                    <span className="text-gray-800">Total</span>
                    <span className="text-primary-600">${total.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Including VAT
                  </p>
                </div>
              </div>
              
              {/* Coupon Code Form */}
              <div className="px-6 py-4 border-t border-gray-200">
                <form onSubmit={handleApplyCoupon} className="flex">
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="input flex-1"
                  />
                  <button type="submit" className="ml-2 btn-outline">
                    Apply
                  </button>
                </form>
              </div>
              
              {/* Checkout Button */}
              <div className="px-6 py-4 border-t border-gray-200">
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full btn-primary py-3 flex items-center justify-center"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Proceed to Checkout'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;