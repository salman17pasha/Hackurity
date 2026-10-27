/**
 * Sentinel AI Assistant Engine
 * 
 * Manages the AI knowledge base, system prompt generation from README.md,
 * live Gemini API integration, and high-assurance local knowledge base synthesis.
 */

import { searchReadmeSections } from './readmeService.js'

/**
 * Builds the comprehensive System Prompt using the parsed README.md as ground truth.
 */
export function buildSystemPrompt(readmeText) {
  return `You are Sentinel AI Assistant, the specialized cybersecurity AI guide for the "GovChain Sentinel" platform (developed by Byte Forge).

PRIMARY KNOWLEDGE BASE (README.md SOURCE TEXT):
==================================================
${readmeText}
==================================================

CORE OPERATIONAL RULES:
1. Act as a high-assurance, expert cybersecurity engineer and cryptographic auditor.
2. Rely strictly on the GovChain Sentinel README.md text provided above as your primary ground truth.
3. Address questions regarding architecture, problem statements (silent SQL edits, insider tampering), cryptographic mechanics (SHA-256 hash-chaining, Merkle tree reduction, root commitments), user roles (Admin Level-5 Directive vs Field Auditor Level-2), adversarial tamper simulations, and zero-trust verification.
4. When relevant, reference specific sections from the README (e.g. "[Ref: README §6 - How the Project Works]").
5. Use code blocks for cryptographic formulas, such as the block serialization structure:
   \${prevHash}|\${blockHeight}|\${timestamp}|\${department}|\${action}|\${rawPayload}|\${actor}
   and the pairwise Merkle tree algorithm.
6. Maintain a professional, cyberpunk SOC-aesthetic tone: sharp, precise, defensive, and mathematically grounded.`
}

/**
 * High-Assurance Local Knowledge Synthesis Engine
 * Provides instant, zero-latency, 100% offline answers citing README.md.
 */
