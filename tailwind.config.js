const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            backgroundImage: {
                'grid-pattern': "linear-gradient(to bottom, theme('colors.white / 10%') 70%, theme('colors.red / 100%')), url('/images/noise.png')"
            },
            colors: {
                neutral: colors.neutral,
                red: {
                    DEFAULT: '#f13800ff',  // This sets the default red for `text-red`
                    dark: '#c03000ff'      // You can also add more shades, like `text-red-dark`
                },
                primary: '#362338ff',
                white: '#ffffff',
                warning: '#f5a623',
            },
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans]
            }
        }
    },
    daisyui: {
        themes: [
            {
                lofi: {
                    ...require('daisyui/src/theming/themes')['lofi'],
                    primary: '#f13800ff',
                    'primary-content': '#171717',
                    secondary: '#362338ff',
                    info: '#2bdcd2',
                    'info-content': '#171717',
                }
            }
        ]
    },
    plugins: [require('daisyui')]
};
