export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {
    colors: { bg: 'var(--bg)', card: 'var(--card)', ink: 'var(--ink)', mut: 'var(--mut)', line: 'var(--line)', soft: 'var(--soft)', pri: '#1d4ed8', navy: '#0b1a44' },
    fontFamily: { sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'] } } },
}
