import type { AppData } from '../types'

export const ADMIN_EMAIL = 'admin@valancheryfestival.com'
export const ADMIN_PASSWORD = 'Admin@2026'

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
      id: 'prize-tv',
      name: 'Smart TV',
      description: '55-inch 4K smart television for the festival home.',
      value: '₹42,000',
      image: PRIZE_IMAGES.tv,
      assignedDrawId: 'draw-01',
      status: 'Assigned',
    },
    {
      id: 'prize-voucher',
      name: 'Gift Voucher',
      description: 'Festival shopping voucher valid at partner stores.',
      value: '₹10,000',
      image: PRIZE_IMAGES.voucher,
      assignedDrawId: 'draw-02',
      status: 'Assigned',
    },
    {
      id: 'prize-laptop',
      name: 'Laptop',
      description: 'Premium laptop for work, study and celebration.',
      value: '₹58,000',
      image: PRIZE_IMAGES.laptop,
      assignedDrawId: 'draw-03',
      status: 'Assigned',
    },
    {
      id: 'prize-phone',
      name: 'Smartphone',
      description: 'Flagship smartphone — the upcoming lucky draw prize.',
      value: '₹35,000',
      image: PRIZE_IMAGES.smartphone,
      assignedDrawId: 'draw-04',
      status: 'Assigned',
    },
    {
      id: 'prize-fridge',
      name: 'Refrigerator',
      description: 'Double-door inverter refrigerator for the family.',
      value: '₹32,000',
      image: PRIZE_IMAGES.fridge,
      assignedDrawId: 'draw-05',
      status: 'Assigned',
    },
    {
      id: 'prize-washer',
      name: 'Washing Machine',
      description: 'Fully automatic front-load washing machine.',
      value: '₹28,000',
      image: PRIZE_IMAGES.washer,
      assignedDrawId: 'draw-06',
      status: 'Assigned',
    },
    {
      id: 'prize-festival',
      name: 'Special Festival Prize',
      description: 'Grand festival hamper with gold-accented gifts.',
      value: '₹75,000',
      image: PRIZE_IMAGES.festival,
      assignedDrawId: 'draw-10',
      status: 'Assigned',
    },
  ],
  draws: [
    { id: 'draw-01', number: 1, date: '2026-08-15', prizeId: 'prize-tv', winnerCount: 1, status: 'Upcoming' },
    { id: 'draw-02', number: 2, date: '2026-08-30', prizeId: 'prize-voucher', winnerCount: 1, status: 'Upcoming' },
    { id: 'draw-03', number: 3, date: '2026-09-15', prizeId: 'prize-laptop', winnerCount: 1, status: 'Upcoming' },
    { id: 'draw-04', number: 4, date: '2026-09-30', prizeId: 'prize-phone', winnerCount: 1, status: 'Upcoming' },
    { id: 'draw-05', number: 5, date: '2026-10-15', prizeId: 'prize-fridge', winnerCount: 1, status: 'Upcoming' },
    { id: 'draw-06', number: 6, date: '2026-10-30', prizeId: 'prize-washer', winnerCount: 1, status: 'Upcoming' },
    { id: 'draw-07', number: 7, date: '2026-11-15', prizeId: 'prize-laptop', winnerCount: 1, status: 'Upcoming' },
    { id: 'draw-08', number: 8, date: '2026-11-30', prizeId: 'prize-tv', winnerCount: 1, status: 'Upcoming' },
    { id: 'draw-09', number: 9, date: '2026-12-15', prizeId: 'prize-phone', winnerCount: 1, status: 'Upcoming' },
    { id: 'draw-10', number: 10, date: '2026-12-30', prizeId: 'prize-festival', winnerCount: 1, status: 'Upcoming' },
  ],
  participants: [],
  winners: [],
  batches: [],
  coupons: [],
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
