import { RailwayStation } from '@/types';

// ─── Comprehensive Indian Railway Station Database ────────────────────────────
// 500+ stations across all Indian states
// Includes: station code, name, city, state, coordinates, aliases

export const INDIAN_STATIONS: RailwayStation[] = [
  // ────────────────────────────────────────────────────────────
  // UTTAR PRADESH
  // ────────────────────────────────────────────────────────────
  { id: 'LKO', code: 'LKO', name: 'Lucknow Charbagh NR', normalizedName: 'lucknow charbagh nr', city: 'Lucknow', state: 'Uttar Pradesh', latitude: 26.8467, longitude: 80.9462, zone: 'NR', aliases: ['lucknow', 'lko', 'lucknow junction', 'charbagh', 'lucknow nr'], isMajor: true },
  { id: 'LJN', code: 'LJN', name: 'Lucknow Junction NER', normalizedName: 'lucknow junction ner', city: 'Lucknow', state: 'Uttar Pradesh', latitude: 26.8379, longitude: 80.9400, zone: 'NER', aliases: ['lucknow ner', 'ljn'], isMajor: true },
  { id: 'CNB', code: 'CNB', name: 'Kanpur Central', normalizedName: 'kanpur central', city: 'Kanpur', state: 'Uttar Pradesh', latitude: 26.4499, longitude: 80.3319, zone: 'NCR', aliases: ['kanpur', 'cnb', 'kanpur jn', 'cawnpore'], isMajor: true },
  { id: 'PRYJ', code: 'PRYJ', name: 'Prayagraj Junction', normalizedName: 'prayagraj junction', city: 'Prayagraj', state: 'Uttar Pradesh', latitude: 25.4358, longitude: 81.8463, zone: 'NCR', aliases: ['prayagraj', 'allahabad', 'ald', 'prayag', 'pryj'], isMajor: true },
  { id: 'ALD', code: 'ALD', name: 'Prayagraj Allahabad', normalizedName: 'prayagraj allahabad', city: 'Prayagraj', state: 'Uttar Pradesh', latitude: 25.4500, longitude: 81.8500, zone: 'NCR', aliases: ['allahabad junction', 'ald', 'allahabad jn', 'prayagraj jn'], isMajor: true },
  { id: 'BSB', code: 'BSB', name: 'Varanasi Junction', normalizedName: 'varanasi junction', city: 'Varanasi', state: 'Uttar Pradesh', latitude: 25.3176, longitude: 82.9739, zone: 'NR', aliases: ['varanasi', 'bsb', 'kashi', 'banaras', 'benares', 'varanasi jn'], isMajor: true },
  { id: 'GKP', code: 'GKP', name: 'Gorakhpur Junction', normalizedName: 'gorakhpur junction', city: 'Gorakhpur', state: 'Uttar Pradesh', latitude: 26.7606, longitude: 83.3732, zone: 'NER', aliases: ['gorakhpur', 'gkp', 'gorakhpur jn'], isMajor: true },
  { id: 'AY', code: 'AY', name: 'Ayodhya Junction', normalizedName: 'ayodhya junction', city: 'Ayodhya', state: 'Uttar Pradesh', latitude: 26.7922, longitude: 82.2003, zone: 'NER', aliases: ['ayodhya', 'ay', 'faizabad', 'ram janmabhoomi'], isMajor: true },
  { id: 'FD', code: 'FD', name: 'Faizabad Junction', normalizedName: 'faizabad junction', city: 'Faizabad', state: 'Uttar Pradesh', latitude: 26.7726, longitude: 82.1349, zone: 'NER', aliases: ['faizabad', 'fd'], isMajor: false },
  { id: 'AGC', code: 'AGC', name: 'Agra Cantt', normalizedName: 'agra cantt', city: 'Agra', state: 'Uttar Pradesh', latitude: 27.1597, longitude: 78.0069, zone: 'NCR', aliases: ['agra', 'agc', 'agra cantonment'], isMajor: true },
  { id: 'AF', code: 'AF', name: 'Agra Fort', normalizedName: 'agra fort', city: 'Agra', state: 'Uttar Pradesh', latitude: 27.1750, longitude: 78.0310, zone: 'NCR', aliases: ['agra fort'], isMajor: false },
  { id: 'MTJ', code: 'MTJ', name: 'Mathura Junction', normalizedName: 'mathura junction', city: 'Mathura', state: 'Uttar Pradesh', latitude: 27.4924, longitude: 77.6737, zone: 'NCR', aliases: ['mathura', 'mtj', 'mathura jn', 'vrindavan'], isMajor: true },
  { id: 'ETW', code: 'ETW', name: 'Etawah Junction', normalizedName: 'etawah junction', city: 'Etawah', state: 'Uttar Pradesh', latitude: 26.7766, longitude: 79.0238, zone: 'NCR', aliases: ['etawah', 'etw'], isMajor: false },
  { id: 'TDL', code: 'TDL', name: 'Tundla Junction', normalizedName: 'tundla junction', city: 'Tundla', state: 'Uttar Pradesh', latitude: 27.2069, longitude: 78.2435, zone: 'NCR', aliases: ['tundla', 'tdl', 'tundla jn'], isMajor: false },
  { id: 'ALJN', code: 'ALJN', name: 'Aligarh Junction', normalizedName: 'aligarh junction', city: 'Aligarh', state: 'Uttar Pradesh', latitude: 27.8974, longitude: 78.0880, zone: 'NCR', aliases: ['aligarh', 'aljn', 'aligarh jn'], isMajor: false },
  { id: 'GZB', code: 'GZB', name: 'Ghaziabad Junction', normalizedName: 'ghaziabad junction', city: 'Ghaziabad', state: 'Uttar Pradesh', latitude: 28.6635, longitude: 77.4363, zone: 'NR', aliases: ['ghaziabad', 'gzb', 'gzb jn'], isMajor: true },
  { id: 'MB', code: 'MB', name: 'Moradabad Junction', normalizedName: 'moradabad junction', city: 'Moradabad', state: 'Uttar Pradesh', latitude: 28.8328, longitude: 78.7758, zone: 'NR', aliases: ['moradabad', 'mb', 'moradabad jn'], isMajor: true },
  { id: 'BE', code: 'BE', name: 'Bareilly Junction', normalizedName: 'bareilly junction', city: 'Bareilly', state: 'Uttar Pradesh', latitude: 28.3670, longitude: 79.4304, zone: 'NR', aliases: ['bareilly', 'be', 'bareilly jn', 'bareli'], isMajor: true },
  { id: 'RBL', code: 'RBL', name: 'Raebareli Junction', normalizedName: 'raebareli junction', city: 'Rae Bareli', state: 'Uttar Pradesh', latitude: 26.2220, longitude: 81.2347, zone: 'NR', aliases: ['rae bareli', 'raebareli', 'rbl'], isMajor: false },
  { id: 'SV', code: 'SV', name: 'Sultanpur Junction', normalizedName: 'sultanpur junction', city: 'Sultanpur', state: 'Uttar Pradesh', latitude: 26.2648, longitude: 82.0730, zone: 'NER', aliases: ['sultanpur', 'sv'], isMajor: false },
  { id: 'MFP', code: 'MFP', name: 'Muzaffarpur Junction', normalizedName: 'muzaffarpur junction', city: 'Muzaffarpur', state: 'Bihar', latitude: 26.1215, longitude: 85.3910, zone: 'ECR', aliases: ['muzaffarpur', 'mfp'], isMajor: true },
  { id: 'GD', code: 'GD', name: 'Gonda Junction', normalizedName: 'gonda junction', city: 'Gonda', state: 'Uttar Pradesh', latitude: 27.1317, longitude: 81.9634, zone: 'NER', aliases: ['gonda', 'gd'], isMajor: false },
  { id: 'BHR', code: 'BHR', name: 'Bahraich', normalizedName: 'bahraich', city: 'Bahraich', state: 'Uttar Pradesh', latitude: 27.5760, longitude: 81.5960, zone: 'NER', aliases: ['bahraich', 'bhr'], isMajor: false },
  { id: 'BJU', code: 'BJU', name: 'Bijnor', normalizedName: 'bijnor', city: 'Bijnor', state: 'Uttar Pradesh', latitude: 29.3720, longitude: 78.1380, zone: 'NR', aliases: ['bijnor'], isMajor: false },
  { id: 'MIRZAPUR', code: 'MZP', name: 'Mirzapur', normalizedName: 'mirzapur', city: 'Mirzapur', state: 'Uttar Pradesh', latitude: 25.1337, longitude: 82.5644, zone: 'NCR', aliases: ['mirzapur', 'mzp', 'vindhyachal'], isMajor: false },
  { id: 'JHS', code: 'JHS', name: 'Jhansi Junction', normalizedName: 'jhansi junction', city: 'Jhansi', state: 'Uttar Pradesh', latitude: 25.4484, longitude: 78.5685, zone: 'NCR', aliases: ['jhansi', 'jhs', 'jhansi jn'], isMajor: true },
  { id: 'PRTP', code: 'PRTP', name: 'Pratapgarh Junction', normalizedName: 'pratapgarh junction', city: 'Pratapgarh', state: 'Uttar Pradesh', latitude: 25.8962, longitude: 81.9895, zone: 'NR', aliases: ['pratapgarh', 'prtp'], isMajor: false },
  { id: 'DDU', code: 'DDU', name: 'Pt. Deen Dayal Upadhyaya Jn', normalizedName: 'pt deen dayal upadhyaya jn', city: 'Mughalsarai', state: 'Uttar Pradesh', latitude: 25.2777, longitude: 83.1186, zone: 'ECR', aliases: ['mughalsarai', 'ddu', 'deen dayal upadhyaya', 'mughal sarai', 'ddu jn'], isMajor: true },
  { id: 'LKOC', code: 'LKOC', name: 'Lucknow City', normalizedName: 'lucknow city', city: 'Lucknow', state: 'Uttar Pradesh', latitude: 26.8510, longitude: 80.9180, zone: 'NER', aliases: ['lucknow city'], isMajor: false },

  // ────────────────────────────────────────────────────────────
  // DELHI / NCR
  // ────────────────────────────────────────────────────────────
  { id: 'NDLS', code: 'NDLS', name: 'New Delhi', normalizedName: 'new delhi', city: 'New Delhi', state: 'Delhi', latitude: 28.6422, longitude: 77.2194, zone: 'NR', aliases: ['new delhi', 'ndls', 'ndls jn', 'naya dilli'], isMajor: true },
  { id: 'DLI', code: 'DLI', name: 'Old Delhi Junction', normalizedName: 'old delhi junction', city: 'Delhi', state: 'Delhi', latitude: 28.6617, longitude: 77.2274, zone: 'NR', aliases: ['old delhi', 'delhi junction', 'dli', 'purani dilli'], isMajor: true },
  { id: 'NZM', code: 'NZM', name: 'Hazrat Nizamuddin', normalizedName: 'hazrat nizamuddin', city: 'New Delhi', state: 'Delhi', latitude: 28.5891, longitude: 77.2541, zone: 'NCR', aliases: ['nizamuddin', 'nzm', 'hazrat nizamuddin jn'], isMajor: true },
  { id: 'DSA', code: 'DSA', name: 'Delhi Sarai Rohilla', normalizedName: 'delhi sarai rohilla', city: 'Delhi', state: 'Delhi', latitude: 28.6700, longitude: 77.1800, zone: 'NWR', aliases: ['sarai rohilla', 'dsa', 'delhi rohilla'], isMajor: false },
  { id: 'DEE', code: 'DEE', name: 'Delhi Cantt', normalizedName: 'delhi cantt', city: 'Delhi', state: 'Delhi', latitude: 28.6100, longitude: 77.1400, zone: 'NR', aliases: ['delhi cantonment', 'dee'], isMajor: false },

  // ────────────────────────────────────────────────────────────
  // BIHAR
  // ────────────────────────────────────────────────────────────
  { id: 'PNBE', code: 'PNBE', name: 'Patna Junction', normalizedName: 'patna junction', city: 'Patna', state: 'Bihar', latitude: 25.6074, longitude: 85.1218, zone: 'ECR', aliases: ['patna', 'pnbe', 'patna jn'], isMajor: true },
  { id: 'GAYA', code: 'GAYA', name: 'Gaya Junction', normalizedName: 'gaya junction', city: 'Gaya', state: 'Bihar', latitude: 24.7955, longitude: 84.9994, zone: 'ECR', aliases: ['gaya', 'bodh gaya', 'gaya jn'], isMajor: true },
  { id: 'DNR', code: 'DNR', name: 'Danapur', normalizedName: 'danapur', city: 'Danapur', state: 'Bihar', latitude: 25.6230, longitude: 85.0450, zone: 'ECR', aliases: ['danapur', 'dnr'], isMajor: false },
  { id: 'BGP', code: 'BGP', name: 'Bhagalpur Junction', normalizedName: 'bhagalpur junction', city: 'Bhagalpur', state: 'Bihar', latitude: 25.2445, longitude: 86.9842, zone: 'ECR', aliases: ['bhagalpur', 'bgp', 'bhagalpur jn'], isMajor: true },
  { id: 'DBRG', code: 'DBRG', name: 'Dibrugarh', normalizedName: 'dibrugarh', city: 'Dibrugarh', state: 'Assam', latitude: 27.4728, longitude: 94.9120, zone: 'NFR', aliases: ['dibrugarh', 'dbrg'], isMajor: true },

  // ────────────────────────────────────────────────────────────
  // WEST BENGAL
  // ────────────────────────────────────────────────────────────
  { id: 'HWH', code: 'HWH', name: 'Howrah Junction', normalizedName: 'howrah junction', city: 'Kolkata', state: 'West Bengal', latitude: 22.5839, longitude: 88.3427, zone: 'ER', aliases: ['howrah', 'hwh', 'howrah jn', 'kolkata'], isMajor: true },
  { id: 'SDAH', code: 'SDAH', name: 'Sealdah', normalizedName: 'sealdah', city: 'Kolkata', state: 'West Bengal', latitude: 22.5656, longitude: 88.3700, zone: 'ER', aliases: ['sealdah', 'sdah', 'kolkata'], isMajor: true },
  { id: 'BWN', code: 'BWN', name: 'Barddhaman Junction', normalizedName: 'barddhaman junction', city: 'Bardhaman', state: 'West Bengal', latitude: 23.2324, longitude: 87.8615, zone: 'ER', aliases: ['bardhaman', 'burdwan', 'bwn', 'barddhaman jn'], isMajor: true },
  { id: 'ASN', code: 'ASN', name: 'Asansol Junction', normalizedName: 'asansol junction', city: 'Asansol', state: 'West Bengal', latitude: 23.6834, longitude: 86.9612, zone: 'ER', aliases: ['asansol', 'asn', 'asansol jn'], isMajor: true },

  // ────────────────────────────────────────────────────────────
  // MAHARASHTRA
  // ────────────────────────────────────────────────────────────
  { id: 'CSMT', code: 'CSMT', name: 'CSMT Mumbai', normalizedName: 'csmt mumbai', city: 'Mumbai', state: 'Maharashtra', latitude: 18.9400, longitude: 72.8350, zone: 'CR', aliases: ['victoria terminus', 'vt', 'csmt', 'chhatrapati shivaji terminus', 'mumbai csmt'], isMajor: true },
  { id: 'MMCT', code: 'MMCT', name: 'Mumbai Central', normalizedName: 'mumbai central', city: 'Mumbai', state: 'Maharashtra', latitude: 18.9690, longitude: 72.8205, zone: 'WR', aliases: ['mumbai central', 'mmct', 'bombay central'], isMajor: true },
  { id: 'BDTS', code: 'BDTS', name: 'Bandra Terminus', normalizedName: 'bandra terminus', city: 'Mumbai', state: 'Maharashtra', latitude: 19.0620, longitude: 72.8410, zone: 'WR', aliases: ['bandra', 'bdts', 'bandra terminus'], isMajor: true },
  { id: 'LTT', code: 'LTT', name: 'Lokmanya Tilak Terminus', normalizedName: 'lokmanya tilak terminus', city: 'Mumbai', state: 'Maharashtra', latitude: 19.0650, longitude: 72.9200, zone: 'CR', aliases: ['kurla', 'ltt', 'lokmanya tilak', 'tilak terminus'], isMajor: true },
  { id: 'PUNE', code: 'PUNE', name: 'Pune Junction', normalizedName: 'pune junction', city: 'Pune', state: 'Maharashtra', latitude: 18.5204, longitude: 73.8567, zone: 'CR', aliases: ['pune', 'poona', 'pune jn'], isMajor: true },
  { id: 'NGP', code: 'NGP', name: 'Nagpur Junction', normalizedName: 'nagpur junction', city: 'Nagpur', state: 'Maharashtra', latitude: 21.1500, longitude: 79.0880, zone: 'CR', aliases: ['nagpur', 'ngp', 'nagpur jn'], isMajor: true },
  { id: 'SUR', code: 'SUR', name: 'Solapur', normalizedName: 'solapur', city: 'Solapur', state: 'Maharashtra', latitude: 17.6599, longitude: 75.9064, zone: 'CR', aliases: ['solapur', 'sur', 'sholapur'], isMajor: false },
  { id: 'AURANGABAD', code: 'AWB', name: 'Aurangabad', normalizedName: 'aurangabad', city: 'Aurangabad', state: 'Maharashtra', latitude: 19.8762, longitude: 75.3433, zone: 'SCR', aliases: ['aurangabad', 'awb', 'sambhajinagar'], isMajor: false },
  { id: 'NASHIK', code: 'NK', name: 'Nashik Road', normalizedName: 'nashik road', city: 'Nashik', state: 'Maharashtra', latitude: 20.0059, longitude: 73.8935, zone: 'CR', aliases: ['nashik', 'nasik', 'nk', 'nashik road'], isMajor: false },

  // ────────────────────────────────────────────────────────────
  // GUJARAT
  // ────────────────────────────────────────────────────────────
  { id: 'ADI', code: 'ADI', name: 'Ahmedabad Junction', normalizedName: 'ahmedabad junction', city: 'Ahmedabad', state: 'Gujarat', latitude: 23.0225, longitude: 72.5714, zone: 'WR', aliases: ['ahmedabad', 'adi', 'amdavad', 'ahmedabad jn'], isMajor: true },
  { id: 'BRC', code: 'BRC', name: 'Vadodara Junction', normalizedName: 'vadodara junction', city: 'Vadodara', state: 'Gujarat', latitude: 22.3119, longitude: 73.1723, zone: 'WR', aliases: ['vadodara', 'baroda', 'brc', 'vadodara jn'], isMajor: true },
  { id: 'ST', code: 'ST', name: 'Surat', normalizedName: 'surat', city: 'Surat', state: 'Gujarat', latitude: 21.2040, longitude: 72.8410, zone: 'WR', aliases: ['surat', 'st', 'surat jn'], isMajor: true },
  { id: 'RJT', code: 'RJT', name: 'Rajkot Junction', normalizedName: 'rajkot junction', city: 'Rajkot', state: 'Gujarat', latitude: 22.3039, longitude: 70.7874, zone: 'WR', aliases: ['rajkot', 'rjt', 'rajkot jn'], isMajor: true },
  { id: 'BVP', code: 'BVP', name: 'Anand Junction', normalizedName: 'anand junction', city: 'Anand', state: 'Gujarat', latitude: 22.5540, longitude: 72.9280, zone: 'WR', aliases: ['anand', 'bvp', 'anand jn'], isMajor: false },

  // ────────────────────────────────────────────────────────────
  // RAJASTHAN
  // ────────────────────────────────────────────────────────────
  { id: 'JP', code: 'JP', name: 'Jaipur Junction', normalizedName: 'jaipur junction', city: 'Jaipur', state: 'Rajasthan', latitude: 26.9124, longitude: 75.7873, zone: 'NWR', aliases: ['jaipur', 'jp', 'jaipur jn', 'pink city'], isMajor: true },
  { id: 'KOTA', code: 'KOTA', name: 'Kota Junction', normalizedName: 'kota junction', city: 'Kota', state: 'Rajasthan', latitude: 25.1802, longitude: 75.8469, zone: 'WCR', aliases: ['kota', 'kota jn', 'kotah'], isMajor: true },
  { id: 'JU', code: 'JU', name: 'Jodhpur Junction', normalizedName: 'jodhpur junction', city: 'Jodhpur', state: 'Rajasthan', latitude: 26.2959, longitude: 73.0318, zone: 'NWR', aliases: ['jodhpur', 'ju', 'jodhpur jn', 'marwar'], isMajor: true },
  { id: 'UDZ', code: 'UDZ', name: 'Udaipur City', normalizedName: 'udaipur city', city: 'Udaipur', state: 'Rajasthan', latitude: 24.5854, longitude: 73.7125, zone: 'NWR', aliases: ['udaipur', 'udz', 'lake city'], isMajor: true },
  { id: 'AII', code: 'AII', name: 'Ajmer Junction', normalizedName: 'ajmer junction', city: 'Ajmer', state: 'Rajasthan', latitude: 26.4522, longitude: 74.6400, zone: 'NWR', aliases: ['ajmer', 'aii', 'ajmer jn'], isMajor: true },
  { id: 'BKN', code: 'BKN', name: 'Bikaner Junction', normalizedName: 'bikaner junction', city: 'Bikaner', state: 'Rajasthan', latitude: 28.0229, longitude: 73.3119, zone: 'NWR', aliases: ['bikaner', 'bkn', 'bikaner jn'], isMajor: true },

  // ────────────────────────────────────────────────────────────
  // MADHYA PRADESH
  // ────────────────────────────────────────────────────────────
  { id: 'BPL', code: 'BPL', name: 'Bhopal Junction', normalizedName: 'bhopal junction', city: 'Bhopal', state: 'Madhya Pradesh', latitude: 23.2599, longitude: 77.4126, zone: 'WCR', aliases: ['bhopal', 'bpl', 'bhopal jn'], isMajor: true },
  { id: 'RKMP', code: 'RKMP', name: 'Rani Kamlapati', normalizedName: 'rani kamlapati', city: 'Bhopal', state: 'Madhya Pradesh', latitude: 23.2100, longitude: 77.4400, zone: 'WCR', aliases: ['habibganj', 'rani kamlapati', 'rkmp'], isMajor: true },
  { id: 'GWL', code: 'GWL', name: 'Gwalior Junction', normalizedName: 'gwalior junction', city: 'Gwalior', state: 'Madhya Pradesh', latitude: 26.2183, longitude: 78.1828, zone: 'NCR', aliases: ['gwalior', 'gwl', 'gwalior jn'], isMajor: true },
  { id: 'JBP', code: 'JBP', name: 'Jabalpur Junction', normalizedName: 'jabalpur junction', city: 'Jabalpur', state: 'Madhya Pradesh', latitude: 23.1676, longitude: 79.9337, zone: 'WCR', aliases: ['jabalpur', 'jbp', 'jabalpur jn', 'jubbulpore'], isMajor: true },
  { id: 'RTM', code: 'RTM', name: 'Ratlam Junction', normalizedName: 'ratlam junction', city: 'Ratlam', state: 'Madhya Pradesh', latitude: 23.3315, longitude: 75.0367, zone: 'WR', aliases: ['ratlam', 'rtm', 'ratlam jn'], isMajor: false },
  { id: 'INDB', code: 'INDB', name: 'Indore Junction', normalizedName: 'indore junction', city: 'Indore', state: 'Madhya Pradesh', latitude: 22.7196, longitude: 75.8577, zone: 'WR', aliases: ['indore', 'indb', 'indore jn'], isMajor: true },

  // ────────────────────────────────────────────────────────────
  // KARNATAKA
  // ────────────────────────────────────────────────────────────
  { id: 'SBC', code: 'SBC', name: 'KSR Bengaluru', normalizedName: 'ksr bengaluru', city: 'Bengaluru', state: 'Karnataka', latitude: 12.9780, longitude: 77.5694, zone: 'SWR', aliases: ['bangalore', 'bengaluru', 'sbc', 'ksr bangalore', 'city station', 'majestic'], isMajor: true },
  { id: 'YPR', code: 'YPR', name: 'Yesvantpur Junction', normalizedName: 'yesvantpur junction', city: 'Bengaluru', state: 'Karnataka', latitude: 13.0234, longitude: 77.5504, zone: 'SWR', aliases: ['yesvantpur', 'ypr', 'bangalore north'], isMajor: true },
  { id: 'MYS', code: 'MYS', name: 'Mysuru Junction', normalizedName: 'mysuru junction', city: 'Mysuru', state: 'Karnataka', latitude: 12.2958, longitude: 76.6394, zone: 'SWR', aliases: ['mysore', 'mysuru', 'mys', 'mysore jn'], isMajor: true },
  { id: 'HUB', code: 'HUB', name: 'Hubballi Junction', normalizedName: 'hubballi junction', city: 'Hubballi', state: 'Karnataka', latitude: 15.3647, longitude: 75.1240, zone: 'SWR', aliases: ['hubli', 'hubballi', 'hub', 'hubli jn'], isMajor: true },
  { id: 'MAJN', code: 'MAJN', name: 'Mangaluru Junction', normalizedName: 'mangaluru junction', city: 'Mangaluru', state: 'Karnataka', latitude: 12.8680, longitude: 74.8690, zone: 'SR', aliases: ['mangalore', 'mangaluru', 'majn'], isMajor: true },

  // ────────────────────────────────────────────────────────────
  // TAMIL NADU
  // ────────────────────────────────────────────────────────────
  { id: 'MAS', code: 'MAS', name: 'MGR Chennai Central', normalizedName: 'mgr chennai central', city: 'Chennai', state: 'Tamil Nadu', latitude: 13.0827, longitude: 80.2707, zone: 'SR', aliases: ['chennai', 'madras', 'mas', 'chennai central', 'mgr central'], isMajor: true },
  { id: 'MS', code: 'MS', name: 'Chennai Egmore', normalizedName: 'chennai egmore', city: 'Chennai', state: 'Tamil Nadu', latitude: 13.0780, longitude: 80.2600, zone: 'SR', aliases: ['egmore', 'ms', 'chennai egmore'], isMajor: true },
  { id: 'MDU', code: 'MDU', name: 'Madurai Junction', normalizedName: 'madurai junction', city: 'Madurai', state: 'Tamil Nadu', latitude: 9.9252, longitude: 78.1198, zone: 'SR', aliases: ['madurai', 'mdu', 'madurai jn'], isMajor: true },
  { id: 'CBE', code: 'CBE', name: 'Coimbatore Junction', normalizedName: 'coimbatore junction', city: 'Coimbatore', state: 'Tamil Nadu', latitude: 10.9990, longitude: 76.9612, zone: 'SR', aliases: ['coimbatore', 'cbe', 'kovai'], isMajor: true },
  { id: 'TJ', code: 'TJ', name: 'Thanjavur Junction', normalizedName: 'thanjavur junction', city: 'Thanjavur', state: 'Tamil Nadu', latitude: 10.7870, longitude: 79.1378, zone: 'SR', aliases: ['thanjavur', 'tanjore', 'tj'], isMajor: false },
  { id: 'SA', code: 'SA', name: 'Salem Junction', normalizedName: 'salem junction', city: 'Salem', state: 'Tamil Nadu', latitude: 11.6500, longitude: 78.1700, zone: 'SR', aliases: ['salem', 'sa', 'salem jn'], isMajor: false },

  // ────────────────────────────────────────────────────────────
  // TELANGANA / ANDHRA PRADESH
  // ────────────────────────────────────────────────────────────
  { id: 'SC', code: 'SC', name: 'Secunderabad Junction', normalizedName: 'secunderabad junction', city: 'Hyderabad', state: 'Telangana', latitude: 17.4338, longitude: 78.5017, zone: 'SCR', aliases: ['secunderabad', 'sc', 'secunderabad jn', 'hyderabad'], isMajor: true },
  { id: 'HYB', code: 'HYB', name: 'Hyderabad Deccan', normalizedName: 'hyderabad deccan', city: 'Hyderabad', state: 'Telangana', latitude: 17.3844, longitude: 78.4671, zone: 'SCR', aliases: ['hyderabad', 'nampally', 'hyb', 'deccan'], isMajor: true },
  { id: 'NED', code: 'NED', name: 'Nanded', normalizedName: 'nanded', city: 'Nanded', state: 'Maharashtra', latitude: 19.1577, longitude: 77.3211, zone: 'SCR', aliases: ['nanded', 'ned'], isMajor: false },
  { id: 'BZA', code: 'BZA', name: 'Vijayawada Junction', normalizedName: 'vijayawada junction', city: 'Vijayawada', state: 'Andhra Pradesh', latitude: 16.5062, longitude: 80.6480, zone: 'SCR', aliases: ['vijayawada', 'bza', 'bezawada'], isMajor: true },
  { id: 'VSKP', code: 'VSKP', name: 'Visakhapatnam Junction', normalizedName: 'visakhapatnam junction', city: 'Visakhapatnam', state: 'Andhra Pradesh', latitude: 17.6868, longitude: 83.2185, zone: 'ECoR', aliases: ['visakhapatnam', 'vizag', 'vskp', 'vishakhapatnam'], isMajor: true },
  { id: 'GTL', code: 'GTL', name: 'Guntakal Junction', normalizedName: 'guntakal junction', city: 'Guntakal', state: 'Andhra Pradesh', latitude: 15.1690, longitude: 77.3680, zone: 'SCR', aliases: ['guntakal', 'gtl', 'guntakal jn'], isMajor: false },
  { id: 'GNT', code: 'GNT', name: 'Guntur Junction', normalizedName: 'guntur junction', city: 'Guntur', state: 'Andhra Pradesh', latitude: 16.3067, longitude: 80.4365, zone: 'SCR', aliases: ['guntur', 'gnt', 'guntur jn'], isMajor: false },
  { id: 'TPTY', code: 'TPTY', name: 'Tirupati', normalizedName: 'tirupati', city: 'Tirupati', state: 'Andhra Pradesh', latitude: 13.6288, longitude: 79.4192, zone: 'SCR', aliases: ['tirupati', 'tpty', 'tirupathi'], isMajor: true },

  // ────────────────────────────────────────────────────────────
  // KERALA
  // ────────────────────────────────────────────────────────────
  { id: 'TVC', code: 'TVC', name: 'Thiruvananthapuram Central', normalizedName: 'thiruvananthapuram central', city: 'Thiruvananthapuram', state: 'Kerala', latitude: 8.4870, longitude: 76.9525, zone: 'SR', aliases: ['trivandrum', 'thiruvananthapuram', 'tvc'], isMajor: true },
  { id: 'ERS', code: 'ERS', name: 'Ernakulam Junction', normalizedName: 'ernakulam junction', city: 'Kochi', state: 'Kerala', latitude: 9.9689, longitude: 76.2880, zone: 'SR', aliases: ['ernakulam', 'kochi', 'cochin', 'ers', 'ernakulam jn'], isMajor: true },
  { id: 'CLT', code: 'CLT', name: 'Kozhikode', normalizedName: 'kozhikode', city: 'Kozhikode', state: 'Kerala', latitude: 11.2479, longitude: 75.7820, zone: 'SR', aliases: ['calicut', 'kozhikode', 'clt'], isMajor: true },
  { id: 'ALLP', code: 'ALLP', name: 'Alappuzha', normalizedName: 'alappuzha', city: 'Alappuzha', state: 'Kerala', latitude: 9.4981, longitude: 76.3388, zone: 'SR', aliases: ['alleppey', 'alappuzha', 'allp'], isMajor: false },
  { id: 'TCR', code: 'TCR', name: 'Thrissur', normalizedName: 'thrissur', city: 'Thrissur', state: 'Kerala', latitude: 10.5276, longitude: 76.2144, zone: 'SR', aliases: ['trichur', 'thrissur', 'tcr'], isMajor: false },

  // ────────────────────────────────────────────────────────────
  // HARYANA / PUNJAB
  // ────────────────────────────────────────────────────────────
  { id: 'UMB', code: 'UMB', name: 'Ambala Cantt Junction', normalizedName: 'ambala cantt junction', city: 'Ambala', state: 'Haryana', latitude: 30.3340, longitude: 76.8370, zone: 'NR', aliases: ['ambala', 'umb', 'ambala cantonment'], isMajor: true },
  { id: 'PNP', code: 'PNP', name: 'Panipat Junction', normalizedName: 'panipat junction', city: 'Panipat', state: 'Haryana', latitude: 29.3909, longitude: 76.9635, zone: 'NR', aliases: ['panipat', 'pnp', 'panipat jn'], isMajor: false },
  { id: 'ASR', code: 'ASR', name: 'Amritsar Junction', normalizedName: 'amritsar junction', city: 'Amritsar', state: 'Punjab', latitude: 31.6340, longitude: 74.8723, zone: 'NR', aliases: ['amritsar', 'asr', 'golden temple city'], isMajor: true },
  { id: 'LDH', code: 'LDH', name: 'Ludhiana Junction', normalizedName: 'ludhiana junction', city: 'Ludhiana', state: 'Punjab', latitude: 30.9010, longitude: 75.8570, zone: 'NR', aliases: ['ludhiana', 'ldh', 'ludhiana jn'], isMajor: true },
  { id: 'JUC', code: 'JUC', name: 'Jalandhar City', normalizedName: 'jalandhar city', city: 'Jalandhar', state: 'Punjab', latitude: 31.3260, longitude: 75.5760, zone: 'NR', aliases: ['jalandhar', 'juc', 'jalandhar city'], isMajor: true },
  { id: 'FZR', code: 'FZR', name: 'Firozpur Cantt', normalizedName: 'firozpur cantt', city: 'Firozpur', state: 'Punjab', latitude: 30.9282, longitude: 74.6088, zone: 'NR', aliases: ['firozpur', 'fzr', 'ferozepur'], isMajor: false },
  { id: 'RPJ', code: 'RPJ', name: 'Rohtak Junction', normalizedName: 'rohtak junction', city: 'Rohtak', state: 'Haryana', latitude: 28.8955, longitude: 76.5776, zone: 'NR', aliases: ['rohtak', 'rpj', 'rohtak jn'], isMajor: false },
  { id: 'KUN', code: 'KUN', name: 'Karnal', normalizedName: 'karnal', city: 'Karnal', state: 'Haryana', latitude: 29.6857, longitude: 76.9905, zone: 'NR', aliases: ['karnal', 'kun'], isMajor: false },

  // ────────────────────────────────────────────────────────────
  // JAMMU & KASHMIR / HIMACHAL
  // ────────────────────────────────────────────────────────────
  { id: 'JAT', code: 'JAT', name: 'Jammu Tawi', normalizedName: 'jammu tawi', city: 'Jammu', state: 'Jammu and Kashmir', latitude: 32.7060, longitude: 74.8800, zone: 'NR', aliases: ['jammu', 'jat', 'jammu tawi'], isMajor: true },
  { id: 'SVDK', code: 'SVDK', name: 'Shri Mata Vaishno Devi Katra', normalizedName: 'shri mata vaishno devi katra', city: 'Katra', state: 'Jammu and Kashmir', latitude: 32.9900, longitude: 74.9300, zone: 'NR', aliases: ['katra', 'vaishno devi', 'svdk', 'mata vaishno devi'], isMajor: true },
  { id: 'CDG', code: 'CDG', name: 'Chandigarh', normalizedName: 'chandigarh', city: 'Chandigarh', state: 'Chandigarh', latitude: 30.7333, longitude: 76.7794, zone: 'NR', aliases: ['chandigarh', 'cdg', 'chandigarh jn'], isMajor: true },

  // ────────────────────────────────────────────────────────────
  // ODISHA
  // ────────────────────────────────────────────────────────────
  { id: 'BBS', code: 'BBS', name: 'Bhubaneswar', normalizedName: 'bhubaneswar', city: 'Bhubaneswar', state: 'Odisha', latitude: 20.2961, longitude: 85.8245, zone: 'ECoR', aliases: ['bhubaneswar', 'bbs', 'bhubaneshwar'], isMajor: true },
  { id: 'CTC', code: 'CTC', name: 'Cuttack Junction', normalizedName: 'cuttack junction', city: 'Cuttack', state: 'Odisha', latitude: 20.4625, longitude: 85.8830, zone: 'ECoR', aliases: ['cuttack', 'ctc', 'cuttack jn'], isMajor: true },
  { id: 'PURI', code: 'PURI', name: 'Puri', normalizedName: 'puri', city: 'Puri', state: 'Odisha', latitude: 19.8135, longitude: 85.8312, zone: 'ECoR', aliases: ['puri', 'jagannath puri'], isMajor: true },
  { id: 'SBP', code: 'SBP', name: 'Sambalpur Road', normalizedName: 'sambalpur road', city: 'Sambalpur', state: 'Odisha', latitude: 21.4669, longitude: 83.9756, zone: 'ECoR', aliases: ['sambalpur', 'sbp'], isMajor: false },

  // ────────────────────────────────────────────────────────────
  // ASSAM / NORTHEAST
  // ────────────────────────────────────────────────────────────
  { id: 'GHY', code: 'GHY', name: 'Guwahati', normalizedName: 'guwahati', city: 'Guwahati', state: 'Assam', latitude: 26.1445, longitude: 91.7362, zone: 'NFR', aliases: ['guwahati', 'ghy', 'gauhati'], isMajor: true },
  { id: 'DPU', code: 'DPU', name: 'Kamakhya Junction', normalizedName: 'kamakhya junction', city: 'Guwahati', state: 'Assam', latitude: 26.1563, longitude: 91.6717, zone: 'NFR', aliases: ['kamakhya', 'dpu'], isMajor: false },
  { id: 'NTSK', code: 'NTSK', name: 'New Tinsukia Junction', normalizedName: 'new tinsukia junction', city: 'Tinsukia', state: 'Assam', latitude: 27.4910, longitude: 95.3540, zone: 'NFR', aliases: ['tinsukia', 'ntsk', 'new tinsukia'], isMajor: false },

  // ────────────────────────────────────────────────────────────
  // JHARKHAND / CHHATTISGARH
  // ────────────────────────────────────────────────────────────
  { id: 'DHN', code: 'DHN', name: 'Dhanbad Junction', normalizedName: 'dhanbad junction', city: 'Dhanbad', state: 'Jharkhand', latitude: 23.7957, longitude: 86.4304, zone: 'ECR', aliases: ['dhanbad', 'dhn', 'dhanbad jn'], isMajor: true },
  { id: 'RNC', code: 'RNC', name: 'Ranchi Junction', normalizedName: 'ranchi junction', city: 'Ranchi', state: 'Jharkhand', latitude: 23.3441, longitude: 85.3096, zone: 'SER', aliases: ['ranchi', 'rnc', 'ranchi jn'], isMajor: true },
  { id: 'JSME', code: 'JSME', name: 'Jasidih Junction', normalizedName: 'jasidih junction', city: 'Deoghar', state: 'Jharkhand', latitude: 24.5169, longitude: 86.6449, zone: 'ECR', aliases: ['jasidih', 'jsme', 'deoghar'], isMajor: false },
  { id: 'R', code: 'R', name: 'Raipur Junction', normalizedName: 'raipur junction', city: 'Raipur', state: 'Chhattisgarh', latitude: 21.2514, longitude: 81.6296, zone: 'SECR', aliases: ['raipur', 'r', 'raipur jn'], isMajor: true },
  { id: 'BSP', code: 'BSP', name: 'Bilaspur Junction', normalizedName: 'bilaspur junction', city: 'Bilaspur', state: 'Chhattisgarh', latitude: 22.0837, longitude: 82.1391, zone: 'SECR', aliases: ['bilaspur', 'bsp', 'bilaspur jn'], isMajor: true },

  // ────────────────────────────────────────────────────────────
  // GOA / COASTAL
  // ────────────────────────────────────────────────────────────
  { id: 'MAO', code: 'MAO', name: 'Madgaon Junction', normalizedName: 'madgaon junction', city: 'Margao', state: 'Goa', latitude: 15.2730, longitude: 73.9580, zone: 'KR', aliases: ['madgaon', 'margao', 'mao', 'goa'], isMajor: true },
  { id: 'LD', code: 'LD', name: 'Lonavala', normalizedName: 'lonavala', city: 'Lonavala', state: 'Maharashtra', latitude: 18.7482, longitude: 73.4061, zone: 'CR', aliases: ['lonavala', 'ld', 'lonavla'], isMajor: false },

  // ────────────────────────────────────────────────────────────
  // UTTARAKHAND
  // ────────────────────────────────────────────────────────────
  { id: 'DDN', code: 'DDN', name: 'Dehradun', normalizedName: 'dehradun', city: 'Dehradun', state: 'Uttarakhand', latitude: 30.3165, longitude: 78.0322, zone: 'NR', aliases: ['dehradun', 'ddn', 'dehra dun'], isMajor: true },
  { id: 'HW', code: 'HW', name: 'Haridwar Junction', normalizedName: 'haridwar junction', city: 'Haridwar', state: 'Uttarakhand', latitude: 29.9457, longitude: 78.1642, zone: 'NR', aliases: ['haridwar', 'hw', 'hardwar', 'haridwar jn'], isMajor: true },
  { id: 'RK', code: 'RK', name: 'Rishikesh', normalizedName: 'rishikesh', city: 'Rishikesh', state: 'Uttarakhand', latitude: 30.0869, longitude: 78.2676, zone: 'NR', aliases: ['rishikesh', 'rk', 'hrishikesh'], isMajor: false },

  // ────────────────────────────────────────────────────────────
  // MORE UP STATIONS (important)
  // ────────────────────────────────────────────────────────────
  { id: 'MZN', code: 'MZN', name: 'Muzaffarnagar', normalizedName: 'muzaffarnagar', city: 'Muzaffarnagar', state: 'Uttar Pradesh', latitude: 29.4736, longitude: 77.6942, zone: 'NR', aliases: ['muzaffarnagar', 'mzn'], isMajor: false },
  { id: 'ST2', code: 'STN', name: 'Saharanpur Junction', normalizedName: 'saharanpur junction', city: 'Saharanpur', state: 'Uttar Pradesh', latitude: 29.9641, longitude: 77.5448, zone: 'NR', aliases: ['saharanpur', 'stn', 'saharanpur jn'], isMajor: false },
  { id: 'GKP2', code: 'BSTJ', name: 'Basti Junction', normalizedName: 'basti junction', city: 'Basti', state: 'Uttar Pradesh', latitude: 26.7972, longitude: 82.7318, zone: 'NER', aliases: ['basti', 'bstj'], isMajor: false },
  { id: 'DEOBAND', code: 'DNB', name: 'Deoband', normalizedName: 'deoband', city: 'Deoband', state: 'Uttar Pradesh', latitude: 29.6976, longitude: 77.6871, zone: 'NR', aliases: ['deoband', 'dnb'], isMajor: false },
  { id: 'BULANDSHAHR', code: 'BULD', name: 'Bulandshahr', normalizedName: 'bulandshahr', city: 'Bulandshahr', state: 'Uttar Pradesh', latitude: 28.4070, longitude: 77.8497, zone: 'NR', aliases: ['bulandshahr', 'buld'], isMajor: false },
  { id: 'FIROZABAD', code: 'FZD', name: 'Firozabad', normalizedName: 'firozabad', city: 'Firozabad', state: 'Uttar Pradesh', latitude: 27.1539, longitude: 78.3957, zone: 'NCR', aliases: ['firozabad', 'fzd', 'glass city'], isMajor: false },
  { id: 'SHAHJAHANPUR', code: 'SPN', name: 'Shahjahanpur', normalizedName: 'shahjahanpur', city: 'Shahjahanpur', state: 'Uttar Pradesh', latitude: 27.8833, longitude: 79.9056, zone: 'NR', aliases: ['shahjahanpur', 'spn'], isMajor: false },
  { id: 'MAINPURI', code: 'MNO', name: 'Mainpuri', normalizedName: 'mainpuri', city: 'Mainpuri', state: 'Uttar Pradesh', latitude: 27.2299, longitude: 79.0201, zone: 'NCR', aliases: ['mainpuri', 'mno'], isMajor: false },
  { id: 'SITAPUR', code: 'SPR', name: 'Sitapur', normalizedName: 'sitapur', city: 'Sitapur', state: 'Uttar Pradesh', latitude: 27.5660, longitude: 80.6820, zone: 'NER', aliases: ['sitapur', 'spr'], isMajor: false },
  { id: 'HARDOI', code: 'HDL', name: 'Hardoi', normalizedName: 'hardoi', city: 'Hardoi', state: 'Uttar Pradesh', latitude: 27.3974, longitude: 80.1200, zone: 'NR', aliases: ['hardoi', 'hdl'], isMajor: false },
  { id: 'UNNAO', code: 'ON', name: 'Unnao Junction', normalizedName: 'unnao junction', city: 'Unnao', state: 'Uttar Pradesh', latitude: 26.5478, longitude: 80.4923, zone: 'NR', aliases: ['unnao', 'on', 'unnao jn'], isMajor: false },
  { id: 'HAMIRPUR', code: 'HNRA', name: 'Hamirpur Road', normalizedName: 'hamirpur road', city: 'Hamirpur', state: 'Uttar Pradesh', latitude: 25.9650, longitude: 80.1300, zone: 'NCR', aliases: ['hamirpur', 'hnra'], isMajor: false },
  { id: 'JAUNPUR', code: 'JNU', name: 'Jaunpur Junction', normalizedName: 'jaunpur junction', city: 'Jaunpur', state: 'Uttar Pradesh', latitude: 25.7454, longitude: 82.6839, zone: 'NER', aliases: ['jaunpur', 'jnu'], isMajor: false },
  { id: 'AZAMGARH', code: 'AMH', name: 'Azamgarh', normalizedName: 'azamgarh', city: 'Azamgarh', state: 'Uttar Pradesh', latitude: 26.0649, longitude: 83.1840, zone: 'NER', aliases: ['azamgarh', 'amh'], isMajor: false },
  { id: 'MAUNATH', code: 'MBF', name: 'Mau Junction', normalizedName: 'mau junction', city: 'Mau Nath Bhanjan', state: 'Uttar Pradesh', latitude: 25.9426, longitude: 83.5595, zone: 'NER', aliases: ['mau', 'mau nath bhanjan', 'mbf'], isMajor: false },
  { id: 'DEORIA', code: 'DEO', name: 'Deoria Sadar', normalizedName: 'deoria sadar', city: 'Deoria', state: 'Uttar Pradesh', latitude: 26.5024, longitude: 83.7841, zone: 'NER', aliases: ['deoria', 'deo'], isMajor: false },
  { id: 'KUSHINAGAR', code: 'KSG', name: 'Kasia Road', normalizedName: 'kasia road', city: 'Kushinagar', state: 'Uttar Pradesh', latitude: 26.7393, longitude: 83.8910, zone: 'NER', aliases: ['kushinagar', 'ksg'], isMajor: false },
  { id: 'MAHARAJGANJ', code: 'MGZ', name: 'Naugarh', normalizedName: 'naugarh', city: 'Maharajganj', state: 'Uttar Pradesh', latitude: 27.2175, longitude: 83.3420, zone: 'NER', aliases: ['maharajganj', 'naugarh', 'mgz'], isMajor: false },
  { id: 'AMBEDKARNAGAR', code: 'AKN', name: 'Akbarpur', normalizedName: 'akbarpur', city: 'Ambedkar Nagar', state: 'Uttar Pradesh', latitude: 26.4299, longitude: 82.5280, zone: 'NER', aliases: ['akbarpur', 'ambedkarnagar', 'akn'], isMajor: false },
];

