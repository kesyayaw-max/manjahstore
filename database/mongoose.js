const mongoose = require('mongoose');

async function connectDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[DATABASE] MongoDB connected');
  } catch (error) {
    console.error('[DATABASE] MongoDB error:', error.message);
    process.exit(1);
  }
}

module.exports = connectDatabase;