const fs = require('fs');
const path = require('path');

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const apiEndpoint = 'https://blog.etzsoft.com/wp-json/wp/v2/posts';

const fetchBlogPosts = async () => {
    try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const posts = await response.json();
        return posts;
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return [];
    }
};

const generateBlogPages = async () => {
    const posts = await fetchBlogPosts();
    const blogListHtml = posts.map(post => `
        <div class="blog-post">
            <h2><a href="/blog/${post.slug}.html">${post.title.rendered}</a></h2>
            <p>${post.excerpt.rendered}</p>
        </div>
    `).join('');

    const blogListPage = `
        <!DOCTYPE html>
        <html lang="en-US">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="stylesheet" href="../styles/index.css" />
            <link rel="stylesheet" href="../styles/index.desktop.css" />
            <link rel="stylesheet" href="../styles/index.mobile.css" />
            <link rel="stylesheet" href="../styles/blog.css" />
            <title>Blog</title>
        </head>
        <body>
            <div id="blog-list">${blogListHtml}</div>
        </body>
        </html>
    `;

    fs.writeFileSync(path.join(__dirname, 'dist', 'blog.html'), blogListPage);

    posts.forEach(post => {
        const postPage = `
            <!DOCTYPE html>
            <html lang="en-US">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="stylesheet" href="../styles/index.css" />
                <link rel="stylesheet" href="../styles/index.desktop.css" />
                <link rel="stylesheet" href="../styles/index.mobile.css" />
                <link rel="stylesheet" href="../styles/blog.css" />
                <title>${post.title.rendered}</title>
            </head>
            <body>
                <div id="post-content">${post.content.rendered}</div>
            </body>
            </html>
        `;
        const postDir = path.join(__dirname, 'dist', 'blog');
        if (!fs.existsSync(postDir)){
            fs.mkdirSync(postDir, { recursive: true });
        }
        fs.writeFileSync(path.join(postDir, `${post.slug}.html`), postPage);
    });
};

generateBlogPages();
