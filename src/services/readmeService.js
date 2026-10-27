/**
 * README.md Ingestion, Parsing & Semantic Indexing Service for GovChain Sentinel
 */
import rawReadmeFallback from '../../README.md?raw'
import { fallbackSha256 } from '../utils/crypto.js'

// Cached index representation
let cachedIndex = null
let rawContentCache = ''

/**
 * Parses markdown into structured semantic sections with headings, contents, and keywords.
 */
function parseMarkdownSections(markdownText) {
  const normalizedText = markdownText.replace(/\r\n/g, '\n')
  const lines = normalizedText.split('\n')
  const sections = []
  let currentSection = {
    id: 'intro',
    level: 1,
    title: 'GovChain Sentinel Overview',
    content: '',
    lines: [],
    startLine: 1,
    endLine: 1
  }

  lines.forEach((line, index) => {
    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/)
    if (headingMatch) {
      if (currentSection.lines.length > 0) {
        currentSection.endLine = index
        sections.push({ ...currentSection, content: currentSection.lines.join('\n') })
      }
      const level = headingMatch[1].length
      const title = headingMatch[2].replace(/[#*_`]/g, '').trim()
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

      currentSection = {
        id: slug || `section-${sections.length + 1}`,
        level,
        title,
        content: '',
        lines: [line],
        startLine: index + 1,
        endLine: index + 1
      }
    } else {
      currentSection.lines.push(line)
    }
  })

  if (currentSection.lines.length > 0) {
    currentSection.endLine = lines.length
    currentSection.content = currentSection.lines.join('\n')
    sections.push(currentSection)
  }

  // Precompute searchable tokens and keywords for each section
  return sections.map(sec => {
    const cleanContent = sec.content.toLowerCase().replace(/[`*_[\]()#]/g, ' ')
    const words = cleanContent.split(/\s+/).filter(w => w.length > 2)
    const tokenSet = new Set(words)
    return {
      ...sec,
      wordCount: words.length,
      tokenSet
    }
  })
}

/**
 * Dynamically fetches and parses the project's README.md.
 * Tries runtime fetch first (HTTP), then gracefully falls back to the Vite-bundled raw import.
 */
export async function loadReadmeDocumentation() {
  if (cachedIndex) {
    return cachedIndex
  }

  let text = ''
  let source = 'bundled'

  // Attempt 1: Fetch runtime file from public/README.md or /README.md
  try {
    const response = await fetch('/README.md?t=' + Date.now(), { cache: 'no-cache' })
    if (response.ok) {
      text = await response.text()
      source = 'dynamic_fetch'
    }
  } catch (err) {
    console.warn('[Sentinel AI] Runtime fetch failed, using bundled README fallback:', err)
  }

  // Fallback to static raw import if fetch returned empty or failed
  if (!text || text.trim().length === 0) {
    text = rawReadmeFallback || ''
    source = 'bundled_raw'
  }

  rawContentCache = text
  const sections = parseMarkdownSections(text)
  const totalLines = text.split('\n').length
  const digest = fallbackSha256(text).substring(0, 16)

  cachedIndex = {
    source,
    rawText: text,
    sections,
    totalLines,
    totalChars: text.length,
    digest,
    indexedAt: new Date().toISOString(),
    sectionTitles: sections.map(s => s.title)
  }

  return cachedIndex
}

/**
 * Synchronous getter for current raw README text
 */
export function getCachedReadmeText() {
  return rawContentCache || rawReadmeFallback || ''
}

/**
 * Searches the parsed README sections using weighted keyword and phrase ranking.
 * Returns the top relevant sections and excerpts.
 */
export function searchReadmeSections(query, sections = [], topK = 4) {
  if (!query || !sections.length) return []

  const cleanQuery = query.toLowerCase().trim()
  const queryTokens = cleanQuery.split(/\s+/).filter(w => w.length > 2)

  const scored = sections.map(section => {
    let score = 0
    const titleLower = section.title.toLowerCase()
    const contentLower = section.content.toLowerCase()

    // 1. Exact phrase matches in title
    if (titleLower.includes(cleanQuery)) {
      score += 60
    }

    // 2. Exact phrase in content
    if (contentLower.includes(cleanQuery)) {
      score += 35
    }

    // 3. Keyword token matches
    queryTokens.forEach(token => {
      if (titleLower.includes(token)) {
        score += 20
      }
      if (section.tokenSet && section.tokenSet.has(token)) {
        score += 8
      } else if (contentLower.includes(token)) {
        score += 4
      }
    })

    // Special Boosts for high-priority GovChain concepts
    if (cleanQuery.includes('hash') && (titleLower.includes('hash-chain') || titleLower.includes('cryptographic'))) {
      score += 25
    }
    if (cleanQuery.includes('merkle') && (titleLower.includes('merkle') || contentLower.includes('calculatelerkleroot'))) {
      score += 30
    }
    if ((cleanQuery.includes('role') || cleanQuery.includes('auditor') || cleanQuery.includes('admin')) && 
        (titleLower.includes('access control') || titleLower.includes('demo') || contentLower.includes('clearance'))) {
      score += 25
    }
    if ((cleanQuery.includes('tamper') || cleanQuery.includes('simulation') || cleanQuery.includes('attack')) && 
        (titleLower.includes('simulation') || titleLower.includes('problem'))) {
      score += 25
    }

    return {
      section,
      score
    }
  })

  return scored
    .filter(item => item.score > 5)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(item => item.section)
}
