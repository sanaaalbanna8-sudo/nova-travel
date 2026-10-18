/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1c2433',
        paper: '#ffffff',
        panel: '#ffffff',
        panel2: '#f4f7fb',
        line: '#d5deea',
        gold: '#c9a227',
        gold2: '#8a6420',
        sea: '#0e7c84',
        sea2: '#0a5358',
        coral: '#e15a4a',
        mist: '#5c6778',
        faint: '#8b95a5',
      },
      fontFamily: {
        sans: ['Cairo', '"IBM Plex Sans Arabic"', 'Tahoma', 'Segoe UI', 'sans-serif'],
        display: ['Amiri', 'Cairo', 'serif'],
      },
      boxShadow: {
        board: '0 18px 50px rgba(28, 36, 51, 0.08)',
      },
    },
  },
  plugins: [],
}
