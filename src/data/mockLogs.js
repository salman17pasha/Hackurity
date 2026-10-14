import { fallbackSha256 } from '../utils/crypto'

const rawData = [
  {
    id: "LOG-1001",
    blockHeight: 1001,
    timestamp: "2026-10-13 09:15:22 UTC",
    department: "Judiciary",
    title: "High Court FIR Registry Amendment",
    actor: "OFFICER-JUD-8842 (Registrar)",
    action: "FIR_CHARGE_ENTRY",
    payload: {
      caseNumber: "CR-4412/2026",
      firId: "FIR-MH-2024-8921",
      accused: "Arjun R. Sharma",
      charges: "IPC Section 420, 406 (Cheating and Criminal Breach)",
      courtBench: "Court Room 4, Division Bench",
      bailStatus: "REJECTED - Judicial Custody Extended 14 Days",
      presidingJudge: "Hon. Justice V. Menon"
    },
    onChainTx: "0x4b78a99c8362b083e4d9c7482bb4062a4980da284f18db0c7e2d93e1b43a91e0"
  },
  {
    id: "LOG-1002",
    blockHeight: 1002,
    timestamp: "2026-10-13 10:04:47 UTC",
    department: "Land Registry",
    title: "Commercial Land Conveyance Deed",
    actor: "SURVEYOR-KA-119 (Sub-Registrar)",
    action: "LAND_TITLE_TRANSFER",
    payload: {
      deedNumber: "DEED-2026-BLR-8819",
      parcelId: "SURVEY-142/3-KA",
      location: "Whitefield Tech Corridor, Bengaluru",
      areaSqFt: "196,000 (4.5 Acres)",
      grantor: "Narayana Estate Holdings Ltd",
      grantee: "Karnataka Industrial Development Board",
      considerationInr: "185,000,000",
      encumbranceFree: true
    },
    onChainTx: "0x89d2c1404e9c70183b54407ab6f66348ef1a7294bb890a5cd199f7ec21c43aa1"
  },
  {
    id: "LOG-1003",
    blockHeight: 1003,
    timestamp: "2026-10-13 11:22:15 UTC",
    department: "State Treasury",
    title: "Agricultural Irrigation Tranche Release",
    actor: "COMPTROLLER-TS-044 (Treasury)",
    action: "FUNDS_DISBURSEMENT",
    payload: {
      voucherId: "TR-2026-EXP-90041",
      budgetHead: "7401-RURAL-IRRIGATION-4B",
      sanctionOrder: "GOV/FIN/2026/884",
      amountInr: "42,000,000",
      recipientAccount: "STATE-AGRI-COMM-ESCROW-091",
      auditedBy: "Auditor General Field Desk II",
      clearingChannel: "RTGS-CENTRAL-SETTLE"
    },
    onChainTx: "0x3e18a44908bd2f0120ee5d92bf327b87c442436d655f523c683b5d32152848ee"
  },
  {
    id: "LOG-1004",
    blockHeight: 1004,
    timestamp: "2026-10-13 12:08:39 UTC",
    department: "Civil Registry",
    title: "National Biometric Credential Attestation",
    actor: "AGENT-DL-7721 (UIDAI Authority)",
    action: "IDENTITY_ATTESTATION",
    payload: {
      credentialToken: "CRED-IND-DL-882190-X",
      jurisdiction: "NCT Delhi Central",
      verificationLevel: "Tier-3 Multi-Biometric (Iris + 10-Finger)",
      status: "VALID_ACTIVE",
      auditChecksum: "E4A9-001F-CC81-B129",
      flaggedWatchlist: false
    },
    onChainTx: "0xfa9108b3c61389c922edef7c653655df02711310cb233b2a8d38e91888040bc3"
  },
  {
    id: "LOG-1005",
    blockHeight: 1005,
    timestamp: "2026-10-13 12:45:01 UTC",
    department: "Customs & Ports",
    title: "Strategic Cargo Clearance Manifest",
    actor: "INSPECTOR-JNPT-09 (Customs Officer)",
    action: "CUSTOMS_CARGO_CLEAR",
    payload: {
      manifestId: "MANIFEST-JNPT-2026-448",
      billOfLading: "BL-MAERSK-99812-IN",
      containerCount: 18,
      classification: "High-Purity Silicon Wafers & Photonic Components",
      portOfEntry: "Nhava Sheva Terminal 3",
      tariffCleared: true,
      radiationScan: "PASS_CLEAR"
    },
    onChainTx: "0x12bb9408e0c4516ff2581007e997a3efd0b134888ca388a1834928b55c3cba19"
  },
  {
    id: "LOG-1006",
    blockHeight: 1006,
    timestamp: "2026-10-13 13:30:19 UTC",
    department: "Urban Infrastructure",
    title: "Smart Metro Expansion Contract Award",
    actor: "DIR-PROCURE-BLR-02 (Chief Engineer)",
    action: "PROCUREMENT_AWARD",
    payload: {
      tenderNoticeNo: "TNDR-BMRCL-PHASE3-CORR2",
      winningBidder: "Larsen & Toubro Heavy Infrastructure Ltd",
      quotedValuationInr: "24,800,000,000",
      projectScope: "Elevated Viaduct & 8 Underground Stations",
      completionHorizonMonths: 36,
      antiCorruptionAffidavitSigned: true
    },
    onChainTx: "0xcc728108ae55b7668910045239a09e083651fa4729177a28e937d10e58832a88"
  }
]

// Cryptographically link initial logs sequentially
export function buildInitialHashChain() {
  let prevHash = "0000000000000000000000000000000000000000000000000000000000000000" // Genesis Hash
  
  return rawData.map((item) => {
    const rawPayloadString = JSON.stringify(item.payload)
    const blockContent = `${prevHash}|${item.blockHeight}|${item.timestamp}|${item.department}|${item.action}|${rawPayloadString}|${item.actor}`
    const currentHash = fallbackSha256(blockContent)

    const logEntry = {
      ...item,
      prevHash,
      currentHash,
      isTampered: false,
      originalPayload: JSON.parse(JSON.stringify(item.payload)),
      originalHash: currentHash,
      blockContent,
      status: "Anchored"
    }

    // Set this block's hash as previous for the next iteration
    prevHash = currentHash
    return logEntry
  })
}

export const INITIAL_LOGS = buildInitialHashChain()
