import type { NextConfig } from "next";

// Cache Components is off on purpose: every page reads the mock session
// cookie and live DB data, so plain request-time rendering is simpler.
const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
