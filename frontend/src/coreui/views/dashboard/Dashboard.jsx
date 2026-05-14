import React, { useState, useEffect } from "react";
import { CCard, CCardBody, CCol, CRow } from "@coreui/react";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

import WidgetsDropdown from "../widgets/WidgetsDropdown";
import WidgetsBrand from "../widgets/WidgetsBrand";
import Tables from "../base/tables/Tables";
import Lottie from "lottie-react";

import userjson from "../../../assets/userjson.json";
import { API_BASE } from "../../../utils/api";
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
);

const Dashboard = () => {
  const [greeting, setGreeting] = useState("");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Determine Greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    // 2. Fetch Dashboard Info from API
    const fetchDashInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE}/dashinfo`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard info");
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashInfo();
  }, []);

  if (loading)
    return <div className="p-4 text-white">Initializing NeuroVault...</div>;
  if (!dashboardData)
    return (
      <div className="p-4 text-red-500">Error loading dashboard data.</div>
    );

  const doughnutData = {
    labels: ["Admin", "Member"],
    datasets: [
      {
        data: [dashboardData.countadmin, dashboardData.memberCount],
        backgroundColor: ["#2D7FF9", "#F9B115"],
        hoverBackgroundColor: ["#1B4FD1", "#E5A00D"],
        borderWidth: 0,
        cutout: "80%",
      },
    ],
  };

  
  const approvalData = {
    labels: ["Approved", "Pending"],
    datasets: [
      {
        label: "Documents",
        data: [
          dashboardData.documentCountApproved,
          dashboardData.documentCountPending,
        ],
        backgroundColor: ["#10b981", "#ef4444"],
        borderRadius: 8,
        barThickness: 12,
      },
    ],
  };

  const barOptions = {
    indexAxis: "y",
    plugins: { legend: { display: false } },
    scales: {
      x: { display: false, beginAtZero: true },
      y: {
        ticks: { color: "rgba(255,255,255,0.5)", font: { size: 11 } },
        grid: { display: false },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="pb-4">
      <div className="mb-6 px-1">
        <h1 className="text-3xl font-bold tracking-tight text-white capitalize">
          {greeting}, {dashboardData.name}
        </h1>
        <p className="text-white/40 text-sm mt-1">
          NeuroVault Status: {dashboardData.documentCount} documents across{" "}
          {dashboardData.workspaceCount} workspaces.
        </p>
      </div>

      <WidgetsDropdown className="mb-4" />

      <CRow className="mb-4">
       
        <CCol lg={4} md={6} className="mb-4">
          <CCard className="h-full bg-[#16181d] border-white/10 text-white shadow-lg">
            <CCardBody className="flex flex-col">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-6">
                Workspace Ownership
              </h3>
              <div
                className="flex-1 flex items-center justify-center relative"
                style={{ minHeight: "200px" }}
              >
                <Doughnut
                  data={doughnutData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                  }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-4xl font-light">
                    {dashboardData.countadmin + dashboardData.memberCount}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-white/40">
                    Total
                  </span>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol lg={4} md={6} className="mb-4">
          <CCard className="h-full bg-[#16181d] border-white/10 text-white shadow-lg">
            <CCardBody className="flex flex-col">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-6">
                Document Approvals
              </h3>
              <div className="flex-1" style={{ minHeight: "200px" }}>
                <Bar data={approvalData} options={barOptions} />
              </div>
              <div className="mt-4 flex justify-between text-[11px] text-white/40 uppercase tracking-tighter">
                <span>
                  Success Rate:{" "}
                  {dashboardData.documentCount > 0
                    ? (
                        (dashboardData.documentCountApproved /
                          dashboardData.documentCount) *
                        100
                      ).toFixed(0)
                    : 0}
                  %
                </span>
                <span>
                  {dashboardData.documentCountPending} Action Required
                </span>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol lg={4} md={12} className="mb-4">
          <CCard className="h-full bg-[#16181d] border-white/10 text-white shadow-lg flex items-center justify-center p-6 text-center">
            <div className="flex flex-col items-center">
              
              <div
                style={{ width: "120px", height: "120px" }}
                className="mb-3 "
              >
                <Lottie
                  animationData={userjson}
                  loop={true}
                 
                  size={120}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  rendererSettings={{
                    preserveAspectRatio: "xMidYMid slice", // This acts like 'object-cover'
                  }}
                  className="mix-blend-screen"
                />
              </div>

              <h4 className="text-white/20 uppercase text-[10px] font-black tracking-[0.2em] mb-2">
                Vault Identity
              </h4>
              <p className="text-lg font-medium">{dashboardData.email}</p>

             
            </div>
          </CCard>
        </CCol>
      </CRow>

      <CRow className="mb-4">
        <CCol xs={12}>
          <CCard className="bg-[#16181d] border-white/10 text-white shadow-lg">
            <CCardBody>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4">
                Recent Workspaces
              </h3>
             <div className="w-full overflow-hidden">
    <table className="w-full text-left border-separate border-spacing-0">
      <thead>
        <tr className="border-b border-white/[0.05]">
          <th className="px-4 py-3 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
            Workspace Name
          </th>
          <th className="px-4 py-3 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
            Access Level
          </th>
          <th className="px-4 py-3 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] text-right">
            Action
          </th>
        </tr>
      </thead>

      <tbody className="divide-y divide-white/[0.02]">
        {[
          { name: "LBM Legal Docks", role: "Member" },
          { name: "AI Project", role: "Admin" },
          { name: "RAG Research", role: "Admin" },
        ].map((item, index) => (
          <tr 
            key={index} 
            className="group hover:bg-white/[0.02] transition-colors duration-150"
          >
            {/* Workspace Name */}
            <td className="px-4 py-4">
              <span className="text-[13px] font-semibold text-white/90 group-hover:text-blue-400 transition-colors">
                {item.name}
              </span>
            </td>

            {/* Role Badge */}
            <td className="px-4 py-4">
              <div className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-white/5 ${
                item.role.toLowerCase() === "admin"
                  ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                  : "bg-white/5 text-white/40"
              }`}>
                {item.role}
              </div>
            </td>

            <td className="px-4 py-4 text-right">
              <button className="inline-flex items-center gap-1 text-[12px] font-bold text-blue-500 hover:text-blue-400 transition-colors group/btn">
                <span>View</span>
                <svg 
                  className="w-4 h-4 transform transition-transform duration-200 ease-out group-hover/btn:translate-x-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <WidgetsBrand withCharts />
    </div>
  );
};

export default Dashboard;
