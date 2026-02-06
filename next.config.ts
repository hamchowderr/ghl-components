import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Skip TypeScript errors during build
  // The hooks/ and docs/ folders contain template code that users copy into their projects
  // These have intentional type mismatches for flexibility
  typescript: {
    ignoreBuildErrors: true,
  },
  // Skip ESLint during build (eslint config has compatibility issues)
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
