import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import RegisterForm from '../../components/auth/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column - Register Form */}
        <div className="flex items-center justify-center lg:order-2">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <Link to="/" className="text-3xl font-bold text-primary-600">
                BookHaven
              </Link>
            </div>
            
            <RegisterForm />
          </div>
        </div>
        
        {/* Right Column - Image and Text */}
        <motion.div 
          className="hidden lg:flex flex-col items-center justify-center lg:order-1"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <img 
            src="https://images.pexels.com/photos/3747137/pexels-photo-3747137.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
            alt="Writing" 
            className="w-4/5 h-auto rounded-lg shadow-lg object-cover"
          />
          
          <div className="mt-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Join Our Literary Community
            </h2>
            <p className="text-gray-600">
              Create an account to start your journey with BookHaven. Whether you're a reader exploring new books or an author sharing your stories, we've got you covered.
            </p>
            
            <div className="mt-6 space-y-4">
              <div className="flex items-start">
                <svg className="h-5 w-5 text-accent-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-600 text-sm">Personalized reading recommendations</span>
              </div>
              
              <div className="flex items-start">
                <svg className="h-5 w-5 text-accent-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-600 text-sm">Save favorite books and create reading lists</span>
              </div>
              
              <div className="flex items-start">
                <svg className="h-5 w-5 text-accent-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-600 text-sm">Support independent authors directly</span>
              </div>
              
              <div className="flex items-start">
                <svg className="h-5 w-5 text-accent-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-600 text-sm">Track your reading progress and history</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;