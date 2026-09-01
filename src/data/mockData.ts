import type { AppData } from '../types'

export const DEMO_STATS = {
  totalParticipants: 1248,
  totalLuckyDraws: 10,
  completedDraws: 3,
  upcomingDrawLabel: '15 Sep 2026',
  totalWinners: 3,
  totalPrizes: 10,
}

export const NEXT_DRAW_AT = '2026-09-15T18:00:00+05:30'

export const ADMIN_EMAIL = 'admin@valancheryfestival.com'
export const ADMIN_PASSWORD = 'Admin@2026'

export const PRIZE_IMAGES = {
  smartphone:
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
  tv: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=900&q=80',
  laptop:
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
  fridge:
    'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?auto=format&fit=crop&w=900&q=80',
  washer:
    'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=900&q=80',
  voucher:
    'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=900&q=80',
  festival:
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=900&q=80',
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
      status: 'Awarded',
    },
    {
      id: 'prize-laptop',
      name: 'Laptop',
      description: 'Premium laptop for work, study and celebration.',
      value: '₹58,000',
      image: PRIZE_IMAGES.laptop,
      assignedDrawId: 'draw-03',
      status: 'Awarded',
    },
    {
      id: 'prize-voucher',
      name: 'Gift Voucher',
      description: 'Festival shopping voucher valid at partner stores.',
      value: '₹10,000',
      image: PRIZE_IMAGES.voucher,
      assignedDrawId: 'draw-02',
      status: 'Awarded',
    },
    {
      id: 'prize-phone',
      name: 'Smartphone',
      description: 'Flagship smartphone — the next lucky draw prize.',
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
    { id: 'draw-01', number: 1, date: '2026-08-15', prizeId: 'prize-tv', winnerCount: 1, status: 'Completed' },
    { id: 'draw-02', number: 2, date: '2026-08-30', prizeId: 'prize-voucher', winnerCount: 1, status: 'Completed' },
    { id: 'draw-03', number: 3, date: '2026-09-01', prizeId: 'prize-laptop', winnerCount: 1, status: 'Completed' },
    { id: 'draw-04', number: 4, date: '2026-09-15', prizeId: 'prize-phone', winnerCount: 1, status: 'Upcoming' },
    { id: 'draw-05', number: 5, date: '2026-09-30', prizeId: 'prize-fridge', winnerCount: 1, status: 'Upcoming' },
    { id: 'draw-06', number: 6, date: '2026-10-15', prizeId: 'prize-washer', winnerCount: 1, status: 'Upcoming' },
    { id: 'draw-07', number: 7, date: '2026-10-30', prizeId: 'prize-laptop', winnerCount: 1, status: 'Upcoming' },
    { id: 'draw-08', number: 8, date: '2026-11-15', prizeId: 'prize-tv', winnerCount: 1, status: 'Upcoming' },
    { id: 'draw-09', number: 9, date: '2026-11-30', prizeId: 'prize-phone', winnerCount: 1, status: 'Upcoming' },
    { id: 'draw-10', number: 10, date: '2026-12-15', prizeId: 'prize-festival', winnerCount: 1, status: 'Upcoming' },
  ],
  participants: [
    { id: 'VF2026-00101', name: 'Muhammed Saleel', phone: '9876543210', address: 'Near Town Juma Masjid, Main Road', location: 'Valanchery', registeredAt: '2026-06-12', eligibility: 'Eligible', status: 'Active' },
    { id: 'VF2026-00102', name: 'Aisha Rahman', phone: '9745123489', address: 'Rahman Manzil, Kottakkal Road', location: 'Malappuram', registeredAt: '2026-06-14', eligibility: 'Eligible', status: 'Active' },
    { id: 'VF2026-00103', name: 'Fathima Nihala', phone: '9895012345', address: 'House No. 12, Railway Station Road', location: 'Tirur', registeredAt: '2026-06-18', eligibility: 'Eligible', status: 'Active' },
    { id: 'VF2026-00104', name: 'Abdul Kareem', phone: '9847123456', address: 'Kareem Stores, Market Junction', location: 'Valanchery', registeredAt: '2026-06-20', eligibility: 'Eligible', status: 'Active' },
    { id: 'VF2026-00105', name: 'Sneha Krishnan', phone: '9995432109', address: 'Krishna Nivas, Temple Road', location: 'Kuttippuram', registeredAt: '2026-06-22', eligibility: 'Eligible', status: 'Active' },
    { id: 'VF2026-00106', name: 'Mohammed Irshad', phone: '8089123456', address: 'Irshad Villa, Bypass', location: 'Edappal', registeredAt: '2026-06-25', eligibility: 'Eligible', status: 'Active' },
    { id: 'VF2026-00107', name: 'Diya Fathima', phone: '9567123401', address: 'Fathima Cottage, College Road', location: 'Ponnani', registeredAt: '2026-07-01', eligibility: 'Eligible', status: 'Active' },
    { id: 'VF2026-00108', name: 'Vishnu Prasad', phone: '9447123890', address: 'Prasad House, NH 66', location: 'Kottakkal', registeredAt: '2026-07-04', eligibility: 'Eligible', status: 'Active' },
    { id: 'VF2026-00109', name: 'Shahana Sherin', phone: '8129345670', address: 'Sherin Mahal, Mini Bypass', location: 'Valanchery', registeredAt: '2026-07-08', eligibility: 'Eligible', status: 'Active' },
    { id: 'VF2026-00110', name: 'Nabeel Rahman', phone: '9746011122', address: 'Rahman Quarters, Bus Stand', location: 'Perinthalmanna', registeredAt: '2026-07-11', eligibility: 'Eligible', status: 'Active' },
    { id: 'VF2026-00111', name: 'Priya Nair', phone: '9895765432', address: 'Nair Bhavan, School Lane', location: 'Malappuram', registeredAt: '2026-07-15', eligibility: 'Eligible', status: 'Active' },
    { id: 'VF2026-00112', name: 'Hashim Ali', phone: '8606123456', address: 'Ali House, Post Office Road', location: 'Valanchery', registeredAt: '2026-07-18', eligibility: 'Eligible', status: 'Active' },
    { id: 'VF2026-00113', name: 'Amna Beevi', phone: '7012345678', address: 'Beevi Manzil, Mosque Lane', location: 'Tirur', registeredAt: '2026-07-22', eligibility: 'Eligible', status: 'Active' },
    { id: 'VF2026-00114', name: 'Arjun Menon', phone: '9388123456', address: 'Menon House, Stadium Road', location: 'Kuttippuram', registeredAt: '2026-07-26', eligibility: 'Eligible', status: 'Active' },
    { id: 'VF2026-00115', name: 'Zainab KP', phone: '8134567890', address: 'KP House, Market Road', location: 'Edappal', registeredAt: '2026-08-02', eligibility: 'Eligible', status: 'Active' },
    { id: 'VF2026-00116', name: 'Ravi Chandran', phone: '9846009988', address: 'Chandran Nivas, Panchayat Road', location: 'Ponnani', registeredAt: '2026-08-06', eligibility: 'Ineligible', status: 'Inactive' },
    { id: 'VF2026-00117', name: 'Hiba Fathima', phone: '9744123789', address: 'Fathima Villa, New Bypass', location: 'Valanchery', registeredAt: '2026-08-10', eligibility: 'Eligible', status: 'Active' },
    { id: 'VF2026-00118', name: 'Sameer Banu', phone: '8089786543', address: 'Banu Residency, Civil Station', location: 'Malappuram', registeredAt: '2026-08-14', eligibility: 'Eligible', status: 'Active' },
    { id: 'VF2026-00119', name: 'Anwar Hussain', phone: '9995678123', address: 'Hussain House, Clock Tower', location: 'Kottakkal', registeredAt: '2026-08-18', eligibility: 'Eligible', status: 'Active' },
    { id: 'VF2026-00120', name: 'Rishana P', phone: '9567890123', address: 'P House, Hospital Junction', location: 'Perinthalmanna', registeredAt: '2026-08-22', eligibility: 'Eligible', status: 'Active' },
    { id: 'VF2026-00121', name: 'Farhan Musthafa', phone: '9895123890', address: 'Farhan Villa, South Bazar', location: 'Valanchery', registeredAt: '2026-08-23', eligibility: 'Eligible', status: 'Active' },
    { id: 'VF2026-00122', name: 'Jasna Fathima', phone: '9744567890', address: 'Green Valley, Chemmad Road', location: 'Malappuram', registeredAt: '2026-08-24', eligibility: 'Eligible', status: 'Active' },
    { id: 'VF2026-00123', name: 'Midhun Raj', phone: '9446781234', address: 'Raj Nivas, Beach Road', location: 'Ponnani', registeredAt: '2026-08-24', eligibility: 'Eligible', status: 'Active' },
    { id: 'VF2026-00124', name: 'Shafi Kolathur', phone: '9895345612', address: 'Kolathur House, Main Road', location: 'Valanchery', registeredAt: '2026-08-25', eligibility: 'Eligible', status: 'Active' },
    { id: 'VF2026-00125', name: 'Ananya Varma', phone: '9995123478', address: 'Varma Palace, Temple Gate', location: 'Kottakkal', registeredAt: '2026-08-25', eligibility: 'Eligible', status: 'Active' },
    { id: 'VF2026-00126', name: 'Aslam Cherukara', phone: '8089456123', address: 'Cherukara House, Railway Station Road', location: 'Tirur', registeredAt: '2026-08-26', eligibility: 'Eligible', status: 'Active' },
    { id: 'VF2026-00127', name: 'Safiya Beegum', phone: '9567451289', address: 'Beegum Villa, Bypass', location: 'Perinthalmanna', registeredAt: '2026-08-26', eligibility: 'Eligible', status: 'Active' },
    { id: 'VF2026-00128', name: 'Rahul Nambiar', phone: '9745789012', address: 'Nambiar Gardens, College Junction', location: 'Edappal', registeredAt: '2026-08-27', eligibility: 'Eligible', status: 'Active' },
    { id: 'VF2026-00129', name: 'Thasneem Banu', phone: '9847678123', address: 'Banu Cottage, Town Hall Road', location: 'Kuttippuram', registeredAt: '2026-08-27', eligibility: 'Eligible', status: 'Active' },
    { id: 'VF2026-00130', name: 'Haris Karingapara', phone: '8606789012', address: 'Karingapara Manzil, Mini Stadium Road', location: 'Valanchery', registeredAt: '2026-08-28', eligibility: 'Eligible', status: 'Active' },
    { id: 'VF2026-00131', name: 'Gopika Suresh', phone: '9388456712', address: 'Suresh Nivas, River View Road', location: 'Kuttippuram', registeredAt: '2026-08-28', eligibility: 'Eligible', status: 'Active' },
    { id: 'VF2026-00132', name: 'Mansoor Ahammed', phone: '7012890123', address: 'Ahammed Villa, Jubilee Road', location: 'Perinthalmanna', registeredAt: '2026-08-29', eligibility: 'Eligible', status: 'Active' },
    { id: 'VF2026-00133', name: 'Razeena Parveen', phone: '8134123456', address: 'Parveen Manzil, Chanthappadi', location: 'Ponnani', registeredAt: '2026-08-29', eligibility: 'Eligible', status: 'Active' },
    { id: 'VF2026-00134', name: 'Sreejith Panicker', phone: '9846234567', address: 'Panicker Madam, Ayurveda College Road', location: 'Kottakkal', registeredAt: '2026-08-30', eligibility: 'Eligible', status: 'Active' },
    { id: 'VF2026-00135', name: 'Dilsha Dilshad', phone: '9744890123', address: 'Dilshad House, Court Road', location: 'Tirur', registeredAt: '2026-08-30', eligibility: 'Eligible', status: 'Active' },
    { id: 'VF2026-00136', name: 'Faisal Babu', phone: '9895890123', address: 'Babu Residency, High School Road', location: 'Edappal', registeredAt: '2026-08-31', eligibility: 'Eligible', status: 'Active' },
    { id: 'VF2026-00137', name: 'Sharafudheen KV', phone: '8089234567', address: 'KV Manzil, Kozhikode Road', location: 'Valanchery', registeredAt: '2026-08-31', eligibility: 'Eligible', status: 'Active' },
    { id: 'VF2026-00138', name: 'Meera Namboodiri', phone: '9995890123', address: 'Namboodiri Illam, Fort Road', location: 'Malappuram', registeredAt: '2026-09-01', eligibility: 'Eligible', status: 'Active' },
    { id: 'VF2026-00139', name: 'Basil Noufal', phone: '9567234567', address: 'Noufal Cottage, Bus Stand Lane', location: 'Tirur', registeredAt: '2026-09-01', eligibility: 'Eligible', status: 'Active' },
    { id: 'VF2026-00140', name: 'Anshad Moideen', phone: '9745234567', address: 'Moideen Villa, Market Road', location: 'Valanchery', registeredAt: '2026-09-01', eligibility: 'Eligible', status: 'Active' },
  ],
  winners: [
    { id: 'win-01', drawId: 'draw-01', participantId: 'VF2026-00101', prizeId: 'prize-tv', date: '2026-08-15', status: 'Confirmed' },
    { id: 'win-02', drawId: 'draw-02', participantId: 'VF2026-00102', prizeId: 'prize-voucher', date: '2026-08-30', status: 'Confirmed' },
    { id: 'win-03', drawId: 'draw-03', participantId: 'VF2026-00111', prizeId: 'prize-laptop', date: '2026-09-01', status: 'Confirmed' },
  ],
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
