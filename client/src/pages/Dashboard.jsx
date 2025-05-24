import React, { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import API from "../api/axios"; // ✅ Axios with token
import {
  HomeIcon,
  CheckCircleIcon,
  CalendarDaysIcon,
  BellIcon,
  ClockIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const colors = {
  primary: "#eb3b88",
  secondary: "#523d97",
  yellow: "#FECB19",
  greyLine: "#d1d5db",
};

// ⬇ Sidebar + Chips + Search + Card (no change)
const Sidebar = () => {
  const menu = [
    { icon: HomeIcon, label: "Dashboard" },
    { icon: CheckCircleIcon, label: "Tasks" },
    { icon: CalendarDaysIcon, label: "Calendar" },
    { icon: BellIcon, label: "Alerts" },
    { icon: ClockIcon, label: "History" },
    { icon: UserCircleIcon, label: "Profile" },
  ];
  return (
    <aside className="hidden lg:flex flex-col items-center bg-white rounded-3xl p-4 shadow h-full space-y-6">
      {menu.map(({ icon: Icon, label }) => (
        <button key={label} className="group">
          <Icon className="h-6 w-6 text-gray-400 group-hover:text-primary-500 transition" />
        </button>
      ))}
    </aside>
  );
};

const FilterChips = () => {
  const [active, setActive] = useState("This Month");
  const items = ["Today", "This Week", "This Month", "Reports"];
  return (
    <div className="flex gap-2">
      {items.map((i) => (
        <button
          key={i}
          onClick={() => setActive(i)}
          className={`px-4 py-1 rounded-full text-sm border
                     ${
                       i === active
                         ? "bg-gray-900 text-white"
                         : "bg-white hover:bg-gray-100"
                     }`}
        >
          {i}
        </button>
      ))}
    </div>
  );
};

const SearchBar = ({ onSearch }) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch(value.toLowerCase());
    }, 300);
    return () => clearTimeout(timeout);
  }, [value, onSearch]);

  return (
    <input
      type="search"
      placeholder="Search Chart (e.g., 'line', 'donut')"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="w-full lg:w-96 px-4 py-2 rounded-full bg-gray-100 focus:outline-none"
    />
  );
};

const ProfileBlock = () => (
  <div className="flex items-center gap-3">
    <div className="h-10 w-10 rounded-full bg-gray-300" />
    <div className="text-sm">
      <p className="font-medium">John Smith</p>
      <p className="text-gray-500">Project manager</p>
    </div>
  </div>
);

const Card = ({ color = colors.primary, children, className = "" }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className={`bg-white dark:bg-gray-800 rounded-2xl shadow p-6 ${className}`}
    style={{ borderTop: `4px solid ${color}` }}
  >
    {children}
  </motion.div>
);

