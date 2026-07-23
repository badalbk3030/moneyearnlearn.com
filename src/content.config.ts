import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/blog",
  }),

  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),

      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),

      author: z.string(),

      category: z.string(),
      tags: z.array(z.string()),

      image: image().optional(),
      imageAlt: z.string().optional(),

      featured: z.boolean().default(false),
      draft: z.boolean().default(false),

      faq: z.array(
  z.object({
    question: z.string(),
    answer: z.string(),
  })
).optional(),
    }),
});

const authors = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/authors",
  }),

  schema: ({ image }) =>
    z.object({
      name: z.string(),
      designation: z.string(),
      bio: z.string(),

      avatar: image(),

      website: z.string(),

      facebook: z.string(),
      twitter: z.string(),
      linkedin: z.string(),
      github: z.string(),

      email: z.string(),

      experience: z.string(),

expertise: z.array(z.string()),

location: z.string(),

verified: z.boolean().default(true),
    }),
});
export const collections = {
  blog,
  authors,
};