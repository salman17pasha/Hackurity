import { useState, useRef } from 'react'
import { 
  UploadCloud, 
  FileCheck2, 
  ShieldCheck, 
  ShieldAlert, 
  File, 
  Download, 
  RefreshCw, 
  Copy, 
  Check, 
  Zap, 
  Cpu,
  FileCode,
  HardDrive,
  AlertTriangle,
  Sparkles
} from 'lucide-react'
import { calculateFileWebCryptoSha256, fallbackSha256 } from '../../utils/crypto'

export default function FileTamperVerifier({ logs, activeLog, onLogSelect }) {
  const fileInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isHashing, setIsHashing] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [copiedHash, setCopiedHash] = useState(false)
  const [simulatedTamperActive, setSimulatedTamperActive] = useState(false)
  const [comparisonMode, setComparisonMode] = useState('active_block') // 'active_block' | 'chain_search'

  // Reference blockchain state
  const targetReferenceHash = activeLog?.currentHash || logs[0]?.currentHash || ''

  // Format file size
  const formatSize = (bytes) => {
    if (!bytes && bytes !== 0) return '0 B'
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${bytes} B`
  }

  // Process file upload and compute Web Crypto SHA-256
  const processUploadedFile = async (file) => {
    if (!file) return
    setIsHashing(true)
    setSimulatedTamperActive(false)

    try {
      // Calculate SHA-256 using Web Crypto API
      const computedHash = await calculateFileWebCryptoSha256(file)

      setUploadedFile({
        name: file.name,
        size: formatSize(file.size),
        rawSize: file.size,
        type: file.type || 'application/octet-stream',
        lastModified: new Date(file.lastModified).toLocaleString(),
        sha256: computedHash,
        originalComputedHash: computedHash
      })
    } catch (err) {
      console.error('File hashing error:', err)
    } finally {
      setIsHashing(false)
    }
  }

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer?.files
    if (files && files.length > 0) {
      await processUploadedFile(files[0])
    }
  }

  const handleFileInputChange = async (e) => {
    const files = e.target.files
    if (files && files.length > 0) {
      await processUploadedFile(files[0])
    }
  }

  const triggerFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
      fileInputRef.current.click()
    }
  }

  // Copy hash helper
  const handleCopyHash = (text) => {
    navigator.clipboard.writeText(text)
    setCopiedHash(true)
    setTimeout(() => setCopiedHash(false), 2000)
  }

  // Download authentic reference sample for active block
  const handleDownloadAuthenticSample = () => {
    if (!activeLog) return
    // The exact blockContent used to calculate the block hash
    const content = activeLog.blockContent || `${activeLog.prevHash}|${activeLog.blockHeight}|${activeLog.timestamp}|${activeLog.department}|${activeLog.action}|${JSON.stringify(activeLog.originalPayload)}|${activeLog.actor}`
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `GovChain_Block_${activeLog.blockHeight}_Authentic_${activeLog.department.replace(/\s+/g, '_')}.log`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Simulate file tampering by modifying 1 byte / mutating the hash
  const handleToggleSimulateTamper = () => {
    if (!uploadedFile) return

    if (!simulatedTamperActive) {
      // Simulate 1-byte alteration by hashing corrupted payload
      const tamperedHash = fallbackSha256(uploadedFile.originalComputedHash + '_TAMPERED_BYTE_0xFF')
      setUploadedFile(prev => ({
        ...prev,
        sha256: tamperedHash
      }))
      setSimulatedTamperActive(true)
    } else {
      // Restore authentic hash
      setUploadedFile(prev => ({
        ...prev,
        sha256: prev.originalComputedHash
      }))
      setSimulatedTamperActive(false)
    }
  }

  // Calculate Verification Status
  let isAuthentic = false
  let matchedBlock = null

  if (uploadedFile) {
    if (comparisonMode === 'active_block') {
      isAuthentic = uploadedFile.sha256.toLowerCase() === targetReferenceHash.toLowerCase()
      if (isAuthentic) matchedBlock = activeLog
    } else {
      // Search across all blockchain blocks
      matchedBlock = logs.find(
        l => l.currentHash.toLowerCase() === uploadedFile.sha256.toLowerCase() ||
             l.originalHash?.toLowerCase() === uploadedFile.sha256.toLowerCase()
      )
      isAuthentic = Boolean(matchedBlock)
    }
  }

  return (
    <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-sm space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-400">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              File Import & Cryptographic Tamper Verification
            </h2>
            <p className="text-[11px] font-mono text-slate-400">
              Web Crypto SHA-256 Engine // Real-Time Blockchain State Comparison
            </p>
          </div>
        </div>

        {/* Quick Demo Helper */}
        <button
          onClick={handleDownloadAuthenticSample}
          className="px-3 py-1.5 rounded-lg text-[11px] font-mono bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/70 transition-all flex items-center space-x-1.5 shadow-sm"
          title="Download an authentic sample file that perfectly matches the active block reference hash"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Authentic Block #{activeLog?.blockHeight} Sample</span>
        </button>
      </div>

      {/* Comparison Reference Selector */}
      <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center space-x-2">
          <span className="text-slate-400">Comparison Target:</span>
          <div className="flex space-x-1.5">
            <button
              onClick={() => setComparisonMode('active_block')}
              className={`px-2.5 py-1 rounded-md text-[11px] transition-colors ${
                comparisonMode === 'active_block'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Active Block #{activeLog?.blockHeight}
            </button>
            <button
              onClick={() => setComparisonMode('chain_search')}
              className={`px-2.5 py-1 rounded-md text-[11px] transition-colors ${
                comparisonMode === 'chain_search'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Entire Chain Search
            </button>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 truncate max-w-xs">
          Reference Hash: <code className="text-cyan-300 font-bold">{targetReferenceHash.substring(0, 16)}...</code>
        </div>
      </div>

      {/* Drag & Drop File Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFilePicker}
        className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-cyan-400 bg-cyan-950/30 scale-[1.01] shadow-cyan-glow'
            : 'border-slate-800 hover:border-cyan-500/50 bg-slate-950/60 hover:bg-slate-950/80'
        }`}
      >
        {/* Hidden File Picker Input */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileInputChange}
          className="hidden"
          id="fileTamperInput"
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="p-3 rounded-2xl bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 mb-1">
            <UploadCloud className="w-8 h-8 animate-pulse" />
          </div>
          
          <div className="font-mono text-xs font-bold text-slate-200">
            {isDragging ? 'Drop file to compute SHA-256 digest...' : 'Drag & drop any system file here, or click to browse'}
          </div>

          <p className="font-mono text-[11px] text-slate-400 max-w-md">
            Import any file from your computer (.log, .json, .txt, .pdf, .docx, images).
            The SHA-256 hash will be calculated instantly in-browser via the Web Crypto API.
          </p>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              triggerFilePicker()
            }}
            className="mt-2 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 transition-colors flex items-center space-x-1.5"
          >
            <File className="w-3.5 h-3.5 text-cyan-400" />
            <span>Select File From System</span>
          </button>
        </div>
      </div>

      {/* Calculating Spinner */}
      {isHashing && (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center space-x-3 text-xs font-mono text-cyan-300 animate-pulse">
          <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
          <span>Hashing file payload with Web Crypto API (SHA-256)...</span>
        </div>
      )}

      {/* Verification Result Card */}
      {uploadedFile && !isHashing && (
        <div className={`p-5 rounded-2xl border transition-all duration-300 font-mono text-xs ${
          isAuthentic
            ? 'bg-emerald-950/30 border-emerald-500/60 shadow-emerald-glow'
            : 'bg-red-950/30 border-red-500/60 shadow-crimson-glow'
        }`}>
          
          {/* Top Badge & Status Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
            <div className="flex items-center space-x-3">
              <div className={`p-2.5 rounded-xl border ${
                isAuthentic 
                  ? 'bg-emerald-950/70 border-emerald-500 text-emerald-400' 
                  : 'bg-red-950/70 border-red-500 text-red-400'
              }`}>
                {isAuthentic ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6 animate-pulse" />}
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  {/* The Green / Red Badge as explicitly required */}
                  {isAuthentic ? (
                    <span 
                      id="verificationBadge"
                      className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 border border-emerald-500 text-emerald-300 flex items-center space-x-1.5 shadow-sm"
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>Intact / Authentic</span>
                    </span>
                  ) : (
                    <span 
                      id="verificationBadge"
                      className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/20 border border-red-500 text-red-300 flex items-center space-x-1.5 shadow-sm"
                    >
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                      <span>Tamper Detected</span>
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {isAuthentic 
                    ? `File SHA-256 matches blockchain state (Block #${matchedBlock?.blockHeight || activeLog.blockHeight})` 
                    : 'Cryptographic divergence: Hash does not match the blockchain reference anchor'}
                </div>
              </div>
            </div>

            {/* Quick Tamper Mutation Simulation Button */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleToggleSimulateTamper}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 border ${
                  simulatedTamperActive
                    ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60'
                    : 'bg-red-950/80 border-red-500/50 text-red-300 hover:bg-red-900/60'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{simulatedTamperActive ? 'Revert to Original File' : 'Simulate File Tampering (Flip 1 Byte)'}</span>
              </button>
            </div>
          </div>

          {/* File Meta Grid */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
            <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
              <span className="text-slate-500 block">FILE NAME</span>
              <span className="text-slate-200 font-semibold truncate block mt-0.5">{uploadedFile.name}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
              <span className="text-slate-500 block">FILE SIZE / TYPE</span>
              <span className="text-slate-200 truncate block mt-0.5">{uploadedFile.size} ({uploadedFile.type})</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
              <span className="text-slate-500 block">LAST MODIFIED</span>
              <span className="text-slate-200 truncate block mt-0.5">{uploadedFile.lastModified}</span>
            </div>
          </div>

          {/* Hash Comparison Strip */}
          <div className="mt-3 space-y-2 text-[11px]">
            
            {/* Computed File Hash */}
            <div className="p-3 rounded-lg bg-slate-950/90 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span>CALCULATED FILE SHA-256 (WEB CRYPTO API):</span>
                <button
                  onClick={() => handleCopyHash(uploadedFile.sha256)}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
                >
                  {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedHash ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className={`break-all font-mono font-bold ${
                isAuthentic ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {uploadedFile.sha256}
              </div>
            </div>

            {/* Reference Blockchain Hash */}
            <div className="p-3 rounded-lg bg-slate-950/90 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span>BLOCKCHAIN REFERENCE STATE HASH:</span>
                <span className="text-slate-500">
                  Target: {activeLog?.department} (#{activeLog?.blockHeight})
                </span>
              </div>
              <div className="break-all font-mono text-cyan-300">
                {targetReferenceHash}
              </div>
            </div>

          </div>

          {/* Interactive Advice */}
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-slate-400">
            <div>
              {isAuthentic ? (
                <span className="text-emerald-400 flex items-center space-x-1">
                  <span>✔ Zero discrepancies detected. File matches on-chain Merkle commitment.</span>
                </span>
              ) : (
                <span className="text-red-400 flex items-center space-x-1">
                  <AlertTriangle className="w-3.5 h-3.5 inline mr-1" />
                  <span>Discrepancy detected: Content has been modified, corrupted, or does not originate from this block.</span>
                </span>
              )}
            </div>

            <button
              onClick={() => {
                setUploadedFile(null)
                setSimulatedTamperActive(false)
              }}
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              Clear & Verify Another File
            </button>
          </div>

        </div>
      )}

    </div>
  )
}
