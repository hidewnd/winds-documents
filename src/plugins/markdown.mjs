import { unified } from '@astrojs/markdown-remark';
import rehypeKatex from 'rehype-katex';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkDirective from 'remark-directive';
import remarkMath from 'remark-math';
import { remarkAdmonitions, remarkNormalizeCodeLanguages } from './remark-admonitions.mjs';
import { rehypeRemoveUnsafeHtml } from './rehype-remove-unsafe-html.mjs';
import { rehypeMermaid } from './rehype-mermaid.mjs';

// 旧文章允许少量原始 HTML；这里仅保留博客正文需要的安全标签和协议。
const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), 'aside', 'kbd'],
  attributes: {
    ...defaultSchema.attributes,
    aside: ['ariaLabel', 'className'],
    code: [['className', /^language-/, 'math-inline', 'math-display']],
    pre: ['className'],
    span: ['className'],
  },
  protocols: {
    ...defaultSchema.protocols,
    href: ['http', 'https', 'mailto', 'tel'],
    src: ['http', 'https'],
  },
};

// 站点与回归测试共用同一处理链，避免测试另写一套清理规则和插件顺序。
export const markdownProcessor = unified({
  remarkPlugins: [remarkDirective, remarkAdmonitions, remarkNormalizeCodeLanguages, remarkMath],
  // 先清理原文，再生成公式和图表容器；Expressive Code 最后处理普通代码。
  rehypePlugins: [
    rehypeRemoveUnsafeHtml,
    [rehypeSanitize, sanitizeSchema],
    [rehypeKatex, { trust: false }],
    rehypeMermaid,
  ],
});
