// @ts-check

import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: "https://moneyearnlearn.com",

  integrations: [
    sitemap()
  ],

  compressHTML: true,
  adapter: cloudflare()
});