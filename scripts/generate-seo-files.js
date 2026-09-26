const fs = require("fs");
const path = require("path");

const siteUrl = (
  process.env.REACT_APP_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")
).replace(/\/$/, "");
const routes = [
  "/", "/services", "/services/terrace-waterproofing", "/services/roof-waterproofing", "/services/bathroom-waterproofing", "/services/basement-waterproofing", "/services/wall-dampness-treatment", "/services/crack-repair-sealing", "/services/industrial-waterproofing", "/services/commercial-waterproofing", "/services/construction-waterproofing", "/services/leakage-treatment", "/services/new-construction-waterproofing", "/services/repair-restoration", "/projects", "/products", "/about", "/blog", "/blog/terrace-leakage-warning-signs", "/blog/monsoon-waterproofing-checklist", "/blog/wall-dampness-causes", "/blog/bathroom-seepage-without-breaking", "/contact", "/waterproofing/nagpur", "/waterproofing/pune", "/waterproofing/mumbai", "/waterproofing/thane", "/waterproofing/nashik", "/waterproofing/chhatrapati-sambhajinagar", "/waterproofing/amravati", "/waterproofing/akola", "/waterproofing/wardha", "/waterproofing/bhandara", "/waterproofing/chandrapur", "/waterproofing/indore", "/waterproofing/bhopal", "/waterproofing/jabalpur", "/waterproofing/chhindwara", "/waterproofing/ujjain", "/waterproofing/gwalior", "/waterproofing/sagar", "/waterproofing/seoni", "/waterproofing/betul", "/privacy-policy", "/terms", "/disclaimer"
];
// Published projects (src/data/site-data.json) bhi sitemap me jaate hain
try {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "src", "data", "site-data.json"), "utf8"));
  (data.projects || []).filter((project) => project.published && project.slug).forEach((project) => routes.push(`/projects/${project.slug}`));
} catch (error) {
  console.warn("[seo] site-data.json read nahi hua:", error.message);
}
const publicDir = path.join(__dirname, "..", "public");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((route) => `  <url><loc>${siteUrl}${route}</loc></url>`).join("\n")}\n</urlset>\n`;
const robots = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /admin/login\nSitemap: ${siteUrl}/sitemap.xml\n`;
fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap);
fs.writeFileSync(path.join(publicDir, "robots.txt"), robots);
