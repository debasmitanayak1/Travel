import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Connecting to database...');
  await prisma.$connect();
  console.log('Connected! Clearing existing records...');
  await prisma.wishlist.deleteMany();
  await prisma.contactSubmission.deleteMany();
  await prisma.transportOption.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.attraction.deleteMany();
  await prisma.destinationImage.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.package.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.guideArticle.deleteMany();
  await prisma.user.deleteMany();

  console.log('Creating demo users...');
  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash('Admin@12345', salt);
  const userPasswordHash = await bcrypt.hash('Traveler@12345', salt);

  const admin = await prisma.user.create({
    data: {
      name: 'Elena Rostova (Admin)',
      email: 'admin@travelexplore.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      isVerified: true,
    },
  });

  const traveler = await prisma.user.create({
    data: {
      name: 'Alex Morgan',
      email: 'traveler@example.com',
      passwordHash: userPasswordHash,
      role: 'USER',
      isVerified: true,
    },
  });

  console.log('Seeding destinations & sub-entities...');

  // 1. BALI
  const bali = await prisma.destination.create({
    data: {
      name: 'Bali',
      slug: 'bali',
      country: 'Indonesia',
      continent: 'Asia',
      tagline: 'Island of the Gods, Emerald Terraces & Serene Oceans',
      description:
        'Bali is a living postcard where volcanic peaks meet turquoise reefs, tranquil jungle retreats, and centuries-old Hindu temple rituals. Whether finding tranquility in Ubud or world-class surfing along Uluwatu cliffs, Bali delivers quintessential tropical magic.',
      bestTimeToVisit: 'April to October (Dry season)',
      avgBudgetMin: 800,
      avgBudgetMax: 2200,
      currency: 'USD',
      latitude: -8.3405,
      longitude: 115.092,
      isPublished: true,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1400&q=80',
            altText: 'Uluwatu Cliff temple overlooking ocean at sunset',
          },
          {
            url: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80',
            altText: 'Lush green Tegalalang rice terraces in Ubud',
          },
          {
            url: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=1200&q=80',
            altText: 'Traditional Balinese temple gateway against blue sky',
          },
        ],
      },
      attractions: {
        create: [
          {
            name: 'Tanah Lot Temple',
            description: 'Iconic ancient rock formation home to a sea pilgrimage temple with breathtaking sunsets.',
            category: 'culture',
            imageUrl: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&w=800&q=80',
          },
          {
            name: 'Tegalalang Rice Terraces',
            description: 'Dramatic tiered emerald paddies carved into hillside ravines, iconic for photography and morning walks.',
            category: 'nature',
            imageUrl: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
          },
          {
            name: 'Sacred Monkey Forest Sanctuary',
            description: 'Protected jungle sanctuary in Ubud teeming with hundreds of Balinese long-tailed macaques and banyan trees.',
            category: 'nature',
            imageUrl: 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?auto=format&fit=crop&w=800&q=80',
          },
        ],
      },
      hotels: {
        create: [
          {
            name: 'Kamandalu Ubud Resort',
            description: 'Luxury villa sanctuary nestled amongst rolling green hills with private infinity pools.',
            starRating: 5,
            pricePerNight: 280,
            currency: 'USD',
            imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
            amenities: JSON.stringify(['Infinity Pool', 'Forest Spa', 'Free Breakfast', 'Airport Shuttle', 'Yoga Pavilion']),
          },
          {
            name: 'The Sun & Surf Stay Bingin',
            description: 'Charming beachfront boutique stay located directly on white sands with panoramic surf views.',
            starRating: 4,
            pricePerNight: 95,
            currency: 'USD',
            imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
            amenities: JSON.stringify(['Beach Access', 'Oceanfront Dining', 'High-Speed Wi-Fi', 'Board Rental']),
          },
        ],
      },
      restaurants: {
        create: [
          {
            name: 'Locavore NXT Ubud',
            cuisine: 'Modern Hyper-Local Indonesian',
            priceRange: '$$$',
            imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
          },
          {
            name: 'Warung Babi Guling Ibu Oka',
            cuisine: 'Traditional Balinese Roasted Pork & Spices',
            priceRange: '$',
            imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
          },
        ],
      },
      transportOptions: {
        create: [
          {
            type: 'Scooter / Motorbike Rental',
            description: 'Most popular and flexible way to explore island roads and hidden beaches.',
            estCost: 7,
            currency: 'USD',
          },
          {
            type: 'Private Driver (Full Day)',
            description: 'Air-conditioned chauffeured SUV for sightseeing trips across temples and waterfalls.',
            estCost: 45,
            currency: 'USD',
          },
          {
            type: 'Ride-Hailing (Grab / Gojek)',
            description: 'Readily available in Seminyak, Canggu, Kuta, and central Ubud.',
            estCost: 15,
            currency: 'USD',
          },
        ],
      },
    },
  });

  // 2. PARIS
  const paris = await prisma.destination.create({
    data: {
      name: 'Paris',
      slug: 'paris',
      country: 'France',
      continent: 'Europe',
      tagline: 'The City of Light, Haute Couture & Timeless Romance',
      description:
        'Paris captivates with grand neoclassical boulevards, world-class art institutions, bistro-lined cobblestones, and the iconic iron silhouette of the Eiffel Tower soaring over the Seine river.',
      bestTimeToVisit: 'May to September',
      avgBudgetMin: 1400,
      avgBudgetMax: 3800,
      currency: 'USD',
      latitude: 48.8566,
      longitude: 2.3522,
      isPublished: true,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1400&q=80',
            altText: 'Eiffel Tower viewed from Pont de Bir-Hakeim at twilight',
          },
          {
            url: 'https://images.unsplash.com/photo-1509299349698-dd22323b5963?auto=format&fit=crop&w=1200&q=80',
            altText: 'Charming Parisian street and traditional sidewalk café',
          },
          {
            url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80',
            altText: 'Louvre Pyramid illuminated against dusk sky',
          },
        ],
      },
      attractions: {
        create: [
          {
            name: 'The Louvre Museum',
            description: 'The world’s largest art museum holding Leonardo’s Mona Lisa and the Winged Victory.',
            category: 'culture',
            imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80',
          },
          {
            name: 'Eiffel Tower',
            description: 'Gustave Eiffel’s celebrated masterpiece offering 360-degree vistas across all 20 arrondissements.',
            category: 'landmark',
            imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80',
          },
          {
            name: 'Montmartre & Sacré-Cœur',
            description: 'Bohemian hilltop quarter known for street portrait artists, winding alleys, and white basilica.',
            category: 'culture',
            imageUrl: 'https://images.unsplash.com/photo-1520939817895-060bdef4ad1b?auto=format&fit=crop&w=800&q=80',
          },
        ],
      },
      hotels: {
        create: [
          {
            name: 'Hôtel Le Marais Chic',
            description: 'Designer boutique hotel with historic timber beams and courtyard cocktail lounge.',
            starRating: 4,
            pricePerNight: 240,
            currency: 'USD',
            imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
            amenities: JSON.stringify(['Free High-Speed Wi-Fi', 'Courtyard Bar', 'Concierge Service', 'Air Conditioning']),
          },
          {
            name: 'Shangri-La Paris',
            description: 'Historic palace hotel overlooking the Eiffel Tower with Michelin-starred dining.',
            starRating: 5,
            pricePerNight: 950,
            currency: 'USD',
            imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
            amenities: JSON.stringify(['Eiffel View Balconies', 'Indoor Pool', 'Michelin Restaurant', 'Luxury Spa']),
          },
        ],
      },
      restaurants: {
        create: [
          {
            name: 'Le Comptoir du Relais',
            cuisine: 'Classic French Neo-Bistro',
            priceRange: '$$',
            imageUrl: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
          },
          {
            name: 'Septime',
            cuisine: 'Contemporary Farm-to-Table Gastronomy',
            priceRange: '$$$',
            imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
          },
        ],
      },
      transportOptions: {
        create: [
          {
            type: 'Paris Métro & RER Network',
            description: 'Efficient and extensive subway grid covering every neighborhood.',
            estCost: 3,
            currency: 'USD',
          },
          {
            type: 'Navigo Easy Pass (Weekly)',
            description: 'Unlimited subway, bus, and tram travel across zones 1-5.',
            estCost: 35,
            currency: 'USD',
          },
          {
            type: 'Vélib’ Shared Bike System',
            description: 'Docked electric and mechanical bicycles on every major corner.',
            estCost: 6,
            currency: 'USD',
          },
        ],
      },
    },
  });

  // 3. KYOTO
  const kyoto = await prisma.destination.create({
    data: {
      name: 'Kyoto',
      slug: 'kyoto',
      country: 'Japan',
      continent: 'Asia',
      tagline: 'Imperial Heritage, Zen Gardens & Vermilion Torii Shrines',
      description:
        'The historic cultural capital of Japan, Kyoto boasts over 2,000 preserved temples, tranquil rock gardens, historic geisha districts in Gion, and ethereal bamboo groves.',
      bestTimeToVisit: 'March to May (Cherry Blossoms) & October to November (Autumn foliage)',
      avgBudgetMin: 1100,
      avgBudgetMax: 2900,
      currency: 'USD',
      latitude: 35.0116,
      longitude: 135.7681,
      isPublished: true,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1400&q=80',
            altText: 'Thousands of red torii gates winding through Fushimi Inari mountain',
          },
          {
            url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
            altText: 'Traditional wooden Pagoda overlooking Gion quarter at dusk',
          },
          {
            url: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1200&q=80',
            altText: 'Serene Arashiyama Bamboo Grove pathway',
          },
        ],
      },
      attractions: {
        create: [
          {
            name: 'Fushimi Inari Shrine',
            description: 'Famous mountain path lined with 10,000 vivid vermilion torii gates dedicated to the god of rice.',
            category: 'culture',
            imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
          },
          {
            name: 'Kinkaku-ji (Golden Pavilion)',
            description: 'Zen Buddhist temple covered in gold leaf overlooking a pristine reflection pond.',
            category: 'culture',
            imageUrl: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=800&q=80',
          },
          {
            name: 'Arashiyama Bamboo Forest',
            description: 'Towering stalks of bamboo creating a whispering acoustic wonder recognized as one of Japan’s 100 Soundscapes.',
            category: 'nature',
            imageUrl: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=800&q=80',
          },
        ],
      },
      hotels: {
        create: [
          {
            name: 'Sowaka Ryokan Gion',
            description: 'Refined traditional ryokan luxury blending tatami mats with modern minimalist Japanese aesthetics.',
            starRating: 5,
            pricePerNight: 420,
            currency: 'USD',
            imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
            amenities: JSON.stringify(['Private Onsen Bath', 'Kaiseki Dinner Included', 'Zen Garden Views', 'Matcha Tea Ceremony']),
          },
          {
            name: 'The Pocket Hotel Kyoto Shijo Karasuma',
            description: 'Ultra-clean, modern Japanese micro-hotel in central Kyoto with smart digital room controls.',
            starRating: 3,
            pricePerNight: 75,
            currency: 'USD',
            imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
            amenities: JSON.stringify(['Fast Wi-Fi', 'Lounge Cafe', 'Luggage Storage', 'Subway Proximity']),
          },
        ],
      },
      restaurants: {
        create: [
          {
            name: 'Gion Karyo Kaiseki',
            cuisine: 'Multi-course Seasonal Kaiseki',
            priceRange: '$$$$',
            imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
          },
          {
            name: 'Menbaka Fire Ramen',
            cuisine: 'Flambéed Green Onion Broth Ramen',
            priceRange: '$',
            imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
          },
        ],
      },
      transportOptions: {
        create: [
          {
            type: 'Kyoto City Bus Pass',
            description: 'Convenient hop-on, hop-off network connecting all major temple compounds.',
            estCost: 6,
            currency: 'USD',
          },
          {
            type: 'Shinkansen Bullet Train (from Tokyo)',
            description: 'High-speed 2-hour 15-min connection on the Tokaido line.',
            estCost: 110,
            currency: 'USD',
          },
          {
            type: 'Rental Bicycle',
            description: 'Kyoto is famously flat and one of the best cycling cities in Asia.',
            estCost: 10,
            currency: 'USD',
          },
        ],
      },
    },
  });

  // 4. SWISS ALPS
  const swissAlps = await prisma.destination.create({
    data: {
      name: 'Swiss Alps (Zermatt)',
      slug: 'swiss-alps',
      country: 'Switzerland',
      continent: 'Europe',
      tagline: 'Glacial Splendor, Alpine Meadows & the Majestic Matterhorn',
      description:
        'Car-free Zermatt sits beneath the pyramid-like peak of the Matterhorn. In winter it is a premier ski resort; in summer, an alpine hiking wonderland with crystal lakes and wildflowers.',
      bestTimeToVisit: 'December to April (Skiing) & July to September (Alpine Hiking)',
      avgBudgetMin: 1800,
      avgBudgetMax: 4500,
      currency: 'USD',
      latitude: 45.9765,
      longitude: 7.7491,
      isPublished: true,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1400&q=80',
            altText: 'The Matterhorn reflected in tranquil alpine lake water at sunrise',
          },
          {
            url: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1200&q=80',
            altText: 'Snow covered peaks of the Swiss Alps with cable cars in distance',
          },
          {
            url: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=1200&q=80',
            altText: 'Charming Swiss wooden chalet village nestled in valley',
          },
        ],
      },
      attractions: {
        create: [
          {
            name: 'Gornergrat Cogwheel Railway',
            description: 'Historic open-air cog railway climbing to 3,089m with views of 29 four-thousand-meter peaks.',
            category: 'adventure',
            imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
          },
          {
            name: 'Matterhorn Glacier Paradise',
            description: 'Highest cable car station in Europe at 3,883m featuring year-round snow and glacier ice palace.',
            category: 'nature',
            imageUrl: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=800&q=80',
          },
          {
            name: 'Five Lakes Walk (5-Seenweg)',
            description: 'Scenic hiking trail reflecting the Matterhorn in three distinct alpine lakes.',
            category: 'nature',
            imageUrl: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=800&q=80',
          },
        ],
      },
      hotels: {
        create: [
          {
            name: 'The Omnia Mountain Lodge',
            description: 'Contemporary mountain lodge perched on a rock 45 meters above Zermatt with indoor/outdoor thermal pool.',
            starRating: 5,
            pricePerNight: 550,
            currency: 'USD',
            imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
            amenities: JSON.stringify(['Heated Alpine Pool', 'Matterhorn View Spa', 'Michelin Star Chef', 'Ski-in Ski-out Shuttle']),
          },
          {
            name: 'Hotel Matterhorn Focus Design',
            description: 'Sleek timber and glass hotel situated right by the Klein Matterhorn valley station.',
            starRating: 4,
            pricePerNight: 290,
            currency: 'USD',
            imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
            amenities: JSON.stringify(['Wellness Spa', 'Panoramic Terrace', 'Free Breakfast', 'Ski Storage']),
          },
        ],
      },
      restaurants: {
        create: [
          {
            name: 'Chez Vrony Findeln',
            cuisine: 'Artisanal Organic Alpine & Swiss Fondue',
            priceRange: '$$$',
            imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
          },
          {
            name: 'Whymper-Stube',
            cuisine: 'Authentic Swiss Raclette & Rösti',
            priceRange: '$$',
            imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
          },
        ],
      },
      transportOptions: {
        create: [
          {
            type: 'Matterhorn Gotthard Bahn Train',
            description: 'Scenic cogwheel train access into car-free Zermatt village from Täsch.',
            estCost: 18,
            currency: 'USD',
          },
          {
            type: 'Swiss Travel Pass (3-Day)',
            description: 'All-inclusive pass for trains, boats, buses, and 50% discount on mountain railways.',
            estCost: 260,
            currency: 'USD',
          },
        ],
      },
    },
  });

  // 5. SANTORINI
  const santorini = await prisma.destination.create({
    data: {
      name: 'Santorini',
      slug: 'santorini',
      country: 'Greece',
      continent: 'Europe',
      tagline: 'Sun-drenched Caldera Cliffs, Cobalt Domes & Aegean Sunsets',
      description:
        'Crescent-shaped Santorini is the jewel of the Cyclades. Perched atop dramatic volcanic cliffs, whitewashed villages cascade toward the deep sapphire Aegean sea.',
      bestTimeToVisit: 'May to October',
      avgBudgetMin: 1200,
      avgBudgetMax: 3400,
      currency: 'USD',
      latitude: 36.3932,
      longitude: 25.4615,
      isPublished: true,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1400&q=80',
            altText: 'Blue domed church overlooking Oia caldera at golden hour',
          },
          {
            url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
            altText: 'Whitewashed cliffside villas with private infinity plunge pools',
          },
        ],
      },
      attractions: {
        create: [
          {
            name: 'Oia Sunset Point',
            description: 'The world-famous promontory where thousands gather daily to applaud the incandescent golden sunset.',
            category: 'landmark',
            imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
          },
          {
            name: 'Red Beach (Akrotiri)',
            description: 'Stunning volcanic red lava cliffs framing cobalt waters and black pebbled sands.',
            category: 'nature',
            imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
          },
        ],
      },
      hotels: {
        create: [
          {
            name: 'Canaves Oia Suites',
            description: 'Luxury cave-style suites carved into the caldera cliff edge with private plunge pools.',
            starRating: 5,
            pricePerNight: 680,
            currency: 'USD',
            imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
            amenities: JSON.stringify(['Private Plunge Pool', 'Caldera View Champagne Bar', 'Complimentary Breakfast', 'Butler Service']),
          },
        ],
      },
      restaurants: {
        create: [
          {
            name: 'Ammoudi Fish Tavern',
            cuisine: 'Fresh Catch Seafood & Greek Mezze by the Water',
            priceRange: '$$$',
            imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
          },
        ],
      },
      transportOptions: {
        create: [
          {
            type: 'ATV / Quad Bike Rental',
            description: 'The preferred adventurous way to explore Santorini’s beaches and wineries.',
            estCost: 35,
            currency: 'USD',
          },
          {
            type: 'KTEL Island Bus Network',
            description: 'Budget-friendly air-conditioned buses connecting Fira to all villages.',
            estCost: 3,
            currency: 'USD',
          },
        ],
      },
    },
  });

  // 6. CAPE TOWN
  const capeTown = await prisma.destination.create({
    data: {
      name: 'Cape Town',
      slug: 'cape-town',
      country: 'South Africa',
      continent: 'Africa',
      tagline: 'Where Ocean Meets Table Mountain, Vineyards & Coastal Drama',
      description:
        'Framed by flat-topped Table Mountain and two oceans, Cape Town pairs cosmopolitan urban energy with world-renowned wine valleys, penguin colonies, and dramatic surf beaches.',
      bestTimeToVisit: 'November to April (Warm Southern Hemisphere summer)',
      avgBudgetMin: 900,
      avgBudgetMax: 2600,
      currency: 'USD',
      latitude: -33.9249,
      longitude: 18.4241,
      isPublished: true,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1400&q=80',
            altText: 'Panoramic aerial view of Table Mountain and Cape Town coastline',
          },
          {
            url: 'https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?auto=format&fit=crop&w=1200&q=80',
            altText: 'Boulders Beach African penguin colony on granite boulders',
          },
        ],
      },
      attractions: {
        create: [
          {
            name: 'Table Mountain Aerial Cableway',
            description: 'Rotating cable car offering 360-degree vistas as it ascends to the 1,086m summit plateau.',
            category: 'adventure',
            imageUrl: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80',
          },
          {
            name: 'Boulders Beach Penguin Colony',
            description: 'Protected cove in Simon’s Town home to thousands of endangered African penguins.',
            category: 'nature',
            imageUrl: 'https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?auto=format&fit=crop&w=800&q=80',
          },
        ],
      },
      hotels: {
        create: [
          {
            name: 'The Silo Hotel V&A Waterfront',
            description: 'Modern luxury icon built in the historic grain silo above Zeitz MOCAA with pillowed glass windows.',
            starRating: 5,
            pricePerNight: 720,
            currency: 'USD',
            imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
            amenities: JSON.stringify(['Rooftop Pool Bar', 'Art Museum Access', 'Spa', 'Panoramic Ocean Views']),
          },
        ],
      },
      restaurants: {
        create: [
          {
            name: 'FYN Restaurant',
            cuisine: 'Contemporary African & Japanese Fusion',
            priceRange: '$$$$',
            imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
          },
        ],
      },
      transportOptions: {
        create: [
          {
            type: 'Uber Cape Town',
            description: 'Affordable, reliable, and widely used across all central districts and coastal Atlantic seaboard.',
            estCost: 10,
            currency: 'USD',
          },
          {
            type: 'Rental Car (Chapman’s Peak Drive)',
            description: 'Best choice for exploring Cape Point and Stellenbosch Winelands at your own pace.',
            estCost: 28,
            currency: 'USD',
          },
        ],
      },
    },
  });

  // 7. BANFF
  const banff = await prisma.destination.create({
    data: {
      name: 'Banff National Park',
      slug: 'banff',
      country: 'Canada',
      continent: 'North America',
      tagline: 'Turquoise Glacial Lakes, Rugged Rockies & Pristine Wilderness',
      description:
        'Located in the heart of the Canadian Rockies, Banff dazzles with neon-turquoise waters of Lake Louise and Moraine Lake, soaring jagged peaks, and encounters with elk and grizzly bears.',
      bestTimeToVisit: 'June to August (Lakes & Hiking) & December to March (Skiing)',
      avgBudgetMin: 1000,
      avgBudgetMax: 2800,
      currency: 'USD',
      latitude: 51.1784,
      longitude: -115.5708,
      isPublished: true,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1400&q=80',
            altText: 'Moraine Lake valley of the ten peaks turquoise water in morning light',
          },
          {
            url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
            altText: 'Spectacular snow-capped Canadian Rocky mountains under starlit sky',
          },
        ],
      },
      attractions: {
        create: [
          {
            name: 'Moraine Lake & Valley of the Ten Peaks',
            description: 'World-renowned glacially fed lake with vivid surreal blue waters surrounded by sheer cliffs.',
            category: 'nature',
            imageUrl: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=800&q=80',
          },
          {
            name: 'Banff Gondola & Sulphur Mountain',
            description: '8-minute gondola ride to the summit offering an all-encompassing view of 6 mountain ranges.',
            category: 'adventure',
            imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
          },
        ],
      },
      hotels: {
        create: [
          {
            name: 'Fairmont Chateau Lake Louise',
            description: 'Heritage castle resort situated directly on the shoreline of Lake Louise overlooking Victoria Glacier.',
            starRating: 5,
            pricePerNight: 510,
            currency: 'USD',
            imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
            amenities: JSON.stringify(['Lakeside Dining', 'Canoe Rentals', 'Heated Indoor Pool', 'Ski Shuttle', 'Guided Hikes']),
          },
        ],
      },
      restaurants: {
        create: [
          {
            name: 'The Bison Restaurant & Lounge',
            cuisine: 'Farm-to-Table Canadian Game & Regional Fare',
            priceRange: '$$$',
            imageUrl: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
          },
        ],
      },
      transportOptions: {
        create: [
          {
            type: 'Parks Canada Roam Transit',
            description: 'Eco-friendly hybrid bus connecting Banff townsite, Canmore, and Lake Louise.',
            estCost: 10,
            currency: 'USD',
          },
        ],
      },
    },
  });

  // 8. ROME
  const rome = await prisma.destination.create({
    data: {
      name: 'Rome',
      slug: 'rome',
      country: 'Italy',
      continent: 'Europe',
      tagline: 'The Eternal City of Gladiators, Piazzas & Handmade Pasta',
      description:
        'Rome is an open-air museum where ancient marble columns stand alongside bustling espresso bars, Renaissance fountains, and world-renowned culinary trattorias.',
      bestTimeToVisit: 'April to June & September to October',
      avgBudgetMin: 950,
      avgBudgetMax: 2700,
      currency: 'USD',
      latitude: 41.9028,
      longitude: 12.4964,
      isPublished: true,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1400&q=80',
            altText: 'Colosseum bathed in afternoon sun with stone pines in foreground',
          },
          {
            url: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=1200&q=80',
            altText: 'Trevi Fountain illuminated beautifully under twilight blue sky',
          },
        ],
      },
      attractions: {
        create: [
          {
            name: 'The Colosseum & Roman Forum',
            description: 'The monumental amphitheater of gladiators and the political beating heart of ancient Rome.',
            category: 'landmark',
            imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
          },
          {
            name: 'Trevi Fountain',
            description: 'Baroque masterpiece where coin tosses promise your return to the Eternal City.',
            category: 'landmark',
            imageUrl: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=800&q=80',
          },
        ],
      },
      hotels: {
        create: [
          {
            name: 'Hotel Artemide Rome',
            description: 'Modern 4-star boutique hotel on Via Nazionale featuring an exquisite rooftop panoramic restaurant.',
            starRating: 4,
            pricePerNight: 210,
            currency: 'USD',
            imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
            amenities: JSON.stringify(['Rooftop Terrace', 'Artemis Spa', 'Complimentary Minibar', 'Free Wi-Fi']),
          },
        ],
      },
      restaurants: {
        create: [
          {
            name: 'Trattoria Da Enzo al 29',
            cuisine: 'Authentic Roman Carbonara, Cacio e Pepe & Artichokes',
            priceRange: '$$',
            imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
          },
        ],
      },
      transportOptions: {
        create: [
          {
            type: 'Rome Metro & ATAC Bus Ticket',
            description: '100-minute integrated transit ticket valid across metro lines A & B, buses, and trams.',
            estCost: 2,
            currency: 'USD',
          },
        ],
      },
    },
  });

  // User wishlist seeding
  await prisma.wishlist.create({
    data: {
      userId: traveler.id,
      destinationId: bali.id,
    },
  });
  await prisma.wishlist.create({
    data: {
      userId: traveler.id,
      destinationId: kyoto.id,
    },
  });

  console.log('Seeding curated tour packages...');
  await prisma.package.create({
    data: {
      title: 'Bali Island Sanctuary & Cultural Escape',
      slug: 'bali-sanctuary-ubud-culture',
      summary: '7 unforgettable days exploring emerald rice terraces, cliffside ocean temples, waterfalls, and yoga in Ubud.',
      durationDays: 7,
      priceMin: 950,
      priceMax: 1650,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
      itinerary: JSON.stringify([
        { day: 1, title: 'Arrival & Seminyak Sunset', detail: 'Private airport pickup, check-in, welcome drink, and dinner by the beach.' },
        { day: 2, title: 'Ubud Rice Terraces & Swing', detail: 'Morning at Tegalalang Rice Terraces followed by the Monkey Forest sanctuary.' },
        { day: 3, title: 'Waterfalls & Sacred Water Temple', detail: 'Tegenungan Waterfall and purification ritual at Tirta Empul.' },
        { day: 4, title: 'Mount Batur Sunrise Trek', detail: 'Early morning hike for sunrise breakfast over volcanic crater lake.' },
        { day: 5, title: 'Uluwatu Cliffs & Kecak Dance', detail: 'Afternoon surf watching at Padang Padang and fire dance at Uluwatu Temple.' },
        { day: 6, title: 'Nusa Penida Island Day Trip', detail: 'Speedboat to Kelingking T-Rex cliff and snorkeling with manta rays.' },
        { day: 7, title: 'Spa Recovery & Farewell', detail: 'Traditional Balinese floral bath spa session and airport departure transfer.' },
      ]),
      isPublished: true,
    },
  });

  await prisma.package.create({
    data: {
      title: 'Grand European Romance: Paris & Rome',
      slug: 'paris-rome-grand-tour',
      summary: '10 days combining the haute cuisine and art of Paris with the ancient gladiators and piazzas of Rome.',
      durationDays: 10,
      priceMin: 2200,
      priceMax: 3600,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
      itinerary: JSON.stringify([
        { day: 1, title: 'Welcome to Paris', detail: 'Arrival, private transfer to boutique hotel in Le Marais, Seine evening dinner cruise.' },
        { day: 2, title: 'Louvre & Historic Boulevards', detail: 'Skip-the-line guided masterpiece tour of the Louvre and stroll down Champs-Élysées.' },
        { day: 3, title: 'Montmartre Artists & Sacré-Cœur', detail: 'Morning croissant tasting, portrait artists of Place du Tertre, evening Moulin Rouge.' },
        { day: 4, title: 'Versailles Palace Royal Day Trip', detail: 'Hall of Mirrors and royal gardens exploration by bicycle.' },
        { day: 5, title: 'Flight to Rome, The Eternal City', detail: 'Morning flight to Rome, hotel check-in, sunset stroll around Piazza Navona.' },
        { day: 6, title: 'Gladiators of the Colosseum', detail: 'Exclusive arena floor access to the Colosseum and the Roman Forum ruins.' },
        { day: 7, title: 'Vatican Museums & Sistine Chapel', detail: 'Michelangelo frescoes, St. Peter’s Basilica, and Trastevere food walk.' },
        { day: 8, title: 'Pantheon & Trevi Wishes', detail: 'Throw coins in the Trevi Fountain, sample artisanal gelato, and shop Via Condotti.' },
        { day: 9, title: 'Roman Countryside & Castelli Romani', detail: 'Wine tasting in Frascati overlooking Roman hills and olive groves.' },
        { day: 10, title: 'Arrivederci Roma', detail: 'Espresso morning at Campo de’ Fiori and private transfer to Fiumicino Airport.' },
      ]),
      isPublished: true,
    },
  });

  await prisma.package.create({
    data: {
      title: 'Kyoto & Tokyo: Ancient Tradition to Neon Metropolis',
      slug: 'kyoto-tokyo-heritage-trail',
      summary: '8 days navigating Zen gardens, geisha alleys, Shinkansen bullet trains, and hyper-modern Tokyo nightlife.',
      durationDays: 8,
      priceMin: 1850,
      priceMax: 3100,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
      itinerary: JSON.stringify([
        { day: 1, title: 'Arrival in Kyoto', detail: 'Check-in at traditional ryokan and relaxing onsen hot spring soak.' },
        { day: 2, title: '10,000 Gates of Fushimi Inari', detail: 'Sunrise hike up the mountain path and traditional tea ceremony.' },
        { day: 3, title: 'Arashiyama Bamboo & Golden Pavilion', detail: 'Walking the whispering bamboo forest and viewing Kinkaku-ji.' },
        { day: 4, title: 'Shinkansen Bullet Train to Tokyo', detail: '300 km/h bullet train journey past Mount Fuji to Shibuya.' },
        { day: 5, title: 'Tokyo Neon & Modern Art', detail: 'Shibuya Crossing, teamLab Planets digital art museum, and Akihabara.' },
        { day: 6, title: 'Tsukiji Outer Market & Asakusa', detail: 'Fresh sashimi breakfast and Senso-ji, Tokyo’s oldest temple.' },
        { day: 7, title: 'Mount Fuji Day Excursion', detail: 'Lake Kawaguchiko scenic views and traditional village stroll.' },
        { day: 8, title: 'Farewell Japan', detail: 'Souvenir shopping in Ginza and Narita/Haneda express departure.' },
      ]),
      isPublished: true,
    },
  });

  console.log('Seeding activities catalog...');
  await prisma.activity.createMany({
    data: [
      {
        name: 'Mount Batur Sunrise Volcanic Trek',
        category: 'adventure',
        description: 'Guided 2-hour pre-dawn trek to the summit of active Mount Batur with eggs cooked in volcanic steam.',
        durationHrs: 6.0,
        difficulty: 'moderate',
        imageUrl: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
        destinationId: bali.id,
      },
      {
        name: 'Traditional Balinese Cooking & Market Tour',
        category: 'food',
        description: 'Visit Ubud morning spice market and learn authentic sambal, satay, and curry recipes with a master chef.',
        durationHrs: 4.5,
        difficulty: 'easy',
        imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        destinationId: bali.id,
      },
      {
        name: 'Louvre Masterpieces Guided Skip-The-Line Tour',
        category: 'culture',
        description: 'Expert art historian walkthrough covering the Mona Lisa, Venus de Milo, and French Crown Jewels.',
        durationHrs: 3.0,
        difficulty: 'easy',
        imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80',
        destinationId: paris.id,
      },
      {
        name: 'Authentic Kyoto Tea Ceremony & Kimono Experience',
        category: 'culture',
        description: 'Dress in formal silk kimono and practice the mindful art of chado (tea preparation) in a 200-year-old machiya.',
        durationHrs: 2.5,
        difficulty: 'easy',
        imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
        destinationId: kyoto.id,
      },
      {
        name: 'Santorini Caldera Sunset Catamaran Cruise',
        category: 'relaxation',
        description: 'Sail to volcanic hot springs, Red Beach, and White Beach with Greek BBQ and unlimited local white wine.',
        durationHrs: 5.0,
        difficulty: 'easy',
        imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
        destinationId: santorini.id,
      },
      {
        name: 'Zermatt Matterhorn Glacier Ice Hiking',
        category: 'adventure',
        description: 'Equip crampons and harnesses to traverse ancient blue crevasse corridors with certified mountain guides.',
        durationHrs: 5.5,
        difficulty: 'challenging',
        imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
        destinationId: swissAlps.id,
      },
    ],
  });

  console.log('Seeding travel guide articles...');
  await prisma.guideArticle.createMany({
    data: [
      {
        slug: 'ultimate-packing-checklist-international-travel-2026',
        title: 'The Ultimate Packing Checklist for International Travel in 2026',
        category: 'packing',
        coverImage: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=1200&q=80',
        content: `### Pack Lighter, Travel Farther

Traveling across continents requires a strategic balance between readiness and mobility. Whether you are backpacking through Southeast Asia or taking trains across Europe, here is our battle-tested packing blueprint.

#### 1. The Capsule Wardrobe Philosophy
Stick to a coherent color scheme (neutrals like navy, gray, black, and olive) so that every top matches every bottom:
- **3-4 Merino wool or moisture-wicking tees:** Resists odor naturally and dries overnight.
- **1 Lightweight waterproof shell jacket:** Gore-Tex or DWR finish for sudden mountain or tropical downpours.
- **1 Pair of versatile walking shoes:** Break them in at least 3 weeks before your flight.
- **1 Dressier outfit:** Suitable for upscale European dining or temple visits requiring covered shoulders/knees.

#### 2. Essential Tech & Power
- Universal travel adapter with USB-C PD fast charging.
- 10,000mAh to 20,000mAh airline-approved portable power bank.
- Offline maps downloaded in Google Maps or Maps.me.
- Digital copies of your passport and travel insurance saved in encrypted cloud storage.

#### 3. Health & First Aid
Always pack basic oral rehydration salts, antihistamines, broad-spectrum sunscreen, and any prescription medications with doctor documentation.`,
        isPublished: true,
      },
      {
        slug: 'navigating-schengen-etias-visa-guide',
        title: 'Navigating European Travel & ETIAS: Everything You Need to Know',
        category: 'visa',
        coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
        content: `### Understanding Europe's New Border System

For decades, travelers from visa-exempt nations enjoyed seamless travel into the 29 countries comprising the European Schengen Area. Here is what is changing and how to ensure your paperwork is spotless.

#### What is ETIAS?
ETIAS stands for the **European Travel Information and Authorisation System**. It is an automated electronic travel pre-screening authorization designed to improve security, similar to the US ESTA.

#### Key Facts:
1. **Validity:** Once granted, your ETIAS authorization is valid for 3 consecutive years (or until your passport expires).
2. **Stay Allowance:** Allows stays up to **90 days within any 180-day rolling window**.
3. **Application Process:** Fully online, usually taking less than 15 minutes with instant approval for 95% of applicants.

> Tip: Always ensure your passport has at least 6 months of validity remaining beyond your intended departure date from Europe!`,
        isPublished: true,
      },
      {
        slug: 'solo-travelers-safety-playbook',
        title: 'Solo Traveler’s Safety Playbook: Smart Habits on the Road',
        category: 'safety',
        coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
        content: `### Freedom With Confidence

Solo travel is one of the most transformative experiences anyone can undertake. Here is our master playbook for staying secure without sacrificing spontaneity.

- **Share Live Location:** Keep a close family member or trusted friend looped in on WhatsApp or Apple Find My.
- **Split Your Financials:** Never carry all cards and cash in one pocket. Keep an emergency debit card locked in your hotel safe.
- **Confidence Over Politeness:** If an interaction or alley feels uncomfortable, leave immediately. Trust your gut instincts.
- **Local Emergency Numbers:** Program local police, medical, and tourist assistance lines into your phone before landing.`,
        isPublished: true,
      },
    ],
  });

  console.log('Seeding sample contact submissions...');
  await prisma.contactSubmission.createMany({
    data: [
      {
        name: 'Sarah Jenkins',
        email: 'sarah.j@example.com',
        subject: 'Custom Family Package for Swiss Alps',
        message: 'Hi team! We are a family of 4 planning a 10-day trip to Zermatt in July. Would love guidance on kid-friendly hikes and mountain rail passes.',
        isRead: false,
      },
      {
        name: 'David Chen',
        email: 'dchen@example.org',
        subject: 'Inquiry regarding Bali Photography Tour',
        message: 'Hello, are there licensed drone photography guidelines we need to be aware of for Uluwatu and Tanah Lot temples? Thanks!',
        isRead: true,
      },
    ],
  });

  console.log('✅ Database seeded successfully with 8 destinations, hotels, activities, packages, and guide articles!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
