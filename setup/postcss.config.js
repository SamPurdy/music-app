// PostCSS configuration — processes CSS through Tailwind and then Autoprefixer.
// Tailwind generates utility classes from your source files.
// Autoprefixer adds vendor prefixes (e.g. -webkit-) for browser compatibility.
// You generally don't need to change this file.
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
