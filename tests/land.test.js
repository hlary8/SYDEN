const mongoose = require('mongoose');
const User = require('../src/models/User');
const Land = require('../src/models/Land');
const LandView = require('../src/models/LandView');
const landController = require('../src/controllers/landController');
const { generateAccessToken } = require('../src/utils/jwt');

describe('DELEON ENTERPRiSES - Land Listings with View Tracking', () => {
  let testUser, testLand;

  beforeAll(async () => {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/DELEON ENTERPRiSES-test';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Land.deleteMany({});
    await LandView.deleteMany({});
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Land.deleteMany({});
    await LandView.deleteMany({});

    testUser = await User.create({
      username: 'landlover',
      email: 'land@example.com',
      passwordHash: 'hashed',
      role: 'user'
    });

    testLand = await Land.create({
      title: 'Scenic Valley Estate',
      slug: 'scenic-valley-estate',
      price: 100000,
      sizeAcres: 5,
      status: 'available'
    });
  });

  test('Should get land by slug', async () => {
    const mockRes = { json: jest.fn() };
    const mockReq = {
      params: { slug: testLand.slug },
      headers: {}
    };

    await landController.getBySlug(mockReq, mockRes, jest.fn());

    expect(mockRes.json).toHaveBeenCalled();
    const { data } = mockRes.json.mock.calls[0][0];
    expect(data.slug).toBe(testLand.slug);
  });

  test('Should track view when authenticated user views land', async () => {
    const accessToken = generateAccessToken({ userId: testUser._id, role: testUser.role });

    const mockRes = { json: jest.fn() };
    const mockReq = {
      params: { slug: testLand.slug },
      headers: { authorization: `Bearer ${accessToken}` }
    };

    await landController.getBySlug(mockReq, mockRes, jest.fn());

    const view = await LandView.findOne({ land: testLand._id, user: testUser._id });
    expect(view).toBeTruthy();
  });

  test('Should not fail if view tracking fails', async () => {
    const invalidToken = 'Bearer invalid.token.here';
    const mockRes = { json: jest.fn() };
    const mockReq = {
      params: { slug: testLand.slug },
      headers: { authorization: invalidToken }
    };

    await landController.getBySlug(mockReq, mockRes, jest.fn());

    expect(mockRes.json).toHaveBeenCalled();
  });

  test('Should list lands with pagination', async () => {
    const mockRes = { json: jest.fn() };
    const mockReq = { query: { page: 1, limit: 12 } };

    await landController.list(mockReq, mockRes, jest.fn());

    expect(mockRes.json).toHaveBeenCalled();
    const { data } = mockRes.json.mock.calls[0][0];
    expect(Array.isArray(data)).toBe(true);
  });
});
