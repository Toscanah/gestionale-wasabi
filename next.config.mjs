/** @type {import('next').NextConfig} */
export const reactStrictMode = false;
export const typescript = {
  // !! WARN !!
  // Dangerously allow production builds to successfully complete even if
  // your project has type errors.
  // !! WARN !!
  ignoreBuildErrors: true,
};
