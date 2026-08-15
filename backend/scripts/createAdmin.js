const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config({ path: require('path').resolve(__dirname, '../../.env') });

const User = require('../src/models/User');

async function main() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI not set');
    process.exit(1);
  }
  await mongoose.connect(uri, { maxPoolSize: 5 });
  console.log('Connected to MongoDB');

  const email = 'e@gmail.com';
  const password = 'strongpass';
  const username = 'adminuser';

  const hashed = await bcrypt.hash(password, 12);

  const existing = await User.findOne({ email });
  if (existing) {
    existing.passwordHash = hashed;
    existing.role = 'admin';
    existing.username = existing.username || username;
    await existing.save();
    console.log('Updated existing user to admin:', existing.email);
  } else {
    const user = await User.create({ username, email, passwordHash: hashed, role: 'admin' });
    console.log('Created admin user:', user.email);
  }

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
