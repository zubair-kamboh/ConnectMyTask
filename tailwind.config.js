/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1A3D8F',
        primaryDark: '#163373',
        graySoft: '#F7FAFC',
        secondary: '#214296', // Blue
        tertiary: '#FFD600', // Yellow
        surface: '#FFFFFF', // White background
        onSurface: '#006851', // Dark Green for onSurface text
        background: '#FAFAFA', // Light Grey background
        error: '#FF9274', // Error orange
        outline: '#BDBDBD', // Grey outline
        darkBackground: '#1F1F1F', // Dark Grey
        darkSurface: '#2C2C2C', // Dark surface
        darkTertiary: '#FFC107', // Amber for dark mode accents
        darkPrimary: '#004D40', // Dark Teal for primary container
      },
      fontFamily: {
        body: ['Figtree', 'sans-serif'],
      },
      boxShadow: {
        custom: '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  darkMode: 'class', // Enable dark mode toggling via class
  plugins: [require('tailwind-scrollbar-hide')],
}
