/**
 * Test Supabase Connection and State Store
 */
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase Connection...\n');

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    return;
  }

  console.log('✅ Environment variables loaded');
  console.log('   URL:', url);
  console.log('   Key:', key.substring(0, 20) + '...\n');

  const client = createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  console.log('✅ Supabase client created\n');

  // Test 1: Check if state_store table exists
  console.log('📋 Test 1: Check state_store table...');
  const { data: testData, error: testError } = await client
    .from('state_store')
    .select('*')
    .limit(5);

  if (testError) {
    console.error('❌ Error accessing state_store:', testError.message);
    return;
  }

  console.log('✅ state_store table exists');
  console.log('   Rows found:', testData?.length || 0);
  if (testData && testData.length > 0) {
    console.log('   Sample keys:', testData.map(r => r.key).join(', '));
  }
  console.log('');

  // Test 2: Write a test session
  const testSessionId = 'test_session_' + Date.now();
  console.log('📝 Test 2: Write test session...');
  console.log('   Session ID:', testSessionId);

  const { error: writeError } = await client
    .from('state_store')
    .upsert([{
      collection_name: 'sessions',
      key: `${testSessionId}:sessionData`,
      value: {
        id: testSessionId,
        title: 'Test Session',
        status: 'active',
        createdAt: new Date().toISOString()
      }
    }]);

  if (writeError) {
    console.error('❌ Error writing test session:', writeError.message);
    return;
  }

  console.log('✅ Test session written\n');

  // Test 3: Read the test session back
  console.log('📖 Test 3: Read test session...');
  const { data: readData, error: readError } = await client
    .from('state_store')
    .select('value')
    .eq('collection_name', 'sessions')
    .eq('key', `${testSessionId}:sessionData`)
    .maybeSingle();

  if (readError) {
    console.error('❌ Error reading test session:', readError.message);
    return;
  }

  console.log('✅ Test session read successfully');
  console.log('   Data:', JSON.stringify(readData?.value, null, 2));
  console.log('');

  // Test 4: Clean up test session
  console.log('🗑️  Test 4: Clean up test session...');
  const { error: deleteError } = await client
    .from('state_store')
    .delete()
    .eq('collection_name', 'sessions')
    .eq('key', `${testSessionId}:sessionData`);

  if (deleteError) {
    console.error('❌ Error deleting test session:', deleteError.message);
    return;
  }

  console.log('✅ Test session deleted\n');

  console.log('🎉 All tests passed! Supabase is working correctly.\n');
}

testSupabaseConnection().catch(console.error);
