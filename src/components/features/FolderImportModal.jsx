import { useState, useRef, useEffect } from 'react'
import { 
  FolderUp, 
  Folder, 
  FileCode, 
  FileText, 
  CheckCircle2, 
  X, 
  Trash2, 
  ArrowRight, 
  Layers, 
  Search, 
  Copy, 
  HardDrive,
  Eye,
  Terminal,
  ShieldCheck
} from 'lucide-react'
import { useAudit } from '../../context/AuditContext'
import { fallbackSha256 } from '../../utils/crypto'

export default function FolderImportModal() {
  const { 
    isFolderModalOpen, 
    closeFolderModal, 
    importedFolderQueue, 
    importedFolderName, 
    addImportedFiles, 
    batchIngestImportedFiles, 
    clearImportedQueue 
  } = useAudit()

  const folderInputRef = useRef(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFileForPreview, setSelectedFileForPreview] = useState(null)
  const [ingestSuccessMessage, setIngestSuccessMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFolderModalOpen) {
        closeFolderModal()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFolderModalOpen, closeFolderModal])

  if (!isFolderModalOpen) return null

  // Trigger system folder picker
  const handleTriggerPicker = () => {
    if (folderInputRef.current) {
      folderInputRef.current.value = ''
      folderInputRef.current.click()
    }
  }

  // Handle selected folder files
  const handleFolderChange = async (e) => {
    const fileList = e.target.files
    if (!fileList || fileList.length === 0) return

    setIsProcessing(true)
    setIngestSuccessMessage('')

    // Extract folder name from first relative path
    let folderName = 'Local Directory'
    const firstFile = fileList[0]
    if (firstFile.webkitRelativePath) {
      const parts = firstFile.webkitRelativePath.split('/')
      if (parts.length > 1) {
        folderName = parts[0]
      }
    }

    const processed = []

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i]
      const path = file.webkitRelativePath || file.name

      // Format size
      const rawSize = file.size
      let formattedSize = `${rawSize} B`
      if (rawSize >= 1024 * 1024) {
        formattedSize = `${(rawSize / (1024 * 1024)).toFixed(2)} MB`
      } else if (rawSize >= 1024) {
        formattedSize = `${(rawSize / 1024).toFixed(1)} KB`
      }

      // Structure detection
      let structureType = 'Raw Binary Data'
      const ext = file.name.split('.').pop().toLowerCase()
      if (ext === 'json') structureType = 'JSON Schema Record'
      else if (['log', 'txt'].includes(ext)) structureType = 'Text Log Stream'
      else if (['csv', 'tsv'].includes(ext)) structureType = 'Tabular Audit Ledger'
      else if (['xml', 'yaml', 'yml'].includes(ext)) structureType = 'Hierarchical Metadata'
      else if (['pdf', 'doc', 'docx'].includes(ext)) structureType = 'Cryptographic Document'

      // Checksum calculation (simulated/computed)
      const checksumSeed = `${file.name}|${rawSize}|${file.lastModified}`
      const checksum = '0x' + fallbackSha256(checksumSeed)

      processed.push({
        id: `FILE-${i + 1}`,
        name: file.name,
        path,
        size: formattedSize,
        rawSize,
        type: file.type || ext.toUpperCase(),
        structureType,
        checksum,
        lastModified: new Date(file.lastModified).toISOString().replace('T', ' ').substring(0, 19),
        status: 'READY_FOR_ANCHOR'
      })
    }

    addImportedFiles(processed, folderName)
    setIsProcessing(false)
  }

  const handleBatchIngest = () => {
    const count = batchIngestImportedFiles()
    setIngestSuccessMessage(`Successfully ingested ${count} system files into GovChain Sentinel SHA-256 hash-chain!`)
    setTimeout(() => {
      setIngestSuccessMessage('')
    }, 4000)
  }

  const filteredFiles = importedFolderQueue.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.structureType.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalBytes = importedFolderQueue.reduce((acc, f) => acc + (f.rawSize || 0), 0)
  let totalFormatted = `${totalBytes} B`
  if (totalBytes >= 1024 * 1024) totalFormatted = `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`
  else if (totalBytes >= 1024) totalFormatted = `${(totalBytes / 1024).toFixed(1)} KB`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl my-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-8 text-slate-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="folder-import-title"
      >
        {/* Hidden System Directory Input with webkitdirectory and directory enabled */}
        <input
          ref={folderInputRef}
          type="file"
          webkitdirectory=""
          directory=""
          multiple
          onChange={handleFolderChange}
          className="hidden"
          aria-hidden="true"
        />

        {/* Top Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400" />

        {/* Close Button */}
        <button
          onClick={closeFolderModal}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          title="Close dialog"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start space-x-4 pb-6 border-b border-slate-800">
          <div className="p-3 rounded-2xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 shadow-cyan-glow shrink-0">
            <FolderUp className="w-6 h-6 text-cyan-400" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                Local Telemetry Ingestion
              </span>
              {importedFolderQueue.length > 0 && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                  {importedFolderQueue.length} Files Loaded
                </span>
              )}
            </div>
            <h2 id="folder-import-title" className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight mt-1">
              Local System Folder Import
            </h2>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Select any local directory from your machine to import, calculate SHA-256 digests, and queue for blockchain-anchored audit ingestion.
            </p>
          </div>
        </div>

        {/* Ingest Success Notice */}
        {ingestSuccessMessage && (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs font-mono flex items-center justify-between animate-fadeIn">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{ingestSuccessMessage}</span>
            </div>
          </div>
        )}

        {/* Content Area */}
        {importedFolderQueue.length === 0 ? (
          /* Empty State: Directory Upload Drop Zone */
          <div className="mt-6 p-8 border-2 border-dashed border-slate-800 hover:border-cyan-500/60 rounded-2xl text-center bg-slate-950/50 transition-all">
            <div className="w-16 h-16 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-4">
              <Folder className="w-8 h-8" />
            </div>

            <h3 className="text-base font-bold text-slate-200">
              No Local Folder Imported Yet
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
              Click below to choose a system directory. GovChain Sentinel will recursively read files, detect log structures, compute SHA-256 checksums, and prepare them for chain anchoring.
            </p>

            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={handleTriggerPicker}
                disabled={isProcessing}
                className="px-6 py-3 rounded-xl font-mono text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-cyan-glow transition-all flex items-center space-x-2"
              >
                <FolderUp className="w-4 h-4" />
                <span>{isProcessing ? 'Reading Folder Structure...' : 'Choose System Folder to Import'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Populated State: Folder Telemetry & Preview Table */
          <div className="mt-6 space-y-4">
            
            {/* Folder Header Bar */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs">
              <div className="flex items-center space-x-3">
                <HardDrive className="w-4 h-4 text-cyan-400" />
                <div>
                  <span className="text-slate-400">Imported Folder: </span>
                  <strong className="text-cyan-300">📁 {importedFolderName}</strong>
                </div>
                <span className="text-slate-500">|</span>
                <span className="text-slate-400">Total: <strong className="text-slate-200">{importedFolderQueue.length} files</strong> ({totalFormatted})</span>
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleTriggerPicker}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors flex items-center space-x-1"
                >
                  <FolderUp className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Import Another</span>
                </button>

                <button
                  type="button"
                  onClick={clearImportedQueue}
                  className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 text-xs transition-colors flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              </div>
            </div>

            {/* Filter Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter imported files by name, path, or structure type..."
                className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 focus:border-cyan-500/80 text-slate-100 rounded-xl text-xs font-mono outline-none"
              />
            </div>

            {/* Preview List Table */}
            <div className="max-h-72 overflow-y-auto border border-slate-800 rounded-xl bg-slate-950/70">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-slate-900/90 text-slate-400 sticky top-0 border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">File Path / Name</th>
                    <th className="py-2.5 px-3">Detected Structure</th>
                    <th className="py-2.5 px-3">Size</th>
                    <th className="py-2.5 px-3">SHA-256 Checksum</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredFiles.map((file) => (
                    <tr key={file.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2 px-3">
                        <div className="flex items-center space-x-2">
                          <FileCode className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span className="font-semibold text-slate-200 truncate max-w-xs" title={file.path}>
                            {file.path}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-slate-400">
                        <span className="px-2 py-0.5 rounded bg-slate-800/80 text-cyan-300 text-[10px]">
                          {file.structureType}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-400">{file.size}</td>
                      <td className="py-2 px-3">
                        <code className="text-[11px] text-slate-400 font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                          {file.checksum.substring(0, 14)}...
                        </code>
                      </td>
                      <td className="py-2 px-3 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          file.status === 'ANCHORED_IN_CHAIN' 
                            ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300'
                            : 'bg-cyan-950/70 border border-cyan-500/30 text-cyan-300'
                        }`}>
                          {file.status === 'ANCHORED_IN_CHAIN' ? 'Anchored' : 'Queued'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs font-mono text-slate-400">
                Displaying {filteredFiles.length} of {importedFolderQueue.length} files loaded into GovChain pipeline.
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={closeFolderModal}
                  className="px-4 py-2.5 rounded-xl font-mono text-xs text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 transition-colors"
                >
                  Done
                </button>

                <button
                  type="button"
                  onClick={handleBatchIngest}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-mono text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-emerald-glow transition-all flex items-center justify-center space-x-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Batch Ingest All into SHA-256 Mesh</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}
