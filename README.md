# Hidewnd Docs

基于 Astro 的轻量个人技术博客。现有文章继续保存在 `documents/`，构建时由 Astro Content Collections 直接读取，不需要复制或改写原文。

## 技术栈

- Astro 7 + TypeScript
- Astro Content Collections
- 原生 CSS 与少量原生 JavaScript
- HarmonyOS Sans SC 自托管字体
- Astro Icon + Tabler 构建期图标
- Astro Expressive Code + 行号插件
- GitHub Actions + GitHub Pages

## 本地开发

```powershell
npm install
npm run dev
```

构建与类型检查：

```powershell
npm run build
```

## 内容约定

文章沿用当前 frontmatter：

```yaml
---
title: 文章标题
date: 2026-08-17 12:00:00
permalink: /doc/d0012/
author:
  name: hidewnd
  link: https://github.com/hidewnd
---
```

目录与站点分类的映射集中在 `src/lib/content.ts`。友链集中在 `src/lib/site.ts`，新增链接只需要补充 `friendLinks` 数组。

迁移文章中的 `:::tip` 会渲染为提示块；旧主题遗留的 `<script>` 与 `<style>` 会在 Markdown 渲染阶段移除，避免将旧 Vue 脚本带进静态页面。

## 主题与字体

颜色令牌参考旧 Vdoing 站点的蓝青配色，集中维护在 `src/styles/global.css`。首页背景与头像位于 `public/assets/`，页面图标仅在构建期从 Tabler 图标集中提取，不加载客户端图标脚本。

项目自托管未修改的 `HarmonyOS Sans SC Regular` 字体，完整授权文件位于 `public/fonts/HarmonyOS_Sans_LICENSE.txt`。根据字体授权要求，页脚保留了字体使用声明；字体文件未做子集化或格式转换。

Astro 开发工具栏在 `astro.config.mjs` 中以项目级配置关闭，避免本地预览和截图被工具栏遮挡。

Markdown 代码块由 `astro-expressive-code` 统一渲染，语言归一化集中在 `src/plugins/remark-admonitions.mjs`，行号、Shiki 语法高亮、复制按钮和明暗主题配置集中在 `ec.config.mjs`。不要在单篇文章中复制代码块脚本或样式。

## GitHub Pages 部署

推送到 `main` 后，`.github/workflows/deploy.yml` 会自动构建并部署。仓库 Settings → Pages 的 Source 需要选择 **GitHub Actions**。

当前站点配置使用自定义域名 `hidewnd.com`，因此 `public/CNAME` 已包含该域名，`astro.config.mjs` 不设置仓库子路径 `base`。若以后改为 `https://<user>.github.io/<repo>/`，需要同时调整 `site`、`base` 与站内链接策略。
