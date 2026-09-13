export default async function handler(req, res) {
  const { slug } = req.query;
  
  // Use Production URL from Vercel Environment Variables, or fallback to localhost
  const apiUrl = process.env.VITE_API_URL_CLIENT || "http://localhost:3000/api/v1/client";
  
  // Default values
  let title = "Veltrix Gear - PC Gaming và Laptop cao cấp";
  let description = "Khám phá các sản phẩm PC Gaming và Laptop cấu hình khủng, giá tốt tại Veltrix Gear.";
  let image = "https://cdn.discordapp.com/attachments/1243760444391690250/1252119313886875700/VeltrixGear_Logo.png"; // Default image fallback
  let url = `https://www.veltrixvoice.autos/news/${slug || ''}`;

  try {
    if (slug) {
      // Fetch news detail from backend
      const response = await fetch(`${apiUrl}/news/detail/${slug}`);
      if (response.ok) {
        const data = await response.json();
        
        if (data && data.code && data.news) {
          title = data.news.title;
          // Clean up HTML tags if description contains them, or just use as is
          description = data.news.description || description; 
          image = data.news.thumbnail || image;
        }
      }
    }
  } catch (error) {
    console.error("Error fetching news detail for bot:", error);
  }

  // Generate lightweight HTML with Meta tags tailored for Social Media Bots
  const html = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <meta name="description" content="${description}">
      
      <!-- Open Graph / Zalo / Facebook -->
      <meta property="og:type" content="article">
      <meta property="og:url" content="${url}">
      <meta property="og:title" content="${title}">
      <meta property="og:description" content="${description}">
      <meta property="og:image" content="${image}">
      
      <!-- Twitter -->
      <meta property="twitter:card" content="summary_large_image">
      <meta property="twitter:url" content="${url}">
      <meta property="twitter:title" content="${title}">
      <meta property="twitter:description" content="${description}">
      <meta property="twitter:image" content="${image}">
    </head>
    <body>
      <h1>${title}</h1>
      <p>${description}</p>
      <img src="${image}" alt="${title}" />
      <script>
        // Redirect standard users to the actual application (fallback if a real user hits this URL)
        window.location.replace("${url}");
      </script>
    </body>
    </html>
  `;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  // Cache the generated HTML on Vercel's Edge Network for 24 hours to reduce load on your backend
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate'); 
  return res.status(200).send(html);
}
