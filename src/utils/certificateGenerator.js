/**
 * Official Malware Detection & Cryptographic Incident Certificate Generator
 * GovChain Sentinel // National Cyber Compliance Mesh
 */

import { fallbackSha256 } from './crypto'

export function generateMalwareCertificateData({
  incidentId = null,
  record = null,
  threatSignature = null,
  officer = null,
  details = null
} = {}) {
  const generatedId = incidentId || `INC-2026-MAL-${Math.floor(10000 + Math.random() * 90000)}`
  const now = new Date()
  const timestamp = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC'

  const targetBlock = record || {
    id: 'LOG-1001',
    blockHeight: 1001,
    department: 'Judiciary',
    title: 'High Court FIR Registry Record',
    originalHash: '4b78a99c8362b083e4d9c7482bb4062a4980da284f18db0c7e2d93e1b43a91e0',
    currentHash: 'd840c8fa21e646271927351654a9b2b545d947502bb1478170d10b8cf8189c42'
  }

  const signature = threatSignature || 'CVE-2026-8819 // Tamper-Chain Malicious Payload Mutation'
  const digitalSeal = '0x' + fallbackSha256(`${generatedId}|${targetBlock.id}|${timestamp}|MALWARE_FLAGGED`)

  return {
    organization: 'GovChain Sentinel // National SOC Compliance Mesh',
    incidentId: generatedId,
    timestamp,
    severity: 'CRITICAL (SEV-1)',
    threatSignature: signature,
    threatClassification: 'Unauthorized Database Mutation & Hash Divergence Vector',
    status: 'SECURITY BREACH CONFIRMED // QUARANTINE ENGAGED',
    recordId: targetBlock.id,
    blockHeight: targetBlock.blockHeight,
    department: targetBlock.department,
    recordTitle: targetBlock.title,
    expectedHash: targetBlock.originalHash || '0xGENESIS_ANCHORED_DIGEST',
    divergentHash: targetBlock.currentHash || '0xMUTATED_DIVERGENT_DIGEST',
    hashComparisonResult: 'CRITICAL FAILURE - SHA-256 CHECKSUM MISMATCH',
    merkleRootFailure: 'Root discrepancy detected against Ethereum L2 consensus anchor',
    forensicDetails: details || 'Adversarial SQL row mutation detected. Predecessor chain linkage severed. Forward cryptographic integrity compromised.',
    investigatingOfficer: officer?.name || 'Commander Vikram Dev (Level-5 SOC Director)',
    officerClearance: officer?.clearance || 'LEVEL-5 DIRECTIVE ACCESS',
    digitalSeal
  }
}

/**
 * Creates and downloads a standalone, printable official security certificate
 */
