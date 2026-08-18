import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import { defineEcConfig } from 'astro-expressive-code';

export default defineEcConfig({
  themes: ['github-dark', 'github-light'],
  useDarkModeMediaQuery: false,
  // 站点使用 data-theme="light|dark"，让代码主题跟随同一状态源。
  themeCssSelector: (theme) => `[data-theme='${theme.type}']`,
  defaultLocale: 'zh-CN',
  plugins: [pluginLineNumbers()],
  defaultProps: {
    showLineNumbers: true,
    wrap: false,
  },
  styleOverrides: {
    borderRadius: '0.875rem',
    codeFontFamily: 'var(--mono)',
    codeFontSize: '0.875rem',
    codeLineHeight: '1.75',
    codePaddingBlock: '1.35rem',
    codePaddingInline: '1.25rem',
    codeBackground: ['#202126', '#f7f7f8'],
    codeForeground: ['#d8dee9', '#263746'],
    uiFontFamily: 'var(--sans)',
    uiFontSize: '0.8rem',
    lineNumbers: {
      foreground: ['#70707a', '#9ca8b5'],
    },
  },
});
