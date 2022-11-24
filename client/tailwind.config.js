/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        'neutral-gray': '#404555',
        accent: '#2558E5',
        charcoal: '#606880',
        primary: '#F1C12B',
        'primary-light': '#DDCE9E',
        danger: '#D92D20',
      },
    },
  },
  plugins: [],
}
