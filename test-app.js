#!/usr/bin/env node

// Test script para verificar que la aplicación NeuroBeats funciona correctamente
import https from 'https';

const RAPIDAPI_KEY = '065ab6a786mshd6cc9b98e753584p12c9c1jsn58fd2129c9a7';
const OPENROUTER_KEY = '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';

console.log('🧪 Testing NeuroBeats API Integrations...\n');

// Test Deezer API
function testDeezerAPI() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'deezerdevs-deezer.p.rapidapi.com',
      path: '/search?q=eminem&limit=3',
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.data && result.data.length > 0) {
            console.log('✅ Deezer API: OK');
            console.log(`   Found ${result.data.length} tracks`);
            console.log(`   Sample: "${result.data[0].title}" by ${result.data[0].artist.name}`);
            console.log(`   Preview URL: ${result.data[0].preview}`);
            resolve(true);
          } else {
            console.log('❌ Deezer API: No data returned');
            resolve(false);
          }
        } catch (error) {
          console.log('❌ Deezer API: Parse error', error.message);
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ Deezer API: Connection error', error.message);
      resolve(false);
    });

    req.setTimeout(5000, () => {
      console.log('❌ Deezer API: Timeout');
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

// Test OpenRouter API
function testOpenRouterAPI() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      model: 'meta-llama/llama-3.1-8b-instruct:free',
      messages: [
        {
          role: 'user',
          content: 'Respond with just "Hello NeuroBeats!" - nothing else.'
        }
      ],
      max_tokens: 20,
      temperature: 0.1
    });

    const options = {
      hostname: 'openrouter.ai',
      path: '/api/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'NeuroBeats AI Test'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.choices && result.choices[0] && result.choices[0].message) {
            console.log('✅ OpenRouter API: OK');
            console.log(`   Model: ${result.model || 'meta-llama/llama-3.1-8b-instruct:free'}`);
            console.log(`   Response: ${result.choices[0].message.content.trim()}`);
            resolve(true);
          } else if (result.error) {
            console.log('❌ OpenRouter API: Error -', result.error.message);
            console.log('   Note: API key might need activation or have no credits');
            resolve(false);
          } else {
            console.log('❌ OpenRouter API: Unexpected response format');
            resolve(false);
          }
        } catch (error) {
          console.log('❌ OpenRouter API: Parse error', error.message);
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ OpenRouter API: Connection error', error.message);
      resolve(false);
    });

    req.setTimeout(10000, () => {
      console.log('❌ OpenRouter API: Timeout');
      req.destroy();
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
}

// Test preview URL accessibility
function testPreviewURL(url) {
  return new Promise((resolve) => {
    if (!url) {
      resolve(false);
      return;
    }

    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'HEAD',
      timeout: 3000
    };

    const req = https.request(options, (res) => {
      resolve(res.statusCode === 200);
    });

    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

// Run all tests
async function runTests() {
  console.log('Starting API tests...\n');
  
  // Test Deezer
  const deezerResult = await testDeezerAPI();
  console.log('');
  
  // Test OpenRouter
  const openrouterResult = await testOpenRouterAPI();
  console.log('');
  
  // Summary
  console.log('📊 Test Summary:');
  console.log(`   Deezer API (Music Search & Previews): ${deezerResult ? '✅ Working' : '❌ Failed'}`);
  console.log(`   OpenRouter API (AI Recommendations): ${openrouterResult ? '✅ Working' : '❌ Failed'}`);
  
  if (deezerResult && openrouterResult) {
    console.log('\n🎉 All APIs are working! NeuroBeats is ready to go!');
  } else if (deezerResult) {
    console.log('\n⚠️ Music functionality works, but AI recommendations may not be available.');
    console.log('   You can still search and play music previews.');
  } else if (openrouterResult) {
    console.log('\n⚠️ AI functionality works, but music search may not be available.');
  } else {
    console.log('\n❌ Both APIs have issues. Please check your API keys and internet connection.');
  }
  
  console.log('\n🚀 You can start the development server with: npm run dev');
  console.log('   Open http://localhost:5173 in your browser to use NeuroBeats!');
}

runTests().catch(console.error);