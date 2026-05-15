import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, ResponsiveContainer,
  XAxis, Tooltip, PieChart, Pie, Cell
} from 'recharts';
import { Home, MessageSquare, Edit3, Link2, Bug, Leaf, CheckCircle } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { api, getErrorMessage } from './api';

const DISEASE_PALETTE = ['#1A4D2E', '#D32F2F', '#E67E22', '#3b82f6', '#a855f7'];
const DISEASE_BG_CLASSES = ['bg-purple-600', 'bg-green-500', 'bg-orange-500', 'bg-blue-500', 'bg-fuchsia-500'];
const DISEASE_BAR_CLASSES = ['bg-purple-500', 'bg-green-400', 'bg-orange-400', 'bg-blue-400', 'bg-fuchsia-400'];
const DISEASE_ICONS = [<Bug />, <Leaf />, <CheckCircle />];

const prettifyDiseaseName = (raw) =>
  raw.replace(/___/g, ' — ').replace(/_/g, ' ');

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black text-white px-3 py-1.5 rounded-lg text-[10px] shadow-xl relative">
        <p className="font-bold">{payload[0].value} images</p>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
      </div>
    );
  }
  return null;
};

const LeafScanDashboard = () => {
  const [hoveredInfo, setHoveredInfo] = useState("");
  const [hoveredRightBar, setHoveredRightBar] = useState(null);
  const [activePieValue, setActivePieValue] = useState(null);
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api.admin.getStats()
      .then(data => { if (!cancelled) setStats(data); })
      .catch(err => {
        console.error('Failed to load dashboard stats:', err);
        if (!cancelled) setError(getErrorMessage(err, 'Failed to load stats'));
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDFDFD] text-[#1A1C1E] font-sans">
        <p className="text-gray-400">Loading dashboard…</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDFDFD] text-[#1A1C1E] font-sans">
        <p className="text-red-500">{error || 'No data available.'}</p>
      </div>
    );
  }

  const weeklyData = stats.last7DaysImages.map(d => ({ day: d.day, value: d.count }));
  const analysisData = stats.last7DaysImages.map(d => ({ name: d.day, v: d.count }));
  const pieData = stats.topDiseases.map((d, i) => ({
    name: prettifyDiseaseName(d.diseaseName),
    value: d.count,
    color: DISEASE_PALETTE[i % DISEASE_PALETTE.length],
    percent: d.percent,
  }));

  const topThree = stats.topDiseases.slice(0, 3);
  const topThreeTotal = topThree.reduce((sum, d) => sum + d.count, 0) || 1;
  const topThreeShares = topThree.map(d => Math.round((d.count / topThreeTotal) * 100));

  return (
    <div className="flex min-h-screen bg-[#FDFDFD] text-[#1A1C1E] font-sans">


      {/* <aside className="flex w-10 md:w-20 flex-col items-center py-8 border-r border-gray-100 bg-white">
        <div className="space-y-10">
          <div className="p-2 text-gray-400 hover:text-green-700 cursor-pointer transition-all flex flex-col items-center"
               onClick={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' });}}>
            <Home size={20} />
            <span className="text-[8px] md:text-[10px] block text-center mt-1">Home</span>
          </div>
          <div className="p-2 text-gray-400 hover:text-green-700 cursor-pointer transition-all flex flex-col items-center">
            <MessageSquare size={20} />
            <span className="text-[8px] md:text-[10px] block text-center mt-1 text-nowrap">Messages</span>
          </div>
        </div>
      </aside> */}


      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold">LeafScan Dashboard</h1>
            <button className="p-2 bg-purple-50 text-purple-500 rounded-xl hover:bg-purple-100"><Edit3 size={18} /></button>
            <button className="p-2 bg-purple-50 text-purple-500 rounded-xl hover:bg-purple-100"><Link2 size={18} /></button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Total images</p>
                    <div className="flex items-baseline gap-2">
                      <h2 className="text-4xl font-bold">{stats.totalImages.toLocaleString()}</h2>
                      <span className="text-[10px] text-gray-400 font-bold">+{stats.imagesAddedToday} Today</span>
                    </div>
                  </div>
                  <button className="text-[10px] border px-3 py-1 rounded-full text-gray-400">📅 last 7 days</button>
                </div>
                <div className="h-44 w-full mt-6 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                      <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
                      <Bar dataKey="value" fill="#2D6A4F" radius={[5, 5, 0, 0]} barSize={32} />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#9ca3af'}} dy={10} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <h3 className="text-gray-400 text-sm font-medium mb-1">Disease Distribution</h3>
                <h2 className="text-4xl font-bold mb-4">{stats.diseaseRatePercent}% <span className="text-xs font-normal text-gray-400">Total Disease</span></h2>
                <div className="flex h-2.5 w-full rounded-full overflow-hidden mb-1">
                  {topThree.map((_, i) => (
                    <div
                      key={i}
                      className={`${DISEASE_BAR_CLASSES[i % DISEASE_BAR_CLASSES.length]} ${i < topThree.length - 1 ? 'mr-0.5' : ''}`}
                      style={{ width: `${topThreeShares[i]}%` }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 mb-8 font-bold px-1">
                  {topThreeShares.map((share, i) => (
                    <span key={i}>{share}%</span>
                  ))}
                </div>
                <div className="flex justify-between gap-2">
                  {topThree.length === 0 ? (
                    <p className="text-[10px] text-gray-400 w-full text-center py-4">No diagnoses yet.</p>
                  ) : topThree.map((d, idx) => {
                    const label = prettifyDiseaseName(d.diseaseName);
                    const statText = `${d.percent}%`;
                    return (
                      <div key={idx} className="text-center group relative cursor-pointer"
                           onMouseEnter={() => setHoveredInfo(`${idx}-${statText}`)}
                           onMouseLeave={() => setHoveredInfo("")}>
                        <div className={`${DISEASE_BG_CLASSES[idx % DISEASE_BG_CLASSES.length]} p-4 rounded-2xl text-white mb-2 transition-transform group-hover:scale-110 shadow-lg`}>
                          {DISEASE_ICONS[idx % DISEASE_ICONS.length]}
                        </div>
                        <p className="text-[10px] font-bold">{label}</p>
                        {hoveredInfo === `${idx}-${statText}` && (
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[8px] py-1 px-2 rounded-md z-10">
                            {statText}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative">
              <h3 className="text-lg font-bold mb-8">Daily Image Analysis</h3>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analysisData}>
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="v" stroke="#1A4D2E" strokeWidth={3} dot={{ r: 0 }} activeDot={{ r: 6, fill: '#1A4D2E', strokeWidth: 2, stroke: '#fff' }} />
                    <XAxis dataKey="name" hide />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between text-[10px] text-gray-300 px-4 mt-2">
                {analysisData.map((d, i) => <span key={i}>{d.name}</span>)}
              </div>
            </div>
          </div>


          <div className="lg:col-span-4 bg-[#F8F9FA] p-5 rounded-[3rem] flex flex-col gap-6">
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm">
              <div className="flex gap-2 mb-4">
                <span className="bg-green-50 text-green-600 text-[9px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">General Information</span>
                <span className="bg-purple-50 text-purple-600 text-[9px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">Advanced</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Healthy vs Diseased</h3>
              <p className="text-[11px] text-gray-400 mb-4 leading-relaxed">Share of uploaded leaf images classified as healthy vs. diseased.</p>

              <div className="grid grid-cols-2 gap-2 mb-6 text-[11px] border border-gray-100 rounded-2xl p-3 bg-gray-50/50">
                <span className="text-gray-500">Total diagnoses</span>
                <span className="font-bold text-right tabular-nums">{stats.totalDiagnoses != null ? stats.totalDiagnoses.toLocaleString() : '—'}</span>
                <span className="text-gray-500">Diagnoses today</span>
                <span className="font-bold text-right tabular-nums">{stats.diagnosesToday != null ? stats.diagnosesToday.toLocaleString() : '—'}</span>
              </div>

              <div className="space-y-6">

                <div className={`p-2 rounded-2xl transition-all duration-300 ${hoveredRightBar === 'h' ? 'bg-green-50 scale-105' : ''}`}
                     onMouseEnter={() => setHoveredRightBar('h')} onMouseLeave={() => setHoveredRightBar(null)}>
                  <div className="flex justify-between text-xs font-bold mb-2"><span>Healthy</span><span>{stats.healthyRatePercent}%</span></div>
                  <div className="w-full bg-gray-100 h-8 rounded-xl overflow-hidden p-1">
                    <div className="bg-green-900 h-full rounded-lg transition-all duration-700" style={{ width: `${stats.healthyRatePercent}%` }}></div>
                  </div>
                </div>

                <div className={`p-2 rounded-2xl transition-all duration-300 ${hoveredRightBar === 'd' ? 'bg-red-50 scale-105' : ''}`}
                     onMouseEnter={() => setHoveredRightBar('d')} onMouseLeave={() => setHoveredRightBar(null)}>
                  <div className="flex justify-between text-xs font-bold mb-2"><span>Diseased</span><span>{stats.diseaseRatePercent}%</span></div>
                  <div className="w-full bg-gray-100 h-8 rounded-xl overflow-hidden p-1">
                    <div className="bg-red-500 h-full rounded-lg transition-all duration-700" style={{ width: `${stats.diseaseRatePercent}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm flex-1">
              <h3 className="text-sm font-bold text-center mb-6">Most Common Diseases</h3>
              {pieData.length === 0 ? (
                <p className="text-[11px] text-gray-400 text-center py-10">No diagnoses yet.</p>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-1/2 h-40 relative">
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-lg font-black text-green-900">{activePieValue !== null ? `${activePieValue}%` : ''}</span>
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} innerRadius={35} outerRadius={52} paddingAngle={4} dataKey="value"
                             onMouseEnter={(_, index) => setActivePieValue(pieData[index].percent)}
                             onMouseLeave={() => setActivePieValue(null)}>
                          {pieData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} stroke="none"
                                  style={{ filter: activePieValue === entry.percent ? 'brightness(1.2)' : 'none', cursor: 'pointer' }} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-1/2 space-y-3">
                    {pieData.map((item, i) => (
                      <div key={i} className={`p-2.5 rounded-xl flex justify-between items-center transition-all cursor-pointer
                          ${activePieValue === item.percent ? 'bg-green-200 translate-x-1 shadow-md' : 'bg-green-50'}`}
                          onMouseEnter={() => setActivePieValue(item.percent)}
                          onMouseLeave={() => setActivePieValue(null)}>
                        <span className="text-[10px] font-bold text-green-800 truncate">{item.name}</span>
                        <span className="text-[10px] font-bold text-green-800">{item.percent}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LeafScanDashboard;
