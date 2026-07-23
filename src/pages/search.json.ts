import { getCollection } from "astro:content";

export async function GET() {

  const posts = await getCollection(
    "blog",
    ({ data }) => !data.draft
  );

  const data = posts.map((post) => {

    const url =
      post.slug
        ? `/${post.slug}/`
        : `/${post.id.replace(/\/index$/, "")}/`;

    return {
      title: post.data.title,
      description: post.data.description,
      url,
      category: post.data.category,
      tags: post.data.tags ?? [],
    };

  });

  return new Response(
    JSON.stringify(data),
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600",
      },
    }
  );

}