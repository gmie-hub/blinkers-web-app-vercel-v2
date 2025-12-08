import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  htmlLimitedBots:
    /facebookexternalhit|whatsapp|twitterbot|linkedinbot|slackbot/i,
};

export default nextConfig;
