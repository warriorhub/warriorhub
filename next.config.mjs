/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'uhmvirtualtour.weebly.com' },
      { protocol: 'https', hostname: 'miro.medium.com' },
      { protocol: 'https', hostname: 'medium.com' },
      // add more hosts here if you use other image CDNs/domains
    ],
  },
};

export default nextConfig;
