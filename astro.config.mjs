import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import Compress from 'astro-compress';
import expressiveCode from 'astro-expressive-code';
import icon from 'astro-icon';
import pagefind from 'astro-pagefind';
import robotsTxt from 'astro-robots-txt';
import { markdownProcessor } from './src/plugins/markdown.mjs';

export default defineConfig({
  site: 'https://hidewnd.com',
  output: 'static',
  trailingSlash: 'always',
  // 项目级关闭，避免开发工具栏遮挡页面预览与视觉验收。
  devToolbar: {
    enabled: false,
  },
  integrations: [
    expressiveCode(),
    icon({
      // 只将页面实际使用的图标加入构建，避免打包整套图标集。
      include: {
        tabler: [
          'search',
          'chevron-down',
          'external-link',
          'moon-stars',
          'sun',
          'brand-github',
          'brand-git',
          'rss',
          'bookmarks',
          'arrow-up',
          'list-tree',
          'menu',
          'x',
        ],
      },
    }),
    sitemap(),
    robotsTxt(),
    // 放在 pagefind 之前：先压缩产物，再由 pagefind 索引压缩后的 HTML，
    // 同时避免 pagefind 生成的资源被二次压缩。站点图片已是 webp，跳过图片重压缩。
    Compress({ Image: false }),
    pagefind(),
  ],
  markdown: {
    processor: markdownProcessor,
  },
});