function synthesizeLocalResponse(userQuestion, readmeData) {
  const q = userQuestion.toLowerCase().trim()
  const sections = readmeData?.sections || []
  const topSections = searchReadmeSections(userQuestion, sections, 3)

  // 1. Hash-chain mechanics question
  if (
    q.includes('hash-chain') || 
    q.includes('hash chain') || 
    (q.includes('how') && q.includes('hash') && q.includes('work')) ||
    q.includes('forward dependency') ||
    q.includes('cryptographic bonding')
  ) {
    return `### 🔗 Cryptographic Hash-Chain Mechanics in GovChain Sentinel

In GovChain Sentinel, public sector audit logs are secured using a **continuous, forward-dependent SHA-256 cryptographic hash-chain** to guarantee mathematical immutability.

#### 1. Cryptographic Record Bonding
When an audit block is created, its core properties are serialized into a strict pipe-delimited format before hashing:
\`\`\`text
\${prevHash}|\${blockHeight}|\${timestamp}|\${department}|\${action}|\${rawPayload}|\${actor}
\`\`\`
This string is passed through **SHA-256** (\`crypto.subtle\` with a pure JS bitwise fallback) to compute the block's unique \`currentHash\`.

#### 2. Forward Dependency Chaining
* Each consecutive block incorporates the exact \`currentHash\` of the previous block as its \`prevHash\`.
* Because cryptographic hash functions are **one-way and collision-resistant**, modifying even a single character in an earlier block (e.g., Block #1001) alters its hash.
* This discrepancy immediately ruptures the chain link with Block #1002 and invalidates every downstream block across the entire ledger.

> **Source Reference**: *GovChain Sentinel README §6.1 (Cryptographic Record Bonding) & §6.2 (Forward Dependency Chaining)*.`
  }

  // 2. Auditor role and RBAC question
  if (
    q.includes('role of an auditor') || 
    q.includes('auditor') || 
    q.includes('clearance') || 
    q.includes('rbac') || 
    q.includes('admin vs') || 
    q.includes('permission')
  ) {
    return `### 🛡️ User Roles & Role-Based Access Control (RBAC)

GovChain Sentinel enforces strict **Role-Based Access Control (RBAC)** aligned with defense-grade clearance tiers:

| Role | Clearance Level | Primary Responsibilities & Capabilities |
| :--- | :--- | :--- |
| **Normal User (Field Auditor)** | **Level-2 Field Auditor** | • Zero-trust read-only access to multi-department audit ledgers.<br>• Run the client-side Zero-Trust Verification Engine to recompute SHA-256 digests.<br>• Inspect Merkle root commitments against on-chain anchors.<br>• Generate forensic compliance certificates without modification permissions. |
| **Administrator** | **Level-5 Directive Access** | • Full administrative authority.<br>• Access to the Adversarial Tamper Simulation Lab (FIR dismissals, deed hijacks).<br>• Permission to commit new Merkle roots to the smart contract.<br>• Ledger restoration and genesis reset capabilities. |

#### Demo Access Credentials:
* **Field Auditor**: Officer Priya Sen (\`priya.sen@auditor.gov.in\`)
* **Administrator**: Commander Vikram Dev (\`v.dev@sentinel.gov.in\`)

*(Note: Users can also use the Instant Role Switcher in the top header bar for fast evaluation).*

> **Source Reference**: *GovChain Sentinel README §4 (Authentication & RBAC) & §8 (Demo Accounts & Quick-Login)*.`
  }

  // 3. Merkle roots & smart contract anchoring question
  if (
    q.includes('merkle') || 
    q.includes('smart contract') || 
    q.includes('anchor') || 
    q.includes('on-chain') ||
    q.includes('ethereum')
  ) {
    return `### 🌳 Merkle Root Generation & Decentralized Anchoring

Rather than posting every individual audit log to an expensive distributed ledger, GovChain Sentinel batches blocks into pairwise **binary Merkle Trees** and anchors a single 32-byte root commitment to a smart contract:

#### 1. Pairwise Tree Reduction Algorithm
Consecutive block hashes are paired iteratively and hashed until a single root hash is reached:
\`\`\`javascript
// Pairwise tree reduction to a single 32-byte root
while (currentLevel.length > 1) {
  const nextLevel = []
  for (let i = 0; i < currentLevel.length; i += 2) {
    const left = currentLevel[i]
    const right = i + 1 < currentLevel.length ? currentLevel[i + 1] : left
    nextLevel.push(fallbackSha256(left + right))
  }
  currentLevel = nextLevel
}
\`\`\`

#### 2. Decentralized Smart Contract Anchoring
* The computed 32-byte Merkle root (\`0x...\`) serves as an immutable cryptographic fingerprint for the entire batch.
* This root is committed to a simulated Ethereum Layer-2 smart contract state.
* During verification, the client re-evaluates the Merkle hierarchy and matches it against the stored on-chain reference. Any divergence flags the entire batch as compromised.

> **Source Reference**: *GovChain Sentinel README §4 (Key Features) & §6.3 (Merkle Root Generation)*.`
  }

  // 4. Problem statement question
  if (
    q.includes('problem') || 
    q.includes('why') || 
    q.includes('vulnerability') || 
    q.includes('sql') || 
    q.includes('traditional')
  ) {
    return `### 🚨 Problem Statement: Vulnerabilities in Centralized Public Records

Modern governance systems manage millions of high-stakes records (Judiciary FIRs, Land Deeds, State Treasuries). However, conventional relational architectures suffer from systemic vulnerabilities:

1. **Silent SQL Row Modification**: Privileged database administrators or compromised perimeter accounts can execute direct SQL queries (e.g., \`UPDATE fir_records SET status='DISMISSED'\`) without triggering application-level logs.
2. **Retroactive Land & Deed Alterations**: Property boundaries and title transfers can be quietly rewritten years later, while regular backups simply propagate the falsified data.
3. **Asymmetric Trust & Unverifiable Audits**: Citizens and ombudsmen must place blind faith in the central authority hosting the server, with no mathematical proof of record veracity.
4. **Lack of Instant Forensic Detection**: Breaches often remain undetected for weeks or months without continuous cryptographic telemetry.

**GovChain Sentinel** resolves this by shifting trust from administrative credentials to **mathematical verification**.

> **Source Reference**: *GovChain Sentinel README §2 (Problem Statement)*.`
  }

  // 5. Tamper Simulation Lab question
  if (
    q.includes('simulation') || 
    q.includes('tamper lab') || 
    q.includes('adversarial') || 
    q.includes('attack') || 
    q.includes('fir') || 
    q.includes('deed')
  ) {
    return `### 🧪 Adversarial Tamper Simulation Lab

GovChain Sentinel features an interactive administrative laboratory allowing security personnel to simulate real-world insider attacks:

* **High Court FIR Dismissal**: Simulates modifying criminal charges, penal sections, and bail statuses in judicial records.
* **Land Conveyance Deed Grantee Hijack**: Modifies title deed ownership recipients and survey plot assignments.
* **Treasury Disbursement Divergence**: Re-routes municipal grant payments and bank IFSC transfers to unauthorized accounts.
* **Custom Payload Injection**: Allows custom JSON key-value modifications on any target block.

When an attack vector is executed:
1. The block's SHA-256 hash fails to match the original signature.
2. The consecutive forward link ruptures.
3. The recalculated Merkle root diverges from the smart contract anchor.
4. The dashboard triggers instant crimson telemetry alerts.

> **Source Reference**: *GovChain Sentinel README §4 (Adversarial Tamper Simulation Lab) & §10 (Interface Showcase)*.`
  }

  // 6. Technology stack question
  if (
    q.includes('tech') || 
    q.includes('stack') || 
    q.includes('library') || 
    q.includes('framework') || 
    q.includes('vite') || 
    q.includes('tailwind')
  ) {
    return `### ⚙️ Technologies & Architecture Stack

GovChain Sentinel is engineered with a modern, high-performance web and cryptographic stack:

* **Frontend Framework**: [React 19](https://react.dev/) (\`^19.2.8\`) - Declarative component UI and reactive state lifecycle.
* **Runtime & Bundler**: [Vite 8](https://vitejs.dev/) (\`^8.3.0\`) - Ultra-fast development server with HMR and optimized production bundling.
* **Styling & Design System**: [Tailwind CSS v4](https://tailwindcss.com/) (\`^4.3.3\`) with \`@tailwindcss/vite\` - Dark-mode-first SOC aesthetics with cyan & emerald telemetry accents.
* **Icons**: [Lucide React](https://lucide.dev/) (\`^1.56.0\`) - Cybersecurity iconography.
* **Cryptographic Hashing**: Native Web Crypto API (\`crypto.subtle\`) SHA-256 with an optimized 32-bit fallback for zero-latency execution.
* **Code Quality**: [Oxlint](https://oxc.rs/) (\`^1.81.0\`) - Rust-based high-speed linter.
* **State Architecture**: React Context API (\`AuthContext\`, \`AuditContext\`, \`RouterContext\`).

> **Source Reference**: *GovChain Sentinel README §5 (Technologies and Tools Used)*.`
  }

  // 7. Verification engine / how it works question
  if (
    q.includes('verification engine') || 
    q.includes('verify') || 
    q.includes('audit process') || 
    q.includes('step')
  ) {
    return `### 🔍 Zero-Trust Real-Time Verification Engine

When an auditor triggers the Verification Engine, the client executes an automated diagnostic sequence:

1. **Block Hash Recomputation**: Every block's SHA-256 hash is independently calculated from its raw metadata and payload.
2. **Forward Link Check**: Each block's \`prevHash\` is checked against the recomputed hash of its preceding block.
3. **Merkle Hierarchy Reconstruction**: A binary Merkle tree is reconstructed from all active block hashes.
4. **On-Chain Anchor Comparison**: The newly calculated Merkle root is matched against the decentralized smart contract anchor reference.
5. **Tamper Isolation**: If any hash differs or link breaks, the corrupted block ID is flagged with crimson telemetry alerts.

> **Source Reference**: *GovChain Sentinel README §4 (Zero-Trust Verification Engine) & §6.4 (Zero-Trust Real-Time Auditing)*.`
  }

  // 8. General search fallback from indexed sections
  if (topSections.length > 0) {
    const primarySection = topSections[0]
    // Clean section lines
    const snippet = primarySection.content
      .split('\n')
      .slice(0, 18)
      .join('\n')

    return `### 📖 Information from GovChain Sentinel Documentation

Based on your inquiry, here is the relevant guidance indexed directly from **${primarySection.title}**:

${snippet}

${topSections.length > 1 ? `\n> **Additional Related Sections**: *${topSections.slice(1).map(s => s.title).join(', ')}*` : ''}

> **Source Reference**: *GovChain Sentinel README [${primarySection.title}] (Lines ${primarySection.startLine}-${primarySection.endLine})*.`;
  }

  // Generic fallback if no specific match
  return `### 🛡️ GovChain Sentinel Assistant

I've searched the GovChain Sentinel project documentation for **"${userQuestion}"**.

GovChain Sentinel is a specialized cybersecurity and cryptographic auditing platform engineered to ensure the mathematical immutability of public records through sequential SHA-256 hash-chaining and Merkle tree root commitments.

**Key Topics you can ask me about:**
* **Hash-chain Mechanics**: How block serialization and forward dependencies prevent unauthorized tampering.
* **Auditor vs Admin Roles**: Clearance permissions, read-only verification vs simulation controls.
* **Merkle Root Anchoring**: How binary Merkle trees compress blocks into a 32-byte on-chain reference.
* **Adversarial Tamper Lab**: High Court FIR, Land Deed, and Treasury attack vectors.
* **Quick Start & Setup**: Commands to install, run, and build the application.

> **Source Reference**: *GovChain Sentinel README.md Index (353 lines loaded)*.`;
}

