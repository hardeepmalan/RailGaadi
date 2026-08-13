'use client';

import { useState } from 'react';
import { Utensils, Leaf, ExternalLink, Info, ChefHat, Clock, MapPin, ShoppingBag, Search, Sparkles, Check } from 'lucide-react';
import { StationSearchInput } from '@/components/search/StationSearchInput';
import { RailwayStation } from '@/types';
import { INDIAN_STATIONS, getStationByCode } from '@/data/indianStations';
import { clsx } from 'clsx';

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks' | 'beverages';

const MEAL_CATEGORIES: { id: MealType; label: string; icon: string; time: string }[] = [
  { id: 'breakfast', label: 'Breakfast', icon: '🌅', time: '7AM – 10AM' },
  { id: 'lunch', label: 'Lunch', icon: '☀️', time: '12PM – 3PM' },
  { id: 'dinner', label: 'Dinner', icon: '🌙', time: '7PM – 10PM' },
  { id: 'snacks', label: 'Snacks', icon: '🍪', time: 'Anytime' },
  { id: 'beverages', label: 'Beverages', icon: '☕', time: 'Anytime' },
];

const MENU_ITEMS: Record<MealType, { name: string; price: number; veg: boolean; desc: string; calories?: string }[]> = {
  breakfast: [
    { name: 'Veg Poha', price: 50, veg: true, desc: 'Light flattened rice with mustard seeds, onion, lemon', calories: '~180 kcal' },
    { name: 'Masala Omelette', price: 65, veg: false, desc: 'Two-egg omelette with onion, tomato, green chili', calories: '~220 kcal' },
    { name: 'Aloo Paratha + Curd', price: 80, veg: true, desc: 'Whole wheat paratha stuffed with spiced potato filling', calories: '~350 kcal' },
    { name: 'Idli Sambhar', price: 60, veg: true, desc: '4 steamed idlis with fresh sambhar and coconut chutney', calories: '~200 kcal' },
    { name: 'Bread Toast + Jam', price: 40, veg: true, desc: 'Toasted white bread with butter and mixed fruit jam', calories: '~180 kcal' },
    { name: 'Upma', price: 55, veg: true, desc: 'Semolina with vegetables, curry leaves and mustard', calories: '~210 kcal' },
  ],
  lunch: [
    { name: 'Rajdhani Veg Thali', price: 170, veg: true, desc: 'Dal, sabzi, rice, roti, raita, salad, dessert', calories: '~700 kcal' },
    { name: 'Rajdhani Non-Veg Thali', price: 200, veg: false, desc: 'Chicken curry, rice, roti, raita, salad', calories: '~800 kcal' },
    { name: 'Jeera Rice + Dal Tadka', price: 90, veg: true, desc: 'Fragrant jeera rice with yellow dal tempered with ghee', calories: '~380 kcal' },
    { name: 'Chicken Biryani', price: 150, veg: false, desc: 'Fragrant basmati rice with tender chicken, dum style', calories: '~550 kcal' },
    { name: 'Paneer Butter Masala + Roti', price: 130, veg: true, desc: 'Rich tomato-cream gravy with cottage cheese', calories: '~480 kcal' },
  ],
  dinner: [
    { name: 'Veg Thali', price: 150, veg: true, desc: 'Dal, mix veg, rice, roti, pickle, papad, sweet', calories: '~650 kcal' },
    { name: 'Chicken Curry + Rice', price: 160, veg: false, desc: 'Home-style chicken curry with steamed rice', calories: '~580 kcal' },
    { name: 'Dal Makhani + Naan', price: 120, veg: true, desc: 'Slow-cooked black lentils in butter-tomato gravy', calories: '~520 kcal' },
    { name: 'Veg Pulao + Raita', price: 100, veg: true, desc: 'Mixed vegetable rice with cooling curd raita', calories: '~380 kcal' },
    { name: 'Egg Curry + Rice', price: 130, veg: false, desc: 'Boiled eggs in spiced onion-tomato gravy', calories: '~480 kcal' },
  ],
  snacks: [
    { name: 'Samosa (2 pcs)', price: 30, veg: true, desc: 'Crispy pastry filled with spiced potato-pea mixture', calories: '~180 kcal' },
    { name: 'Veg Burger', price: 60, veg: true, desc: 'Soft bun with veggie patty, lettuce, tomato, sauce', calories: '~290 kcal' },
    { name: 'Kachori (2 pcs)', price: 35, veg: true, desc: 'Puffed deep-fried bread filled with spiced lentils', calories: '~240 kcal' },
    { name: 'Veg Sandwich', price: 55, veg: true, desc: 'Bread with cucumber, tomato, cheese, green chutney', calories: '~210 kcal' },
    { name: 'Instant Noodles', price: 40, veg: true, desc: 'Quick preparation masala noodles, served hot', calories: '~280 kcal' },
    { name: 'Bhujia Sev Pack', price: 25, veg: true, desc: 'Crispy gram flour noodles, popular railway snack', calories: '~160 kcal' },
  ],
  beverages: [
    { name: 'Chai (Cutting)', price: 15, veg: true, desc: 'Hot spiced Indian milk tea, railway classic', calories: '~60 kcal' },
    { name: 'Packaged Mineral Water (1L)', price: 20, veg: true, desc: 'ISI certified sealed water bottle', calories: '0 kcal' },
    { name: 'Cold Coffee', price: 50, veg: true, desc: 'Chilled coffee with milk and sugar', calories: '~120 kcal' },
    { name: 'Mango Frooti 200ml', price: 20, veg: true, desc: 'Packaged mango fruit drink', calories: '~90 kcal' },
    { name: 'Buttermilk (Chaas)', price: 25, veg: true, desc: 'Cool spiced curd drink with cumin and coriander', calories: '~50 kcal' },
  ],
};

