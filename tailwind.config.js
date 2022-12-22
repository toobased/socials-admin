const colors = require('tailwindcss/colors')
module.exports = {
    content: [
        "src/**/*.{js,ts,jsx,tsx}",
        // "./components/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        colors: {
            'back2': 'green',
            ...colors
        },
        dark: {
            colors: {
                'back2': 'red',
                ...colors
            },
        }
    },
    plugins: [],
}