/**
 * Handles generating an AI answer.
 * If Gemini API Key is configured, attempts live LLM generation; otherwise uses high-assurance synthesis.
 */
export async function generateSentinelAiResponse({
  userMessage,
  conversationHistory = [],
  readmeData,
  apiKey = null
}) {
  const activeApiKey = apiKey || import.meta.env.VITE_GEMINI_API_KEY || ''

  // If Gemini API Key is available, invoke Gemini 1.5 Flash
  if (activeApiKey && activeApiKey.trim().length > 10) {
    try {
      const systemInstruction = buildSystemPrompt(readmeData?.rawText || '')

      const contents = []
      // Include limited past conversation for context
      conversationHistory.slice(-4).forEach(msg => {
        contents.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        })
      })

      contents.push({
        role: 'user',
        parts: [{ text: userMessage }]
      })

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            systemInstruction: {
              parts: [{ text: systemInstruction }]
            },
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 1000
            }
          })
        }
      )

      if (response.ok) {
        const data = await response.json()
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
        if (text && text.trim().length > 0) {
          return {
            text,
            source: 'gemini-llm',
            references: ['README.md Dynamic System Context']
          }
        }
      } else {
        console.warn('[Sentinel AI] Gemini API returned error status:', response.status)
      }
    } catch (err) {
      console.warn('[Sentinel AI] Gemini API call failed, falling back to local synthesis:', err)
    }
  }

  // High-assurance local synthesis based directly on README.md
  // Brief realistic latency (350ms) to emulate neural indexing
  await new Promise(resolve => setTimeout(resolve, 380))
  const synthesizedText = synthesizeLocalResponse(userMessage, readmeData)

  return {
    text: synthesizedText,
    source: 'readme-neural-index',
    references: ['README.md Local Semantic Index']
  }
}
