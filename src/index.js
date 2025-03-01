// src/index.js
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

/**
 * Capture screenshots for an array of Next.js routes.
 *
 * @param {string[]} routes - An array of routes (e.g., ["/", "/about", "/contact"])
 * @param {string} outputDir - The directory to save screenshots (default: './screenshots')
 * @param {string} baseUrl - The base URL of your Next.js app (default: 'http://localhost:3000')
 */
export async function captureScreenshots(
  routes,
  outputDir = './screenshots',
  baseUrl = 'http://localhost:3000'
) {
  // Ensure the output directory exists.
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (const route of routes) {
    const url = `${baseUrl}${route}`;
    await page.goto(url, { waitUntil: 'networkidle0' });

    // Sanitize filename: use 'home.png' for '/', replace '/' with '_' for other routes.
    const fileName = route === '/' ? 'home.png' : `${route.replace(/\//g, '_')}.png`;
    const filePath = path.join(outputDir, fileName);

    await page.screenshot({ path: filePath, fullPage: true });
    console.log(`Captured screenshot for ${route} at ${filePath}`);
  }

  await browser.close();
}
