import { useState } from "react";
import {
  TrendingUp,
  BarChart3,
  PieChart,
  MapPin,
  Calendar,
  ShieldCheck,
  Download,
  Filter,
} from "lucide-react";

export function AnalyticsPage() {
  const [selectedRange, setSelectedRange] = useState("30d");

  const metrics = [
    {
      label: "Total Reported FIRs",
      value: "4,280",
      change: "+8.4%",
      icon: BarChart3,
      color: "text-[#2563EB]",
    },
    {
      label: "Solved Case Rate",
      value: "78.2%",
      change: "+3.1%",
      icon: ShieldCheck,
      color: "text-[#10B981]",
    },
    {
      label: "High Priority Hotspots",
      value: "14 Zones",
      change: "-2 Zones",
      icon: MapPin,
      color: "text-[#EF4444]",
    },
    {
      label: "Avg Conviction Time",
      value: "42 Days",
      change: "-4 Days",
      icon: TrendingUp,
      color: "text-[#F59E0B]",
    },
  ];

  const districtAnalytics = [
    {
      district: "Bangalore City",
      total: 1420,
      solved: 1120,
      rate: "78.8%",
      risk: "High",
      color: "text-[#EF4444] bg-[#EF4444]/15",
    },
    {
      district: "Mysore Urban",
      total: 840,
      solved: 690,
      rate: "82.1%",
      risk: "Medium",
      color: "text-[#F59E0B] bg-[#F59E0B]/15",
    },
    {
      district: "Hubballi-Dharwad",
      total: 620,
      solved: 510,
      rate: "82.2%",
      risk: "Low",
      color: "text-[#10B981] bg-[#10B981]/15",
    },
    {
      district: "Mangaluru City",
      total: 540,
      solved: 430,
      rate: "79.6%",
      risk: "Medium",
      color: "text-[#F59E0B] bg-[#F59E0B]/15",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in select-none max-w-[1600px] mx-auto pb-10 font-sans">
      {/* 1. Filter Bar */}
      <div className="bg-[#0B1220] border border-[rgba(255,255,255,0.06)] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#2563EB]/15 border border-[#2563EB]/30 rounded-xl text-[#2563EB]">
            <PieChart className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Activity Analytics
            </h2>
            <p className="text-[10px] text-[#94A3B8] font-mono">
              Operational activity and evidence overview
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#080D1A] border border-[rgba(255,255,255,0.08)] px-3 py-1.5 rounded-xl text-xs font-mono text-[#94A3B8]">
            <Calendar className="h-3.5 w-3.5 text-[#2563EB]" />
            <select
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
              className="bg-transparent text-white outline-none cursor-pointer"
            >
              <option value="7d" className="bg-[#0B1220]">
                Last 7 Days
              </option>
              <option value="30d" className="bg-[#0B1220]">
                Last 30 Days
              </option>
              <option value="90d" className="bg-[#0B1220]">
                Last 90 Days
              </option>
              <option value="1y" className="bg-[#0B1220]">
                Year-to-Date 2026
              </option>
            </select>
          </div>

          <button
            onClick={() => alert("Exporting state crime analytics report...")}
            className="bg-[#121826] hover:bg-[#182235] border border-[rgba(255,255,255,0.08)] text-[#F8FAFC] text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2"
          >
            <Download className="h-4 w-4 text-[#10B981]" />
            <span>Export Analytics PDF</span>
          </button>
        </div>
      </div>

      {/* 2. Top Telemetry Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-[#0B1220] border border-[rgba(255,255,255,0.06)] rounded-2xl p-5 space-y-3 shadow-sm select-none"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-[#94A3B8] font-bold">
                  {stat.label}
                </span>
                <div
                  className={`p-2 rounded-xl bg-[#080D1A] border border-[rgba(255,255,255,0.04)] ${stat.color}`}
                >
                  <IconComponent className="h-4.5 w-4.5" />
                </div>
              </div>

              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl font-extrabold text-white font-mono tracking-tight">
                  {stat.value}
                </h3>
                <span className="text-xs font-bold font-mono text-[#10B981]">
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. District Analytics Breakdown Table */}
      <div className="bg-[#0B1220] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4.5 w-4.5 text-[#2563EB]" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              District Wise Crime Clearance Rates
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#94A3B8]">
            Updated 15 mins ago
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.08)] text-[9px] uppercase tracking-widest text-[#94A3B8]">
                <th className="py-2.5 px-3">District</th>
                <th className="py-2.5 px-3">Total Reported</th>
                <th className="py-2.5 px-3">Solved Cases</th>
                <th className="py-2.5 px-3">Clearance Rate</th>
                <th className="py-2.5 px-3 text-right">Risk Assessment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.03)] text-white">
              {districtAnalytics.map((row) => (
                <tr
                  key={row.district}
                  className="hover:bg-[#182235]/40 transition-colors"
                >
                  <td className="py-3 px-3 font-bold text-[#2563EB] flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-[#2563EB]" />
                    <span>{row.district}</span>
                  </td>
                  <td className="py-3 px-3">{row.total}</td>
                  <td className="py-3 px-3 text-[#10B981] font-semibold">
                    {row.solved}
                  </td>
                  <td className="py-3 px-3 font-bold">{row.rate}</td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[9px] font-bold ${row.color}`}
                    >
                      {row.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
