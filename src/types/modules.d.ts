declare module "tailwindcss-bg-patterns";

declare module "*.png" {
  const content: import("next/image").StaticImageData;
  export default content;
}