// ✅ MAIN DASHBOARD
export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [projectStats, setProjectStats] = useState({});
  const [taskOverview, setTaskOverview] = useState({});
  const [invoices, setInvoices] = useState({});
  const [progressData, setProgressData] = useState([]);
  const [taskDistribution, setTaskDistribution] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // 🔁 FETCH DASHBOARD DATA FROM API
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await API.get("/dashboard");
        setProjectStats(data.projectStats || {});
        setTaskOverview(data.taskOverview || {});
        setInvoices(data.invoices || {});
        setProgressData(data.progressData || []);
        setTaskDistribution(data.taskDistribution || []);
        setMeetings(data.meetings || []);
        setTickets(data.tickets || []);
        setNotifications(data.notifications || []);
      } catch (err) {
        console.error("Dashboard error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse grid grid-cols-1 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-28 bg-gray-200 rounded-xl" />
        ))}
      </div>
    );
  }

  /* -------------------------- UI ---------------------------------------- */
  return (
    <div className="flex gap-6">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN COLUMN */}
      <div className="flex-1 flex flex-col gap-6">
        {/* TOP BAR */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <FilterChips />
          <div className="flex-1 flex items-center gap-4">
            <SearchBar onSearch={setSearchQuery} />
            <ProfileBlock />
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-12 gap-6">
          {/* MY TASKS */}

          {(searchQuery === "" || searchQuery.includes("task")) && (
            <Card color={colors.primary} className="col-span-12 lg:col-span-3">
              <h2
                className="text-xl font-semibold mb-4"
                style={{ color: colors.primary }}
              >
                My Tasks
              </h2>
              <div className="mb-2 flex gap-2">
                <span className="px-2 py-1 text-xs rounded-full bg-gray-900 text-white">
                  Today
                </span>
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                  Tomorrow
                </span>
                <span className="ml-auto text-gray-500 text-xs">
                  {taskOverview?.open ?? 0} On Going
                </span>
              </div>
              <ul className="space-y-4 max-h-80 overflow-y-auto pr-2">
                {[
                  {
                    title: "BrightBridge – Website Design",
                    brand: "🦊",
                    tag: "Design a Framer website with modern templates",
                  },
                  {
                    title: "Github – Upload Dev Files",
                    brand: "🐱",
                    tag: "Collaborate with devs on the SaaS project",
                  },
                  {
                    title: "9T9Design – Mobile-App Prototype",
                    brand: "📱",
                    tag: "Ready prototype for user testing this week",
                  },
                  {
                    title: "Horizon – Dashboard Design",
                    brand: "🖥️",
                    tag: "Design a dashboard compatible with Vision Pro",
                  },
                ].map((t, i) => (
                  <li
                    key={i}
                    className="p-3 rounded-lg border hover:shadow-sm transition"
                  >
                    <p className="font-medium">
                      {t.brand} {t.title}
                    </p>
                    <p className="text-xs text-gray-500">{t.tag}</p>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* PROJECTS OVERVIEW (DONUT) */}
          {(searchQuery === "" ||
            searchQuery.includes("project") ||
            searchQuery.includes("donut")) && (
            <Card
              color={colors.secondary}
              className="col-span-12 lg:col-span-3"
            >
              <h2
                className="text-xl font-semibold mb-4"
                style={{ color: colors.secondary }}
              >
                Projects Overview
              </h2>
              <div style={{ width: "100%", height: 200 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Completed", value: 5 },
                        { name: "Pending", value: 3 },
                        { name: "Overdue", value: 2 },
                      ]}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={4}
                      label
                    >
                      {["#eb3b88", "#FECB19", "#523d97"].map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" height={36} />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          {/* INCOME vs EXPENSE (LINE) */}
          {(searchQuery === "" ||
            searchQuery.includes("income") ||
            searchQuery.includes("expense") ||
            searchQuery.includes("line")) && (
            <Card color={colors.primary} className="col-span-12 lg:col-span-3">
              <h2
                className="text-xl font-semibold mb-4"
                style={{ color: colors.primary }}
              >
                Income vs Expense
              </h2>

              <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={
                      progressData.length > 0
                        ? progressData
                        : [
                            { month: "Jan", income: 24000, expense: 13000 },
                            { month: "Feb", income: 22500, expense: 11500 },
                            { month: "Mar", income: 25000, expense: 14500 },
                            { month: "Apr", income: 23000, expense: 12000 },
                            { month: "May", income: 26500, expense: 15200 },
                            { month: "Jun", income: 28300, expense: 16400 },
                          ]
                    }
                    margin={{ top: 5, right: 10, bottom: 0, left: 0 }}
                  >
                    <XAxis dataKey="month" stroke={colors.greyLine} />
                    <YAxis stroke={colors.greyLine} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="income"
                      stroke={colors.primary}
                      strokeWidth={3}
                    />
                    <Line
                      type="monotone"
                      dataKey="expense"
                      stroke={colors.yellow}
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}
          {/* MEETINGS + TICKETS */}
           {(searchQuery === '' || searchQuery.includes('meeting')) && (
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
            <Card color={colors.secondary}>
              <h2
                className="text-xl font-semibold mb-4"
                style={{ color: colors.secondary }}
              >
                My Meetings
              </h2>
              <ul className="space-y-3">
                {meetings.map((m) => (
                  <li
                    key={m.id}
                    className="p-3 border rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{m.title}</p>
                      <p className="text-xs text-gray-500">
                        {m.time} • {m.mode}
                      </p>
                    </div>
                    <span className="text-gray-400">➜</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card color={colors.yellow}>
              <h2
                className="text-xl font-semibold mb-4"
                style={{ color: colors.yellow }}
              >
                Open Tickets
              </h2>
              <ul className="space-y-3">
                {tickets.map((t) => (
                  <li key={t.id} className="p-3 border rounded-lg space-y-1">
                    <p className="font-medium">{t.name}</p>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {t.msg}
                    </p>
                    <button className="mt-1 text-xs px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200">
                      Check
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
           )}
          {/* INVOICE OVERVIEW (BAR PROGRESS) */}
          {(searchQuery === '' || searchQuery.includes('invoice')) && (
          <Card color={colors.secondary} className="col-span-12">
            <h2
              className="text-xl font-semibold mb-6"
              style={{ color: colors.secondary }}
            >
              Invoice Overview
            </h2>
            {[
              {
                label: "Overdue",
                value: invoices.overdue,
                color: "bg-fuchsia-600",
              },
              {
                label: "Not Paid",
                value: invoices.notPaid,
                color: "bg-violet-500",
              },
              {
                label: "Partially Paid",
                value: invoices.partiallyPaid,
                color: "bg-blue-500",
              },
              {
                label: "Fully Paid",
                value: invoices.fullyPaid,
                color: "bg-green-500",
              },
              { label: "Draft", value: invoices.draft, color: "bg-yellow-400" },
            ].map((bar, i) => {
              const totalValue = invoices.total || 1; // prevent div by zero
              const widthPercent = ((bar.value || 0) / totalValue) * 100;
              return (
                <div key={i} className="mb-4">
                  <div className="flex justify-between mb-1 text-sm">
                    <span>{bar.label}</span>
                    <span>
                      {bar.value ?? 0} | {invoices.currency ?? "INR"}{" "}
                      {invoices.total != null
                        ? invoices.total.toLocaleString()
                        : "0"}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`${bar.color} h-2 rounded-full`}
                      style={{ width: `${widthPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </Card>
          )}
          
          {/* NOTIFICATIONS */}
            {(searchQuery === '' || searchQuery.includes('notification')) && (
          <Card color={colors.yellow} className="col-span-12">
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: colors.yellow }}
            >
              Notifications
            </h2>
            <ul className="space-y-2">
              {notifications.map((n, i) => (
                <li key={i} className="text-sm">
                  {n}
                </li>
              ))}
            </ul>
          </Card>
            )}
        </div>
      </div>
    </div>
  );
}
