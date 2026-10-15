import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { INITIAL_LOGS } from '../data/mockLogs'
import { fallbackSha256, calculateMerkleRoot } from '../utils/crypto'
import { generateMalwareCertificateData } from '../utils/certificateGenerator'

const AuditContext = createContext(null)

export function AuditProvider({ children }) {
  const [logs, setLogs] = useState(() => INITIAL_LOGS)
  const [isStreaming, setIsStreaming] = useState(false)
  const [lastVerificationResult, setLastVerificationResult] = useState({
    status: 'VALID', // 'VALID' | 'TAMPERED' | 'NOT_RUN'
    timestamp: new Date().toISOString(),
    corruptedBlockIds: [],
    brokenChainIndices: [],
    details: 'System integrity 100% verified against Ethereum L2 root commitment.'
  })

  // Folder Import Queue State & Modal
  const [importedFolderQueue, setImportedFolderQueue] = useState([])
  const [importedFolderName, setImportedFolderName] = useState('')
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false)

  // Malware Detection Certificate State & Modal
  const [malwareIncident, setMalwareIncident] = useState(null)
  const [isMalwareModalOpen, setIsMalwareModalOpen] = useState(false)

  // Canonical Smart Contract Merkle Root anchored from initial state
  const [onChainMerkleRoot, setOnChainMerkleRoot] = useState(() => {
    const hashes = INITIAL_LOGS.map(l => l.originalHash)
    return calculateMerkleRoot(hashes)
  })

  // Admin function: Commit new state Merkle root to decentralized smart contract
  const commitNewMerkleAnchor = useCallback((newRoot) => {
    setOnChainMerkleRoot(newRoot)
    return {
      txHash: `0x${fallbackSha256(newRoot + Date.now()).substring(0, 40)}`,
      blockNumber: 18409240 + Math.floor(Math.random() * 50),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      merkleRoot: newRoot,
      status: 'FINALIZED_ON_L2'
    }
  }, [])


  // Check current chain validity helper
  const performIntegrityAudit = useCallback(() => {
    const corruptedBlockIds = []
    const brokenChainIndices = []
    
    for (let i = 0; i < logs.length; i++) {
      const block = logs[i]
      const rawPayload = JSON.stringify(block.payload)
      const expectedContent = `${block.prevHash}|${block.blockHeight}|${block.timestamp}|${block.department}|${block.action}|${rawPayload}|${block.actor}`
      const recomputedHash = fallbackSha256(expectedContent)

      // 1. Check if payload matches stored hash
      if (recomputedHash !== block.currentHash || block.isTampered) {
        corruptedBlockIds.push(block.id)
      }

      // 2. Check if chain link to predecessor is intact
      if (i > 0) {
        const prevBlock = logs[i - 1]
        if (block.prevHash !== prevBlock.currentHash) {
          brokenChainIndices.push(i)
        }
      }
    }

    const currentHashes = logs.map(l => l.currentHash)
    const computedMerkleRoot = calculateMerkleRoot(currentHashes)
    const isRootMismatched = computedMerkleRoot !== onChainMerkleRoot
    const isValid = corruptedBlockIds.length === 0 && brokenChainIndices.length === 0 && !isRootMismatched

    const result = {
      status: isValid ? 'VALID' : 'TAMPERED',
      isValid,
      timestamp: new Date().toISOString(),
      corruptedBlockIds,
      brokenChainIndices,
      computedMerkleRoot,
      onChainMerkleRoot,
      totalChecked: logs.length,
      details: isValid
        ? 'All cryptographic SHA-256 block hashes and Merkle tree root match on-chain anchor.'
        : `CRITICAL INTEGRITY BREACH: Discrepancy detected in ${corruptedBlockIds.length} record(s) and Merkle root divergence.`
    }

    setLastVerificationResult(result)
    return result
  }, [logs, onChainMerkleRoot])

  // Tamper record simulation (Admin function)
  const tamperRecord = (logId, modifiedFields, threatSignature = null) => {
    let affectedItem = null

    setLogs(prevLogs => {
      return prevLogs.map(item => {
        if (item.id === logId) {
          const updatedPayload = { ...item.payload, ...modifiedFields }
          // Recompute altered hash to show modified data without consensus
          const rawPayloadString = JSON.stringify(updatedPayload)
          const blockContent = `${item.prevHash}|${item.blockHeight}|${item.timestamp}|${item.department}|${item.action}|${rawPayloadString}|${item.actor}`
          const alteredHash = fallbackSha256(blockContent)

          affectedItem = {
            ...item,
            payload: updatedPayload,
            currentHash: alteredHash,
            isTampered: true,
            tamperedAt: new Date().toISOString(),
            status: "Tampered (Divergent Hash)"
          }
          return affectedItem
        }
        return item
      })
    })

    // Immediately trigger alert status
    setLastVerificationResult(prev => ({
      ...prev,
      status: 'TAMPERED',
      details: `Alert: Unauthorized modification flagged on Record ${logId}. Run Verification Engine to inspect divergence.`
    }))

    // Generate formal malware/tampering certificate
    const cert = generateMalwareCertificateData({
      record: affectedItem || { id: logId, blockHeight: 1001, department: 'Judiciary', title: 'Tampered Audit Record' },
      threatSignature: threatSignature || 'CVE-2026-8819 // Tamper-Chain Malicious Payload Mutation',
      details: `Malicious payload injection executed on record ${logId}. SHA-256 hash diverged from consensus anchor.`
    })
    setMalwareIncident(cert)
    return cert
  }

  // Trigger manual or simulated malware alert
  const triggerMalwareIncident = (threatType = 'Zero-Day Ransomware Vector', targetLogId = null) => {
    const target = (targetLogId ? logs.find(l => l.id === targetLogId) : logs[0]) || logs[0]
    tamperRecord(target.id, {
      malwareSignature: "RANSOMWARE-PAYLOAD-INJECTED",
      encryptionStatus: "LOCKED_BY_MALWARE",
      demandedRansomBtc: "4.5 BTC"
    }, `CVE-2026-MALWARE // ${threatType}`)
    setIsMalwareModalOpen(true)
  }

  // Restore single record
  const restoreRecord = (logId) => {
    setLogs(prevLogs => {
      return prevLogs.map(item => {
        if (item.id === logId) {
          return {
            ...item,
            payload: JSON.parse(JSON.stringify(item.originalPayload)),
            currentHash: item.originalHash,
            isTampered: false,
            tamperedAt: null,
            status: "Anchored"
          }
        }
        return item
      })
    })
  }

  // Restore entire chain to genesis-verified state
  const resetAllRecords = () => {
    setLogs(INITIAL_LOGS)
    setMalwareIncident(null)
    const initialRoot = calculateMerkleRoot(INITIAL_LOGS.map(l => l.originalHash))
    setOnChainMerkleRoot(initialRoot)
    setLastVerificationResult({
      status: 'VALID',
      isValid: true,
      timestamp: new Date().toISOString(),
      corruptedBlockIds: [],
      brokenChainIndices: [],
      details: 'Blockchain restored to genesis state. All cryptographic blocks verified.'
    })
  }

  // Folder Import Handlers
  const addImportedFiles = (filesList, folderName = 'Local System Folder') => {
    setImportedFolderName(folderName)
    setImportedFolderQueue(filesList)
  }

  const clearImportedQueue = () => {
    setImportedFolderQueue([])
    setImportedFolderName('')
  }

  // Ingest imported folder files into the live hash-chain ledger
  const batchIngestImportedFiles = () => {
    if (!importedFolderQueue.length) return 0

    setLogs(prev => {
      let currentChain = [...prev]
      let lastBlock = currentChain[currentChain.length - 1]

      importedFolderQueue.forEach((file, idx) => {
        const newHeight = lastBlock.blockHeight + 1 + idx
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
        const newId = `LOG-${newHeight}`
        const filePayload = {
          fileName: file.name,
          relativePath: file.path,
          fileSize: file.size,
          mimeType: file.type || 'application/octet-stream',
          localChecksum: file.checksum,
          importedVia: 'GovChain System Folder Ingestion Pipeline',
          ingestTimestamp: timestamp
        }

        const rawPayloadString = JSON.stringify(filePayload)
        const blockContent = `${lastBlock.currentHash}|${newHeight}|${timestamp}|Local Ingestion Mesh|SYSTEM_FOLDER_INGEST|${rawPayloadString}|SYSTEM-FOLDER-PIPELINE`
        const currentHash = fallbackSha256(blockContent)

        const newLog = {
          id: newId,
          blockHeight: newHeight,
          timestamp,
          department: "Local Ingestion Mesh",
          title: `System Ingest: ${file.name}`,
          actor: "OFFICER-LOCAL-PIPELINE",
          action: "SYSTEM_FOLDER_INGEST",
          payload: filePayload,
          onChainTx: `0x${fallbackSha256(newId + timestamp)}`,
          prevHash: lastBlock.currentHash,
          currentHash,
          isTampered: false,
          originalPayload: JSON.parse(JSON.stringify(filePayload)),
          originalHash: currentHash,
          blockContent,
          status: "Anchored"
        }

        currentChain.push(newLog)
        lastBlock = newLog
      })

      return currentChain
    })

    // Mark imported queue items as anchored
    setImportedFolderQueue(prev => prev.map(f => ({ ...f, status: 'ANCHORED_IN_CHAIN' })))
    return importedFolderQueue.length
  }

  // Streaming simulated incoming government events
  useEffect(() => {
    if (!isStreaming) return

    const streamTemplates = [
      {
        department: "Judiciary",
        title: "Session Court Bail Application Filed",
        actor: "OFFICER-JUD-9910",
        action: "BAIL_PETITION_FILED",
        payload: { caseId: `CR-2026-${Math.floor(1000 + Math.random() * 9000)}`, status: "PENDING_HEARING", applicant: "M. K. Patel" }
      },
      {
        department: "Land Registry",
        title: "Agricultural Land Mutation Endorsement",
        actor: "SURVEYOR-UP-402",
        action: "LAND_MUTATION_ENDORSED",
        payload: { plotNo: `PLOT-${Math.floor(100 + Math.random() * 900)}`, zone: "Northern Greenbelt", verifiedGeoTag: true }
      },
      {
        department: "State Treasury",
        title: "Municipal Grant Subvention Cleared",
        actor: "COMPTROLLER-DL-11",
        action: "MUNI_GRANT_RELEASE",
        payload: { grantNo: `GR-${Math.floor(10000 + Math.random() * 90000)}`, amountInr: "12,500,000", approved: true }
      }
    ]

    const interval = setInterval(() => {
      setLogs(prev => {
        if (prev.length >= 15) return prev // keep manageable for demo
        const lastBlock = prev[prev.length - 1]
        const template = streamTemplates[Math.floor(Math.random() * streamTemplates.length)]
        const newHeight = lastBlock.blockHeight + 1
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
        const newId = `LOG-${newHeight}`
        const rawPayloadString = JSON.stringify(template.payload)
        const blockContent = `${lastBlock.currentHash}|${newHeight}|${timestamp}|${template.department}|${template.action}|${rawPayloadString}|${template.actor}`
        const currentHash = fallbackSha256(blockContent)

        const newLog = {
          id: newId,
          blockHeight: newHeight,
          timestamp,
          department: template.department,
          title: template.title,
          actor: template.actor,
          action: template.action,
          payload: template.payload,
          onChainTx: `0x${Math.random().toString(16).substring(2, 34)}${Math.random().toString(16).substring(2, 34)}`,
          prevHash: lastBlock.currentHash,
          currentHash,
          isTampered: false,
          originalPayload: JSON.parse(JSON.stringify(template.payload)),
          originalHash: currentHash,
          blockContent,
          status: "Anchored"
        }

        return [...prev, newLog]
      })
    }, 7000)

    return () => clearInterval(interval)
  }, [isStreaming])

  return (
    <AuditContext.Provider
      value={{
        logs,
        onChainMerkleRoot,
        lastVerificationResult,
        performIntegrityAudit,
        tamperRecord,
        restoreRecord,
        resetAllRecords,
        commitNewMerkleAnchor,
        isStreaming,
        setIsStreaming,
        // Folder Import Features
        importedFolderQueue,
        importedFolderName,
        isFolderModalOpen,
        openFolderModal: () => setIsFolderModalOpen(true),
        closeFolderModal: () => setIsFolderModalOpen(false),
        addImportedFiles,
        batchIngestImportedFiles,
        clearImportedQueue,
        // Malware Detection Features
        malwareIncident,
        isMalwareModalOpen,
        openMalwareModal: () => setIsMalwareModalOpen(true),
        closeMalwareModal: () => setIsMalwareModalOpen(false),
        triggerMalwareIncident,
        setMalwareIncident
      }}
    >
      {children}
    </AuditContext.Provider>
  )
}

export function useAudit() {
  const context = useContext(AuditContext)
  if (!context) {
    throw new Error('useAudit must be used within an AuditProvider')
  }
  return context
}
