/** @type {import('next').NextConfig} */
const nextConfig = {
	async redirects() {
		return [
			{
				source: "/about-us",
				destination: "/gioi-thieu-gia-su-uy-tin",
				permanent: true,
			},
			{
				source: "/faq",
				destination: "/hoi-dap-gia-su",
				permanent: true,
			},
			{
				source: "/login",
				destination: "/dang-nhap-gia-su",
				permanent: true,
			},
			{
				source: "/khu-vuc-gia-su",
				destination: "/tai-khoan-gia-su",
				permanent: true,
			},
			{
				source: "/khu-vuc-gia-su/:path*",
				destination: "/tai-khoan-gia-su/:path*",
				permanent: true,
			},
			{
				source: "/tutor",
				destination: "/tai-khoan-gia-su",
				permanent: true,
			},
			{
				source: "/tutor/:path*",
				destination: "/tai-khoan-gia-su/:path*",
				permanent: true,
			},
		];
	},
};

export default nextConfig;
