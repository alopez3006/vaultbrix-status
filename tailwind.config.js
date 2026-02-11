/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        vaultbrix: {
          bg: '#020617',
          card: '#0f172a',
          border: '#1e293b',
        }
      }
    },
  },
  plugins: [],
}
