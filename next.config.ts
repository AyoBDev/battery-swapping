import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
    S3_REGION: process.env.S3_REGION,
    WAITLIST_S3_BUCKET: process.env.WAITLIST_S3_BUCKET,
  },
};

export default nextConfig;
