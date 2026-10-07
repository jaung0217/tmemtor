import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // cacheComponents (create-next-app's new default as of Next 16.4) is
  // incompatible with the `export const dynamic = "force-dynamic"` route
  // segment config used throughout the copied Admin CMS (site-factory,
  // C:\project\salt_project) to keep user-session pages out of prerender.
  // Disabled here to match the rendering model the copied common code
  // was built for.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  experimental: {
    serverActions: {
      // Media upload (src/actions/media.ts) allows files up to
      // MAX_MEDIA_SIZE_BYTES (10MB, src/validations/media.ts). Next.js's
      // default Server Action body limit is 1MB, so it must be raised here
      // for /admin/media uploads to work at all.
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
