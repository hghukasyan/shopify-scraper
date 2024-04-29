const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function scrapeShopifyProductPage(url) {
  const browser = await puppeteer.launch({
    headless: true
  }); // You can set headless to false for debugging

  const page = await browser.newPage();

  // Set up some extra options for stealthiness
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-US,en;q=0.9', // Set preferred languages
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36' // Set a common user agent
  });

  await page.setViewport({
    width: 1366, height: 768
  }); // Set a common viewport size

  // Navigate to the product page
  await page.goto(url, { waitUntil: 'networkidle2' });

  // Extract product data
  const productData = await page.evaluate(() => {
    const title = document.querySelector('h1').innerText;
    const sub_title = document.querySelector('h2').innerText;
    const price = document.querySelector('.js-variants-price-ctn p').innerText;
    const images = [];

    document.querySelectorAll('.js-product-media img').forEach(img => {
        images.push(img.src);
    });

    return { title, sub_title, price, images };
  });

  await browser.close();
  return productData;
}

// Example usage
const url = 'url to the product page';

scrapeShopifyProductPage(url).then(productData => {
  console.log(productData);
}).catch(err => console.error(err));
