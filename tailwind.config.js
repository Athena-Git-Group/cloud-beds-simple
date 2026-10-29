/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Official Cloudbeds palette, taken from their public React Native example
        // (cloudbeds/mobile-example · src/Theme/colors.ts).
        lightning: {
          50: '#F5F7FF', 100: '#EBF0FF', 200: '#CCD9FF', 300: '#99B3FF', 400: '#668CFF',
          500: '#3366FF', 600: '#264DC3', 700: '#193586', 800: '#0D1C4A', 900: '#001238',
        },
        mint: {
          50: '#F5FCFA', 100: '#EBF9F6', 200: '#CCEFE7', 300: '#99E0D0', 400: '#65D0B8',
          500: '#32C0A0', 600: '#25917B', 700: '#196257', 800: '#0C3332', 900: '#05171D',
        },
        solar: {
          50: '#FFFCF4', 100: '#FFF9EA', 200: '#FEEFCB', 300: '#FDDF96', 400: '#FCD062',
          500: '#FBC02D', 600: '#BC9125', 700: '#7D621D', 800: '#3F3316', 900: '#191711',
        },
        dusk: {
          50: '#FEF7F7', 100: '#FEEEEF', 200: '#FCD5D7', 300: '#F9ABAE', 400: '#F68086',
          500: '#F3565D', 600: '#B64149', 700: '#792D35', 800: '#3D1822', 900: '#180C16',
        },
        fog: {
          50: '#F8F9FA', 100: '#F1F3F4', 200: '#E4E6EA', 300: '#DDE0E4', 400: '#BBC0CA',
          500: '#99A1AF', 600: '#778295', 700: '#596273', 800: '#3B4351', 900: '#1E2330',
        },
        // `brand` aliases the primary (lightning) scale so existing classes keep working.
        brand: {
          50: '#F5F7FF', 100: '#EBF0FF', 200: '#CCD9FF', 300: '#99B3FF', 400: '#668CFF',
          500: '#3366FF', 600: '#264DC3', 700: '#193586', 800: '#0D1C4A', 900: '#001238',
        },
        ink: {
          DEFAULT: '#001238', // darkText
          soft: '#596273',
          faint: '#778295', // lightText
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        panel: '-8px 0 32px -12px rgba(0, 18, 56, 0.22)',
        card: '0 1px 2px rgba(0,18,56,.06), 0 1px 3px rgba(0,18,56,.08)',
      },
    },
  },
  plugins: [],
}
