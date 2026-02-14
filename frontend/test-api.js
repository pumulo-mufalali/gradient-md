#!/usr/bin/env node

/**
 * Test script for GradientMD API endpoints
 * 
 * Usage: node test-api.js
 * 
 * This script tests all three main API endpoints with sample data
 * to verify they're working correctly.
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function testTriageAPI() {
  console.log('\n🏥 Testing Triage API...');

  const response = await fetch(`${BASE_URL}/api/triage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      age: '35',
      sex: 'male',
      symptoms: 'persistent headache on the right side, nausea, sensitivity to light',
      duration: '2-3 days',
      severity: '6',
      medications: 'ibuprofen',
      conditions: 'none',
      additionalInfo: 'high stress at work recently'
    })
  });

  const data = await response.json();

  if (response.ok && data.severity && data.title) {
    console.log('✅ Triage API working');
    console.log(`   Severity: ${data.severity}`);
    console.log(`   Title: ${data.title}`);
    console.log(`   Citations: ${data.citations?.length || 0}`);
  } else {
    console.log('❌ Triage API failed');
    console.log(data);
  }
}

async function testInteractionsAPI() {
  console.log('\n💊 Testing Drug Interactions API...');

  const response = await fetch(`${BASE_URL}/api/interactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      medications: ['Lisinopril', 'Ibuprofen', 'Metformin']
    })
  });

  const data = await response.json();

  if (response.ok && Array.isArray(data.interactions)) {
    console.log('✅ Interactions API working');
    console.log(`   Interactions found: ${data.interactions.length}`);
    console.log(`   Summary: ${data.summary?.substring(0, 80)}...`);
  } else {
    console.log('❌ Interactions API failed');
    console.log(data);
  }
}

async function testAskAPI() {
  console.log('\n❓ Testing Medical Q&A API...');

  const response = await fetch(`${BASE_URL}/api/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question: 'What are the early warning signs of diabetes?',
      context: 'Patient has family history of type 2 diabetes',
      history: []
    })
  });

  const data = await response.json();

  if (response.ok && data.answer) {
    console.log('✅ Ask API working');
    console.log(`   Answer length: ${data.answer.length} characters`);
    console.log(`   Preview: ${data.answer.substring(0, 100)}...`);
  } else {
    console.log('❌ Ask API failed');
    console.log(data);
  }
}

async function runTests() {
  console.log('🧪 GradientMD API Test Suite');
  console.log(`📍 Testing against: ${BASE_URL}`);
  console.log('='.repeat(50));

  try {
    await testTriageAPI();
    await testInteractionsAPI();
    await testAskAPI();

    console.log('\n' + '='.repeat(50));
    console.log('✨ All tests completed!');
    console.log('\n💡 Tip: If using mock agent, responses are simulated.');
    console.log('   Deploy the real agent for production-quality results.\n');
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
    console.error('\nMake sure the dev server is running: pnpm dev\n');
    process.exit(1);
  }
}

runTests();
