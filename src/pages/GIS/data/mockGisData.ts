// Types for GIS Data Structures
export interface CityMarker {
  name: string
  x: number // Y-relative coordinate percentage (0 - 100)
  y: number // X-relative coordinate percentage (0 - 100)
  severity: 'Low' | 'Medium' | 'High' | 'Critical'
  description: string
  activeCases: number
}

export interface PoliceStationPin {
  name: string
  city: string
  x: number
  y: number
}

// 1. Coordinates mapped to Karnataka SVG ViewBox (Scale fit)
export const karnatakaCities: CityMarker[] = [
  {
    name: 'Bengaluru',
    x: 65,
    y: 78,
    severity: 'Critical',
    description: 'High Cyber Crime and Theft density',
    activeCases: 142
  },
  {
    name: 'Mysuru',
    x: 52,
    y: 84,
    severity: 'High',
    description: 'Medium Fraud & Domestic cases',
    activeCases: 65
  },
  {
    name: 'Hubballi',
    x: 35,
    y: 48,
    severity: 'Medium',
    description: 'Burglary and Assault clusters',
    activeCases: 42
  },
  {
    name: 'Mangaluru',
    x: 28,
    y: 75,
    severity: 'Critical',
    description: 'Coastal Smuggling and Fraud incidents',
    activeCases: 89
  },
  {
    name: 'Belagavi',
    x: 22,
    y: 35,
    severity: 'High',
    description: 'Assault and Theft reports',
    activeCases: 51
  },
  {
    name: 'Kalaburagi',
    x: 68,
    y: 19,
    severity: 'Medium',
    description: 'Assault and Robbery alerts',
    activeCases: 38
  },
  {
    name: 'Shivamogga',
    x: 39,
    y: 60,
    severity: 'Low',
    description: 'General theft reports',
    activeCases: 14
  },
  {
    name: 'Tumakuru',
    x: 58,
    y: 72,
    severity: 'Low',
    description: 'Minimal boundary alerts',
    activeCases: 19
  }
]

// 2. Mock Police Station Coords
export const policeStations: PoliceStationPin[] = [
  { name: 'KSP HQ Bengaluru', city: 'Bengaluru', x: 67, y: 77 },
  { name: 'VV Puram Station', city: 'Mysuru', x: 53, y: 83 },
  { name: 'Central Station', city: 'Hubballi', x: 37, y: 47 },
  { name: 'Coastal Command', city: 'Mangaluru', x: 29, y: 74 },
  { name: 'Border Security Div', city: 'Belagavi', x: 23, y: 34 },
  { name: 'Town Station', city: 'Kalaburagi', x: 69, y: 18 }
]

// 3. Mock District Poly-lines coordinates representation
export const karnatakaDistrictBoundaries = [
  // SVG points for connecting district nodes
  { id: 1, points: '20,30 30,22 45,28 35,38 20,30' },
  { id: 2, points: '35,38 45,28 55,20 62,30 52,38 35,38' },
  { id: 3, points: '52,38 62,30 75,15 78,25 68,35 52,38' },
  { id: 4, points: '20,30 25,48 35,38' },
  { id: 5, points: '25,48 30,62 42,55 35,38' },
  { id: 6, points: '30,62 38,72 48,65 42,55' },
  { id: 7, points: '38,72 45,86 58,80 48,65' },
  { id: 8, points: '48,65 58,80 66,74 58,62' },
  { id: 9, points: '58,62 66,74 72,60 62,50' }
]
