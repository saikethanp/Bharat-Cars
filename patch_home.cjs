const fs = require('fs');

let content = fs.readFileSync('src/components/HomeView.tsx', 'utf-8');

content = content.replace(
  /Find Your Perfect Car <br \/>\s*<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-red-600 font-serif">\s*Today\s*<\/span>/,
  `{settings.heroTitle}`
);

content = content.replace(
  /Welcome to Bharat Cars, Madanapalle\. We offer quality pre-owned cars with trusted service, fair prices, and a smooth buying experience\./,
  `{settings.heroSubtitle}`
);

// We need to also patch the video URL. Let's find it.
// Right now I don't know where the video is. Is it a video tag?
