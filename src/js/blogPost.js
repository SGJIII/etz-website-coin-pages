const apiEndpoint = "https://blog.etzsoft.com/wp-json/wp/v2/posts";

const getPostSlug = () => {
  // Extract the slug from the pathname
  const pathname = window.location.pathname;
  const slug = pathname.split("/").pop().replace(".html", "");
  console.log("Extracted Slug:", slug); // Debugging log
  return slug;
};

const fetchBlogPost = async (slug) => {
  console.log("Fetching post with slug:", slug); // Debugging log
  try {
    const response = await fetch(`${apiEndpoint}?slug=${slug}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const posts = await response.json();
    console.log("Fetched posts:", posts); // Debugging log
    return posts.length > 0 ? posts[0] : null; // Ensure the correct post is fetched
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
};

export const renderBlogPost = async () => {
  const slug = getPostSlug();
  if (!slug) {
    document.getElementById("post-content").innerHTML =
      "<p>Post not found. Missing slug parameter.</p>";
    return;
  }
  const post = await fetchBlogPost(slug);

  if (!post) {
    document.getElementById("post-content").innerHTML =
      "<p>Post not found.</p>";
    return;
  }

  console.log("Rendering post:", post); // Debugging log
  document.getElementById("post-title").textContent = post.title.rendered;
  document.getElementById("post-content").innerHTML = post.content.rendered;

  // SEO Optimization
  document.querySelector("title").textContent = post.title.rendered;
  const metaDescription = document.createElement("meta");
  metaDescription.name = "description";
  metaDescription.content = post.excerpt.rendered;
  document.head.appendChild(metaDescription);
};

document.addEventListener("DOMContentLoaded", renderBlogPost);
