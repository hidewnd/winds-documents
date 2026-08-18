import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';

export type DocumentEntry = CollectionEntry<'documents'>;

export const categoryOrder = [
  'articles',
  'notes',
  'api',
  'jx3',
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
  api: {
    title: 'API',
    description: '接口设计与服务文档',
    directory: '03.API',
  },
  jx3: {
    title: '剑网三',
    description: '剑网三相关资料与攻略',
    directory: '04.剑网三',
  },
  'vibe-coding': {
    title: 'Vibe Coding',
    description: 'AI 编程工具与使用记录',
    directory: '07.VibeCoding',
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
