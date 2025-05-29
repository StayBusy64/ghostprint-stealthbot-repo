// trend-sniper.js
const axios = require('axios');
const fs = require('fs');
const cheerio = require('cheerio');

(async () => {
  const { data } = await axios.get('https://www.youtube.com/feed/trending');
  const $ = cheerio.load(data);
  const links = [];

  $('a#video-title').each((_, el) => {
    const href = $(el).attr('href');
    if (href && href.includes('watch')) {
      links.push(`https://www.youtube.com${href}`);
    }
  });

  const top10 = [...new Set(links)].slice(0, 10);
  fs.writeFileSync('videos.txt', top10.join('\n'));

  console.log(`[🎯] Trending videos loaded into videos.txt:\n`, top10);
})();
