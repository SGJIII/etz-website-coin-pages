const apiEndpoint = "https://blog.etzsoft.com/wp-json/wp/v2/posts";

const getPostSlug = () => {
  const pathParts = window.location.pathname.split("/");
  return pathParts[pathParts.length - 1].replace(".html", "");
};

const fetchBlogPost = async (slug) => {
  try {
    const response = await fetch(`${apiEndpoint}?slug=${slug}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const posts = await response.json();
    return posts[0]; // The response is an array
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
};

export const renderBlogPost = async () => {
  const slug = getPostSlug();
  const post = await fetchBlogPost(slug);

  if (!post) {
    document.getElementById("blog-post").innerHTML = "<p>Post not found.</p>";
    return;
  }

  document.getElementById("post-title").textContent = post.title.rendered;
  document.getElementById("post-content").innerHTML = post.content.rendered;
};

document.addEventListener("DOMContentLoaded", renderBlogPost);
