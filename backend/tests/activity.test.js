const mongoose = require('mongoose');
const User = require('../src/models/User');
const Land = require('../src/models/Land');
const Comment = require('../src/models/Comment');
const Inquiry = require('../src/models/Inquiry');
const ProduceOrder = require('../src/models/ProduceOrder');
const Produce = require('../src/models/Produce');
const LandView = require('../src/models/LandView');
const redis = require('../src/services/redisClient');
const userController = require('../src/controllers/userController');
const { generateAccessToken } = require('../src/utils/jwt');

describe('DELEON ENTERPRiSES Passport - Activity & Badges', () => {
  let testUser, testLand, testProduce;
  const mockReq = {};
  const mockRes = { json: jest.fn() };
  const mockNext = jest.fn();

  beforeAll(async () => {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/DELEON ENTERPRiSES-test';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Land.deleteMany({});
    await Comment.deleteMany({});
    await Inquiry.deleteMany({});
    await ProduceOrder.deleteMany({});
    await Produce.deleteMany({});
    await LandView.deleteMany({});
    await redis.flushdb();
    // await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Land.deleteMany({});
    await Comment.deleteMany({});
    await Inquiry.deleteMany({});
    await ProduceOrder.deleteMany({});
    await Produce.deleteMany({});
    await LandView.deleteMany({});
    mockRes.json.mockClear();
    mockNext.mockClear();

    testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      passwordHash: 'hashed',
      role: 'user'
    });

    testLand = await Land.create({
      title: 'Premium Plot',
      slug: 'premium-plot',
      price: 50000,
      sizeAcres: 2
    });

    testProduce = await Produce.create({
      name: 'Organic Tomatoes',
      slug: 'organic-tomatoes',
      category: 'vegetables',
      pricePerUnit: 5
    });
  });

  test('Should aggregate activity from inquiries, comments, and orders', async () => {
    const inquiry = await Inquiry.create({ listing: testLand._id, user: testUser._id, message: 'Interested' });
    const comment = await Comment.create({
      targetType: 'land',
      targetId: testLand._id,
      author: testUser._id,
      content: 'Great location'
    });
    const order = await ProduceOrder.create({
      produce: testProduce._id,
      user: testUser._id,
      quantity: 5,
      status: 'pre-ordered'
    });

    mockReq.user = testUser;
    mockReq.app = { get: () => null };
    
    await userController.activity(mockReq, mockRes, mockNext);

    expect(mockRes.json).toHaveBeenCalled();
    const payload = mockRes.json.mock.calls[0][0];
    expect(payload.activity).toHaveLength(3);
    expect(payload.activity.some((a) => a.type === 'inquiry')).toBe(true);
    expect(payload.activity.some((a) => a.type === 'comment')).toBe(true);
    expect(payload.activity.some((a) => a.type === 'order')).toBe(true);
  });

  test('Should award "Seed Saver" badge for pre-orders', async () => {
    await ProduceOrder.create({
      produce: testProduce._id,
      user: testUser._id,
      quantity: 1,
      status: 'pre-ordered'
    });

    mockReq.user = testUser;
    mockReq.app = { get: () => null };
    
    await userController.activity(mockReq, mockRes, mockNext);

    const payload = mockRes.json.mock.calls[0][0];
    expect(payload.badges).toContain('Seed Saver');
  });

  test('Should award "Land Scout" badge for 10+ distinct land views', async () => {
    const lands = await Promise.all(
      Array.from({ length: 10 }, (_, i) =>
        Land.create({ title: `Land ${i}`, slug: `land-${i}`, price: 30000 })
      )
    );

    await Promise.all(
      lands.map((land) => LandView.create({ land: land._id, user: testUser._id }))
    );

    mockReq.user = testUser;
    mockReq.app = { get: () => null };
    
    await userController.activity(mockReq, mockRes, mockNext);

    const payload = mockRes.json.mock.calls[0][0];
    expect(payload.badges).toContain('Land Scout');
  });

  test('Should cache activity response for 5 minutes', async () => {
    await Inquiry.create({ listing: testLand._id, user: testUser._id });

    mockReq.user = testUser;
    mockReq.app = { get: () => null };
    
    await userController.activity(mockReq, mockRes, mockNext);

    const cacheKey = `user:activity:${testUser._id}`;
    const cached = await redis.get(cacheKey);
    expect(cached).toBeTruthy();

    const parsed = JSON.parse(cached);
    expect(parsed.activity).toBeDefined();
  });

  test('Should sort activity by date DESC', async () => {
    const now = new Date();
    const inquiry = await Inquiry.create({
      listing: testLand._id,
      user: testUser._id,
      createdAt: new Date(now.getTime() - 1000)
    });

    const comment = await Comment.create({
      targetType: 'land',
      targetId: testLand._id,
      author: testUser._id,
      content: 'Test',
      createdAt: now
    });

    mockReq.user = testUser;
    mockReq.app = { get: () => null };
    
    await userController.activity(mockReq, mockRes, mockNext);

    const payload = mockRes.json.mock.calls[0][0];
    expect(payload.activity[0].date >= payload.activity[1].date).toBe(true);
  });
});
