/**
 * O*NET API v2 Test Script
 * Run with: npx tsx scripts/test-onet-v2.ts
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'

// Load .env.local manually
function loadEnv() {
  try {
    const envPath = resolve(process.cwd(), '.env.local')
    const content = readFileSync(envPath, 'utf-8')
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        const value = valueParts.join('=')
        process.env[key] = value
      }
    }
  } catch (e) {
    console.error('Could not load .env.local')
  }
}

loadEnv()

const ONET_API_KEY = process.env.ONET_API_KEY

console.log('=== O*NET API v2 Test ===')
console.log('API Key:', ONET_API_KEY ? `${ONET_API_KEY.substring(0, 5)}...` : 'NOT SET')

if (!ONET_API_KEY) {
  console.error('ERROR: Missing ONET_API_KEY in environment')
  process.exit(1)
}

async function testEndpoint(name: string, url: string) {
  console.log(`\n--- Testing: ${name} ---`)
  console.log('URL:', url)

  try {
    const start = Date.now()
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-API-Key': ONET_API_KEY!,
        'Accept': 'application/json',
      },
    })
    const latency = Date.now() - start

    console.log('Status:', response.status, response.statusText)
    console.log('Latency:', latency, 'ms')

    const text = await response.text()
    console.log('Body length:', text.length, 'chars')

    // Try to parse as JSON
    try {
      const json = JSON.parse(text)
      console.log('Body (JSON):', JSON.stringify(json, null, 2).substring(0, 1000))
      if (JSON.stringify(json).length > 1000) {
        console.log('... (truncated)')
      }
    } catch {
      console.log('Body (text):', text.substring(0, 500))
    }

    return response.ok
  } catch (error) {
    console.error('Fetch error:', error)
    return false
  }
}

async function main() {
  const endpoints = [
    ['Search (manager)', 'https://api-v2.onetcenter.org/veterans/search?keyword=manager'],
    ['Navy DC (Damage Controlman)', 'https://api-v2.onetcenter.org/veterans/military?code=DC&branch=navy'],
    ['Navy IT (Information Systems Tech)', 'https://api-v2.onetcenter.org/veterans/military?code=IT&branch=navy'],
    ['Army 11B (Infantry)', 'https://api-v2.onetcenter.org/veterans/military?code=11B&branch=army'],
  ]

  const results: { name: string; success: boolean }[] = []

  for (const [name, url] of endpoints) {
    const success = await testEndpoint(name, url)
    results.push({ name, success })
  }

  console.log('\n=== Summary ===')
  for (const { name, success } of results) {
    console.log(`${success ? '✓' : '✗'} ${name}`)
  }
}

main().catch(console.error)
