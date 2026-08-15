const mongoose = require('mongoose');
const User = require('../src/models/User');
const Produce = require('../src/models/Produce');
const ProduceOrder = require('../src/models/ProduceOrder');
const produceController = require('../src/controllers/produceController');

describe('DeeFresh - Produce Orders', () => {
  let testUser, testProduce;

  beforeAll(async () => {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/DELEON ENTERPRiSES-test';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Produce.deleteMany({});
    await ProduceOrder.deleteMany({});
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Produce.deleteMany({});
    await ProduceOrder.deleteMany({});

    testUser = await User.create({
      username: 'farmer123',
      email: 'farmer@example.com',
      passwordHash: 'hashed',
      role: 'farmer'
    });

    testProduce = await Produce.create({
      name: 'Fresh Strawberries',
      slug: 'fresh-strawberries',
      category: 'fruits',
      pricePerUnit: 8,
      unit: 'kg',
      availability: 'in-season'
    });
  });

  test('Should list produce items', async () => {
    const mockRes = { json: jest.fn() };
    const mockReq = { query: { page: 1, limit: 12 } };

    await produceController.list(mockReq, mockRes, jest.fn());

    expect(mockRes.json).toHaveBeenCalled();
    const { data } = mockRes.json.mock.calls[0][0];
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  test('Should get produce by slug', async () => {
    const mockRes = { json: jest.fn() };
    const mockReq = { params: { slug: testProduce.slug } };

    await produceController.getBySlug(mockReq, mockRes, jest.fn());

    expect(mockRes.json).toHaveBeenCalled();
    const { data } = mockRes.json.mock.calls[0][0];
    expect(data.slug).toBe(testProduce.slug);
  });

  test('Should create a produce pre-order', async () => {
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const mockReq = {
      user: testUser,
      params: { slug: testProduce.slug },
      body: { quantity: 5, unit: 'kg' }
    };

    await produceController.createOrder(mockReq, mockRes, jest.fn());

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalled();

    const order = await ProduceOrder.findOne({ user: testUser._id });
    expect(order).toBeTruthy();
    expect(order.quantity).toBe(5);
    expect(order.status).toBe('pre-ordered');
  });

  test('Should list user orders', async () => {
    await ProduceOrder.create({
      produce: testProduce._id,
      user: testUser._id,
      quantity: 10,
      status: 'pre-ordered'
    });

    const mockRes = { json: jest.fn() };
    const mockReq = { user: testUser };

    await produceController.listOrders(mockReq, mockRes, jest.fn());

    expect(mockRes.json).toHaveBeenCalled();
    const { data } = mockRes.json.mock.calls[0][0];
    expect(data).toHaveLength(1);
    expect(data[0].quantity).toBe(10);
  });

  test('Should reject invalid quantity', async () => {
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const mockNext = jest.fn();
    const mockReq = {
      user: testUser,
      params: { slug: testProduce.slug },
      body: { quantity: 0 }
    };

    await produceController.createOrder(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockNext.mock.calls[0][0].status).toBe(400);
  });
});
