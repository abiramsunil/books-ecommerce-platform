import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { doc, setDoc, getDoc, arrayUnion, arrayRemove, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize cart and wishlist from localStorage or Firestore
  useEffect(() => {
    const loadCartData = async () => {
      try {
        if (currentUser) {
          // Get cart from Firestore if user is logged in
          const cartDocRef = doc(db, 'carts', currentUser.uid);
          const cartDoc = await getDoc(cartDocRef);
          
          if (cartDoc.exists()) {
            setCart(cartDoc.data().items || []);
            setWishlist(cartDoc.data().wishlist || []);
          } else {
            // Create cart document if it doesn't exist
            await setDoc(cartDocRef, { items: [], wishlist: [] });
          }
        } else {
          // Get cart from localStorage if user is not logged in
          const localCart = localStorage.getItem('cart');
          const localWishlist = localStorage.getItem('wishlist');
          
          if (localCart) setCart(JSON.parse(localCart));
          if (localWishlist) setWishlist(JSON.parse(localWishlist));
        }
      } catch (error) {
        console.error("Error loading cart data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCartData();
  }, [currentUser]);

  // Update localStorage when cart changes
  useEffect(() => {
    if (!currentUser && !loading) {
      localStorage.setItem('cart', JSON.stringify(cart));
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  }, [cart, wishlist, currentUser, loading]);

  // Add item to cart
  const addToCart = async (book, quantity = 1) => {
    try {
      const existingItemIndex = cart.findIndex(item => item.id === book.id);
      let newCart;
      
      if (existingItemIndex >= 0) {
        // Update quantity if item already in cart
        newCart = [...cart];
        newCart[existingItemIndex].quantity += quantity;
      } else {
        // Add new item to cart
        newCart = [...cart, { ...book, quantity }];
      }
      
      setCart(newCart);
      
      // Update Firestore if user is logged in
      if (currentUser) {
        const cartDocRef = doc(db, 'carts', currentUser.uid);
        await updateDoc(cartDocRef, { items: newCart });
      }
      
      return true;
    } catch (error) {
      console.error("Error adding to cart:", error);
      return false;
    }
  };

  // Remove item from cart
  const removeFromCart = async (bookId) => {
    try {
      const newCart = cart.filter(item => item.id !== bookId);
      setCart(newCart);
      
      // Update Firestore if user is logged in
      if (currentUser) {
        const cartDocRef = doc(db, 'carts', currentUser.uid);
        await updateDoc(cartDocRef, { items: newCart });
      }
      
      return true;
    } catch (error) {
      console.error("Error removing from cart:", error);
      return false;
    }
  };

  // Update cart item quantity
  const updateQuantity = async (bookId, quantity) => {
    try {
      const newCart = cart.map(item => 
        item.id === bookId ? { ...item, quantity } : item
      );
      
      setCart(newCart);
      
      // Update Firestore if user is logged in
      if (currentUser) {
        const cartDocRef = doc(db, 'carts', currentUser.uid);
        await updateDoc(cartDocRef, { items: newCart });
      }
      
      return true;
    } catch (error) {
      console.error("Error updating quantity:", error);
      return false;
    }
  };

  // Add item to wishlist
  const addToWishlist = async (book) => {
    try {
      if (!wishlist.some(item => item.id === book.id)) {
        const newWishlist = [...wishlist, book];
        setWishlist(newWishlist);
        
        // Update Firestore if user is logged in
        if (currentUser) {
          const cartDocRef = doc(db, 'carts', currentUser.uid);
          await updateDoc(cartDocRef, { wishlist: newWishlist });
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      return false;
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (bookId) => {
    try {
      const newWishlist = wishlist.filter(item => item.id !== bookId);
      setWishlist(newWishlist);
      
      // Update Firestore if user is logged in
      if (currentUser) {
        const cartDocRef = doc(db, 'carts', currentUser.uid);
        await updateDoc(cartDocRef, { wishlist: newWishlist });
      }
      
      return true;
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      return false;
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      setCart([]);
      
      // Update Firestore if user is logged in
      if (currentUser) {
        const cartDocRef = doc(db, 'carts', currentUser.uid);
        await updateDoc(cartDocRef, { items: [] });
      }
      
      return true;
    } catch (error) {
      console.error("Error clearing cart:", error);
      return false;
    }
  };

  // Calculate cart total
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Calculate number of items in cart
  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    wishlist,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    addToWishlist,
    removeFromWishlist,
    clearCart,
    getCartTotal,
    getCartItemCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};