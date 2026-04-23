const fetchImages = async () => {
  const urls = [
    'https://amzn.to/3Oycf9t',
    'https://amzn.to/48jjLM9',
    'https://amzn.to/4ctRVzf',
    'https://amzn.to/4u4nhSH',
    'https://amzn.to/4cuewf6'
  ];
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      const text = await res.text();
      const match = text.match(/<img[^>]+id=\"landingImage\"[^>]+src=\"([^\"]+)\"/);
      console.log(url, match ? match[1] : 'Not found');
    } catch (e) {
      console.log(url, e.message);
    }
  }
};
fetchImages();
