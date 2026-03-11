import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites(){
    return [
      {
        source:"/api/:path*",
        destination:`${process.env.API_URL}/:path*`,
      }
    ]
  }
  // /* config options here */
  // reactCompiler: true,
};

export default nextConfig;