// Rich Station Specialities Knowledge Base
const STATION_SPECIALITIES: Record<string, { speciality: string; items: string[]; pantry: boolean; bestVendor?: string }> = {
  KOTA: { speciality: 'Crispy Pyaaz Kachoris & Sweet Jalebi', items: ['Kota Pyaaz Kachori', 'Dal Kachori', 'Desi Ghee Jalebi', 'Kulhad Chai'], pantry: true, bestVendor: 'Suwalal Kachori Wala' },
  RTM: { speciality: 'Famous Ratlami Sev & Namkeen', items: ['Ratlami Laung Sev', 'Garlic Sev', 'Chakli', 'Indori Poha Sev'], pantry: false, bestVendor: 'Ratlami Sev Bhandar' },
  MTJ: { speciality: 'Mathura Pedas & Bedai Puri', items: ['Mathura Peda', 'Kesar Rabri Lassi', 'Bedai Puri + Aloo Sabzi'], pantry: false, bestVendor: 'Brijwasi Sweets' },
  NGP: { speciality: 'Nagpuri Saoji Delicacies & Tarri Poha', items: ['Tarri Poha', 'Nagpur Orange Sweets', 'Saoji Paneer Curry', 'Orange Barfi'], pantry: true, bestVendor: 'Haldiram Planet' },
  BZA: { speciality: 'Andhra Pesarattu & Filter Coffee', items: ['Pesarattu Upma', 'Hot Filter Coffee', 'Pulihora Tamarind Rice', 'Gongura Rice'], pantry: true, bestVendor: 'Hotel Sri Ram' },
  HWH: { speciality: 'Authentic Bengali Sweets & Fish Curry', items: ['Fresh Rosogolla', 'Mishti Doi', 'Kolkata Fish Fry', 'Jhal Muri'], pantry: true, bestVendor: 'K C Das Sweets' },
  ASR: { speciality: 'Amritsari Kulcha & Lassi', items: ['Butter Amritsari Kulcha', 'Chole Bhature', 'Big Malai Lassi', 'Pinni Sweets'], pantry: true, bestVendor: 'Pehelwan Lassi' },
  NDLS: { speciality: 'Delhi Parathas, Chole Bhature & Chaat', items: ['Chole Bhature', 'Aloo Paratha', 'Chana Jor Garam', 'Rabri Falooda'], pantry: true, bestVendor: 'Bikanervala' },
  CNB: { speciality: 'Kanpur Thaggu Ke Laddu & Biryani', items: ['Thaggu Ke Laddu', 'Badam Milk', 'Kanpuri Veg Biryani', 'Samosa Chat'], pantry: true, bestVendor: 'Thaggu Ke Laddu' },
  LKO: { speciality: 'Lucknawi Mughlai & Basket Chaat', items: ['Lucknawi Veg Biryani', 'Royal Malai Kulfi', 'Basket Chaat', 'Kesari Halwa'], pantry: true, bestVendor: 'Royal Cafe' },
  AGC: { speciality: 'Agra Petha & Bedai', items: ['Agra Petha (Angoori & Dry)', 'Daloth Bedai', 'Dal Moth'], pantry: true, bestVendor: 'Panchi Petha' },
  JP: { speciality: 'Rajasthani Pyaz Kachori & Ghevar', items: ['Rawat Pyaz Kachori', 'Rabri Ghevar', 'Dal Baati Churma', 'Mirchi Bada'], pantry: true, bestVendor: 'Rawat Mishthan Bhandar' },
  BSB: { speciality: 'Varanasi Banarasi Paan & Malaiyyo', items: ['Banarasi Rabri Lassi', 'Tamatar Chaat', 'Malaiyyo', 'Banarasi Paan'], pantry: true, bestVendor: 'Pehlwan Lassi Shop' },
};

