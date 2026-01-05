tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#6B5CFF', // Cornflower (Purple)
                secondary: '#FB6962', // Bittersweet (Orange)
                accent: '#F3F4F6' // Light Gray
            },
            animation: {
                blob: "blob 7s infinite",
            },
            keyframes: {
                blob: {
                    "0%": { transform: "translate(0px, 0px) scale(1)" },
                    "33%": { transform: "translate(30px, -50px) scale(1.1)" },
                    "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
                    "100%": { transform: "translate(0px, 0px) scale(1)" }
                }
            }
        }
    }
}
