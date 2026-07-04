const fs = require('fs');

let content = fs.readFileSync('src/components/AdminView.tsx', 'utf-8');

const insertion = `</div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-[16px] font-sans font-medium text-red-500 uppercase tracking-[0.15em] border-b border-[#2A2A2A]/50 pb-2">Homepage & Hero</h4>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <label className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] uppercase block">Hero Title</label>
                          <input type="text" value={settingsForm.heroTitle || ''} onChange={e => setSettingsForm({...settingsForm, heroTitle: e.target.value})} className="w-full bg-[#111111] border border-[#2A2A2A] rounded py-2.5 px-3 text-[16px] text-white focus:border-red-500/50" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] uppercase block">Hero Subtitle</label>
                          <textarea rows={2} value={settingsForm.heroSubtitle || ''} onChange={e => setSettingsForm({...settingsForm, heroSubtitle: e.target.value})} className="w-full bg-[#111111] border border-[#2A2A2A] rounded py-2.5 px-3 text-[16px] text-white focus:border-red-500/50" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[13px] font-sans font-medium tracking-[0.15em] text-[#BDBDBD] uppercase block">Hero Video URL</label>
                          <input type="text" value={settingsForm.heroVideoUrl || ''} onChange={e => setSettingsForm({...settingsForm, heroVideoUrl: e.target.value})} className="w-full bg-[#111111] border border-[#2A2A2A] rounded py-2.5 px-3 text-[16px] text-white focus:border-red-500/50" />
                        </div>
                      </div>
                    </div>`;

content = content.replace(
  /<\/div>\s*<\/div>\s*<div className="pt-4">/g,
  insertion + '\n                    <div className="pt-4">'
);

fs.writeFileSync('src/components/AdminView.tsx', content);
console.log('Patched AdminView with Homepage Settings');
