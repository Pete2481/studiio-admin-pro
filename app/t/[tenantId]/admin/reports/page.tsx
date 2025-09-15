"use client";

import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";
import { TrendingUp, Users, DollarSign, Calendar, BarChart3, PieChart, Activity } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import Sidebar from "@/components/Sidebar";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - replace with real data from your database
  const mockData = {
    bookings: {
      "7d": [12, 19, 15, 25, 22, 30, 28],
      "30d": [45, 52, 48, 65, 58, 72, 68, 75, 82, 78, 85, 90, 88, 95, 92, 98, 105, 102, 108, 115, 112, 118, 125, 122, 128, 135, 132, 138, 145, 142],
      "90d": [120, 135, 142, 158, 165, 172, 188, 195, 202, 218, 225, 232]
    },
    revenue: {
      "7d": [2400, 3800, 3000, 5000, 4400, 6000, 5600],
      "30d": [9000, 10400, 9600, 13000, 11600, 14400, 13600, 15000, 16400, 15600, 17000, 18000, 17600, 19000, 18400, 19600, 21000, 20400, 21600, 23000, 22400, 23600, 25000, 24400, 25600, 27000, 26400, 27600, 29000, 28400],
      "90d": [24000, 27000, 28400, 31600, 33000, 34400, 37600, 39000, 40400, 43600, 45000, 46400]
    },
    clients: {
      "7d": [5, 8, 6, 12, 10, 15, 13],
      "30d": [18, 22, 20, 28, 25, 32, 30, 35, 38, 36, 40, 42, 41, 44, 43, 46, 48, 47, 50, 52, 51, 54, 56, 55, 58, 60, 59, 62, 64, 63],
      "90d": [48, 54, 58, 64, 68, 72, 78, 82, 86, 92, 96, 100]
    }
  };

  // Chart configurations
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#374151",
          font: {
            size: 12,
            weight: 500
          }
        }
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "#10b981",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false
      }
    },
    scales: {
      x: {
        grid: {
          color: "#e5e7eb",
          drawBorder: false
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: "#e5e7eb",
          drawBorder: false
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 11
          }
        }
      }
    }
  };

  // Bar Chart Data
  const barChartData = {
    labels: selectedPeriod === "7d" 
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      : selectedPeriod === "30d"
      ? Array.from({length: 30}, (_, i) => `Day ${i + 1}`)
      : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Bookings",
        data: mockData.bookings[selectedPeriod as keyof typeof mockData.bookings],
        backgroundColor: "#10b981",
        borderColor: "#059669",
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      },
      {
        label: "Revenue ($)",
        data: mockData.revenue[selectedPeriod as keyof typeof mockData.revenue].map(val => val / 100),
        backgroundColor: "#3b82f6",
        borderColor: "#2563eb",
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      }
    ]
  };

  // Line Chart Data
  const lineChartData = {
    labels: selectedPeriod === "7d" 
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      : selectedPeriod === "30d"
      ? Array.from({length: 30}, (_, i) => `Day ${i + 1}`)
      : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "New Clients",
        data: mockData.clients[selectedPeriod as keyof typeof mockData.clients],
        borderColor: "#8b5cf6",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#8b5cf6",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  };

  // Pie Chart Data
  const pieChartData = {
    labels: ["Real Estate", "Luxury Properties", "Commercial", "Residential", "Investment"],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          "#10b981",
          "#3b82f6", 
          "#8b5cf6",
          "#f59e0b",
          "#ef4444"
        ],
        borderColor: [
          "#059669",
          "#2563eb",
          "#7c3aed", 
          "#d97706",
          "#dc2626"
        ],
        borderWidth: 2,
        hoverOffset: 4,
      }
    ]
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#374151",
          font: {
            size: 12,
            weight: 500
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle"
        }
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "#10b981",
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  // Summary cards data
  const summaryData = [
    {
      title: "Total Bookings",
      value: mockData.bookings[selectedPeriod as keyof typeof mockData.bookings].reduce((a, b) => a + b, 0),
      change: "+12.5%",
      icon: Calendar,
      color: "bg-blue-500"
    },
    {
      title: "Total Revenue",
      value: `$${(mockData.revenue[selectedPeriod as keyof typeof mockData.revenue].reduce((a, b) => a + b, 0) / 100).toLocaleString()}`,
      change: "+8.2%",
      icon: DollarSign,
      color: "bg-green-500"
    },
    {
      title: "New Clients",
      value: mockData.clients[selectedPeriod as keyof typeof mockData.clients].reduce((a, b) => a + b, 0),
      change: "+15.3%",
      icon: Users,
      color: "bg-purple-500"
    },
    {
      title: "Growth Rate",
      value: "23.4%",
      change: "+2.1%",
      icon: TrendingUp,
      color: "bg-orange-500"
    }
  ];

  return (
    <PageLayout className="bg-gray-50">
      <Sidebar />
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
          <p className="text-gray-600">Track your business performance and insights</p>
        </div>

        {/* Period Selector */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Time Period:</label>
            <div className="flex bg-white rounded-lg border border-gray-200 p-1">
              {[
                { value: "7d", label: "7 Days" },
                { value: "30d", label: "30 Days" },
                { value: "90d", label: "90 Days" }
              ].map((period) => (
                <button
                  key={period.value}
                  onClick={() => setSelectedPeriod(period.value)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    selectedPeriod === period.value
                      ? "bg-teal-600 text-white"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {summaryData.map((card, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  <p className="text-sm text-green-600 font-medium mt-1">{card.change}</p>
                </div>
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Bar Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-teal-600" />
                Bookings & Revenue
              </h3>
            </div>
            <div className="h-80">
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </div>

          {/* Line Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-teal-600" />
                Client Growth Trend
              </h3>
            </div>
            <div className="h-80">
              <Line data={lineChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <PieChart className="w-5 h-5 mr-2 text-teal-600" />
              Property Type Distribution
            </h3>
          </div>
          <div className="h-80 flex items-center justify-center">
            <div className="w-96 h-80">
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}





