import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Skip ESLint during build (eslint config has compatibility issues)
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
