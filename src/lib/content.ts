import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';

export type DocumentEntry = CollectionEntry<'documents'>;

export const categoryOrder = [
  'articles',
  'notes',
  'api',
  'games',
  'vibe-coding',
] as const;

export type CategorySlug = (typeof categoryOrder)[number];

export const categories: Record<
  CategorySlug,
  { title: string; description: string; directory: string }
> = {
  articles: {
    title: '文章',
    description: '开发实践、工具与工程经验',
    directory: '01.文档',
  },
  notes: {
    title: '笔记',
    description: '学习过程与部署记录',
    directory: '02.笔记',
  },
  'vibe-coding': {
    title: 'Vibe Coding',
    description: 'AI 编程工具与使用记录',
    directory: '07.VibeCoding',
  },
  api: {
    title: 'API',
    description: '接口设计与服务文档',
    directory: '03.API',
  },
  games: {
    title: '游戏',
    description: '游戏相关资料与攻略',
    directory: '04.游戏',
  },
};

const directoryToSlug = Object.fromEntries(
  Object.entries(categories).map(([slug, value]) => [value.directory, slug]),
) as Record<string, CategorySlug>;

function normalizedPath(entry: DocumentEntry) {
  return (entry.filePath ?? '').replaceAll('\\', '/');
}

export function getCategorySlug(entry: DocumentEntry): CategorySlug | 'about' {
  const filePath = normalizedPath(entry);
  const match = Object.keys(directoryToSlug).find((directory) =>
    filePath.includes(`/${directory}/`),
  );
  if (match) return directoryToSlug[match];
  return 'about';
}

export function getCategory(entry: DocumentEntry) {
  const slug = getCategorySlug(entry);
  return slug === 'about'
    ? { slug, title: '关于', description: '关于本站', href: '/about/' }
    : { slug, ...categories[slug], href: `/category/${slug}/` };
}

export function getEntryUrl(entry: DocumentEntry) {
  const permalink = entry.data.permalink.startsWith('/')
    ? entry.data.permalink
    : `/${entry.data.permalink}`;
  return permalink.endsWith('/') ? permalink : `${permalink}/`;
}

export function getExcerpt(entry: DocumentEntry, maxLength = 116) {
  const source = (entry as DocumentEntry & { body?: string }).body ?? '';
  const text = source
    .replace(/^---[\s\S]*?---/m, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/[#>*_`~\[\]():|-]/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(date)
    .replaceAll('/', '.');
}

export async function getPublishedDocuments() {
  // article:false 只控制目录与 RSS 是否展示，不代表历史永久链接应失效。
  const entries = await getCollection(
    'documents',
    ({ data }) => data.article !== false && data.permalink !== '/about/',
  );
  return entries.toSorted((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getRoutableDocuments() {
  // /about/ 由专用页面渲染，其余文章（包括隐藏文章）都保留原 permalink。
  return getCollection('documents', ({ data }) => data.permalink !== '/about/');
}

// —— 标签 ——

export function getTags(entry: DocumentEntry): string[] {
  const raw = (entry.data as { tags?: unknown }).tags;
  if (Array.isArray(raw)) {
    return raw.map((t) => String(t).trim()).filter(Boolean);
  }
  return [];
}

// 标签进入 URL 前归一化：小写、空白转连字符、剔除符号（保留中英文与数字）。
export function slugifyTag(tag: string): string {
  return tag
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\p{Letter}\p{Number}_-]+/gu, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getTagHref(tag: string): string {
  return `/tag/${slugifyTag(tag)}/`;
}

export interface TagInfo {
  tag: string;
  slug: string;
  count: number;
}

// 汇总所有已发布文章的标签：去重并统计各标签下的文章数。
export async function getAllTags(): Promise<TagInfo[]> {
  const posts = await getPublishedDocuments();
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of getTags(post)) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, slug: slugifyTag(tag), count }))
    .toSorted((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'zh-CN'));
}

// 按标签 slug 取文章；slug 相同（来自不同原始写法）的标签合并归入同一页。
export async function getPostsByTagSlug(slug: string): Promise<DocumentEntry[]> {
  const tags = await getAllTags();
  const matching = new Set(tags.filter((t) => t.slug === slug).map((t) => t.tag));
  if (matching.size === 0) return [];
  const posts = await getPublishedDocuments();
  return posts.filter((post) => getTags(post).some((tag) => matching.has(tag)));
}
