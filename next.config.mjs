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

/**
 * Set the time zone to UTC because that's what Vercel uses.
 * Prevents issues with mismatching times between local development environment and Vercel
 */
process.env.TZ = "UTC";

export default nextConfig;
