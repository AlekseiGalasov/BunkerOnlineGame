import {Config} from "tailwindcss";


const config: Config = {
    darkMode: "class",
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                light: {
                    primary_bg_color: '#F5F5F5',
                    bg_color: '#E0E0E0',
                    text_color: '#333333',
                    link_color: '#1A73E8',
                    alert_color: '#D32F2F',
                    border_color: '#BDBDBD',
                    warning_color: '#FFA000',
                },
                dark: {
                    primary_bg_color: '#121212',
                    bg_color: '#1E1E1E',
                    text_color: '#E0E0E0',
                    link_color: '#8AB4F8',
                    alert_color: '#F28B82',
                    border_color: '#424242',
                    warning_color: '#FF8A65',
                },
            },
            boxShadow: {
                'light-100': '0px 12px 20px 0px rgba(184, 184, 184, 0.03), 0px 6px 12px 0px rgba(184, 184, 184, 0.02), 0px 2px 4px 0px rgba(184, 184, 184, 0.03)',
                'light-200': '10px 10px 20px 0px rgba(218, 213, 213, 0.10)',
                'light-300': '-10px 10px 20px 0px rgba(218, 213, 213, 0.10)',
                'dark-100': '0px 2px 10px 0px rgba(46, 52, 56, 0.10)',
                'dark-200': '2px 0px 20px 0px rgba(39, 36, 36, 0.04)'
            },
            screens: {
                xs: '420px'
            },
            borderRadius: {
                "2": "8px",
                "1.5": "6px",
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            backgroundImage: {
                "auth-dark": 'url("/images/auth-dark.png")',
                "auth-light": 'url("/images/auth-light.png")',
            } ,
        }
    },
    plugins: [
    ],
}

export default config