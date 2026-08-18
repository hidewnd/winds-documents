import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const documents = defineCollection({
  // 保持 documents/ 为唯一内容源，避免迁移后出现两份文章副本。
  loader: glob({
    base: './documents',
    pattern: '**/*.md',
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    permalink: z.string(),
    author: z
      .object({
        name: z.string().optional(),
        link: z.url().optional(),
      })
      .optional(),
    sidebar: z.boolean().optional(),
    article: z.boolean().optional(),
  }),
});

export const collections = { documents };
