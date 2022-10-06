/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	env: {
		apiKey: `${process.env.API_KEY}`,
		authDomain: `${process.env.AUTH_DOMAIN}`,
		projectId: `${process.env.PROJECT_ID}`,
		storageBucket: `${process.env.STORAGE_BUCKET}`,
		messagingSenderId: `${process.env.API_KEY}`,
		appId: `${process.env.APP_ID}`,
		measurementId: `${process.env.MEASUREMENT_ID}`,
	},
	images: {
    domains: ['lh3.googleusercontent.com'],
  },
};

module.exports = nextConfig;
