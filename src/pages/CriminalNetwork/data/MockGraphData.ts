export interface GraphNode {
  id: string
  label: string
  type: 'suspect' | 'crime' | 'vehicle' | 'phone' | 'location' | 'weapon' | 'victim' | 'station' | 'associate' | 'officer' | 'evidence'
  x: number // Viewport percentage center x (0-100)
  y: number // Viewport percentage center y (0-100)
  isHighRisk?: boolean
}

export interface GraphLink {
  source: string
  target: string
}

export interface EntityProfile {
  name: string
  type: string
  associatedCases: string
  aliases: string
  linkedEvidence: string
  riskLevel: 'High' | 'Medium' | 'Low'
  status: string
  notes: string
}

// 26 nodes mapped for visual display
export const mockNodes: GraphNode[] = [
  { id: 'Rahul Kumar', label: 'Rahul Kumar', type: 'suspect', x: 50, y: 50, isHighRisk: true },
  
  // Rahul's direct links
  { id: 'Burglary FIR-123456', label: 'Burglary FIR-123456', type: 'crime', x: 35, y: 40 },
  { id: 'Amit Singh', label: 'Amit Singh', type: 'associate', x: 65, y: 45 },
  { id: 'KA01AB4587', label: 'KA01AB4587', type: 'vehicle', x: 50, y: 30 },
  { id: '+91 98450 XXXXX', label: '+91 98450 XXXXX', type: 'phone', x: 58, y: 68 },
  { id: 'Bengaluru Urban', label: 'Bengaluru Urban', type: 'location', x: 38, y: 65 },
  { id: 'Kiran Gowda', label: 'Kiran Gowda', type: 'associate', x: 32, y: 52 },

  // Added Officers and Evidence
  { id: 'Inspector Ramesh', label: 'Inspector Ramesh', type: 'officer', x: 42, y: 35 },
  { id: 'DCP Anjan', label: 'DCP Anjan', type: 'officer', x: 58, y: 25 },
  { id: 'Fingerprint Ledger', label: 'Fingerprint Ledger', type: 'evidence', x: 28, y: 44 },
  { id: 'CCTV Footage Clip', label: 'CCTV Footage Clip', type: 'evidence', x: 48, y: 64 },
  
  // Burglary FIR-123456 direct links
  { id: 'Iron Rod', label: 'Iron Rod', type: 'weapon', x: 20, y: 35 },
  { id: 'Rakesh Sharma', label: 'Rakesh Sharma', type: 'victim', x: 22, y: 48 },
  { id: 'JC Nagar Station', label: 'JC Nagar Station', type: 'station', x: 32, y: 25 },
  
  // Amit Singh's direct links
  { id: 'Vikram Malhotra', label: 'Vikram Malhotra', type: 'associate', x: 80, y: 40 },
  { id: 'Robbery FIR-123777', label: 'Robbery FIR-123777', type: 'crime', x: 72, y: 58 },
  { id: 'Hubballi', label: 'Hubballi', type: 'location', x: 75, y: 30 },
  
  // Vikram Malhotra direct links
  { id: 'Theft FIR-123890', label: 'Theft FIR-123890', type: 'crime', x: 90, y: 35 },
  { id: 'KA02CD8912', label: 'KA02CD8912', type: 'vehicle', x: 88, y: 50 },
  { id: '+91 99000 YYYYY', label: '+91 99000 YYYYY', type: 'phone', x: 82, y: 25 },
  { id: 'Mysuru', label: 'Mysuru', type: 'location', x: 92, y: 58 },
  
  // Theft FIR-123890 direct links
  { id: 'Knife', label: 'Knife', type: 'weapon', x: 95, y: 22 },
  { id: 'Suresh Babu', label: 'Suresh Babu', type: 'victim', x: 98, y: 40 },
  
  // Kiran Gowda direct links
  { id: 'Cyber Fraud FIR-123999', label: 'Cyber Fraud FIR-123999', type: 'crime', x: 18, y: 60 },
  { id: '+91 98888 ZZZZZ', label: '+91 98888 ZZZZZ', type: 'phone', x: 22, y: 72 },
  
  // Cyber Fraud FIR-123999 direct links
  { id: 'Laptop', label: 'Laptop', type: 'weapon', x: 10, y: 68 }
]

