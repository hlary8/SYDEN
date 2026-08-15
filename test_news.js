const axios = require('axios');

const BASE_URL = 'http://localhost:4000/api/v1';

async function test() {
  try {
    console.log('Login...');
    const login = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@syden.com',
      password: 'AdminPass123!'
    });
    const token = login.data.accessToken;
    console.log('✓ Logged in\n');
    
    console.log('Fetching admin articles...');
    const res = await axios.get(`${BASE_URL}/news/admin/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✓ Found ${res.data.articles.length} articles`);
    console.log(res.data.articles.slice(0, 2).map(a => ({ title: a.title, published: a.isPublished })));
    
  } catch (e) {
    console.error('Error:', e.response?.status, e.response?.data?.message || e.message);
  }
}

test();