export function downloadMalwareCertificate(certData) {
  const data = certData || generateMalwareCertificateData()

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Security Certificate - ${data.incidentId}</title>
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    body {
      font-family: 'Courier New', Courier, monospace;
      background: #020617;
      color: #e2e8f0;
      padding: 30px;
      margin: 0;
      box-sizing: border-box;
    }
    .cert-container {
      border: 3px double #ef4444;
      background: #0b1120;
      padding: 35px;
      position: relative;
      box-shadow: 0 0 30px rgba(239, 68, 68, 0.25);
    }
    .cert-corner {
      position: absolute;
      width: 16px;
      height: 16px;
      border-color: #ef4444;
      border-style: solid;
    }
    .tl { top: 6px; left: 6px; border-width: 2px 0 0 2px; }
    .tr { top: 6px; right: 6px; border-width: 2px 2px 0 0; }
    .bl { bottom: 6px; left: 6px; border-width: 0 0 2px 2px; }
    .br { bottom: 6px; right: 6px; border-width: 0 2px 2px 0; }
    .header {
      text-align: center;
      border-bottom: 2px solid #ef4444;
      padding-bottom: 20px;
      margin-bottom: 25px;
    }
    .org-badge {
      display: inline-block;
      font-size: 11px;
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid #ef4444;
      color: #f87171;
      padding: 4px 12px;
      margin-bottom: 12px;
      letter-spacing: 2px;
    }
    h1 {
      margin: 0;
      font-size: 22px;
      color: #ef4444;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    h2 {
      margin: 6px 0 0;
      font-size: 13px;
      color: #94a3b8;
      font-weight: normal;
      letter-spacing: 1px;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 25px;
      font-size: 12px;
    }
    .meta-item {
      background: #020617;
      padding: 10px 14px;
      border: 1px solid #1e293b;
    }
    .meta-label {
      color: #64748b;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 4px;
    }
    .meta-value {
      font-weight: bold;
      color: #f1f5f9;
    }
    .meta-value.critical {
      color: #ef4444;
    }
    .section-title {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #06b6d4;
      border-left: 3px solid #06b6d4;
      padding-left: 8px;
      margin: 20px 0 10px;
    }
    .hash-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      font-size: 11px;
    }
    .hash-table th, .hash-table td {
      border: 1px solid #1e293b;
      padding: 8px 10px;
      text-align: left;
    }
    .hash-table th {
      background: #020617;
      color: #94a3b8;
    }
    .hash-table td {
      background: #090d16;
      word-break: break-all;
    }
    .hash-divergent {
      color: #f87171;
      font-weight: bold;
    }
    .hash-expected {
      color: #10b981;
    }
    .details-box {
      background: #020617;
      border: 1px solid #334155;
      padding: 12px;
      font-size: 11px;
      color: #cbd5e1;
      line-height: 1.6;
      margin-bottom: 25px;
    }
    .seal-box {
      border-top: 1px dashed #334155;
      padding-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 11px;
    }
    .seal-signature {
      max-width: 65%;
      word-break: break-all;
      color: #64748b;
    }
    .seal-badge {
      text-align: right;
      border: 2px solid #ef4444;
      padding: 8px 14px;
      color: #ef4444;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      transform: rotate(-3deg);
    }
    .print-btn {
      display: block;
      margin: 20px auto 0;
      background: #ef4444;
      color: white;
      border: none;
      padding: 10px 20px;
      font-family: inherit;
      font-weight: bold;
      cursor: pointer;
      border-radius: 4px;
    }
    @media print {
      body { background: #fff; color: #000; padding: 0; }
      .cert-container { background: #fff; border-color: #991b1b; box-shadow: none; }
      .meta-item, .details-box, .hash-table td, .hash-table th { background: #f8fafc; border-color: #cbd5e1; color: #000; }
      .print-btn { display: none; }
    }
  </style>
</head>
<body>
  <div class="cert-container">
    <div class="cert-corner tl"></div>
    <div class="cert-corner tr"></div>
    <div class="cert-corner bl"></div>
    <div class="cert-corner br"></div>

    <div class="header">
      <div class="org-badge">${data.organization}</div>
      <h1>Official Malware & Tamper Incident Certificate</h1>
      <h2>Cryptographic Ledger Invalidation & Hash Failure Report</h2>
    </div>

    <div class="meta-grid">
      <div class="meta-item">
        <div class="meta-label">Incident Tracking ID</div>
        <div class="meta-value critical">${data.incidentId}</div>
      </div>
      <div class="meta-item">
        <div class="meta-label">Detection Timestamp</div>
        <div class="meta-value">${data.timestamp}</div>
      </div>
      <div class="meta-item">
        <div class="meta-label">Severity Level</div>
        <div class="meta-value critical">${data.severity}</div>
      </div>
      <div class="meta-item">
        <div class="meta-label">Incident Status</div>
        <div class="meta-value critical">${data.status}</div>
      </div>
      <div class="meta-item">
        <div class="meta-label">Threat Signature</div>
        <div class="meta-value">${data.threatSignature}</div>
      </div>
      <div class="meta-item">
        <div class="meta-label">Threat Classification</div>
        <div class="meta-value">${data.threatClassification}</div>
      </div>
    </div>

    <div class="section-title">Compromised Audit Block Metadata</div>
    <table class="hash-table">
      <tr>
        <th style="width: 25%;">Target Record ID</th>
        <td>${data.recordId} (Block #${data.blockHeight})</td>
      </tr>
      <tr>
        <th>Affected Department</th>
        <td>${data.department} // ${data.recordTitle}</td>
      </tr>
      <tr>
        <th>Expected Anchor Hash</th>
        <td class="hash-expected">${data.expectedHash}</td>
      </tr>
      <tr>
        <th>Divergent Recalculated Hash</th>
        <td class="hash-divergent">${data.divergentHash}</td>
      </tr>
      <tr>
        <th>Verification Verdict</th>
        <td class="hash-divergent">${data.hashComparisonResult}</td>
      </tr>
      <tr>
        <th>Merkle Consensus Status</th>
        <td class="hash-divergent">${data.merkleRootFailure}</td>
      </tr>
    </table>

    <div class="section-title">Forensic Diagnostic Details</div>
    <div class="details-box">
      ${data.forensicDetails}
      <br><br>
      <strong>Action Taken:</strong> The affected block has been quarantined. Network validators have rejected forward block proposals referencing the mutated digest. Cryptographic integrity alerts have been distributed to SOC personnel.
    </div>

    <div class="seal-box">
      <div class="seal-signature">
        <div><strong>Investigating Officer:</strong> ${data.investigatingOfficer}</div>
        <div><strong>Clearance:</strong> ${data.officerClearance}</div>
        <div style="margin-top: 6px;"><strong>Digital Seal:</strong> ${data.digitalSeal}</div>
      </div>
      <div class="seal-badge">
        MALWARE FLAGGED<br>TAMPER DETECTED
      </div>
    </div>

    <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
  </div>
</body>
</html>`

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `GovChain_Sentinel_Malware_Certificate_${data.incidentId}.html`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