export const mockLinks: GraphLink[] = [
  { source: 'Rahul Kumar', target: 'Burglary FIR-123456' },
  { source: 'Rahul Kumar', target: 'Amit Singh' },
  { source: 'Rahul Kumar', target: 'KA01AB4587' },
  { source: 'Rahul Kumar', target: '+91 98450 XXXXX' },
  { source: 'Rahul Kumar', target: 'Bengaluru Urban' },
  { source: 'Rahul Kumar', target: 'Kiran Gowda' },
  
  // Connect Officers and Evidence
  { source: 'Inspector Ramesh', target: 'Burglary FIR-123456' },
  { source: 'Inspector Ramesh', target: 'Rahul Kumar' },
  { source: 'DCP Anjan', target: 'KA01AB4587' },
  { source: 'Fingerprint Ledger', target: 'Burglary FIR-123456' },
  { source: 'CCTV Footage Clip', target: '+91 98450 XXXXX' },
  
  { source: 'Burglary FIR-123456', target: 'Iron Rod' },
  { source: 'Burglary FIR-123456', target: 'Rakesh Sharma' },
  { source: 'Burglary FIR-123456', target: 'JC Nagar Station' },
  
  { source: 'Amit Singh', target: 'Vikram Malhotra' },
  { source: 'Amit Singh', target: 'Robbery FIR-123777' },
  { source: 'Amit Singh', target: 'Hubballi' },
  
  { source: 'Vikram Malhotra', target: 'Theft FIR-123890' },
  { source: 'Vikram Malhotra', target: 'KA02CD8912' },
  { source: 'Vikram Malhotra', target: '+91 99000 YYYYY' },
  { source: 'Vikram Malhotra', target: 'Mysuru' },
  
  { source: 'Theft FIR-123890', target: 'Knife' },
  { source: 'Theft FIR-123890', target: 'Suresh Babu' },
  
  { source: 'Kiran Gowda', target: 'Cyber Fraud FIR-123999' },
  { source: 'Kiran Gowda', target: '+91 98888 ZZZZZ' },
  
  { source: 'Cyber Fraud FIR-123999', target: 'Laptop' }
]