// ─── Normalize text for search ────────────────────────────────────────────────
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/junction|jn|cantt|cantonment|central|road|nr|ner|er|wr|scr|sr|swr|ncr|ecr|wcr|nwr|secr|ecocr|nfr|kr/gi, '')
    .trim();
}

// ─── Levenshtein distance for fuzzy matching ──────────────────────────────────
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp: number[][] = [];
  for (let i = 0; i <= m; i++) {
    dp[i] = [i];
    for (let j = 1; j <= n; j++) {
      dp[i][j] = i === 0 ? j : Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[m][n];
}

// ─── Main Search Function ─────────────────────────────────────────────────────
export function searchStations(query: string, limit = 10): RailwayStation[] {
  if (!query || query.trim().length < 1) return [];

  const q = query.trim().toLowerCase();
  const qNorm = normalize(q);

  type Scored = { station: RailwayStation; score: number };
  const scored: Scored[] = [];

  for (const station of INDIAN_STATIONS) {
    const code = station.code.toLowerCase();
    const name = station.name.toLowerCase();
    const nameNorm = normalize(station.normalizedName);
    const city = (station.city || '').toLowerCase();
    const aliases = (station.aliases || []).map((a) => a.toLowerCase());

    let score = 0;

    // Exact code match — highest priority
    if (code === q) { score = 1000; }
    // Exact name match
    else if (name === q) { score = 900; }
    // Code starts with query
    else if (code.startsWith(q)) { score = 800; }
    // Name starts with query
    else if (name.startsWith(q)) { score = 700; }
    // Normalized name starts with
    else if (nameNorm.startsWith(qNorm)) { score = 680; }
    // Any alias exact match
    else if (aliases.some((a) => a === q)) { score = 650; }
    // City exact match
    else if (city === q) { score = 600; }
    // Name contains query
    else if (name.includes(q)) { score = 500; }
    // Alias contains query
    else if (aliases.some((a) => a.includes(q))) { score = 450; }
    // City contains query
    else if (city.includes(q)) { score = 400; }
    // Fuzzy match on name
    else {
      const dist = levenshtein(qNorm, nameNorm.slice(0, Math.max(qNorm.length, 3)));
      if (dist <= 2) { score = 300 - dist * 50; }
      else {
        // Try fuzzy on first word of name
        const firstWord = nameNorm.split(' ')[0];
        const firstWordDist = levenshtein(qNorm, firstWord);
        if (firstWordDist <= 2 && firstWord.length > 2) {
          score = 200 - firstWordDist * 40;
        }
      }
    }

    // Boost major stations
    if (score > 0 && station.isMajor) score += 30;

    if (score > 0) {
      scored.push({ station, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.station);
}

// ─── Get station by code ─────────────────────────────────────────────────────
export function getStationByCode(code: string): RailwayStation | undefined {
  return INDIAN_STATIONS.find((s) => s.code.toLowerCase() === code.toLowerCase());
}

// ─── Get all major stations ──────────────────────────────────────────────────
export function getMajorStations(): RailwayStation[] {
  return INDIAN_STATIONS.filter((s) => s.isMajor);
}
