"use client";
import { useEffect, useState } from "react";
import { Heart, ChevronDown } from "lucide-react";

export type Service = {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: "Active" | "Inactive";
  cost: string;
  date: string;
  imageQuotaEnabled?: boolean;
  imageQuota?: number;
  displayPrice?: boolean;
  active?: boolean;
  durationMinutes?: number; // service duration in minutes
  favorite?: boolean; // for quick booking in calendar
};

// Photography-related icons for the dropdown
const PHOTOGRAPHY_ICONS = [
  { emoji: "📸", name: "Camera" },
  { emoji: "🎥", name: "Video Camera" },
  { emoji: "📷", name: "Digital Camera" },
  { emoji: "🎬", name: "Film Camera" },
  { emoji: "📹", name: "Camcorder" },
  { emoji: "🚁", name: "Drone" },
  { emoji: "📸🎥", name: "Camera & Video" },
  { emoji: "🖼️", name: "Picture Frame" },
  { emoji: "🖨️", name: "Printer" },
  { emoji: "💾", name: "Storage" },
  { emoji: "☀️", name: "Sunlight" },
  { emoji: "💡", name: "Light Bulb" },
  { emoji: "🔦", name: "Flashlight" },
  { emoji: "🎭", name: "Theater Masks" },
  { emoji: "🎨", name: "Artist Palette" },
  { emoji: "🖌️", name: "Paintbrush" },
  { emoji: "📐", name: "Triangular Ruler" },
  { emoji: "📏", name: "Straight Ruler" },
  { emoji: "🏠", name: "House" },
  { emoji: "🏢", name: "Office Building" },
  { emoji: "🏖️", name: "Beach" },
  { emoji: "🌅", name: "Sunrise" },
  { emoji: "🌇", name: "Sunset" },
  { emoji: "🌆", name: "Cityscape" },
  { emoji: "🌃", name: "Night Scene" },
  { emoji: "🌊", name: "Ocean Wave" },
  { emoji: "⛰️", name: "Mountain" },
  { emoji: "🌲", name: "Evergreen Tree" },
  { emoji: "🌸", name: "Cherry Blossom" },
  { emoji: "🌺", name: "Hibiscus" },
  { emoji: "🌻", name: "Sunflower" },
  { emoji: "🌷", name: "Tulip" },
  { emoji: "🌹", name: "Rose" },
  { emoji: "💐", name: "Bouquet" },
  { emoji: "🎂", name: "Birthday Cake" },
  { emoji: "🍰", name: "Shortcake" },
  { emoji: "🎉", name: "Party Popper" },
  { emoji: "🎊", name: "Confetti Ball" },
  { emoji: "🎈", name: "Balloon" },
  { emoji: "🎁", name: "Wrapped Gift" },
  { emoji: "💍", name: "Ring" },
  { emoji: "👰", name: "Bride" },
  { emoji: "🤵", name: "Groom" },
  { emoji: "👶", name: "Baby" },
  { emoji: "👨‍👩‍👧‍👦", name: "Family" },
  { emoji: "👨‍💼", name: "Business Person" },
  { emoji: "👩‍💼", name: "Business Woman" },
  { emoji: "🎓", name: "Graduation Cap" },
  { emoji: "🏆", name: "Trophy" },
  { emoji: "🥇", name: "Gold Medal" },
  { emoji: "🏅", name: "Sports Medal" },
  { emoji: "🎖️", name: "Military Medal" },
  { emoji: "📜", name: "Scroll" },
  { emoji: "📋", name: "Clipboard" },
  { emoji: "📝", name: "Memo" },
  { emoji: "✏️", name: "Pencil" },
  { emoji: "✒️", name: "Black Nib" },
  { emoji: "🖊️", name: "Pen" },
  { emoji: "🖋️", name: "Fountain Pen" },
  { emoji: "📌", name: "Pushpin" },
  { emoji: "📍", name: "Round Pushpin" },
  { emoji: "🗂️", name: "Card Index Dividers" },
  { emoji: "📁", name: "File Folder" },
  { emoji: "📂", name: "Open File Folder" },
  { emoji: "🗃️", name: "Card File Box" },
  { emoji: "🗄️", name: "File Cabinet" },
  { emoji: "📊", name: "Bar Chart" },
  { emoji: "📈", name: "Trending Up" },
  { emoji: "📉", name: "Trending Down" },
  { emoji: "📋", name: "Clipboard" },
  { emoji: "📌", name: "Pushpin" },
  { emoji: "🔍", name: "Magnifying Glass" },
  { emoji: "🔎", name: "Magnifying Glass Tilted Right" },
  { emoji: "🔬", name: "Microscope" },
  { emoji: "🔭", name: "Telescope" },
  { emoji: "📡", name: "Satellite Antenna" },
  { emoji: "🛰️", name: "Satellite" },
  { emoji: "🚁", name: "Helicopter" },
  { emoji: "✈️", name: "Airplane" },
  { emoji: "🚀", name: "Rocket" },
  { emoji: "🛸", name: "Flying Saucer" },
  { emoji: "🎯", name: "Direct Hit" },
  { emoji: "🎪", name: "Circus Tent" },
  { emoji: "🎨", name: "Artist Palette" },
  { emoji: "🎭", name: "Performing Arts" },
  { emoji: "🎪", name: "Circus Tent" },
  { emoji: "🎫", name: "Admission Tickets" },
  { emoji: "🎟️", name: "Admission Tickets" },
  { emoji: "🎠", name: "Carousel Horse" },
  { emoji: "🎡", name: "Ferris Wheel" },
  { emoji: "🎢", name: "Roller Coaster" },
  { emoji: "🎰", name: "Slot Machine" },
  { emoji: "🎲", name: "Game Die" },
  { emoji: "🃏", name: "Joker" },
  { emoji: "🀄", name: "Mahjong Red Dragon" },
  { emoji: "🎴", name: "Flower Playing Cards" },
  { emoji: "🎮", name: "Video Game" },
  { emoji: "🕹️", name: "Joystick" },
  { emoji: "🎯", name: "Direct Hit" },
  { emoji: "🎳", name: "Bowling" },
  { emoji: "🎪", name: "Circus Tent" },
  { emoji: "🎭", name: "Performing Arts" },
  { emoji: "🎨", name: "Artist Palette" },
  { emoji: "🎬", name: "Clapper Board" },
  { emoji: "🎤", name: "Microphone" },
  { emoji: "🎧", name: "Headphone" },
  { emoji: "🎵", name: "Musical Note" },
  { emoji: "🎶", name: "Musical Notes" },
  { emoji: "🎼", name: "Musical Score" },
  { emoji: "🎹", name: "Musical Keyboard" },
  { emoji: "🥁", name: "Drum" },
  { emoji: "🎷", name: "Saxophone" },
  { emoji: "🎺", name: "Trumpet" },
  { emoji: "🎸", name: "Guitar" },
  { emoji: "🪕", name: "Banjo" },
  { emoji: "🎻", name: "Violin" },
  { emoji: "🪗", name: "Accordion" },
  { emoji: "🎲", name: "Game Die" },
  { emoji: "🎯", name: "Direct Hit" },
  { emoji: "🎳", name: "Bowling" },
  { emoji: "🎮", name: "Video Game" },
  { emoji: "🕹️", name: "Joystick" },
  { emoji: "🎰", name: "Slot Machine" },
  { emoji: "🃏", name: "Joker" },
  { emoji: "🀄", name: "Mahjong Red Dragon" },
  { emoji: "🎴", name: "Flower Playing Cards" },
  { emoji: "🎲", name: "Game Die" },
  { emoji: "🎯", name: "Direct Hit" },
  { emoji: "🎳", name: "Bowling" },
  { emoji: "🎪", name: "Circus Tent" },
  { emoji: "🎭", name: "Performing Arts" },
  { emoji: "🎨", name: "Artist Palette" },
  { emoji: "🎬", name: "Clapper Board" },
  { emoji: "🎤", name: "Microphone" },
  { emoji: "🎧", name: "Headphone" },
  { emoji: "🎵", name: "Musical Note" },
  { emoji: "🎶", name: "Musical Notes" },
  { emoji: "🎼", name: "Musical Score" },
  { emoji: "🎹", name: "Musical Keyboard" },
  { emoji: "🥁", name: "Drum" },
  { emoji: "🎷", name: "Saxophone" },
  { emoji: "🎺", name: "Trumpet" },
  { emoji: "🎸", name: "Guitar" },
  { emoji: "🪕", name: "Banjo" },
  { emoji: "🎻", name: "Violin" },
  { emoji: "🪗", name: "Accordion" }
];