function getSpecialityForStation(station: RailwayStation) {
  const code = station.code.toUpperCase();
  if (STATION_SPECIALITIES[code]) {
    return STATION_SPECIALITIES[code];
  }
  // Generic fallback if station not in dictionary
  return {
    speciality: `Popular regional cuisine of ${station.city || station.name}`,
    items: [`${station.city || 'Station'} Special Thali`, 'Hot Railway Tea & Snacks', 'Fresh Mineral Water', 'Local Sweets'],
    pantry: true,
    bestVendor: 'IRCTC Approved Catering Unit',
  };
}

export default function FoodPage() {
  const [selectedStation, setSelectedStation] = useState<RailwayStation | null>(() => getStationByCode('KOTA') || INDIAN_STATIONS[0]);
  const [activeCategory, setActiveCategory] = useState<MealType>('lunch');
  const [vegOnly, setVegOnly] = useState(false);

  const items = MENU_ITEMS[activeCategory].filter(i => !vegOnly || i.veg);
  const currentSpeciality = selectedStation ? getSpecialityForStation(selectedStation) : null;

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Signature Unified Brand Header */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 text-white px-5 pt-8 pb-8">
        <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
          <Utensils size={22} />
          Food on Train
        </h1>
        <p className="text-blue-100 text-sm">Station specialities · Pantry menus · IRCTC eCatering</p>
      </div>

      <div className="px-4 -mt-5 space-y-4">
        {/* Order via IRCTC Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <ShoppingBag size={20} className="text-amber-700" />
            </div>
            <div>
              <div className="font-bold text-slate-800 text-sm">Order via IRCTC eCatering</div>
              <div className="text-xs text-slate-500">Seat & berth delivery at upcoming stations</div>
            </div>
          </div>
          <a
            href="https://www.ecatering.irctc.co.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors whitespace-nowrap"
          >
            Order <ExternalLink size={12} />
          </a>
        </div>

        {/* Dynamic Station Selector Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <MapPin size={16} className="text-orange-500" />
              Choose Station for Local Specialities
            </h2>
            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles size={10} /> Interactive
            </span>
          </div>

          {/* Station Input */}
          <StationSearchInput
            id="food-station-select"
            label="Select Station"
            placeholder="Type any station name (e.g. Kota, Mathura, Kanpur, Ratlam, Varanasi)..."
            value={selectedStation}
            onSelect={setSelectedStation}
            onClear={() => setSelectedStation(null)}
          />

          {/* Quick Station Chips */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Popular Food Stations</p>
            <div className="flex flex-wrap gap-1.5">
              {[
                { code: 'KOTA', name: 'Kota' },
                { code: 'RTM', name: 'Ratlam' },
                { code: 'MTJ', name: 'Mathura' },
                { code: 'BSB', name: 'Varanasi' },
                { code: 'NGP', name: 'Nagpur' },
                { code: 'ASR', name: 'Amritsar' },
                { code: 'BZA', name: 'Vijayawada' },
                { code: 'LKO', name: 'Lucknow' },
                { code: 'AGC', name: 'Agra' },
              ].map(st => {
                const isSelected = selectedStation?.code === st.code;
                return (
                  <button
                    key={st.code}
                    onClick={() => {
                      const found = getStationByCode(st.code);
                      if (found) setSelectedStation(found);
                    }}
                    className={clsx(
                      'text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all',
                      isSelected
                        ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-orange-300 hover:bg-orange-50'
                    )}
                  >
                    {st.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Station Speciality Details */}
          {selectedStation && currentSpeciality && (
            <div className="mt-3 pt-3 border-t border-slate-100 space-y-3">
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-3.5 border border-orange-200">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs font-bold text-orange-600 uppercase tracking-wide">Station Speciality</div>
                    <div className="font-bold text-slate-900 text-base">{selectedStation.name} ({selectedStation.code})</div>
                    <div className="text-xs text-slate-600 font-medium mt-0.5">{currentSpeciality.speciality}</div>
                  </div>
                  {currentSpeciality.pantry && (
                    <span className="text-[10px] font-bold bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0">
                      <ChefHat size={11} /> Delivery On Berth
                    </span>
                  )}
                </div>

                <div className="mt-3">
                  <div className="text-[10px] font-bold text-slate-500 uppercase mb-1.5">Famous Station Items</div>
                  <div className="flex flex-wrap gap-1.5">
                    {currentSpeciality.items.map(item => (
                      <span key={item} className="text-xs bg-white border border-amber-300 text-amber-900 px-2.5 py-1 rounded-lg font-semibold shadow-xs flex items-center gap-1">
                        <Check size={11} className="text-amber-600" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {currentSpeciality.bestVendor && (
                  <div className="mt-2.5 text-[11px] text-slate-500 flex items-center gap-1">
                    <Sparkles size={12} className="text-amber-500" /> Top Vendor: <strong className="text-slate-800">{currentSpeciality.bestVendor}</strong>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Meal Categories */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-800">Standard Train Pantry Menu</h2>
            <button
              onClick={() => setVegOnly(v => !v)}
              className={clsx(
                'flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-colors',
                vegOnly ? 'bg-green-600 text-white border-green-600' : 'bg-slate-50 text-slate-700 border-slate-200'
              )}
            >
              <Leaf size={12} /> Veg Only
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {MEAL_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={clsx(
                  'flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl border text-xs font-semibold whitespace-nowrap transition-colors flex-shrink-0',
                  activeCategory === cat.id
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-amber-300'
                )}
              >
                <span className="text-lg">{cat.icon}</span>
                <span>{cat.label}</span>
                <span className={clsx('text-[9px]', activeCategory === cat.id ? 'text-amber-100' : 'text-slate-400')}>{cat.time}</span>
              </button>
            ))}
          </div>

          {/* Food Items List */}
          <div className="mt-3 space-y-2.5">
            {items.length === 0 ? (
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 text-center">
                <Leaf size={24} className="text-green-500 mx-auto mb-2" />
                <p className="text-xs text-slate-500">No pure-veg options in this category.<br />Turn off Veg filter to see all options.</p>
              </div>
            ) : (
              items.map((item, idx) => (
                <div key={idx} className="bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 p-3 flex items-start gap-3 transition-colors">
                  <div className={clsx(
                    'w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5',
                    item.veg ? 'border-green-600' : 'border-red-600'
                  )}>
                    <div className={clsx('w-2 h-2 rounded-full', item.veg ? 'bg-green-600' : 'bg-red-600')} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-xs text-slate-900">{item.name}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{item.desc}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-black text-sm text-slate-800">₹{item.price}</div>
                        {item.calories && <div className="text-[9px] text-slate-400">{item.calories}</div>}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
          <Info size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>Note:</strong> Menu items and prices are indicative and vary by train, pantry car, and zone. To place actual orders, visit the official <a href="https://www.ecatering.irctc.co.in" target="_blank" rel="noopener noreferrer" className="font-bold underline">IRCTC eCatering portal</a>. RailGaadi does not facilitate food orders directly.
          </p>
        </div>
      </div>
    </div>
  );
}
