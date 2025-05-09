import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoginForm from '../../components/auth/LoginForm';

const LoginPage = () => {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column - Image and Text */}
        <motion.div 
          className="hidden lg:flex flex-col items-center justify-center"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <img 
            src="https://images.pexels.com/photos/4238488/pexels-photo-4238488.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
            alt="Books" 
            className="w-4/5 h-auto rounded-lg shadow-lg object-cover"
          />
          
          <div className="mt-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Discover a World of Stories
            </h2>
            <p className="text-gray-600">
              Sign in to access your personalized reading experience, manage your book collection, and connect with independent authors.
            </p>
          </div>
        </motion.div>
        
        {/* Right Column - Login Form */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <Link to="/" className="text-3xl font-bold text-primary-600">
                BookHaven
              </Link>
            </div>
            
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;