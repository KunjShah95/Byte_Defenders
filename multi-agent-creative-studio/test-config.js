#!/usr/bin/env node

/**
 * Configuration Test Script
 * Verifies all environment variables and connections are properly configured
 */

require('dotenv').config();

console.log('🔍 Orchestra Studio - Configuration Test\n');
console.log('='.repeat(50));

// Test 1: Environment Variables
console.log('\n📋 Environment Variables:');
console.log('  ✓ SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Configured' : '❌ Missing');
console.log('  ✓ SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '✅ Configured' : '❌ Missing');
console.log('  ✓ FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? '✅ Configured' : '❌ Missing');
console.log('  ✓ FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? '✅ Configured' : '❌ Missing');
console.log('  ✓ FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? '✅ Configured' : '❌ Missing');
console.log('  ✓ PERSISTENCE_MODE:', process.env.PERSISTENCE_MODE || 'memory');
console.log('  ✓ PORT:', process.env.PORT || '3000');

// Test 2: Supabase Connection
console.log('\n🗄️  Testing Supabase Connection...');
const { createClient } = require('@supabase/supabase-js');

try {
    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY
    );
    console.log('  ✅ Supabase client created successfully');

    // Test a simple query
    supabase.from('state_store').select('count').limit(1)
        .then(() => {
            console.log('  ✅ Database connection verified');
        })
        .catch(err => {
            console.log('  ⚠️  Connection test:', err.message);
        });
} catch (error) {
    console.log('  ❌ Supabase connection failed:', error.message);
}

// Test 3: Firebase Admin
console.log('\n🔐 Testing Firebase Admin SDK...');
try {
    const admin = require('firebase-admin');

    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
        });
    }
    console.log('  ✅ Firebase Admin initialized successfully');
} catch (error) {
    console.log('  ❌ Firebase Admin failed:', error.message);
}

console.log('\n' + '='.repeat(50));
console.log('✨ Configuration test complete!\n');
