import React, { useState } from 'react'
import { ShieldCheck, Download, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { generateInjectedPayloadCertificate, downloadCertificateFile } from '../../utils/payloadCertificate'

/**
 * InjectedPayloadCertificateButton
 * 
 * Reusable, security-grade UI button that captures active payload details,
 * computes SHA-256 via Web Crypto API, generates a certificate, and triggers download.
 */
export default function InjectedPayloadCertificateButton({
  payload,
  sourceId = 'LOG-TARGET',
  sourceName = 'Database Transaction Record',
  threatVector = 'ADVERSARIAL_PAYLOAD_MUTATION',
  className = '',
  buttonLabel = 'Injected Payload Certificate'
}) {
  const [status, setStatus] = useState('idle') // 'idle' | 'generating' | 'success' | 'error'
  const [feedbackMessage, setFeedbackMessage] = useState('')

  const handleGenerateAndDownload = async () => {
    if (!payload) {
      setStatus('error')
      setFeedbackMessage('No injected payload detected to certify.')
      setTimeout(() => setStatus('idle'), 3500)
      return
    }

    try {
      setStatus('generating')
      setFeedbackMessage('Computing SHA-256 & signing certificate...')

      // Generate certificate with Web Crypto SHA-256
      const cert = await generateInjectedPayloadCertificate({
        payload,
        sourceId,
        sourceName,
        threatVector,
        operator: 'Forensic System Auditor'
      })

      // Programmatic Blob download
      const result = downloadCertificateFile(cert)

      setStatus('success')
      setFeedbackMessage(`Downloaded ${result.filename}`)
      setTimeout(() => {
        setStatus('idle')
        setFeedbackMessage('')
      }, 4000)
    } catch (err) {
      console.error('[InjectedPayloadCertificate] Generation error:', err)
      setStatus('error')
      setFeedbackMessage(err.message || 'Failed to generate certificate.')
      setTimeout(() => {
        setStatus('idle')
        setFeedbackMessage('')
      }, 4000)
    }
  }

  return (
    <div className="inline-flex flex-col items-start gap-1.5 w-full">
      <button
        type="button"
        id="injected-payload-cert-btn"
        onClick={handleGenerateAndDownload}
        disabled={status === 'generating'}
        className={`w-full py-2.5 px-4 rounded-xl font-mono text-xs font-bold transition-all duration-200 flex items-center justify-center space-x-2 border shadow-sm ${
          status === 'generating'
            ? 'bg-slate-800 border-slate-700 text-slate-400 cursor-wait'
            : status === 'success'
            ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 shadow-emerald-900/30'
            : status === 'error'
            ? 'bg-red-950/80 border-red-500/60 text-red-300 shadow-red-900/30'
            : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border-cyan-400/40 text-white shadow-cyan-900/20 active:scale-[0.99]'
        } ${className}`}
      >
        {status === 'generating' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            <span>Generating Certificate...</span>
          </>
        ) : status === 'success' ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Certificate Downloaded</span>
          </>
        ) : status === 'error' ? (
          <>
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span>Generation Failed</span>
          </>
        ) : (
          <>
            <ShieldCheck className="w-4 h-4 text-cyan-200" />
            <Download className="w-3.5 h-3.5 text-cyan-100" />
            <span>{buttonLabel}</span>
          </>
        )}
      </button>

      {/* Micro-Feedback Notification Banner */}
      {feedbackMessage && (
        <div
          role="status"
          className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border w-full flex items-center space-x-1.5 animate-fadeIn ${
            status === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : status === 'error'
              ? 'bg-red-950/40 border-red-500/30 text-red-300'
              : 'bg-slate-900 border-slate-700 text-slate-300'
          }`}
        >
          <span className="truncate">{feedbackMessage}</span>
        </div>
      )}
    </div>
  )
}
