import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import { defineConfig } from 'astro/config';
import expressiveCode from 'astro-expressive-code';
import icon from 'astro-icon';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkDirective from 'remark-directive';
import {
  remarkAdmonitions,
  remarkNormalizeCodeLanguages,
} from './src/plugins/remark-admonitions.mjs';
import { rehypeRemoveUnsafeHtml } from './src/plugins/rehype-remove-unsafe-html.mjs';

// 旧文章允许少量原始 HTML；这里仅保留博客正文需要的安全标签和协议。
const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), 'aside', 'kbd'],
  attributes: {
    ...defaultSchema.attributes,
    aside: ['ariaLabel', 'className'],
    code: [
      ...(defaultSchema.attributes?.code ?? []),
      ['className', /^language-/],
    ],
    pre: ['className'],
    // Prism 仅使用 class 标记 token；允许 class 不会放开 style 或事件属性。
    span: ['className'],
  },
  protocols: {
    ...defaultSchema.protocols,
    href: ['http', 'https', 'mailto', 'tel'],
    src: ['http', 'https'],
  },
};

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
        ],
      },
    }),
    sitemap(),
  ],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkDirective, remarkAdmonitions, remarkNormalizeCodeLanguages],
      rehypePlugins: [rehypeRemoveUnsafeHtml, [rehypeSanitize, sanitizeSchema]],
    }),
  },
});
