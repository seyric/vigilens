import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  FolderOpen,
  BadgeCheck,
  TrendingUp,
  MapPinned,
  BellRing,
  Mic,
  ClipboardList,
  Brain,
} from "lucide-react";
import PageLoader from "../../components/ui/PageLoader";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  PageHeader,
  DashboardCard,
  KPICard,
  SecondaryButton,
} from "../../components/ui/DashboardComponents";
import apiClient from "../../api/client";
import DashboardFooter from "../../components/layout/DashboardFooter";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Status Badge Components
interface StatusBadgeProps {
  status: "Active" | "Investigating" | "Closed";
}

function CaseStatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    Active: "bg-[#22C55E]/10 border-[#22C55E]/20 text-[#22C55E]",
    Investigating: "bg-[#F59E0B]/10 border-[#F59E0B]/20 text-[#F59E0B]",
    Closed: "bg-gray-500/10 border-gray-500/20 text-[#94A3B8]",
  };
  return (
    <span
      className={`px-2.5 py-0.5 rounded border text-[8px] font-mono tracking-wider font-bold uppercase transition-all duration-150 ${styles[status]}`}
    >
      {status}
    </span>
  );
}

interface SeverityBadgeProps {
  severity: "High" | "Medium" | "Low";
}

function SeverityBadge({ severity }: SeverityBadgeProps) {
  const styles = {
    High: "bg-[#EF4444]/15 border-[#EF4444]/30 text-[#EF4444]",
    Medium: "bg-[#F59E0B]/15 border-[#F59E0B]/30 text-[#F59E0B]",
    Low: "bg-[#22C55E]/15 border-[#22C55E]/30 text-[#22C55E]",
  };
  return (
    <span
      className={`px-2.5 py-0.5 rounded border text-[8px] font-mono tracking-wider font-bold uppercase transition-all duration-150 ${styles[severity]}`}
    >
      {severity}
    </span>
  );
}

interface DistrictIntelligence {
  name: string;
  color: string;
  status: string;
}

interface CrimeCategory {
  name: string;
  value: number;
  color: string;
}

interface RecentCase {
  fir: string;
  type: string;
  district: string;
  severity: "High" | "Medium" | "Low";
  status: "Active" | "Investigating" | "Closed";
}

interface MonthlyStat {
  name: string;
  Crimes: number;
}

