/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	swcMinify: true,
	env: {
		BASE_URL: process.env.BASE_URL,
		clientId: process.env.clientId,
		tenantId: process.env.tenantId,
		redirectUri: process.env.redirectUri,
		postLogoutRedirectUri: process.env.postLogoutRedirectUri,
		cacheLocation: process.env.cacheLocation,
		storeAuthStateInCookie: process.env.storeAuthStateInCookie,
		graphMeEndpoint: process.env.graphMeEndpoint
	},
}

module.exports = nextConfig
