/**
 * Quick Authentication Test Script
 * Run this after setting up Firebase to verify the configuration
 */

import { auth, googleProvider } from './lib/firebase';
import { signInWithPopup } from 'firebase/auth';

async function testFirebaseAuth() {
    console.log('🔧 Testing Firebase Authentication Setup...\n');

    // Test 1: Check Firebase Config
    console.log('✅ Firebase SDK initialized');
    console.log('   Project ID:', auth.app.options.projectId);
    console.log('   Auth Domain:', auth.app.options.authDomain);
    console.log('');

    // Test 2: Attempt Google Sign-In
    console.log('🔐 Testing Google Sign-In...');
    console.log('   A popup window should appear. Please sign in with your Google account.');

    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        console.log('✅ Sign-in successful!\n');
        console.log('User Details:');
        console.log('   UID:', user.uid);
        console.log('   Email:', user.email);
        console.log('   Display Name:', user.displayName);
        console.log('   Photo URL:', user.photoURL);
        console.log('');

        // Test 3: Get ID Token
        const token = await user.getIdToken();
        console.log('✅ ID Token retrieved successfully');
        console.log('   Token (first 50 chars):', token.substring(0, 50) + '...');
        console.log('');

        // Test 4: Test Backend API
        console.log('🔌 Testing Backend API...');
        try {
            const response = await fetch('http://localhost:3001/api/v1/sessions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ metadata: { test: 'auth verification' } })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Backend authentication successful!');
                console.log('   Response:', data);
            } else {
                console.log('❌ Backend authentication failed');
                console.log('   Status:', response.status);
                const error = await response.text();
                console.log('   Error:', error);
            }
        } catch (error) {
            console.log('❌ Backend connection failed');
            console.log('   Make sure the backend server is running on http://localhost:3001');
            console.log('   Error:', error);
        }

        console.log('');
        console.log('🎉 Authentication test complete!');
        console.log('');
        console.log('Next steps:');
        console.log('1. If backend test failed, start the backend server:');
        console.log('   cd c:\\Byte_Defenders\\multi-agent-creative-studio\\apps\\backend');
        console.log('   npm run dev');
        console.log('');
        console.log('2. Update your .env files with the correct Firebase credentials');
        console.log('3. Enable Google Sign-In in Firebase Console');
        console.log('4. Test the login flow on http://localhost:8082/login');

    } catch (error) {
        console.log('❌ Sign-in failed');
        console.log('   Error:', error);
        console.log('');
        console.log('Troubleshooting:');
        console.log('1. Check that Google Sign-In is enabled in Firebase Console');
        console.log('2. Verify localhost is in authorized domains');
        console.log('3. Check browser console for detailed error messages');
    }
}

// Run the test
testFirebaseAuth();
