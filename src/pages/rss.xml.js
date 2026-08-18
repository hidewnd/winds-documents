import rss from '@astrojs/rss';
import { getEntryUrl, getExcerpt, getPublishedDocuments } from '../lib/content';
import { site } from '../lib/site';

export async function GET(context) {
  const posts = await getPublishedDocuments();
  return rss({
    title: site.title,
    description: site.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: getExcerpt(post, 180),
      link: getEntryUrl(post),
    })),
  });
}