// Entity details database for selected cards
export const mockEntityProfiles: Record<string, EntityProfile> = {
  'Rahul Kumar': {
    name: 'Rahul Kumar',
    type: 'Suspect',
    associatedCases: 'Burglary FIR-123456, Robbery FIR-123777',
    aliases: 'Rahul "Chotu"',
    linkedEvidence: 'Iron Rod, CCTV Footage Clip',
    riskLevel: 'High',
    status: 'Under Active Investigation',
    notes: 'Primary suspect in J.C. Nagar burglaries. Phone contact logs place him near incident sites during crime window.'
  },
  'Amit Singh': {
    name: 'Amit Singh',
    type: 'Associate',
    associatedCases: 'Burglary FIR-123456, Robbery FIR-123777',
    aliases: 'Amit Pahelwan',
    linkedEvidence: 'Phone records',
    riskLevel: 'Medium',
    status: 'Pending Trial',
    notes: 'Close associate of Rahul. Financial ties indicate potential funding and getaway vehicle facilitation.'
  },
  'Kiran Gowda': {
    name: 'Kiran Gowda',
    type: 'Associate',
    associatedCases: 'Cyber Fraud FIR-123999',
    aliases: 'Gowda Boy',
    linkedEvidence: 'Laptop, Call Logs',
    riskLevel: 'High',
    status: 'Active Alert',
    notes: 'Operates technical infrastructure for local cyber syndicate. Suspected of laundering burglary proceeds.'
  },
  'Vikram Malhotra': {
    name: 'Vikram Malhotra',
    type: 'Associate',
    associatedCases: 'Theft FIR-123890',
    aliases: 'Vicky',
    linkedEvidence: 'KA02CD8912 vehicle',
    riskLevel: 'Medium',
    status: 'Under Investigation',
    notes: 'Accomplice to Amit Singh in northern district thefts. Specializes in vehicle tag tampering.'
  },
  'Burglary FIR-123456': {
    name: 'Burglary FIR-123456',
    type: 'Case',
    associatedCases: 'Burglary FIR-123456',
    aliases: 'J.C. Nagar Residence Heist',
    linkedEvidence: 'Iron Rod, CCTV Footage Clip, Fingerprint Ledger',
    riskLevel: 'Medium',
    status: 'Under Investigation',
    notes: 'Midnight burglary at JC Nagar. Over 150g gold and assets stolen. Modus operandi matches Rahul Kumar profile.'
  },
  'Robbery FIR-123777': {
    name: 'Robbery FIR-123777',
    type: 'Case',
    associatedCases: 'Robbery FIR-123777',
    aliases: 'Hubballi Bypass Highway Hold-up',
    linkedEvidence: 'Phone Records',
    riskLevel: 'High',
    status: 'Under Active Investigation',
    notes: 'Highway truck intercept. Suspects used a white hatchback to block vehicles. Overlapping GPS logs found.'
  },
  'Theft FIR-123890': {
    name: 'Theft FIR-123890',
    type: 'Case',
    associatedCases: 'Theft FIR-123890',
    aliases: 'Mysuru Warehouse Break-in',
    linkedEvidence: 'Knife, KA02CD8912',
    riskLevel: 'Medium',
    status: 'Case Open',
    notes: 'Break-in at logistics storage. High value electronics removed. Vehicle registered to Vikram spotted.'
  },
  'Cyber Fraud FIR-123999': {
    name: 'Cyber Fraud FIR-123999',
    type: 'Case',
    associatedCases: 'Cyber Fraud FIR-123999',
    aliases: 'Bengaluru Phishing Campaign',
    linkedEvidence: 'Laptop',
    riskLevel: 'High',
    status: 'Active Alert',
    notes: 'Phishing campaign targeting local banks. Linked back to IP logs registered to Kiran Gowda.'
  },
  'KA01AB4587': {
    name: 'KA01AB4587',
    type: 'Vehicle',
    associatedCases: 'Burglary FIR-123456',
    aliases: 'White Swift Hatchback',
    linkedEvidence: 'CCTV Footage Clip',
    riskLevel: 'High',
    status: 'Active Search Warrant',
    notes: 'Registered to Rahul Kumar. Spotted by ANPR camera near J.C. Nagar within 10 minutes of the heist.'
  },
  'KA02CD8912': {
    name: 'KA02CD8912',
    type: 'Vehicle',
    associatedCases: 'Theft FIR-123890',
    aliases: 'Grey Pulsar Motorbike',
    linkedEvidence: 'CCTV Sighting Mysuru',
    riskLevel: 'Medium',
    status: 'Impounded',
    notes: 'Registered to Vikram Malhotra. Found abandoned near Mysuru bypass yard. DNA matches collected.'
  },
  '+91 98450 XXXXX': {
    name: '+91 98450 XXXXX',
    type: 'Phone',
    associatedCases: 'Burglary FIR-123456, Robbery FIR-123777',
    aliases: 'Primary Burner SIM (Rahul)',
    linkedEvidence: 'CDR Log Sheets',
    riskLevel: 'High',
    status: 'Active Tap',
    notes: 'Phone subscription registered under fake credentials. Used heavily on dates of active burglaries.'
  },
  '+91 99000 YYYYY': {
    name: '+91 99000 YYYYY',
    type: 'Phone',
    associatedCases: 'Theft FIR-123890',
    aliases: 'Secondary Phone (Vikram)',
    linkedEvidence: 'Signal intercept logs',
    riskLevel: 'Low',
    status: 'Monitored',
    notes: 'Contacts Amit Singh once a week. Cell logs place it in Mysuru during warehouse heist.'
  },
  '+91 98888 ZZZZZ': {
    name: '+91 98888 ZZZZZ',
    type: 'Phone',
    associatedCases: 'Cyber Fraud FIR-123999',
    aliases: 'Crypto Account Authenticator',
    linkedEvidence: 'Phishing logs',
    riskLevel: 'High',
    status: 'Active Tap',
    notes: 'Phone linked to outbound phishing transactions and bank account authorizations.'
  },
  'Bengaluru Urban': {
    name: 'Bengaluru Urban',
    type: 'Location',
    associatedCases: 'Burglary FIR-123456, Cyber Fraud FIR-123999',
    aliases: 'JC Nagar Area',
    linkedEvidence: 'ANPR Logs, Mobile Towers',
    riskLevel: 'Medium',
    status: 'Surveillance Active',
    notes: 'Primary jurisdiction where Rahul and Kiran operate. High density of overlapping events.'
  },
  'Hubballi': {
    name: 'Hubballi',
    type: 'Location',
    associatedCases: 'Robbery FIR-123777',
    aliases: 'Hubballi bypass junction',
    linkedEvidence: 'Cell tower records',
    riskLevel: 'Medium',
    status: 'Surveillance Active',
    notes: 'Highway zone. High incidence of logistics intercept crimes. Suspected stash house located nearby.'
  },
  'Mysuru': {
    name: 'Mysuru',
    type: 'Location',
    associatedCases: 'Theft FIR-123890',
    aliases: 'Industrial Suburb Lane',
    linkedEvidence: 'CCTV Camera 4',
    riskLevel: 'Low',
    status: 'Investigation Open',
    notes: 'Secondary site. Warehouse district where cargo was unloaded.'
  },
  'Iron Rod': {
    name: 'Iron Rod',
    type: 'Weapon',
    associatedCases: 'Burglary FIR-123456',
    aliases: 'Housebreak Instrument',
    linkedEvidence: 'Fingerprint Ledger',
    riskLevel: 'Medium',
    status: 'Forensic Lab',
    notes: 'Recovered at J.C. Nagar entry window. Toolmarks match latch damage. Labeled under evidence item ID #EV-901.'
  },
  'Knife': {
    name: 'Knife',
    type: 'Weapon',
    associatedCases: 'Theft FIR-123890',
    aliases: 'Tactical folder',
    linkedEvidence: 'Recovered Blade',
    riskLevel: 'High',
    status: 'Forensic Lab',
    notes: 'Used to threaten warehouse security. Labeled under item #EV-1024. DNA swab under analysis.'
  },
  'Laptop': {
    name: 'Laptop',
    type: 'Weapon',
    associatedCases: 'Cyber Fraud FIR-123999',
    aliases: 'Dell Crime terminal',
    linkedEvidence: 'Seized hardware',
    riskLevel: 'High',
    status: 'Digital Lab',
    notes: 'Seized from Kiran Gowda residence. Contains active credentials, bank logs, and phishing scripts.'
  },
  'Rakesh Sharma': {
    name: 'Rakesh Sharma',
    type: 'Victim',
    associatedCases: 'Burglary FIR-123456',
    aliases: 'Complainant',
    linkedEvidence: 'FIR Document',
    riskLevel: 'Low',
    status: 'Statements Logged',
    notes: 'Owner of the burglarized residential villa. Provided CCTV clips from the garage entrance.'
  },
  'Suresh Babu': {
    name: 'Suresh Babu',
    type: 'Victim',
    associatedCases: 'Theft FIR-123890',
    aliases: 'Warehouse Supervisor',
    linkedEvidence: 'Security Logs',
    riskLevel: 'Low',
    status: 'Statements Logged',
    notes: 'Security chief held at knife-point. Identified vehicle KA02CD8912 escaping the warehouse block.'
  },
  'JC Nagar Station': {
    name: 'JC Nagar Station',
    type: 'Station',
    associatedCases: 'Burglary FIR-123456',
    aliases: 'KSP JC Nagar Circle',
    linkedEvidence: 'Officer logs',
    riskLevel: 'Low',
    status: 'Command Unit',
    notes: 'Jurisdiction station handling the primary case. Command center logs show rapid action dispatch.'
  },
  'Inspector Ramesh': {
    name: 'Inspector Ramesh',
    type: 'Officer',
    associatedCases: 'Burglary FIR-123456',
    aliases: 'Station House Officer',
    linkedEvidence: 'Investigation Case Diary',
    riskLevel: 'Low',
    status: 'Lead Investigator',
    notes: 'Lead case officer assigned to the J.C. Nagar burglary network. Headed the raid that led to Rahul Kumar tap.'
  },
  'DCP Anjan': {
    name: 'DCP Anjan',
    type: 'Officer',
    associatedCases: 'Burglary FIR-123456, Robbery FIR-123777',
    aliases: 'Division Commander',
    linkedEvidence: 'Operational sign-offs',
    riskLevel: 'Low',
    status: 'Supervising Authority',
    notes: 'Directs the Central Division Cyber Crime taskforce. Signs off on warrant requests and device intercept logs.'
  },
  'Fingerprint Ledger': {
    name: 'Fingerprint Ledger',
    type: 'Evidence',
    associatedCases: 'Burglary FIR-123456',
    aliases: 'Latent Print Card #EV-F4',
    linkedEvidence: 'Physical prints card',
    riskLevel: 'High',
    status: 'Analysis Complete',
    notes: 'Prints recovered from the entry latch. Matched to Rahul Kumar right index profile at 99.4% confidence.'
  },
  'CCTV Footage Clip': {
    name: 'CCTV Footage Clip',
    type: 'Evidence',
    associatedCases: 'Burglary FIR-123456',
    aliases: 'V-0428 JC Nagar Block',
    linkedEvidence: 'Drive USB-02',
    riskLevel: 'High',
    status: 'Review Complete',
    notes: 'Visual record of suspect white hatchback driving past the complainant house 3 times preceding incident.'
  }
}
