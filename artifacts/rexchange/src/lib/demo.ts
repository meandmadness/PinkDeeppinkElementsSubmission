export type ListingType = 'item' | 'skill';
export type ExchangeMode = 'Sell' | 'Exchange' | 'Give away' | 'Request';

export type Listing = {
  id: string;
  type: ListingType;
  title: string;
  description: string;
  category: string;
  condition: string;
  price: number;
  exchangeMode: ExchangeMode;
  campus: string;
  deliveryMode: string;
  ownerName: string;
  ownerAvatar: string;
  requestedCount: number;
  createdDate: string;
  favorited?: boolean;
};

export type DemoUser = {
  name: string;
  email: string;
  registrationNumber: string;
  verified: boolean;
};

export const categories = ['All', 'Textbooks', 'Electronics', 'Hostel', 'Cycles', 'Fashion', 'Skills'];

export const seedListings: Listing[] = [
  {
    id: 'rx-101',
    type: 'item',
    title: 'Signals & Systems — 5th edition',
    description: 'Clean copy with a few highlighted examples. Perfect for ECE semester prep.',
    category: 'Textbooks',
    condition: 'Good',
    price: 320,
    exchangeMode: 'Sell',
    campus: 'Kattankulathur',
    deliveryMode: 'Meet at Java Green',
    ownerName: 'Ishita Rao',
    ownerAvatar: 'IR',
    requestedCount: 4,
    createdDate: '2025-02-18',
  },
  {
    id: 'rx-102',
    type: 'item',
    title: 'IKEA desk lamp, warm white',
    description: 'Moving out sale. Three brightness levels, barely used, includes the original box.',
    category: 'Hostel',
    condition: 'Like new',
    price: 650,
    exchangeMode: 'Sell',
    campus: 'Kattankulathur',
    deliveryMode: 'Hostel lobby',
    ownerName: 'Rohan Krishnan',
    ownerAvatar: 'RK',
    requestedCount: 7,
    createdDate: '2025-02-17',
  },
  {
    id: 'rx-103',
    type: 'skill',
    title: 'Portfolio review for design internships',
    description: 'I have reviewed 40+ student portfolios. Get a direct, practical 30-minute critique.',
    category: 'Skills',
    condition: 'Peer-led',
    price: 0,
    exchangeMode: 'Give away',
    campus: 'Online / KTR',
    deliveryMode: 'Video call',
    ownerName: 'Nivedita S',
    ownerAvatar: 'NS',
    requestedCount: 12,
    createdDate: '2025-02-16',
  },
  {
    id: 'rx-104',
    type: 'item',
    title: 'Hybrid cycle, 7-speed',
    description: 'Recently serviced and ready for campus rides. Helmet included with the exchange.',
    category: 'Cycles',
    condition: 'Good',
    price: 4800,
    exchangeMode: 'Exchange',
    campus: 'Kattankulathur',
    deliveryMode: 'Main gate',
    ownerName: 'Arjun Balan',
    ownerAvatar: 'AB',
    requestedCount: 3,
    createdDate: '2025-02-15',
  },
  {
    id: 'rx-105',
    type: 'item',
    title: 'Mechanical keyboard — Keychron K2',
    description: 'Brown switches, compact layout, and one extra set of keycaps. No shine on keys.',
    category: 'Electronics',
    condition: 'Like new',
    price: 5200,
    exchangeMode: 'Sell',
    campus: 'Ramapuram',
    deliveryMode: 'Library foyer',
    ownerName: 'Dev Shah',
    ownerAvatar: 'DS',
    requestedCount: 9,
    createdDate: '2025-02-14',
  },
  {
    id: 'rx-106',
    type: 'item',
    title: 'Formal blazer for placement season',
    description: 'Navy two-button blazer, size M. Worn twice, freshly dry-cleaned.',
    category: 'Fashion',
    condition: 'Like new',
    price: 1100,
    exchangeMode: 'Give away',
    campus: 'Kattankulathur',
    deliveryMode: 'Hostel lobby',
    ownerName: 'Meera Prakash',
    ownerAvatar: 'MP',
    requestedCount: 6,
    createdDate: '2025-02-13',
  },
  {
    id: 'rx-107',
    type: 'skill',
    title: 'Python debugging, no judgement',
    description: 'Stuck on a lab or personal project? Bring the error, we will find the signal together.',
    category: 'Skills',
    condition: 'Peer-led',
    price: 0,
    exchangeMode: 'Exchange',
    campus: 'Kattankulathur',
    deliveryMode: 'Tech Park café',
    ownerName: 'Kabir Nair',
    ownerAvatar: 'KN',
    requestedCount: 5,
    createdDate: '2025-02-12',
  },
  {
    id: 'rx-108',
    type: 'item',
    title: 'Mini fridge for hostel room',
    description: 'Small 45L fridge with a quiet compressor. Ideal for the last stretch of the semester.',
    category: 'Hostel',
    condition: 'Good',
    price: 3500,
    exchangeMode: 'Request',
    campus: 'Kattankulathur',
    deliveryMode: 'Block N lobby',
    ownerName: 'Varun J',
    ownerAvatar: 'VJ',
    requestedCount: 2,
    createdDate: '2025-02-11',
  },
];

export const readStore = <T,>(key: string, fallback: T): T => {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const writeStore = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Local-first demo continues to work for restricted browser storage.
  }
};
