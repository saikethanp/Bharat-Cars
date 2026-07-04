const fs = require('fs');
let code = fs.readFileSync('src/components/HomeView.tsx', 'utf-8');

const oldActions = `<motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto"
                id="hero-actions"
              >
                <button
                  onClick={() => setView('inventory')}
                  className="group flex items-center justify-center space-x-3 px-8 py-4 bg-[#050505] border border-red-500 text-white hover:border-red-400 hover:shadow-[0_0_20px_rgba(200,16,46,0.5)] font-sans font-semibold text-[16px] rounded tracking-[0.15em] uppercase transition-all duration-300 w-full sm:w-[240px] whitespace-nowrap cursor-pointer"
                  id="hero-btn-inventory"
                >
                  <span>Explore Cars</span>
                  <ArrowUpRight className="h-4 w-4 text-red-500 group-hover:text-black group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
                <button
                  onClick={() => setView('contact')}
                  className="group flex items-center justify-center space-x-3 px-8 py-4 bg-transparent hover:bg-white text-white hover:text-black border border-white hover:border-white font-sans font-semibold text-[16px] rounded tracking-[0.15em] uppercase transition-all duration-300 backdrop-blur-md w-full sm:w-[240px] whitespace-nowrap cursor-pointer"
                  id="hero-btn-contact"
                >
                  Get Directions
                </button>
              </motion.div>`;

// Actually the old code might be different because my previous script replaced only part of it.
// Let's use regex to replace the entire motion.div with id="hero-actions".

code = code.replace(
  /<motion\.div[\s\S]*?id="hero-actions"[\s\S]*?<\/motion\.div>/,
  `<motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto"
                id="hero-actions"
              >
                <button
                  onClick={() => setView('inventory')}
                  className="group flex items-center justify-center space-x-3 px-8 py-4 bg-[#050505] border border-red-500 text-white hover:bg-red-500 hover:text-white hover:border-red-400 hover:shadow-[0_0_20px_rgba(200,16,46,0.5)] font-sans font-semibold text-[16px] rounded tracking-[0.15em] uppercase transition-all duration-300 w-full sm:w-[240px] whitespace-nowrap cursor-pointer"
                  id="hero-btn-inventory"
                >
                  <span>Explore Cars</span>
                  <ArrowUpRight className="h-5 w-5 text-red-500 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
                <button
                  onClick={() => setView('contact')}
                  className="group flex items-center justify-center space-x-3 px-8 py-4 bg-transparent hover:bg-white text-white hover:text-black border border-white hover:border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] font-sans font-semibold text-[16px] rounded tracking-[0.15em] uppercase transition-all duration-300 backdrop-blur-md w-full sm:w-[240px] whitespace-nowrap cursor-pointer"
                  id="hero-btn-contact"
                >
                  <span>Get Directions</span>
                  <MapPin className="h-5 w-5 text-white group-hover:text-black group-hover:translate-y-[-2px] transition-transform" />
                </button>
              </motion.div>`
);

// Now the logo area
code = code.replace(
  /<div className="relative w-80 h-80 sm:w-\[480px\] sm:h-\[480px\] md:w-\[580px\] md:h-\[580px\] flex items-center justify-center group transition-all duration-700">[\s\S]*?<\/div>\s*<\/motion\.div>/,
  `<div className="relative w-[270px] h-[270px] sm:w-[410px] sm:h-[410px] md:w-[500px] md:h-[500px] flex items-center justify-center group transition-all duration-700 animate-[float_6s_ease-in-out_infinite]">
                {/* Radial red background glow behind the logo */}
                <div className="absolute w-full h-full bg-[#C8102E]/20 blur-[100px] rounded-full group-hover:bg-[#C8102E]/30 transition-all duration-700"></div>
                
                <img 
                  src={settings.logoUrl} 
                  onError={(e) => {
                    // Fallback to logo.png
                    e.currentTarget.src = "/logo.png";
                  }}
                  alt={settings.seoTitle} 
                  className="relative w-full h-full object-contain filter drop-shadow-[0_15px_20px_rgba(200,16,46,0.2)] group-hover:scale-[1.04] transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>`
);

fs.writeFileSync('src/components/HomeView.tsx', code);
console.log("Patched hero complete");
