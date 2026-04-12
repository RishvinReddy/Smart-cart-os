import { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p-001',
    name: 'Organic Whole Milk',
    price: 64.00,
    category: 'Dairy',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=400&q=80',
    rfid_uid: '04:A2:3F:77',
    weight_g: 1000,
    inStock: true,
    nutrition: {
        calories: 150,
        protein: '8g',
        carbs: '12g',
        fat: '8g'
    },
    ingredients: ['Organic Grade A Milk', 'Vitamin D3']
  },
  {
    id: 'p-002',
    name: 'Sourdough Bread',
    price: 55.00,
    category: 'Bakery',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
    rfid_uid: 'A1:2F:45:C1',
    weight_g: 500,
    inStock: true,
    nutrition: {
        calories: 180,
        protein: '6g',
        carbs: '34g',
        fat: '1g'
    },
    ingredients: ['Wheat Flour', 'Water', 'Salt', 'Natural Sourdough Starter']
  },
  {
    id: 'p-003',
    name: 'Avocados (Pack of 3)',
    price: 240.00,
    category: 'Produce',
    image: 'https://images.unsplash.com/photo-1523049673856-38866ea6c0d1?auto=format&fit=crop&w=400&q=80',
    rfid_uid: 'B2:11:9A:FF',
    weight_g: 600,
    inStock: false,
    nutrition: {
        calories: 234,
        protein: '3g',
        carbs: '12g',
        fat: '21g'
    },
    ingredients: ['100% Fresh Avocado']
  },
  {
    id: 'p-004',
    name: 'Free Range Eggs (Dozen)',
    price: 110.00,
    category: 'Dairy',
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=400&q=80',
    rfid_uid: 'C3:88:21:00',
    weight_g: 700,
    inStock: true,
    nutrition: {
        calories: 70,
        protein: '6g',
        carbs: '0g',
        fat: '5g'
    },
    ingredients: ['Fresh Grade A Eggs']
  },
  {
    id: 'p-005',
    name: 'Extra Virgin Olive Oil',
    price: 850.00,
    category: 'Pantry',
    image: 'https://images.unsplash.com/photo-1474979266404-7cadd259d300?auto=format&fit=crop&w=400&q=80',
    rfid_uid: 'D4:55:EE:11',
    weight_g: 500,
    inStock: true,
    nutrition: {
        calories: 120,
        protein: '0g',
        carbs: '0g',
        fat: '14g'
    },
    ingredients: ['Cold Pressed Olives']
  },
  {
    id: 'p-006',
    name: 'Sea Salt Chips',
    price: 40.00,
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1566478919030-26d81dd812cd?auto=format&fit=crop&w=400&q=80',
    rfid_uid: 'E5:99:AA:33',
    weight_g: 200,
    inStock: true,
    nutrition: {
        calories: 160,
        protein: '2g',
        carbs: '15g',
        fat: '10g'
    },
    ingredients: ['Potatoes', 'Sunflower Oil', 'Sea Salt']
  },
  {
    id: 'p-007',
    name: 'India Gate Basmati Rice',
    price: 185.00,
    category: 'Pantry',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80',
    rfid_uid: 'F6:11:BB:44',
    weight_g: 1000,
    inStock: true,
    nutrition: {
        calories: 350,
        protein: '8.8g',
        carbs: '78g',
        fat: '0.5g'
    },
    ingredients: ['Aged Basmati Rice']
  },
  {
    id: 'p-008',
    name: 'Amul Malai Paneer',
    price: 95.00,
    category: 'Dairy',
    image: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?auto=format&fit=crop&w=400&q=80',
    rfid_uid: 'G7:22:CC:55',
    weight_g: 200,
    inStock: true,
    nutrition: {
        calories: 289,
        protein: '18g',
        carbs: '1.2g',
        fat: '23g'
    },
    ingredients: ['Milk Solids', 'Citric Acid']
  },
  {
    id: 'p-009',
    name: 'Tata Tea Gold',
    price: 150.00,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80',
    rfid_uid: 'H8:33:DD:66',
    weight_g: 250,
    inStock: true,
    nutrition: {
        calories: 0,
        protein: '0g',
        carbs: '0g',
        fat: '0g'
    },
    ingredients: ['Black Tea', '15% Long Leaves']
  },
  {
    id: 'p-010',
    name: 'Aashirvaad Wheat Atta',
    price: 62.00,
    category: 'Pantry',
    image: 'https://images.unsplash.com/photo-1627485937980-221c88ac04f9?auto=format&fit=crop&w=400&q=80',
    rfid_uid: 'I9:44:EE:77',
    weight_g: 1000,
    inStock: true,
    nutrition: {
        calories: 364,
        protein: '12g',
        carbs: '75g',
        fat: '1.7g'
    },
    ingredients: ['Whole Wheat']
  },
  {
    id: 'p-011',
    name: 'Haldiram\'s Bhujia Sev',
    price: 55.00,
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1606443425514-9c4c74cb1160?auto=format&fit=crop&w=400&q=80',
    rfid_uid: 'J0:55:FF:88',
    weight_g: 200,
    inStock: true,
    nutrition: {
        calories: 569,
        protein: '14g',
        carbs: '42g',
        fat: '38g'
    },
    ingredients: ['Moth Bean Flour', 'Gram Flour', 'Spices', 'Vegetable Oil']
  },
  {
    id: 'p-012',
    name: 'Everest Turmeric Powder',
    price: 38.00,
    category: 'Spices',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80',
    rfid_uid: 'K1:66:00:99',
    weight_g: 100,
    inStock: true,
    nutrition: {
        calories: 354,
        protein: '8g',
        carbs: '65g',
        fat: '10g'
    },
    ingredients: ['Turmeric']
  },
  {
    id: 'p-013',
    name: 'Tata Sampann Toor Dal',
    price: 145.00,
    category: 'Pantry',
    image: 'https://images.unsplash.com/photo-1585996669866-931d86d26785?auto=format&fit=crop&w=400&q=80',
    rfid_uid: 'L2:77:11:AA',
    weight_g: 1000,
    inStock: false,
    nutrition: {
        calories: 335,
        protein: '22g',
        carbs: '58g',
        fat: '1.5g'
    },
    ingredients: ['Unpolished Toor Dal']
  },
  {
    id: 'p-014',
    name: 'Amul Pure Ghee',
    price: 275.00,
    category: 'Dairy',
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80',
    rfid_uid: 'M3:88:22:BB',
    weight_g: 500,
    inStock: true,
    nutrition: {
        calories: 814,
        protein: '0g',
        carbs: '0g',
        fat: '99.7g'
    },
    ingredients: ['Milk Fat']
  },
    {
    id: 'p-015',
    name: 'Britannia Good Day',
    price: 35.00,
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1499636138143-bd630f1cf272?auto=format&fit=crop&w=400&q=80',
    rfid_uid: 'N4:99:33:CC',
    weight_g: 150,
    inStock: true,
    nutrition: {
        calories: 480,
        protein: '7g',
        carbs: '68g',
        fat: '21g'
    },
    ingredients: ['Refined Wheat Flour', 'Sugar', 'Cashew', 'Butter']
  },
    {
    id: 'p-016',
    name: 'Maggi 2-Minute Noodles',
    price: 14.00,
    category: 'Pantry',
    image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=400&q=80',
    rfid_uid: 'O5:00:44:DD',
    weight_g: 70,
    inStock: true,
    nutrition: {
        calories: 310,
        protein: '7g',
        carbs: '44g',
        fat: '11g'
    },
    ingredients: ['Wheat Flour', 'Palm Oil', 'Salt', 'Dehydrated Vegetables']
  },
  {
    id: 'p-017',
    name: 'Amul Butter',
    price: 56.00,
    category: 'Dairy',
    image: 'https://images.unsplash.com/photo-1626139576127-1c609c1b3f7d?auto=format&fit=crop&w=400&q=80',
    rfid_uid: 'P6:22:55:EE',
    weight_g: 100,
    inStock: true,
    nutrition: {
        calories: 717,
        protein: '0.9g',
        carbs: '0.1g',
        fat: '81g'
    },
    ingredients: ['Pasteurized Butter', 'Common Salt']
  },
  {
    id: 'p-018',
    name: 'Nescafe Classic Coffee',
    price: 160.00,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=400&q=80',
    rfid_uid: 'Q7:33:66:FF',
    weight_g: 50,
    inStock: true,
    nutrition: {
        calories: 65,
        protein: '0g',
        carbs: '16g',
        fat: '0g'
    },
    ingredients: ['Coffee Beans']
  },
  {
    id: 'p-019',
    name: 'Lays Magic Masala',
    price: 20.00,
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1621447504864-d8686e12698c?auto=format&fit=crop&w=400&q=80',
    rfid_uid: 'R8:44:77:00',
    weight_g: 52,
    inStock: true,
    nutrition: {
        calories: 544,
        protein: '7g',
        carbs: '53g',
        fat: '33g'
    },
    ingredients: ['Potato', 'Edible Vegetable Oil', 'Spices & Condiments']
  },
  {
    id: 'p-020',
    name: 'Fortune Sunflower Oil',
    price: 165.00,
    category: 'Pantry',
    image: 'https://images.unsplash.com/photo-1620706857370-e1b9fb9044b9?auto=format&fit=crop&w=400&q=80',
    rfid_uid: 'S9:55:88:11',
    weight_g: 1000,
    inStock: true,
    nutrition: {
        calories: 900,
        protein: '0g',
        carbs: '0g',
        fat: '100g'
    },
    ingredients: ['Refined Sunflower Oil', 'Vitamin A', 'Vitamin D']
  },
  {
    id: 'p-021',
    name: 'Kissan Fresh Tomato Ketchup',
    price: 130.00,
    category: 'Pantry',
    image: 'https://images.unsplash.com/photo-1607301406259-dfb186e15de8?auto=format&fit=crop&w=400&q=80',
    rfid_uid: 'T0:66:99:22',
    weight_g: 950,
    inStock: true,
    nutrition: {
        calories: 147,
        protein: '1.2g',
        carbs: '36g',
        fat: '0.1g'
    },
    ingredients: ['Tomato Paste', 'Sugar', 'Salt', 'Spices']
  },
  {
    id: 'p-022',
    name: 'Cadbury Dairy Milk Silk',
    price: 175.00,
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=400&q=80',
    rfid_uid: 'U1:77:AA:33',
    weight_g: 150,
    inStock: true,
    nutrition: {
        calories: 532,
        protein: '7.8g',
        carbs: '57g',
        fat: '29g'
    },
    ingredients: ['Sugar', 'Milk Solids', 'Cocoa Butter', 'Cocoa Solids']
  },
  {
    id: 'p-023',
    name: 'MDH Garam Masala',
    price: 88.00,
    category: 'Spices',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80',
    rfid_uid: 'V2:88:BB:44',
    weight_g: 100,
    inStock: true,
    nutrition: {
        calories: 400,
        protein: '12g',
        carbs: '60g',
        fat: '12g'
    },
    ingredients: ['Coriander', 'Cumin', 'Black Pepper', 'Cardamom', 'Cinnamon', 'Cloves']
  },
  {
    id: 'p-024',
    name: 'Britannia Marie Gold',
    price: 30.00,
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=80',
    rfid_uid: 'W3:99:CC:55',
    weight_g: 250,
    inStock: true,
    nutrition: {
        calories: 450,
        protein: '8g',
        carbs: '75g',
        fat: '12g'
    },
    ingredients: ['Wheat Flour', 'Sugar', 'Vegetable Oil', 'Milk Solids']
  }
];

export const ARCHITECTURE_STEPS = [
  {
    id: 'layer1',
    title: 'Embedded Layer',
    subtitle: 'ESP32 / Arduino',
    description: 'Reads RFID tags via SPI. Maintains local product cache.',
    icon: 'Cpu',
    color: 'bg-blue-100 text-blue-700 border-blue-200'
  },
  {
    id: 'layer2',
    title: 'Edge Gateway',
    subtitle: 'Raspberry Pi',
    description: 'Aggregates data via MQTT. Handles local conflict resolution.',
    icon: 'Router',
    color: 'bg-purple-100 text-purple-700 border-purple-200'
  },
  {
    id: 'layer3',
    title: 'Cloud Backend',
    subtitle: 'Node.js / DB',
    description: 'Stores inventory, processes transactions, runs analytics.',
    icon: 'Cloud',
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200'
  }
];