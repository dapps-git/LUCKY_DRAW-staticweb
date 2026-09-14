import type { AppData } from '../types'

export const ADMIN_EMAIL = 'admin@valancheryfestival.com'
export const ADMIN_PASSWORD = 'admin123'

export const GIFT_PRESETS = [
  {
    name: 'Smart TV',
    value: '₹42,000',
    description: '55-inch 4K Ultra HD Smart LED Television.',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=900&q=80',
    category: 'Electronics',
  },
  {
    name: 'Smartphone',
    value: '₹35,000',
    description: 'Flagship 5G smartphone with high-performance camera.',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
    category: 'Mobile',
  },
  {
    name: 'Premium Laptop',
    value: '₹58,000',
    description: 'High-speed 16GB RAM laptop for work, study and coding.',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
    category: 'Computers',
  },
  {
    name: 'Double-Door Refrigerator',
    value: '₹32,000',
    description: 'Energy-efficient frost-free refrigerator for home.',
    image: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?auto=format&fit=crop&w=900&q=80',
    category: 'Home Appliances',
  },
  {
    name: 'Front-Load Washing Machine',
    value: '₹28,000',
    description: 'Fully automatic inverter front-load washing machine.',
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=900&q=80',
    category: 'Home Appliances',
  },
  {
    name: 'Festival Gold Hamper',
    value: '₹75,000',
    description: 'Grand festive gold coin hamper and celebration voucher.',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=900&q=80',
    category: 'Gold & Luxury',
  },
  {
    name: 'Smart Watch',
    value: '₹12,000',
    description: 'AMOLED display smartwatch with health & fitness tracking.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    category: 'Wearables',
  },
  {
    name: 'Festival Shopping Voucher',
    value: '₹10,000',
    description: 'Shopping voucher redeemable at all Valanchery partner stores.',
    image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=900&q=80',
    category: 'Vouchers',
  },
  {
    name: 'Air Fryer & Microwave Combo',
    value: '₹18,000',
    description: 'Digital convection microwave and healthy air fryer set.',
    image: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=900&q=80',
    category: 'Kitchen',
  },
]

export const PRIZE_IMAGES = {
  smartphone: GIFT_PRESETS[1].image,
  tv: GIFT_PRESETS[0].image,
  laptop: GIFT_PRESETS[2].image,
  fridge: GIFT_PRESETS[3].image,
  washer: GIFT_PRESETS[4].image,
  voucher: GIFT_PRESETS[7].image,
  festival: GIFT_PRESETS[5].image,
}

