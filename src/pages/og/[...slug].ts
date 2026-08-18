import { OGImageRoute } from 'astro-og-canvas';
import { getEntryUrl, getExcerpt, getRoutableDocuments } from '../../lib/content';

const entries = await getRoutableDocuments();

// 以归一化后的 permalink 路径作为 key；默认 getSlug 会为其追加 .png，
// 最终生成 /og/<permalink-slug>.png，与 [...slug].astro 中的 og:image 一致。
const pages = Object.fromEntries(
  entries.map((entry) => {
    const slug = getEntryUrl(entry).replace(/^\//, '').replace(/\/$/, '');
    return [slug, entry];
  }),
);

export const { getStaticPaths, GET } = await OGImageRoute({
  pages,
  getImageOptions: (_path, entry) => ({
    title: entry.data.title,
    description: getExcerpt(entry, 120) || undefined,
    logo: { path: './public/assets/avatar-v2.webp', size: [96] },
    bgGradient: [
      [17, 168, 205],
      [0, 80, 110],
    ],
    font: {
      title: { families: ['HarmonyOS Sans SC'], size: 70, color: [255, 255, 255] },
      description: { families: ['HarmonyOS Sans SC'], size: 38, color: [224, 240, 246] },
    },
    fonts: ['./public/fonts/HarmonyOS_Sans_SC_Regular.ttf'],
  }),
});
