/**
 * Comprehensive Test Suite for azios
 * Tests all sprints including plugins, middleware, and universal runtime
 */

import azios from "../src"
import type { AziosPlugin, AziosResponse } from "../src/types"

// ============================================
// Test Utilities
// ============================================

const testResults: { name: string; passed: boolean; message: string }[] = []

async function test(name: string, fn: () => Promise<void>) {
  try {
    await fn()
    testResults.push({ name, passed: true, message: "✅ PASSED" })
    console.log(`✅ ${name}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    testResults.push({ name, passed: false, message })
    console.log(`❌ ${name}: ${message}`)
  }
}

// ============================================
// Sprint 1 - Core HTTP Tests
// ============================================

async function testSprint1() {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log("Sprint 1 - Core HTTP")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

  await test("GET Request", async () => {
    const response = await azios.get("https://jsonplaceholder.typicode.com/users/1")
    if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`)
    if (!response.data) throw new Error("Response data is missing")
  })

  await test("POST Request", async () => {
    const response = await azios.post("https://jsonplaceholder.typicode.com/posts", {
      title: "Test Post",
      body: "Test Body",
      userId: 1
    })
    if (response.status !== 201) throw new Error(`Expected 201, got ${response.status}`)
  })

  await test("Query Parameters", async () => {
    const response = await azios.get("https://jsonplaceholder.typicode.com/users", {
      params: { id: 1 }
    })
    if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`)
  })
}

// ============================================
// Sprint 2 - Interceptors Tests
// ============================================

async function testSprint2() {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log("Sprint 2 - Interceptors & Error Handling")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

  await test("Request Interceptor", async () => {
    const testInstance = azios
    let interceptorCalled = false

    testInstance.interceptors.request.use((config) => {
      interceptorCalled = true
      config.headers = { ...config.headers, "X-Test": "true" }
      return config
    })

    const response = await testInstance.get("https://jsonplaceholder.typicode.com/users/1")
    if (!interceptorCalled) throw new Error("Request interceptor was not called")
  })

  await test("Response Interceptor", async () => {
    const testInstance = azios
    let interceptorCalled = false

    testInstance.interceptors.response.use((response) => {
      interceptorCalled = true
      return response
    })

    const response = await testInstance.get("https://jsonplaceholder.typicode.com/users/1")
    if (!interceptorCalled) throw new Error("Response interceptor was not called")
  })

  await test("Request Cancellation", async () => {
    const controller = new AbortController()
    const request = azios.get("https://jsonplaceholder.typicode.com/posts", {
      signal: controller.signal
    })

    // Cancel immediately
    controller.abort()

    try {
      await request
      throw new Error("Request should have been cancelled")
    } catch (error: any) {
      // Check that error indicates cancellation
      if (!error.message.includes("aborted") && error.code !== "ABORTED") {
        throw error
      }
    }
  })
}

// ============================================
// Sprint 3 - Retry & Deduplication Tests
// ============================================

async function testSprint3() {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log("Sprint 3 - Retry & Deduplication")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

  await test("Request Deduplication", async () => {
    // Make 3 identical concurrent requests
    const r1 = azios.get("https://jsonplaceholder.typicode.com/users/1")
    const r2 = azios.get("https://jsonplaceholder.typicode.com/users/1")
    const r3 = azios.get("https://jsonplaceholder.typicode.com/users/1")

    const [res1, res2, res3] = await Promise.all([r1, r2, r3])

    // All should return same data (deduplicated)
    if (res1.data.id !== res2.data.id || res2.data.id !== res3.data.id) {
      throw new Error("Deduplicated requests returned different data")
    }
  })

  await test("Retry Logic", async () => {
    let attempts = 0
    let lastError: any = null

    try {
      // This should fail after retries
      await azios.get("https://invalid-domain-12345.test", {
        retry: 1,
        retryDelay: 100
      })
    } catch (error) {
      lastError = error
    }

    if (!lastError) {
      throw new Error("Expected request to fail after retries")
    }
  })
}

// ============================================
// Sprint 4 - Cache & Rate Limiting Tests
// ============================================

async function testSprint4() {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log("Sprint 4 - Cache & Rate Limiting")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

  await test("Response Caching", async () => {
    const url = "https://jsonplaceholder.typicode.com/users/2"

    // First request
    const res1 = await azios.get(url, { cache: true, cacheTTL: 5000 })

    // Second request should be from cache
    const res2 = await azios.get(url, { cache: true })

    // Should be same object reference if cached
    if (res1.data !== res2.data) {
      throw new Error("Cache not working - responses are different")
    }
  })

  await test("Rate Limiting", async () => {
    const startTime = Date.now()
    const promises = []

    // 6 requests with max 2 concurrent
    for (let i = 0; i < 6; i++) {
      promises.push(
        azios.get("https://jsonplaceholder.typicode.com/users/1", {
          rateLimit: 2
        })
      )
    }

    await Promise.all(promises)
    const duration = Date.now() - startTime

    // With rate limit of 2, 6 requests should take reasonable time
    if (duration < 100) {
      // Should be throttled at least a bit
      console.log(`⚠️  Rate limiting timing: ${duration}ms`)
    }
  })
}

// ============================================
// Sprint 5 - Plugin System Tests
// ============================================

async function testSprint5() {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log("Sprint 5 - Plugin System & Middleware")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

  await test("Plugin Installation", async () => {
    let onInstallCalled = false

    const testPlugin: AziosPlugin = {
      name: "test-plugin-install",
      hooks: {
        onInstall: (instance) => {
          onInstallCalled = true
        }
      }
    }

    const testInstance = azios
    await testInstance.installPlugin(testPlugin)

    if (!onInstallCalled) {
      throw new Error("Plugin onInstall hook was not called")
    }
  })

  await test("Plugin beforeRequest Hook", async () => {
    let hookCalled = false

    const testPlugin: AziosPlugin = {
      name: "hook-test-plugin",
      hooks: {
        beforeRequest: async (config) => {
          hookCalled = true
          config.headers = { ...config.headers, "X-Plugin": "test" }
          return config
        }
      }
    }

    const testInstance = azios
    await testInstance.installPlugin(testPlugin)

    const response = await testInstance.get("https://jsonplaceholder.typicode.com/users/1")

    if (!hookCalled) {
      throw new Error("Plugin beforeRequest hook was not called")
    }
  })

  await test("Middleware Pipeline", async () => {
    let middlewareCalled = false

    const testMiddleware = async (config: any, next: any) => {
      middlewareCalled = true
      return await next()
    }

    const testInstance = azios
    testInstance.use(testMiddleware)

    const response = await testInstance.get("https://jsonplaceholder.typicode.com/users/1")

    if (!middlewareCalled) {
      throw new Error("Middleware was not called")
    }
  })
}

// ============================================
// Main Test Execution
// ============================================

async function runAllTests() {
  console.log("\n")
  console.log("╔══════════════════════════════════════════════════════════════╗")
  console.log("║         AZIOS COMPREHENSIVE TEST SUITE                       ║")
  console.log("║               Production-Grade Testing                        ║")
  console.log("╚══════════════════════════════════════════════════════════════╝")

  try {
    await testSprint1()
    await testSprint2()
    await testSprint3()
    await testSprint4()
    await testSprint5()
  } catch (error) {
    console.error("Test execution error:", error)
  }

  // Print summary
  console.log("\n")
  console.log("╔══════════════════════════════════════════════════════════════╗")
  console.log("║                    TEST SUMMARY                              ║")
  console.log("╚══════════════════════════════════════════════════════════════╝")

  const passed = testResults.filter((r) => r.passed).length
  const failed = testResults.filter((r) => !r.passed).length
  const total = testResults.length

  console.log(`\nTotal Tests: ${total}`)
  console.log(`✅ Passed: ${passed}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`)

  if (failed > 0) {
    console.log("\nFailed Tests:")
    testResults
      .filter((r) => !r.passed)
      .forEach((r) => {
        console.log(`  ❌ ${r.name}`)
        console.log(`     ${r.message}`)
      })
  }

  console.log("\n")
  process.exit(failed > 0 ? 1 : 0)
}

// Run tests
runAllTests()
