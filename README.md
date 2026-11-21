# ProImpact — RUPEETRACE (Mumbai Road Civic Accountability)

> **Follow the Rupee. Verify the Repair. Fund What Matters.**  
> A civic-finance intelligence and lifecycle accountability platform for Mumbai's monsoon road repairs.

Built for the **Claude Impact Lab Hackathon** using authentic Mumbai municipal data across 24 Wards, 2,499 Work Orders, ₹13.43 Crore monsoon expenditure, chronic flood hotspots, and daily IMD weather logs.

---

## 🌟 Key Features

1. **Role-Based 3-Party Governance:**
   - **Citizen Portal (Public):** Locality grievance lookup, Road Passport inspection with QR code, 1-Click "Report Relapse on Spot", UNESCO Olavula WhatsApp signboard scanner, and World Bank GEMS 3-citizen consensus.
   - **Ward Officer Console (Municipal):** Ward scoping selector, dynamic scoped budget KPIs, 3-tier escalation ladder (L1 JE Show-Cause $\rightarrow$ L2 AC Escrow Withholding $\rightarrow$ L3 Central Vigilance Debarment), and World Bank OPBRC outcome-based durability escrow simulator.
   - **Contractor Extranet (Agency):** Context-adjusted performance scorecard controlling for terrain flood stress, right-of-response dispute desk with auto-attached IMD rainfall and tidal lock proofs, and verified scorecard certificate download.

2. **Forensic Audit & Evidence Trail:**
   - **Cyber-GIS Command Center:** Interactive Leaflet GIS mapping 24 BMC wards, 291 road segments, 28 chronic flood hotspots, 160 critical facilities (hospitals & schools), and 420 accident casualties.
   - **Ward Timeline & Weather Sync:** Gantt matrix correlating repair completion against daily IMD rainfall bars (>64.5mm) and high-tide locks (≥4.5m) to evaluate *force majeure* delay attribution.
   - **4-Stage Lifecycle & Visual Money Trace Graph:** Tracks projects from Start $\rightarrow$ Tender $\rightarrow$ Build $\rightarrow$ Complete with explicit evidence-gap confidence badges (*Documented*, *Unavailable in Supplied Dataset*, *Cross-Verified*, *Observed Outcome*).
   - **Next Rupee Allocator:** Gates Foundation Human-ROI predictive budgeting engine (protecting hospital corridors and high-casualty corridors per ₹1 Lakh spent).
   - **Statutory 1-Click Legal RTI Export:** Auto-drafts ready-to-print Section 6 RTI Act 2005 / MMC Act Section 69 legal briefs pre-filled with Work Order ID, rate card overcharge (+34%), and contractor warranty details.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/)

### Installation & Run

```bash
# 1. Clone repository
git clone https://github.com/pronay/ProImpact.git
cd ProImpact

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛠️ Tech Stack

- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS + Custom CSS Design System
- **Icons:** Lucide React
- **Mapping:** Leaflet + React-Leaflet (GeoJSON ward polygons, road segments, hotspots)
- **Data Engine:** Pure client-side compiled JSON aggregation (`rupeetrace_db.json`)

---

## 📄 License
MIT License. Open for public civic audit and civic tech development.
