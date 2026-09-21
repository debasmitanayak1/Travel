async function runTests() {
  const baseUrl = `http://localhost:5000/api`;
  let failures = 0;

  try {
    // 1. Health check
    const healthRes = await fetch(`${baseUrl}/health`);
    const health = await healthRes.json();
    console.log('✓ Health Check:', health.status);

    // 2. Destinations list
    const destsRes = await fetch(`${baseUrl}/destinations`);
    const dests = await destsRes.json();
    console.log(`✓ Destinations Count: ${dests.data.destinations.length}`);

    // 3. Destination Detail
    const baliRes = await fetch(`${baseUrl}/destinations/bali`);
    const bali = await baliRes.json();
    console.log(`✓ Bali Details: ${bali.data.destination.name}, Attractions: ${bali.data.destination.attractions.length}, Hotels: ${bali.data.destination.hotels.length}`);

    // 4. Weather API
    const weatherRes = await fetch(`${baseUrl}/weather/bali`);
    const weather = await weatherRes.json();
    console.log(`✓ Weather Bali: ${weather.data.weather.temperatureC}°C, ${weather.data.weather.condition}`);

    // 5. Auth Login
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@travelexplore.com', password: 'Admin@12345' }),
    });
    const login = await loginRes.json();
    console.log(`✓ Admin Login: ${login.data.user.name} (${login.data.user.role})`);
    const token = login.data.token;

    // 6. Admin Stats
    const statsRes = await fetch(`${baseUrl}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const stats = await statsRes.json();
    console.log(`✓ Admin Stats:`, stats.data.stats);

    // 7. Tour Packages
    const pkgsRes = await fetch(`${baseUrl}/packages`);
    const pkgs = await pkgsRes.json();
    console.log(`✓ Packages Count: ${pkgs.data.packages.length}`);

    console.log('\n🎉 ALL 7 BACKEND API INTEGRATION TESTS PASSED!');
  } catch (err) {
    console.error('Test failure:', err);
    failures++;
  } finally {
    process.exit(failures > 0 ? 1 : 0);
  }
}

runTests();
