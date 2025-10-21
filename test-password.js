const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/userModel');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB)
  .then(() => console.log('DB connection successful!'))
  .catch(err => console.error('DB connection error:', err));

const testPassword = async () => {
  try {
    // Test with a known password
    const testPassword = 'test1234';
    const hashedPassword = '$2a$12$w6T3hcoY93TZim6qSNPH0eYG0FeDoO0HvEztgO/qZ8kkrOYXG20g6'; // test1@example.com's hash

    console.log('Testing password verification...');
    console.log('Password to test:', testPassword);
    console.log('Hashed password:', hashedPassword);

    const isMatch = await bcrypt.compare(testPassword, hashedPassword);
    console.log('Password match:', isMatch);

    // Check if user exists in database
    const user = await User.findOne({ email: 'test1@example.com' }).select('+password');
    if (user) {
      console.log('User found in database:', user.email);
      console.log('Password hash from DB:', user.password);

      const isDbMatch = await bcrypt.compare(testPassword, user.password);
      console.log('Database password match:', isDbMatch);
    } else {
      console.log('User not found in database');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testPassword();