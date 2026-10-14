/**
 * Cryptographic & Sanitization Utilities for GovChain Sentinel
 */

// Native Web Crypto SHA-256 with fallback
export async function sha256(message) {
  try {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const msgUint8 = new TextEncoder().encode(message)
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
      return hashHex
    }
  } catch {
    // fallback below
  }
  return fallbackSha256(message)
}

// Synchronous fast hash fallback for instantaneous rendering
export function fallbackSha256(ascii) {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount))
  }
  
  const mathPow = Math.pow
  const maxWord = mathPow(2, 32)
  const lengthProperty = 'length'
  let i, j
  let result = ''

  const words = []
  const asciiBitLength = ascii[lengthProperty] * 8
  
  let hash = fallbackSha256.h = fallbackSha256.h || []
  const k = fallbackSha256.k = fallbackSha256.k || []
  let primeCounter = k[lengthProperty]

  const isComposite = {}
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 300; i += candidate) {
        isComposite[i] = candidate
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0
    }
  }
  
  ascii += '\x80'
  while (ascii[lengthProperty] % 64 - 56) ascii += '\x00'
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i)
    if (j >> 8) return '' // non-standard char
    words[i >> 2] |= j << ((3 - i) % 4) * 8
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0
  words[words[lengthProperty]] = asciiBitLength
  
  for (j = 0; j < words[lengthProperty];) {
    const w = words.slice(j, j += 16)
    const oldHash = hash
    hash = hash.slice(0, 8)
    
    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15], w2 = w[i - 2]
      const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)
      const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10)
      const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6])
      const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2])
      const temp1 = (hash[7] + (rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25)) + ch + k[i] + (w[i] = (i < 16) ? w[i] : (w[i - 16] + s0 + w[i - 7] + s1) | 0)) | 0
      const temp2 = ((rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22)) + maj) | 0
      
      hash = [(temp1 + temp2) | 0, hash[0], hash[1], hash[2], (hash[3] + temp1) | 0, hash[4], hash[5], hash[6]]
    }
    
    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0
    }
  }
  
  for (i = 0; i < 8; i++) {
    for (j = 3; j >= 0; j--) {
      const b = (hash[i] >> (8 * j)) & 255
      result += (b < 16 ? '0' : '') + b.toString(16)
    }
  }
  return result
}

/**
 * Strict Client-Side XSS Sanitization & Analysis
 * Detects and strips:
 * - HTML tags: <script>, <iframe>, <img>, <style>, <svg>, <object>, etc.
 * - Event handlers: onload=, onerror=, onclick=, onmouseover=, etc.
 * - URI schemes: javascript:, vbscript:, data:text/html
 * - Suspicious characters and entity injections
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return { sanitized: '', hasMaliciousContent: false, removed: [] }
  
  const removed = []
  let original = input
  let cleaned = input

  // Check for script tags
  const scriptTagRegex = /<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi
  if (scriptTagRegex.test(cleaned)) {
    removed.push('Embedded <script> tag detected and purged')
    cleaned = cleaned.replace(scriptTagRegex, '')
  }

  // Check for dangerous iframe, object, embed tags
  const dangerousTagRegex = /<\s*(iframe|object|embed|svg|applet|meta|link)[^>]*>[\s\S]*?(<\s*\/\s*\1\s*>)?/gi
  if (dangerousTagRegex.test(cleaned)) {
    removed.push('Harmful container tag (<iframe/embed/object/svg>) removed')
    cleaned = cleaned.replace(dangerousTagRegex, '')
  }

  // Check for javascript: or vbscript: pseudoprotocols
  const pseudoProtocolRegex = /(javascript|vbscript|data\s*:\s*text\/html):/gi
  if (pseudoProtocolRegex.test(cleaned)) {
    removed.push('Executable pseudo-protocol (javascript:) neutralized')
    cleaned = cleaned.replace(pseudoProtocolRegex, '[BLOCKED_URI]:')
  }

  // Check for event handlers like onerror=, onload=, onmouseover=
  const eventHandlerRegex = /on\w+\s*=\s*(['"][^'"]*['"]|[^\s>]+)/gi
  if (eventHandlerRegex.test(cleaned)) {
    removed.push('Inline JavaScript event handler (e.g. onerror/onclick) stripped')
    cleaned = cleaned.replace(eventHandlerRegex, '')
  }

  // Strip all residual raw HTML tags
  const residualTags = /<[^>]*>/g
  if (residualTags.test(cleaned)) {
    removed.push('Raw HTML markup tags stripped')
    cleaned = cleaned.replace(residualTags, '')
  }

  // Trim and remove control characters
  cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')

  const hasMaliciousContent = removed.length > 0 || original !== cleaned

  return {
    sanitized: cleaned.trim(),
    hasMaliciousContent,
    removed,
    original
  }
}

/**
 * Merkle Root computation from an array of block hashes
 */
export function calculateMerkleRoot(hashes) {
  if (!hashes || hashes.length === 0) return '0x0000000000000000000000000000000000000000000000000000000000000000'
  if (hashes.length === 1) return hashes[0]

  let currentLevel = [...hashes]

  while (currentLevel.length > 1) {
    const nextLevel = []
    for (let i = 0; i < currentLevel.length; i += 2) {
      const left = currentLevel[i]
      const right = i + 1 < currentLevel.length ? currentLevel[i + 1] : left
      const combined = fallbackSha256(left + right)
      nextLevel.push(combined)
    }
    currentLevel = nextLevel
  }

  return '0x' + currentLevel[0]
}
