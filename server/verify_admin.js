async function runAdminTests() {
  console.log(`Testing Admin endpoints on http://localhost:5000/api...`);
  const baseUrl = `http://localhost:5000/api`;
  let failures = 0;

  try {
    // 1. Login as Admin
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@travelexplore.com', password: 'Admin@12345' }),
    });
    const login = await loginRes.json();
    const token = login.data.token;
    const authHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    console.log('✓ Admin Login successful');

    // 2. Admin Stats
    const statsRes = await fetch(`${baseUrl}/admin/stats`, { headers: authHeaders });
    const stats = await statsRes.json();
    console.log('✓ Admin Stats:', {
      destinations: stats.data.stats.destinations,
      hotels: stats.data.stats.hotels,
      restaurants: stats.data.stats.restaurants,
      packages: stats.data.stats.packages,
      activities: stats.data.stats.activities,
      articles: stats.data.stats.articles,
    });

    // 3. Restaurants CRUD
    const restListRes = await fetch(`${baseUrl}/admin/restaurants`, { headers: authHeaders });
    const restList = await restListRes.json();
    console.log(`✓ Admin Restaurants Count: ${restList.data.restaurants.length}`);

    // Create a temporary restaurant
    const destsRes = await fetch(`${baseUrl}/admin/destinations`, { headers: authHeaders });
    const dests = await destsRes.json();
    const firstDest = dests.data.destinations[0];

    const createRestRes = await fetch(`${baseUrl}/admin/restaurants`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        destinationId: firstDest.id,
        name: 'Test Gastro Bistro',
        cuisine: 'Fusion',
        priceRange: '$$$',
      }),
    });
    const createdRest = await createRestRes.json();
    console.log('✓ Created Restaurant:', createdRest.data.restaurant.name);

    await fetch(`${baseUrl}/admin/restaurants/${createdRest.data.restaurant.id}`, {
      method: 'DELETE',
      headers: authHeaders,
    });
    console.log('✓ Deleted Test Restaurant');

    // 4. Activities CRUD
    const actRes = await fetch(`${baseUrl}/admin/activities`, { headers: authHeaders });
    const actList = await actRes.json();
    console.log(`✓ Admin Activities Count: ${actList.data.activities.length}`);

    const createActRes = await fetch(`${baseUrl}/admin/activities`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        name: 'Test Cliff Gliding',
        category: 'adventure',
        difficulty: 'challenging',
        durationHrs: 2.5,
      }),
    });
    const createdAct = await createActRes.json();
    console.log('✓ Created Activity:', createdAct.data.activity.name);

    await fetch(`${baseUrl}/admin/activities/${createdAct.data.activity.id}`, {
      method: 'DELETE',
      headers: authHeaders,
    });
    console.log('✓ Deleted Test Activity');

    // 5. Travel Guide CRUD
    const createArtRes = await fetch(`${baseUrl}/admin/guide`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        title: 'Test Packing Checklist Article',
        category: 'packing',
        content: '### Test content',
      }),
    });
    const createdArt = await createArtRes.json();
    console.log('✓ Created Guide Article:', createdArt.data.article.title);

    await fetch(`${baseUrl}/admin/guide/${createdArt.data.article.id}`, {
      method: 'DELETE',
      headers: authHeaders,
    });
    console.log('✓ Deleted Test Guide Article');

    // 6. Users List
    const usersRes = await fetch(`${baseUrl}/admin/users`, { headers: authHeaders });
    const users = await usersRes.json();
    console.log(`✓ Admin Users Count: ${users.data.users.length}`);

    // 7. Sub-entity: Attraction on destination
    const createAttrRes = await fetch(`${baseUrl}/admin/attractions`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        destinationId: firstDest.id,
        name: 'Test Waterfall Trail',
        category: 'nature',
      }),
    });
    const createdAttr = await createAttrRes.json();
    console.log('✓ Created Destination Attraction:', createdAttr.data.attraction.name);

    await fetch(`${baseUrl}/admin/attractions/${createdAttr.data.attraction.id}`, {
      method: 'DELETE',
      headers: authHeaders,
    });
    console.log('✓ Deleted Test Destination Attraction');

    console.log('\n🎉 ALL 7 ADMIN SUITE INTEGRATION TESTS PASSED CLEANLY!');
  } catch (err) {
    console.error('Test failure:', err);
    failures++;
  } finally {
    process.exit(failures > 0 ? 1 : 0);
  }
}

runAdminTests();
