"use client";

import { Activity, DollarSign, Package, Users } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isIncrease: boolean;
  icon: React.ElementType;
}

const data = [
  { month: "Jan", revenue: 150, sales: 100 },
  { month: "Feb", revenue: 200, sales: 120 },
  { month: "Mar", revenue: 280, sales: 180 },
  { month: "Apr", revenue: 250, sales: 160 },
  { month: "May", revenue: 300, sales: 200 },
  { month: "Jun", revenue: 280, sales: 190 },
  { month: "Jul", revenue: 260, sales: 180 },
  { month: "Aug", revenue: 320, sales: 220 },
  { month: "Sep", revenue: 290, sales: 200 },
  { month: "Oct", revenue: 350, sales: 240 },
  { month: "Nov", revenue: 330, sales: 230 },
  { month: "Dec", revenue: 380, sales: 260 },
];

function StatCard({ title, value, change, isIncrease, icon: Icon }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-semibold mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${isIncrease ? "bg-green-100" : "bg-red-100"}`}>
          <Icon className={`w-6 h-6 ${isIncrease ? "text-green-600" : "text-red-600"}`} />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span className={`text-sm ${isIncrease ? "text-green-600" : "text-red-600"}`}>
          {change}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">vs last month</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Visits"
          value="3,500"
          change="+45%"
          isIncrease={true}
          icon={Activity}
        />
        <StatCard
          title="Total Profit"
          value="$5,000"
          change="-25%"
          isIncrease={false}
          icon={DollarSign}
        />
        <StatCard
          title="Total Products"
          value="200"
          change="+50%"
          isIncrease={true}
          icon={Package}
        />
        <StatCard
          title="Total Users"
          value="20,000"
          change="-12%"
          isIncrease={false}
          icon={Users}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Revenue Overview</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Revenue</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Sales</span>
            </div>
          </div>
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#22c55e"
                fill="#22c55e"
                fillOpacity={0.2}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}