const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Patient = require('../models/Patient');

// Load env vars
dotenv.config();

/**
 * Script to link existing users to patient records
 * This helps establish the connection between user accounts and patient data
 */

const linkUsersToPatients = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📊 Connected to MongoDB');

    // Get all users and patients
    const users = await User.find({});
    const patients = await Patient.find({}).limit(10); // Get first 10 patients for demo

    console.log('👥 Found', users.length, 'users');
    console.log('🏥 Found', patients.length, 'patients');

    if (patients.length === 0) {
      console.log('⚠️  No patients found. Please run the hospital data seeder first:');
      console.log('   npm run seed');
      return;
    }

    // Link users to patients (for demo purposes)
    let linkedCount = 0;
    for (let i = 0; i < users.length && i < patients.length; i++) {
      const user = users[i];
      const patient = patients[i];

      if (!user.patientId) {
        user.patientId = patient._id;
        user.role = 'patient';
        await user.save();
        
        console.log(`🔗 Linked user "${user.name}" (${user.email}) to patient "${patient.patient_name}" (${patient._id})`);
        linkedCount++;
      } else {
        console.log(`✅ User "${user.name}" already has patient ID: ${user.patientId}`);
      }
    }

    console.log(`\n🎉 Successfully linked ${linkedCount} users to patient records`);
    
    // Display some example patient IDs for testing
    console.log('\n📋 Available Patient IDs for testing:');
    const testPatients = await Patient.find({}).limit(5).select('_id patient_name diagnosis');
    testPatients.forEach(patient => {
      console.log(`   ${patient._id} - ${patient.patient_name} (${patient.diagnosis})`);
    });

    console.log('\n💡 Usage:');
    console.log('1. Login with any user account');
    console.log('2. The chatbot will automatically use their linked patient context');
    console.log('3. Test endpoints:');
    console.log('   - POST /api/chatbot/chat (with auth token)');
    console.log('   - POST /api/chatbot/session/start (with auth token)');

  } catch (error) {
    console.error('❌ Error linking users to patients:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

/**
 * Create a test user with a specific patient ID
 */
const createTestUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📊 Connected to MongoDB');

    // Get first patient for demo
    const patient = await Patient.findOne({});
    if (!patient) {
      console.log('⚠️  No patients found. Please run the hospital data seeder first.');
      return;
    }

    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@mindsupport.com' });
    if (existingUser) {
      console.log('✅ Test user already exists:', existingUser.email);
      console.log('📋 Patient ID:', existingUser.patientId);
      return;
    }

    // Create test user
    const testUser = await User.create({
      name: 'Test Patient User',
      email: 'test@mindsupport.com',
      password: 'password123',
      patientId: patient._id,
      role: 'patient'
    });

    console.log('👤 Created test user:');
    console.log('   Email: test@mindsupport.com');
    console.log('   Password: password123');
    console.log('   Patient ID:', testUser.patientId);
    console.log('   Patient Name:', patient.patient_name);
    console.log('   Diagnosis:', patient.diagnosis);

  } catch (error) {
    console.error('❌ Error creating test user:', error.message);
  } finally {
    await mongoose.disconnect();
  }
};

// Run based on command line argument
const command = process.argv[2];

if (command === 'link') {
  linkUsersToPatients();
} else if (command === 'create-test') {
  createTestUser();
} else {
  console.log('🔧 Patient-User Linking Utility');
  console.log('');
  console.log('Usage:');
  console.log('  node tools/linkPatients.js link        # Link existing users to patients');
  console.log('  node tools/linkPatients.js create-test # Create a test user with patient data');
  console.log('');
  console.log('Make sure to run the hospital data seeder first:');
  console.log('  npm run seed');
}