function DashboardPage() {
  const navigate = useNavigate();

  const [stats, setStats] = useState<any>(null);
  const [crimeTrendData, setCrimeTrendData] = useState<MonthlyStat[]>([]);
  const [categoryData, setCategoryData] = useState<CrimeCategory[]>([]);
  const [districtIntelligence, setDistrictIntelligence] = useState<
    DistrictIntelligence[]
  >([]);
  const [recentCases, setRecentCases] = useState<RecentCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAssistantExpanded, setIsAssistantExpanded] = useState(false);

  const exportCrimeTrendsPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.setTextColor(37, 99, 235); // Vigilens blue
    doc.text("CRIME TRENDS (LAST 6 MONTHS)", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Monthly Registered Crime Statistics", 14, 28);

    const tableData = crimeTrendData.map((stat) => [stat.name, stat.Crimes]);

    autoTable(doc, {
      startY: 35,
      head: [["Month", "Total Crimes"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [17, 24, 39], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 248, 255] },
    });

    doc.save("crime_trends_report.pdf");
  };

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [statsRes, trendRes, categoryRes, districtRes, firRes] =
          await Promise.all([
            apiClient.get("/analytics/dashboard/stats"),
            apiClient.get("/analytics/dashboard/monthly-stats"),
            apiClient.get("/analytics/dashboard/crimes-by-category"),
            apiClient.get("/analytics/dashboard/crimes-by-district"),
            apiClient.get("/core/firs"),
          ]);

        setStats(statsRes.data);

        const mappedTrend = trendRes.data.map((t: any) => {
          const date = new Date(t.month);
          return {
            name:
              date.toLocaleString("default", { month: "short" }) +
              " '" +
              date.getFullYear().toString().substring(2),
            Crimes: t.crime_count,
          };
        });
        setCrimeTrendData(mappedTrend);

        const categoryColors = [
          "#2563EB",
          "#EF4444",
          "#F59E0B",
          "#10B981",
          "#8B5CF6",
          "#EC4899",
        ];
        const mappedCategories = categoryRes.data.map(
          (c: any, index: number) => ({
            name: c.category_name,
            value: c.crime_count,
            color: categoryColors[index % categoryColors.length],
          }),
        );
        setCategoryData(mappedCategories);

        const mappedDistricts = districtRes.data.map((d: any) => {
          const count = d.crime_count || 0;
          let status = "LOW RISK";
          let color = "#22C55E"; // Green
          if (count > 20) {
            status = "HIGH RISK";
            color = "#EF4444";
          } else if (count > 5) {
            status = "MEDIUM RISK";
            color = "#F59E0B";
          }

          return {
            name: d.district_name,
            status: status,
            color: color,
          };
        });
        setDistrictIntelligence(mappedDistricts);

        const mappedFirs = firRes.data.map((f: any) => ({
          fir: f.fir_number,
          type: "Criminal Offense",
          district: f.district_name || f.district_id || "Unknown",
          severity: f.severity || "Medium",
          status: f.status || "Investigating",
        }));
        setRecentCases(
          mappedFirs.length > 0
            ? mappedFirs
            : [
                {
                  fir: "FIR 45/2026",
                  type: "Cyber Fraud / Phishing",
                  district: "Bangalore City",
                  severity: "High",
                  status: "Investigating",
                },
                {
                  fir: "FIR 88/2026",
                  type: "ATM Heist / Vault Break-in",
                  district: "Mysore Urban",
                  severity: "High",
                  status: "Active",
                },
                {
                  fir: "FIR 102/2026",
                  type: "Jewellery Store Theft",
                  district: "Hubballi",
                  severity: "Medium",
                  status: "Closed",
                },
                {
                  fir: "FIR 125/2026",
                  type: "Commercial Burglary",
                  district: "Mangaluru",
                  severity: "Low",
                  status: "Active",
                },
              ],
        );
      } catch (err) {
        console.error("Dashboard API fallback:", err);
        setStats({
          total_crimes: 4280,
          active_cases: 1240,
          solved_cases: 2890,
          arrest_rate: "78.4%",
          high_risk_districts: 4,
          live_alerts: 12,
        });
        setCrimeTrendData([
          { name: "Feb '26", Crimes: 620 },
          { name: "Mar '26", Crimes: 680 },
          { name: "Apr '26", Crimes: 710 },
          { name: "May '26", Crimes: 690 },
          { name: "Jun '26", Crimes: 750 },
          { name: "Jul '26", Crimes: 830 },
        ]);
        setCategoryData([
          { name: "Cyber Crime", value: 38, color: "#2563EB" },
          { name: "Burglary / Theft", value: 26, color: "#EF4444" },
          { name: "Financial Fraud", value: 18, color: "#F59E0B" },
          { name: "Violent Offenses", value: 10, color: "#10B981" },
          { name: "Narcotics", value: 8, color: "#8B5CF6" },
        ]);
        setDistrictIntelligence([
          { name: "Bangalore City", status: "HIGH RISK", color: "#EF4444" },
          { name: "Mysore Urban", status: "MEDIUM RISK", color: "#F59E0B" },
          { name: "Hubballi-Dharwad", status: "LOW RISK", color: "#22C55E" },
          { name: "Mangaluru City", status: "MEDIUM RISK", color: "#F59E0B" },
        ]);
        setRecentCases([
          {
            fir: "FIR 45/2026",
            type: "Cyber Fraud / Phishing",
            district: "Bangalore City",
            severity: "High",
            status: "Investigating",
          },
          {
            fir: "FIR 88/2026",
            type: "ATM Heist / Vault Break-in",
            district: "Mysore Urban",
            severity: "High",
            status: "Active",
          },
          {
            fir: "FIR 102/2026",
            type: "Jewellery Store Theft",
            district: "Hubballi",
            severity: "Medium",
            status: "Closed",
          },
          {
            fir: "FIR 125/2026",
            type: "Commercial Burglary",
            district: "Mangaluru",
            severity: "Low",
            status: "Active",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <PageLoader message="Loading dashboard..." />;
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] animate-fade-in select-none space-y-6 pb-6">
      {/* SECTION 1: Page Header */}
      <PageHeader
        title="Dashboard"
        subtitle="Crime Intelligence Overview"
        role="SCRB Analyst"
      />

      {/* SECTION 2: KPI Cards */}
      <section className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KPICard
          title="Total Crimes"
          value={stats?.total_crimes ?? "--"}
          trend="↑ +12.8%"
          trendLabel="this month"
          trendType="up"
          trendBadge="ANNUAL"
          icon={Shield}
          color="blue"
        />
        <KPICard
          title="Active Cases"
          value={stats?.active_cases ?? "--"}
          trend="↑ +5.6%"
          trendLabel="this month"
          trendType="up"
          trendBadge="LIVE"
          icon={FolderOpen}
          color="orange"
        />
        <KPICard
          title="Solved Cases"
          value={stats?.solved_cases ?? "--"}
          trend="↑ +11.2%"
          trendLabel="this month"
          trendType="up"
          trendBadge="SOLVED"
          icon={BadgeCheck}
          color="green"
        />
        <KPICard
          title="Arrest Rate"
          value={stats?.arrest_rate ?? "--"}
          trend="↑ +8.3%"
          trendLabel="this month"
          trendType="up"
          trendBadge="TARGET"
          icon={TrendingUp}
          color="purple"
        />
        <KPICard
          title="High Risk Districts"
          value={stats?.high_risk_districts ?? "--"}
          trend="View Details"
          trendType="neutral"
          icon={MapPinned}
          color="yellow"
          onClickTrend={() =>
            alert("Forwarding to GIS Geographical risk maps panel...")
          }
        />
        <KPICard
          title="Live Alerts"
          value={stats?.live_alerts ?? "--"}
          trend="View Alerts"
          trendType="neutral"
          icon={BellRing}
          color="red"
          onClickTrend={() =>
            alert("Displaying active control room alerts console...")
          }
        />
      </section>

      {/* SECTION 3 & 4: Charts */}
      <section className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-12 lg:[&>div]:h-[420px]">
        {/* Crime Trend Line Chart (8 Cols) */}
        <div className="flex flex-col lg:col-span-8">
          <DashboardCard
            title="Crime Trends (Last 6 Months)"
            subtitle="Monthly Registered Crime Statistics"
            className="h-full"
            action={
              <SecondaryButton onClick={exportCrimeTrendsPDF}>
                Export PDF
              </SecondaryButton>
            }
          >
            <div className="mt-2 flex min-h-0 flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={crimeTrendData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                >
                  <defs>
                    <linearGradient
                      id="areaBlueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#2563EB"
                        stopOpacity={0.25}
                      />
                      <stop
                        offset="95%"
                        stopColor="#2563EB"
                        stopOpacity={0.0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255, 255, 255, 0.03)"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="name"
                    stroke="#94A3B8"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    dy={8}
                  />
                  <YAxis
                    stroke="#94A3B8"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    dx={-6}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111827",
                      borderColor: "rgba(255, 255, 255, 0.06)",
                      borderRadius: "12px",
                      fontSize: "11px",
                    }}
                    labelStyle={{ color: "#F8FAFC", fontWeight: "bold" }}
                    itemStyle={{ color: "#2563EB" }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={32}
                    iconType="circle"
                    wrapperStyle={{
                      fontSize: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: "#F8FAFC",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="Crimes"
                    stroke="#2563EB"
                    strokeWidth={2.5}
                    fill="url(#areaBlueGradient)"
                    dot={{
                      fill: "#0B1220",
                      stroke: "#2563EB",
                      strokeWidth: 2,
                      r: 4,
                    }}
                    activeDot={{
                      r: 6,
                      fill: "#2563EB",
                      stroke: "#0B1220",
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>
        </div>

        {/* Crime Category Analysis Doughnut (4 Cols) */}
        <div className="flex flex-col lg:col-span-4">
          <DashboardCard
            title="Crime by Category"
            subtitle="Case File Classification"
            className="h-full"
          >
            <div className="mt-2 flex h-full w-full flex-col">
              <div className="flex-1 min-h-0 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={68}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#111827",
                        borderColor: "rgba(255, 255, 255, 0.06)",
                        borderRadius: "12px",
                        fontSize: "11px",
                      }}
                      itemStyle={{ color: "#F8FAFC" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Custom Pie Legend Grid with percentages and proper spacing */}
              <div className="grid shrink-0 grid-cols-2 gap-2.5 border-t border-[rgba(255,255,255,0.06)] pt-3 text-[10px] font-mono select-none">
                {categoryData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="truncate text-[#94A3B8]">
                        {item.name}
                      </span>
                    </div>
                    <span className="ml-1 font-bold text-white">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </DashboardCard>
        </div>
      </section>

      {/* SECTION 5–7: District Intelligence, Recent Cases, Quick Actions */}
      <section className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-12 lg:[&>div]:h-[382px]">
        {/* SECTION 5: District Intelligence */}
        <div className="flex flex-col lg:col-span-4">
          <DashboardCard
            title="District Wise Crimes"
            subtitle="Geographical Risk Assessment"
            className="h-full"
          >
            <div className="flex min-h-0 flex-1 flex-col">
              {/* Outline placeholder representation of the operating area */}
              <div className="relative mb-3 flex h-[135px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0B1220] select-none">
                {/* Radar sweep vectors */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.08)_0%,transparent_70%)]" />
                <div className="absolute h-32 w-32 border border-[#2563EB]/15 rounded-full animate-pulse flex items-center justify-center">
                  <div className="h-20 w-20 border border-[#2563EB]/10 rounded-full flex items-center justify-center">
                    <div className="h-10 w-10 border border-[#2563EB]/5 rounded-full" />
                  </div>
                </div>

                {/* Stylized state map nodes outline */}
                <svg
                  className="absolute h-28 w-28 opacity-25 stroke-[#2563EB]"
                  viewBox="0 0 100 100"
                  fill="none"
                >
                  <polygon
                    points="50,10 65,25 70,45 85,60 75,85 60,90 35,75 25,60 20,40 35,20"
                    strokeWidth="1"
                    strokeDasharray="3 2"
                  />
                  <line
                    x1="50"
                    y1="10"
                    x2="60"
                    y2="90"
                    strokeWidth="0.5"
                    opacity="0.3"
                  />
                  <line
                    x1="20"
                    y1="40"
                    x2="85"
                    y2="60"
                    strokeWidth="0.5"
                    opacity="0.3"
                  />
                  {/* Node coordinates */}
                  <circle cx="50" cy="10" r="2.5" fill="#2563EB" />
                  <circle
                    cx="70"
                    cy="45"
                    r="3"
                    fill="#EF4444"
                    className="animate-ping"
                    style={{ transformOrigin: "70px 45px" }}
                  />
                  <circle cx="70" cy="45" r="2.5" fill="#EF4444" />
                  <circle cx="35" cy="75" r="2.5" fill="#F59E0B" />
                  <circle cx="20" cy="40" r="2" fill="#22C55E" />
                </svg>

                <div className="absolute bottom-2 right-2 text-[8px] font-mono uppercase text-[#2563EB] tracking-widest bg-[#111827]/90 border border-white/5 px-2 py-0.5 rounded">
                  GIS Live View
                </div>
              </div>

              {/* District alert statuses list representation */}
              <div className="min-h-0 flex-1 overflow-y-auto custom-scrollbar space-y-1.5 pr-1">
                {districtIntelligence.map((dist) => (
                  <div
                    key={dist.name}
                    className="flex items-center justify-between border-b border-[rgba(255,255,255,0.03)] py-1 text-[11px] font-mono last:border-b-0"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: dist.color }}
                      />
                      <span className="truncate tracking-wider text-[#F8FAFC]">
                        {dist.name}
                      </span>
                    </div>
                    <span className="shrink-0 text-[9px] font-bold uppercase text-[#94A3B8]">
                      {dist.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Geographical risk levels color code legend block */}
              <div className="mt-3 flex shrink-0 items-center justify-center gap-4 border-t border-[rgba(255,255,255,0.04)] pt-2.5 text-[9px] font-mono text-[#94A3B8] select-none">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#EF4444]" />
                  <span>High Risk</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
                  <span>Medium</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
                  <span>Low</span>
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* SECTION 6: Recent Cases */}
        <div className="flex flex-col lg:col-span-5">
          <DashboardCard
            title="Recent Cases"
            subtitle="SCRB Live Case Registry Database"
            className="h-full"
            action={
              <SecondaryButton onClick={() => navigate("/crime-database")}>
                View All
              </SecondaryButton>
            }
          >
            <div className="mt-2 flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0B1220] custom-scrollbar select-none">
              <div className="min-h-0 flex-1 overflow-x-auto overflow-y-auto">
                <table className="w-full min-w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-[#0F172A] z-10 shadow-sm">
                    <tr className="border-b border-[rgba(255,255,255,0.08)] text-[9px] font-mono uppercase tracking-widest text-[#94A3B8]">
                      <th className="px-3.5 py-2.5 font-bold">FIR No.</th>
                      <th className="px-3 py-2.5 font-bold">Crime Type</th>
                      <th className="px-3 py-2.5 font-bold">District</th>
                      <th className="px-3 py-2.5 font-bold">Severity</th>
                      <th className="px-3.5 py-2.5 font-bold text-right">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(255,255,255,0.03)] text-[11px]">
                    {recentCases.map((row) => (
                      <tr
                        key={row.fir}
                        className="hover:bg-[#182235]/50 transition-colors duration-150 text-[#F8FAFC]"
                      >
                        <td className="px-3.5 py-2.5 font-bold font-mono text-[#2563EB] whitespace-nowrap">
                          {row.fir}
                        </td>
                        <td className="px-3 py-2.5 font-medium whitespace-nowrap">
                          {row.type}
                        </td>
                        <td className="px-3 py-2.5 text-[#94A3B8] whitespace-nowrap">
                          {row.district}
                        </td>
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          <SeverityBadge severity={row.severity} />
                        </td>
                        <td className="px-3.5 py-2.5 text-right whitespace-nowrap">
                          <CaseStatusBadge status={row.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* SECTION 7: Quick Actions */}
        <div className="flex flex-col lg:col-span-3">
          <DashboardCard
            title="Quick Actions"
            subtitle="Frequently Used Investigation Tools"
          >
            <div className="flex flex-col select-none">
              {/* Collapsed State */}
              {!isAssistantExpanded && (
                <div className="flex flex-col items-center justify-center gap-3 py-12">
                  {/* Police Badge */}
                  <button
                    onClick={() => setIsAssistantExpanded(true)}
                    className="group relative flex h-16 w-16 items-center justify-center rounded-full border border-[#2563EB]/30 bg-[#0B1220] shadow-[0_8px_32px_rgba(37,99,235,0.25)] transition-all duration-300 hover:scale-105 hover:border-[#2563EB]/50 hover:shadow-[0_12px_40px_rgba(37,99,235,0.35)]"
                  >
                    <div className="absolute inset-0 rounded-full bg-[#2563EB]/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <Shield className="h-8 w-8 text-[#60A5FA]" />
                  </button>

                  {/* Tool Preview */}
                  <div className="text-center space-y-1">
                    <p className="text-[10px] text-[#94A3B8] font-medium">
                      Voice Search • Diary • Digital Intelligence Hub
                    </p>
                    <p className="text-[9px] text-[#64748B]">
                      Click the badge to expand
                    </p>
                  </div>
                </div>
              )}

              {/* Expanded State */}
              <div
                className={`flex flex-col gap-3 transition-all duration-300 ease-in-out overflow-hidden ${
                  isAssistantExpanded
                    ? "opacity-100 max-h-[320px] py-2"
                    : "opacity-0 max-h-0"
                }`}
              >
                {/* Voice Search */}
                <button
                  onClick={() => navigate("/voice-search")}
                  className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left bg-[#0B1220] border border-[rgba(255,255,255,0.06)] hover:border-[#2563EB]/30 hover:bg-[#111827] transition-all duration-200 cursor-pointer"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/20">
                    <Mic className="h-5 w-5 text-[#60A5FA]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-white">
                      Voice Search
                    </p>
                    <p className="text-[10px] text-[#94A3B8]">
                      Search crime records using voice commands
                    </p>
                  </div>
                </button>

                {/* Officer Investigation Diary */}
                <button
                  onClick={() => navigate("/investigation-diary")}
                  className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left bg-[#0B1220] border border-[rgba(255,255,255,0.06)] hover:border-[#2563EB]/30 hover:bg-[#111827] transition-all duration-200 cursor-pointer"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/20">
                    <ClipboardList className="h-5 w-5 text-[#60A5FA]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-white">
                      Officer Investigation Diary
                    </p>
                    <p className="text-[10px] text-[#94A3B8]">
                      View and manage officer investigation notes
                    </p>
                  </div>
                </button>

                {/* Digital Intelligence Hub */}
                <button
                  onClick={() => navigate("/digital-intelligence")}
                  className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left bg-[#0B1220] border border-[rgba(255,255,255,0.06)] hover:border-[#2563EB]/30 hover:bg-[#111827] transition-all duration-200 cursor-pointer"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/20">
                    <Brain className="h-5 w-5 text-[#60A5FA]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-white">
                      Digital Intelligence Hub
                    </p>
                    <p className="text-[10px] text-[#94A3B8]">
                      Analyze uploaded digital evidence with Vigilens
                    </p>
                  </div>
                </button>

                {/* Close Button */}
                <button
                  onClick={() => setIsAssistantExpanded(false)}
                  className="w-full px-4 py-2 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#111827] hover:bg-[#1E293B] text-[#94A3B8] hover:text-white text-[10px] font-semibold transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </DashboardCard>
        </div>
      </section>

      {/* SECTION 8: Footer */}
      <DashboardFooter />
    </div>
  );
}

export default DashboardPage;
