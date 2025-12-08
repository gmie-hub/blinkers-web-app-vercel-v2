import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  htmlLimitedBots:
    /facebookexternalhit|WhatsApp|whatsapp|twitterbot|linkedinbot|slackbot|telegrambot|discordbot/i,
};

export default nextConfig;
