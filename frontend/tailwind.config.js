export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E8ECFA',
          100: '#D1DAF5',
          200: '#A3B5EB',
          300: '#758FE0',
          400: '#476AD6',
          500: '#3C5A99', // Main primary
          600: '#334E85',
          700: '#2A4170',
          800: '#20355C',
          900: '#172847',
        },
        accent: {
          50: '#FCF7E6',
          100: '#F9EFCD',
          200: '#F2DF9B',
          300: '#EBD069',
          400: '#E4C037',
          500: '#CDA435', // Main accent
          600: '#B08C2F',
          700: '#947526',
          800: '#775E1E',
          900: '#5B4817',
        },
        teal: {
          50: '#E6F6F5',
          100: '#CCECEA',
          200: '#99D9D5',
          300: '#66C7BF',
          400: '#33B4AA',
          500: '#2A9D8F', // Main teal
          600: '#24867A',
          700: '#1E6F65',
          800: '#185952',
          900: '#12423D',
        },
        success: {
          500: '#4CAF50',
        },
        warning: {
          500: '#FF9800',
        },
        error: {
          500: '#F44336',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      spacing: {
        // 8px spacing system
        '1': '8px',
        '2': '16px',
        '3': '24px',
        '4': '32px',
        '5': '40px',
        '6': '48px',
        '7': '56px',
        '8': '64px',
        '9': '72px',
        '10': '80px',
        '11': '88px',
        '12': '96px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}