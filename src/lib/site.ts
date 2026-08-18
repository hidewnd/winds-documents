import backgroundLocal from '../assets/backgroud.png';

export const site = {
  title: 'Hidewnd Docs',
  description: '不被关注的小角落，记录开发、折腾与生活。',
  url: 'https://hidewnd.com',
  author: 'Hidewnd',
  github: 'https://github.com/hidewnd',
};

// 首页背景图轮播：可配置远程 URL 或本地资源（本地经 Astro 资源管线处理为哈希地址）。
export const backgroundImages: string[] = [
  'https://cdn.jsdmirror.com/gh/xugaoyi/image_store/blog/20200507175828.jpeg',
  backgroundLocal.src,
];

// 友链是站点运营数据，集中维护可避免散落在多个页面组件中。
export const friendLinks = [
  {
    name: 'GitHub',
    description: 'Hidewnd 的开源项目与代码仓库',
    url: 'https://github.com/hidewnd',
  },
  {
    name: 'Gitee',
    description: 'Hidewnd 的国内代码镜像',
    url: 'https://gitee.com/hidewnd/',
  },
  {
    name: '旧博客',
    description: '历史博客入口',
    url: 'http://blog.hidewnd.cn/',
  },
];

// 图标库样式资源：供 iconClass 型图标加载对应 CSS/脚本（在 BaseLayout <head> 中引入）。
// 复刻旧站（vuepress-theme-vdoing）的 iconfont，字体文件自托管于 public/fonts/iconfont/。
// 也可追加其它博客常用图标库的 CDN 资源：
//   - Font Awesome：https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6/css/all.min.css
//   - Remix Icon：https://cdn.jsdelivr.net/npm/remixicon@4/fonts/remixicon.css
export const iconLibraryStyles: string[] = [
  '/fonts/iconfont/iconfont.css',
];

// 页脚社交图标链接：三种图标来源按优先级渲染（iconUrl > icon > iconClass）。
// - iconUrl：在线/网络图标图片地址，渲染为 <img>。
// - icon：astro-icon 图标名（如 tabler:brand-github），渲染为内联 SVG，无需加载额外样式。
// - iconClass：类名图标（iconfont / Font Awesome / Remix Icon 等），渲染为 <i class="...">，
//   需在 iconLibraryStyles 中加载对应图标库样式。iconfont 需要带上基类 iconfont，
//   例如 "iconfont icon-github"；Font Awesome 用 "fa-brands fa-github"；Remix 用 "ri-github-line"。
export type SocialLink = {
  title: string;
  link: string;
  iconClass?: string;
  icon?: string;
  iconUrl?: string;
};

export const socialLinks: SocialLink[] = [
  { iconClass: 'iconfont icon-github', title: 'Github', link: 'https://github.com/hidewnd' },
  { iconClass: 'iconfont icon-gitee', title: 'Gitee', link: 'https://gitee.com/hidewnd' },
  { iconClass: 'iconfont icon-bilibili', title: 'Bilibili', link: 'https://www.bilibili.com/' },
  { iconClass: 'iconfont icon-maomao', title: '二猫子', link: 'https://www.ermao.net/' },
];
