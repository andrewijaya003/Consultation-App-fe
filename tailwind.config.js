/** @type {import('tailwindcss').Config} */
module.exports = {
	important: true
	,
	content: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			blur: {
				xsm: "0.75px",
			},
			backgroundColor: {
				blue: "#00a9e2",
				hoverblue: "#0096c9",
				brokenwhite: '#fafafa'
			},
			backgroundSize: {
				'400%': '400%'
			},
			borderColor: {
				blue: "#00a9e2",
			},
			width: {
				550: "550px",
				385: "385px",
				345: "345px",
			},
			fontSize: {
				bigtitle: "42px",
				normal: "16px",
				smalltitle: "18px",
				smalltext: "14px",
				tinytext: "12.8px",
				normaltitle: "22px",
			},
			colors: {
				white: "#ffffff",
				blue: "#00a9e2",
				secblack: "#222222",
				red: "#ea6664",
				yellow: "#ffc549",
				popupbg: 'rgba(0, 0, 0, 0.7)',
				brkwhite: '#fafafa',
				pink: '#fef2f2',
				redblack: '#a12f4b'
			},
			fontFamily: {
				mont: ["Montserrat", "sans-serif"],
			},
			animation: {
				'movebg': 'move-bg 1s ease infinite',
				'dropdown': 'drop-down 300ms ease-in-out forwards'
			},
			screens: {
				'sm': '380px',
				'xm': '640px',
				'md': '768px',
				'lg': '820px',
				'xl': '1280px',
				'2xl': '1536px',
			},
			keyframe: {
				'move-bg': {
					'0%, 100%': {
						'background-position': '0% 50%'
					},
					'50%': {
						'background-position': '100% 50%'
					}
				},
				'drop-down': {
					'0%': {
						'transform': 'scaleY(0)'
					},
					'80%': {
						'transform': 'scaleY(1.1)'
					},
					'100%': {
						'transform': 'scaleY(1)'
					}
				}
			}
		},
	},
	plugins: [
		require('tailwind-scrollbar')
	],
};