export const seedData: AppData = {
  prizes: [
  {
    "id": "prize-tv",
    "name": "Smart TV",
    "description": "55-inch 4K Ultra HD smart television for the festival home.",
    "value": "₹42,000",
    "image": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=900&q=80",
    "assignedDrawId": "draw-01",
    "status": "Awarded"
  },
  {
    "id": "prize-voucher",
    "name": "Gift Voucher",
    "description": "Festival shopping voucher valid at all partner stores.",
    "value": "₹10,000",
    "image": "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=900&q=80",
    "assignedDrawId": "draw-02",
    "status": "Awarded"
  },
  {
    "id": "prize-laptop",
    "name": "Premium Laptop",
    "description": "High-speed 16GB RAM laptop for work, study and celebration.",
    "value": "₹58,000",
    "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
    "assignedDrawId": "draw-03",
    "status": "Awarded"
  },
  {
    "id": "prize-phone",
    "name": "Flagship Smartphone",
    "description": "Flagship 5G smartphone — the upcoming grand lucky draw prize.",
    "value": "₹35,000",
    "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
    "assignedDrawId": "draw-04",
    "status": "Awarded"
  },
  {
    "id": "prize-fridge",
    "name": "Double-Door Refrigerator",
    "description": "Energy-efficient frost-free refrigerator for home.",
    "value": "₹32,000",
    "image": "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?auto=format&fit=crop&w=900&q=80",
    "assignedDrawId": "draw-05",
    "status": "Awarded"
  },
  {
    "id": "prize-washer",
    "name": "Washing Machine",
    "description": "Fully automatic inverter front-load washing machine.",
    "value": "₹28,000",
    "image": "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=900&q=80",
    "assignedDrawId": "draw-06",
    "status": "Assigned"
  },
  {
    "id": "prize-festival",
    "name": "Special Gold Hamper",
    "description": "Grand festive gold coin hamper and celebration voucher.",
    "value": "₹75,000",
    "image": "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=900&q=80",
    "assignedDrawId": "draw-10",
    "status": "Assigned"
  }
],
  draws: [
  {
    "id": "draw-01",
    "number": 1,
    "date": "2026-08-15",
    "prizeId": "prize-tv",
    "winnerCount": 1,
    "status": "Completed"
  },
  {
    "id": "draw-02",
    "number": 2,
    "date": "2026-08-30",
    "prizeId": "prize-voucher",
    "winnerCount": 1,
    "status": "Completed"
  },
  {
    "id": "draw-03",
    "number": 3,
    "date": "2026-09-15",
    "prizeId": "prize-laptop",
    "winnerCount": 1,
    "status": "Completed"
  },
  {
    "id": "draw-04",
    "number": 4,
    "date": "2026-09-30",
    "prizeId": "prize-phone",
    "winnerCount": 1,
    "status": "Completed"
  },
  {
    "id": "draw-05",
    "number": 5,
    "date": "2026-10-15",
    "prizeId": "prize-fridge",
    "winnerCount": 1,
    "status": "Completed"
  },
  {
    "id": "draw-06",
    "number": 6,
    "date": "2026-10-30",
    "prizeId": "prize-washer",
    "winnerCount": 1,
    "status": "Upcoming"
  },
  {
    "id": "draw-07",
    "number": 7,
    "date": "2026-11-15",
    "prizeId": "prize-laptop",
    "winnerCount": 1,
    "status": "Upcoming"
  },
  {
    "id": "draw-08",
    "number": 8,
    "date": "2026-11-30",
    "prizeId": "prize-tv",
    "winnerCount": 1,
    "status": "Upcoming"
  },
  {
    "id": "draw-09",
    "number": 9,
    "date": "2026-12-15",
    "prizeId": "prize-phone",
    "winnerCount": 1,
    "status": "Upcoming"
  },
  {
    "id": "draw-10",
    "number": 10,
    "date": "2026-12-30",
    "prizeId": "prize-festival",
    "winnerCount": 1,
    "status": "Upcoming"
  }
],
  participants: [
  {
    "id": "VF2026-00101",
    "name": "Aifa",
    "phone": "9745307450",
    "address": "Valanchery",
    "location": "Valanchery",
    "couponId": "C9AK01B7V7781",
    "registeredAt": "2026-09-12",
    "eligibility": "Eligible",
    "status": "Active"
  },
  {
    "id": "VF2026-00102",
    "name": "Aifa",
    "phone": "9745307450",
    "address": "Valanchery",
    "location": "Valanchery",
    "couponId": "0LGH93N157H23",
    "registeredAt": "2026-09-12",
    "eligibility": "Eligible",
    "status": "Active"
  },
  {
    "id": "VF2026-00103",
    "name": "Aifa",
    "phone": "9745307450",
    "address": "Valanchery",
    "location": "Valanchery",
    "couponId": "0D08257A51AGY",
    "registeredAt": "2026-09-12",
    "eligibility": "Eligible",
    "status": "Active"
  },
  {
    "id": "VF2026-00104",
    "name": "Aifa",
    "phone": "9745307450",
    "address": "Valanchery",
    "location": "Valanchery",
    "couponId": "TD5U8Z75Z5896",
    "registeredAt": "2026-09-12",
    "eligibility": "Eligible",
    "status": "Active"
  },
  {
    "id": "VF2026-00105",
    "name": "Aifa",
    "phone": "9745307450",
    "address": "Valanchery",
    "location": "Valanchery",
    "couponId": "F2Y1M2C550P79",
    "registeredAt": "2026-09-12",
    "eligibility": "Eligible",
    "status": "Active"
  },
  {
    "id": "VF2026-00106",
    "name": "Aifa",
    "phone": "9745307450",
    "address": "Valanchery",
    "location": "Valanchery",
    "couponId": "M0Z56153P9W0H",
    "registeredAt": "2026-09-12",
    "eligibility": "Eligible",
    "status": "Active"
  },
  {
    "id": "VF2026-00107",
    "name": "Aifa",
    "phone": "9745307458",
    "address": "Valanchery",
    "location": "Valanchery",
    "couponId": "B326Z045ZCH66",
    "registeredAt": "2026-09-12",
    "eligibility": "Eligible",
    "status": "Active"
  },
  {
    "id": "VF2026-00108",
    "name": "Aifa",
    "phone": "9745307458",
    "address": "Valanchery",
    "location": "Valanchery",
    "couponId": "7JT3N5685N3V8",
    "registeredAt": "2026-09-12",
    "eligibility": "Eligible",
    "status": "Active"
  },
  {
    "id": "VF2026-00109",
    "name": "Aifa",
    "phone": "9745307450",
    "address": "Valanchery",
    "location": "Valanchery",
    "couponId": "T92GE4D6B0839",
    "registeredAt": "2026-09-12",
    "eligibility": "Eligible",
    "status": "Active"
  },
  {
    "id": "VF2026-00110",
    "name": "Aifa",
    "phone": "9745307450",
    "address": "Valanchery",
    "location": "Valanchery",
    "couponId": "C61972V51LXF2",
    "registeredAt": "2026-09-12",
    "eligibility": "Eligible",
    "status": "Active"
  },
  {
    "id": "VF2026-00111",
    "name": "Saleel-1",
    "phone": "9947400278",
    "address": "Valanchery",
    "location": "Valanchery",
    "couponId": "898ZC8L149P1G",
    "registeredAt": "2026-09-13",
    "eligibility": "Eligible",
    "status": "Active"
  },
  {
    "id": "VF2026-00112",
    "name": "Saleel-2",
    "phone": "9947400278",
    "address": "Valanchery",
    "location": "Valanchery",
    "couponId": "5H4487L81K8TD",
    "registeredAt": "2026-09-13",
    "eligibility": "Eligible",
    "status": "Active"
  },
  {
    "id": "VF2026-00113",
    "name": "Aifa",
    "phone": "9745307450",
    "address": "Valanchery",
    "location": "Valanchery",
    "couponId": "67E0M04140BTM",
    "registeredAt": "2026-09-12",
    "eligibility": "Eligible",
    "status": "Active"
  }
],
  winners: [
  {
    "id": "win-1789317302236",
    "drawId": "draw-01",
    "participantId": "VF2026-00109",
    "prizeId": "prize-tv",
    "date": "2026-09-13",
    "status": "Confirmed"
  },
  {
    "id": "win-1789317806900",
    "drawId": "draw-02",
    "participantId": "VF2026-00106",
    "prizeId": "prize-voucher",
    "date": "2026-09-13",
    "status": "Confirmed"
  },
  {
    "id": "win-1789317911777",
    "drawId": "draw-03",
    "participantId": "VF2026-00105",
    "prizeId": "prize-laptop",
    "date": "2026-09-13",
    "status": "Confirmed"
  },
  {
    "id": "win-1789364679530",
    "drawId": "draw-04",
    "participantId": "VF2026-00107",
    "prizeId": "prize-phone",
    "date": "2026-09-14",
    "status": "Confirmed"
  },
  {
    "id": "win-1789365384645",
    "drawId": "draw-05",
    "participantId": "VF2026-00110",
    "prizeId": "prize-fridge",
    "date": "2026-09-14",
    "status": "Confirmed"
  }
],
  batches: [
  {
    "id": "BATCH-1789215940343",
    "name": "Coupons Batch (10 pcs)",
    "count": 10,
    "startId": "C9AK01B7V7781",
    "endId": "TD5U8Z75Z5896",
    "createdAt": "2026-09-12T12:25:40.343Z",
    "unusedCount": 0,
    "usedCount": 10
  },
  {
    "id": "BATCH-1789317954405",
    "name": "Coupons Batch (10000 pcs)",
    "count": 10000,
    "startId": "055EC44J28FD2",
    "endId": "6A171LT63Q4L5",
    "createdAt": "2026-09-13T16:45:54.405Z",
    "unusedCount": 10000,
    "usedCount": 0
  },
  {
    "id": "BATCH-1789351058970",
    "name": "Coupons Batch (1 pcs)",
    "count": 1,
    "startId": "42EX413K1LY30",
    "endId": "42EX413K1LY30",
    "createdAt": "2026-09-14T01:57:38.970Z",
    "unusedCount": 1,
    "usedCount": 0
  },
  {
    "id": "BATCH-1789364005865",
    "name": "Coupons Batch (10 pcs)",
    "count": 10,
    "startId": "T32DPZ34206Y8",
    "endId": "42C84Z411W6XC",
    "createdAt": "2026-09-14T05:33:25.865Z",
    "unusedCount": 10,
    "usedCount": 0
  },
  {
    "id": "BATCH-1789364055622",
    "name": "Coupons Batch (10 pcs)",
    "count": 10,
    "startId": "AN89075N4LP58",
    "endId": "130A306V5WE3P",
    "createdAt": "2026-09-14T05:34:15.622Z",
    "unusedCount": 10,
    "usedCount": 0
  },
  {
    "id": "BATCH-1789370429987",
    "name": "Coupons Batch (10000 pcs)",
    "count": 10000,
    "startId": "BPELD63264443",
    "endId": "JCYTF97588886",
    "createdAt": "2026-09-14T07:20:29.987Z",
    "unusedCount": 10000,
    "usedCount": 0
  },
  {
    "id": "BATCH-1789372062066",
    "name": "Coupons Batch (10 pcs)",
    "count": 10,
    "startId": "DUYJF54357337",
    "endId": "MZQZH88746594",
    "createdAt": "2026-09-14T07:47:42.066Z",
    "unusedCount": 10,
    "usedCount": 0
  }
],
  coupons: [],
  totalCouponsCount: 50044,
  usedCouponsCount: 13,
}

export const LOCATIONS = [
  'Valanchery',
  'Malappuram',
  'Tirur',
  'Kuttippuram',
  'Edappal',
  'Ponnani',
  'Kottakkal',
  'Perinthalmanna',
]

export const NEXT_DRAW_AT = '2026-09-15T18:00:00+05:30'
