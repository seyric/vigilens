export interface SidebarHistoryItem {
  id: string
  title: string
  date: string
  category: 'burglary' | 'vehicle' | 'drugs' | 'fraud' | 'offenders'
}

export interface AIEvidenceItem {
  name: string
  type: 'image' | 'video' | 'document' | 'audio'
}

export interface AIIntelligenceSummary {
  summaryTitle: string
  summaryText: string
  observations: string[]
  evidence: AIEvidenceItem[]
  nextSteps: string[]
}

export interface ChatMessageData {
  id: string
  sender: 'user' | 'ai'
  text: string
  timestamp: string
  intelligenceData?: AIIntelligenceSummary
}

export interface InsightCardItem {
  title: string
  value: string
  detail: string
  color: string
}

export const recentConversations: SidebarHistoryItem[] = [
  { id: '1', title: 'Burglary Cases - Bengaluru', date: '15 Jul 10:30', category: 'burglary' },
  { id: '2', title: 'Vehicle Theft Investigation', date: '14 Jul 16:15', category: 'vehicle' },
  { id: '3', title: 'Drug Network Analysis', date: '12 Jul 09:45', category: 'drugs' },
  { id: '4', title: 'Fraud Investigation', date: '10 Jul 11:20', category: 'fraud' },
  { id: '5', title: 'Repeat Offender Search', date: '08 Jul 14:05', category: 'offenders' }
]

export const initialMessages: ChatMessageData[] = [
  {
    id: 'msg-1',
    sender: 'user',
    text: 'Show burglary cases involving white vehicles in Bengaluru during the last three months.',
    timestamp: '11:42 AM'
  },
  {
    id: 'msg-2',
    sender: 'ai',
    text: 'I have analyzed the database for burglary incidents matching these criteria. A total of 3 matching FIR records were detected, concentrated in the JC Nagar district. Below is the summary of intelligence parameters recovered:',
    timestamp: '11:43 AM',
    intelligenceData: {
      summaryTitle: 'Burglary Case Analysis - JC Nagar Cluster',
      summaryText: 'Our geospatial and records analysis of JC Nagar over the last three months indicates a concentrated pattern of residential break-ins. The modus operandi consistently involves forced rear-entry during afternoon hours (12:00 PM - 4:00 PM) when properties are unoccupied.',
      observations: [
        'Three matching FIR records share identical forced-entry signatures at the rear door points.',
        'Suspects utilized a white hatchback (White Swift, partial registration KA01AB1234) for transport and quick exit.',
        'Active association mapping links suspect Ravi Kumar to two of the three targeted properties.'
      ],
      evidence: [
        { name: 'CCTV_ForcedEntry_JC_Nagar.jpg', type: 'image' },
        { name: 'Vehicle_Trace_KA01AB1234.mp4', type: 'video' },
        { name: 'JC_Nagar_Fingerprints_Report.pdf', type: 'document' }
      ],
      nextSteps: [
        'Verify accused Ravi Kumar\'s mobile location data mapping on 12 May 2025.',
        'Request street-level cameras footage from the JC Nagar junction.',
        'Cross-verify fingerprint partial matches recovered from main gate entry points.'
      ]
    }
  }
]

export const quickInsightsList: InsightCardItem[] = [
  { title: 'Recent Alerts', value: '14 Active', detail: '4 high-priority investigations', color: 'text-[#EF4444]' },
  { title: 'Top Crime Category', value: 'Theft / Burglary', detail: '48% of total registered FIRs', color: 'text-[#F97316]' },
  { title: 'Most Active District', value: 'Bengaluru Urban', detail: 'Increased street patrols suggested', color: 'text-[#2563EB]' },
  { title: 'Repeat Offenders', value: '5 Flagged', detail: 'Connected to multiple active cases', color: 'text-[#F59E0B]' },
  { title: 'Today\'s Cases', value: '12 New', detail: 'Bengaluru Command Center logs', color: 'text-[#10B981]' }
]
