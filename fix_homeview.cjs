const fs = require('fs');
let code = fs.readFileSync('src/components/HomeView.tsx', 'utf-8');

const replacement = `              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="inline-flex items-center space-x-2 px-4 py-1.5 rounded bg-white/5 border border-[#2A2A2A] backdrop-blur-md"
                id="hero-badge"
              >
                <Sparkles className="h-4 w-4 text-red-500 animate-pulse" />
                <span className="text-[13px] font-sans font-medium tracking-[0.15em] text-red-500 uppercase">Buying & Selling</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-[46px] sm:text-[56px] md:text-[68px] font-serif font-bold text-white leading-[1.1] tracking-tight uppercase"
                id="hero-title"
              >
                Find Your Perfect Car <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-red-600 font-serif">
                  Today
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="max-w-xl text-[16px] text-[#BDBDBD] font-sans font-normal leading-[1.7]"
                id="hero-desc"
              >
                Welcome to Bharat Cars, Madanapalle. We offer quality pre-owned cars with trusted service, fair prices, and a smooth buying experience.
              </motion.p>

              <motion.div`;

code = code.replace(/<motion\.div[\s]*initial=\{\{ opacity: 0, y: 20 \}\}[\s]*animate=\{\{ opacity: 1, y: 0 \}\}[\s]*transition=\{\{ duration: 0\.8, delay: 0\.3 \}\}[\s]*className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto"[\s]*id="hero-actions"/, replacement + `\n                initial={{ opacity: 0, y: 20 }}\n                animate={{ opacity: 1, y: 0 }}\n                transition={{ duration: 0.8, delay: 0.3 }}\n                className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto"\n                id="hero-actions"`);

fs.writeFileSync('src/components/HomeView.tsx', code);
console.log("Fixed HomeView.tsx");