export default function ServiceModal({
  open,
  initial,
  onClose,
  onSave,
  onDelete,
}: {
  open: boolean;
  initial?: Partial<Service>;
  onClose: () => void;
  onSave: (svc: Service) => void;
  onDelete?: (id: string) => void;
}){
  const [iconDropdownOpen, setIconDropdownOpen] = useState(false);
  const [draft, setDraft] = useState<Service>({
    id: initial?.id || crypto.randomUUID(),
    name: initial?.name || "",
    description: initial?.description || "",
    icon: initial?.icon || "📸",
    status: (initial?.status as any) || "Active",
    cost: initial?.cost || "0",
    date: initial?.date || new Date().toDateString(),
    imageQuotaEnabled: initial?.imageQuotaEnabled || false,
    imageQuota: initial?.imageQuota || 0,
    displayPrice: initial?.displayPrice || false,
    active: initial?.active ?? true,
    durationMinutes: initial?.durationMinutes || 60,
    favorite: initial?.favorite || false,
  });

  useEffect(() => {
    if (!open) return;
    setDraft({
      id: initial?.id || crypto.randomUUID(),
      name: initial?.name || "",
      description: initial?.description || "",
      icon: initial?.icon || "📸",
      status: (initial?.status as any) || "Active",
      cost: initial?.cost || "0",
      date: initial?.date || new Date().toDateString(),
      imageQuotaEnabled: initial?.imageQuotaEnabled || false,
      imageQuota: initial?.imageQuota || 0,
      displayPrice: initial?.displayPrice || false,
      active: initial?.active ?? true,
      durationMinutes: initial?.durationMinutes || 60,
      favorite: initial?.favorite || false,
    });
  }, [open, initial]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
      <div className="w-full max-w-xl card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-semibold">{initial?.id ? "Update Service" : "Add Service"}</div>
          <button
            onClick={() => setDraft({...draft, favorite: !draft.favorite})}
            className={`p-2 rounded-lg transition-colors ${
              draft.favorite 
                ? 'text-red-500 hover:text-red-600 bg-red-50' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }`}
            title={draft.favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart size={20} className={draft.favorite ? 'fill-current' : ''} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm col-span-2">
            <div className="mb-1">Service Name</div>
            <input className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm" value={draft.name} onChange={e=>setDraft({...draft, name:e.target.value})}/>
          </label>
          <label className="text-sm col-span-2">
            <div className="mb-1">Service Description</div>
            <textarea className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm" rows={4} value={draft.description} onChange={e=>setDraft({...draft, description:e.target.value})}/>
          </label>
          <label className="text-sm">
            <div className="mb-1">Icon</div>
            <div className="relative">
              <button
                type="button"
                className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm flex items-center justify-between hover:bg-gray-50 transition-colors"
                onClick={() => setIconDropdownOpen(!iconDropdownOpen)}
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg">{draft.icon}</span>
                  <span className="text-gray-500">
                    {PHOTOGRAPHY_ICONS.find(icon => icon.emoji === draft.icon)?.name || "Select Icon"}
                  </span>
                </span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${iconDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {iconDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-[var(--border)] rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <div className="p-2">
                    <div className="grid grid-cols-6 gap-2">
                      {PHOTOGRAPHY_ICONS.map((icon, index) => (
                        <button
                          key={index}
                          type="button"
                          className={`p-2 rounded-lg text-center hover:bg-gray-50 transition-colors ${
                            draft.icon === icon.emoji ? 'bg-[#e9f9f0] border border-[#b7e7cc]' : ''
                          }`}
                          onClick={() => {
                            setDraft({...draft, icon: icon.emoji});
                            setIconDropdownOpen(false);
                          }}
                          title={icon.name}
                        >
                          <div className="text-lg mb-1">{icon.emoji}</div>
                          <div className="text-xs text-gray-600 truncate">{icon.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </label>
          <label className="text-sm">
            <div className="mb-1">Service Price</div>
            <input 
              type="number" 
              step="0.01"
              min="0"
              className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm" 
              value={draft.cost.replace('$', '')} 
              onChange={e=>setDraft({...draft, cost: e.target.value})}
              placeholder="0.00"
            />
          </label>
          <label className="text-sm">
            <div className="mb-1">Duration</div>
            <select
              className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm"
              value={draft.durationMinutes || 60}
              onChange={e=>setDraft({...draft, durationMinutes: parseInt(e.target.value)})}
            >
              {Array.from({ length: 20 }, (_, i) => (i + 1) * 30).map(m => (
                <option key={m} value={m}>{`${Math.floor(m/60) ? Math.floor(m/60)+"h " : ""}${m%60 ? (m%60)+"m" : ""}`.trim()}</option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <div className="mb-1">Status</div>
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="status-toggle"
                  checked={draft.status === "Active"}
                  onChange={(e) => setDraft({...draft, status: e.target.checked ? "Active" : "Inactive"})}
                  className="sr-only"
                />
                <label
                  htmlFor="status-toggle"
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    draft.status === "Active" ? 'bg-[#b7e7cc]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      draft.status === "Active" ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </label>
              </div>
              <span className="text-sm font-medium">
                {draft.status === "Active" ? "Active" : "Inactive"}
              </span>
            </div>
          </label>
          <div className="text-sm col-span-2">
            <div className="flex items-center justify-between mb-3">
              <span>Display Price to clients</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="display-price-toggle"
                    checked={!!draft.displayPrice}
                    onChange={(e) => setDraft({...draft, displayPrice: e.target.checked})}
                    className="sr-only"
                  />
                  <label
                    htmlFor="display-price-toggle"
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      draft.displayPrice ? 'bg-[#b7e7cc]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        draft.displayPrice ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </label>
                </div>
                <span className="text-sm font-medium">
                  {draft.displayPrice ? "Yes" : "No"}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Product Active</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="product-active-toggle"
                    checked={!!draft.active}
                    onChange={(e) => setDraft({...draft, active: e.target.checked})}
                    className="sr-only"
                  />
                  <label
                    htmlFor="product-active-toggle"
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      draft.active ? 'bg-[#b7e7cc]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        draft.active ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </label>
                </div>
                <span className="text-sm font-medium">
                  {draft.active ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>
          <div className="col-span-2 border-t border-[var(--border)] pt-3 mt-1"/>
          <div className="col-span-2 text-sm">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={!!draft.imageQuotaEnabled} onChange={e=>setDraft({...draft, imageQuotaEnabled: e.target.checked})}/>
              Enable Image Quota
            </label>
          </div>
          <label className="text-sm col-span-2">
            <div className="mb-1">Image Quota</div>
            <input type="number" className="w-full rounded-lg bg-white border border-[var(--border)] px-3 py-2 text-sm" value={draft.imageQuota || 0} onChange={e=>setDraft({...draft, imageQuota: Number(e.target.value)})} disabled={!draft.imageQuotaEnabled}/>
          </label>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-slate-500">ID: {draft.id}</div>
          <div className="flex gap-2">
            {initial?.id && onDelete && (
              <button className="px-3 py-2 rounded-xl bg-red-600 text-white text-sm" onClick={()=>onDelete(draft.id)}>Delete</button>
            )}
            <button className="btn" onClick={onClose}>Close</button>
            <button 
              className="px-4 py-2 text-white rounded-lg transition-colors"
              style={{ backgroundColor: '#b7e7cc' }}
              onClick={()=>onSave(draft)}
            >
              {initial?.id ? "Update Service" : "Create Service"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


