/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0c1016',
        panel: '#151b24',
        panel2: '#1e2632',
        line: '#313b4a',
        gold: '#b59a6a',
        gold2: '#e3d3b4',
        sea: '#a8b4c4',
        sea2: '#3c4a5c',
        coral: '#a6847c',
        mist: '#d2d8e0',
        faint: '#8e9aab',
      },
      fontFamily: {
        sans: ['"IBM Plex Sans Arabic"', 'Tahoma', 'Segoe UI', 'sans-serif'],
        display: ['Amiri', 'Times New Roman', 'serif'],
      },
      boxShadow: {
        board: '0 30px 80px rgba(0,0,0,.42)',
      },
    },
  },
  plugins: [],
}
