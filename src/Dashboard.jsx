import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, ResponsiveContainer, 
  XAxis, Tooltip, PieChart, Pie, Cell 
} from 'recharts';
import { Home, MessageSquare, Edit3, Link2, Bug, Leaf, CheckCircle } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import api from './api'; // استيراد ملف الـ api

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

// ألوان ثابتة للأمراض
const DISEASE_COLORS = ['#1A4D2E', '#D32F2F', '#E67E22', '#8E44AD', '#2980B9'];

const LeafScanDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredInfo, setHoveredInfo] = useState("");
  const [hoveredRightBar, setHoveredRightBar] = useState(null); 
  const [activePieValue, setActivePieValue] = useState(null); 
  const navigate = useNavigate();

  // جلب البيانات من الباك إند
  useEffect(() => {
    api.admin.getStats()
      .then(data => setStats(data))
      .catch(err => console.error('Dashboard error:', err))
      .finally(() => setLoading(false));
  }, []);

  // دالة لتنظيف أسماء الأمراض
  const formatName = (name) => name.replace(/___/g, ' - ').replace(/_/g, ' ');

  if (loading) return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  if (!stats) return <div className="flex min-h-screen items-center justify-center">Error loading dashboard.</div>;

  // تحويل بيانات الباك إند لتناسب الـ Charts بتاعتك
  const dynamicWeeklyData = stats.last7DaysImages.map(d => ({ day: d.day, value: d.count }));
  const dynamicPieData = stats.topDiseases.map((d, i) => ({
    name: formatName(d.diseaseName),
    value: d.percent, // هنعرض النسبة المئوية في الـ Pie
    color: DISEASE_COLORS[i] || '#94a3b8'
  }));

  // داتا الـ Analysis الثابتة (لأن الباك مبعتهاش)
  const analysisData = [
    { name: '02', v: 25 }, { name: '03', v: 28 }, { name: '04', v: 15 },
    { name: '05', v: 30 }, { name: '06', v: 25 }, { name: '07', v: 32 },
    { name: '08', v: 30 }, { name: '09', v: 45 }, { name: '10', v: 48 }
  ];

  return (
    <div className="flex min-h-screen bg-[#FDFDFD] text-[#1A1C1E] font-sans">
      
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
                  <div className="absolute top-[40%] left-0 w-full border-t border-dashed border-gray-300 z-0">
                    <span className="absolute -top-3 left-[40%] bg-black text-white text-[9px] px-2 py-0.5 rounded shadow-lg">Live Stats</span>
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dynamicWeeklyData}>
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
                  <div className="bg-red-500 mr-0.5" style={{ width: `${stats.diseaseRatePercent}%` }}></div>
                  <div className="bg-green-400" style={{ width: `${stats.healthyRatePercent}%` }}></div>
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 mb-8 font-bold px-1">
                  <span>{stats.diseaseRatePercent}%</span><span>{stats.healthyRatePercent}%</span>
                </div>
                <div className="flex justify-between gap-2">
                  {[
                    { icon: <Bug />, label: "Diseased", color: "bg-red-500", stats: `${stats.diseaseRatePercent}% Rate` },
                    { icon: <CheckCircle />, label: "Healthy", color: "bg-green-500", stats: `${stats.healthyRatePercent}% Safe` }
                  ].map((item, idx) => (
                    <div key={idx} className="text-center group relative cursor-pointer" 
                         onMouseEnter={() => setHoveredInfo(item.stats)} 
                         onMouseLeave={() => setHoveredInfo("")}>
                      <div className={`${item.color} p-4 rounded-2xl text-white mb-2 transition-transform group-hover:scale-110 shadow-lg`}>
                        {item.icon}
                      </div>
                      <p className="text-[10px] font-bold">{item.label}</p>
                      {hoveredInfo === item.stats && (
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[8px] py-1 px-2 rounded-md z-10">
                          {item.stats}
                        </div>
                      )}
                    </div>
                  ))}
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
                <span>02</span><span>04</span><span>06</span><span>08</span><span>10</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-[#F8F9FA] p-5 rounded-[3rem] flex flex-col gap-6">
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm">
              <div className="flex gap-2 mb-4">
                <span className="bg-green-50 text-green-600 text-[9px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">General Information</span>
                <span className="bg-purple-50 text-purple-600 text-[9px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">Live</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Healthy vs Diseased</h3>
              <p className="text-[11px] text-gray-400 mb-6 leading-relaxed">Detailed breakdown of current plant health status across all scans.</p>

              <div className="space-y-6">
                <div className={`p-2 rounded-2xl transition-all duration-300 ${hoveredRightBar === 'h' ? 'bg-green-50 scale-105' : ''}`}
                     onMouseEnter={() => setHoveredRightBar('h')} onMouseLeave={() => setHoveredRightBar(null)}>
                  <div className="flex justify-between text-xs font-bold mb-2"><span>Healthy</span><span>{stats.healthyRatePercent}%</span></div>
                  <div className="w-full bg-gray-100 h-8 rounded-xl overflow-hidden p-1">
                    <div className="bg-green-900 h-full rounded-lg transition-all duration-700" style={{width: `${stats.healthyRatePercent}%`}}></div>
                  </div>
                </div>
                
                <div className={`p-2 rounded-2xl transition-all duration-300 ${hoveredRightBar === 'd' ? 'bg-red-50 scale-105' : ''}`}
                     onMouseEnter={() => setHoveredRightBar('d')} onMouseLeave={() => setHoveredRightBar(null)}>
                  <div className="flex justify-between text-xs font-bold mb-2"><span>Diseased</span><span>{stats.diseaseRatePercent}%</span></div>
                  <div className="w-full bg-gray-100 h-8 rounded-xl overflow-hidden p-1">
                    <div className="bg-red-500 h-full rounded-lg transition-all duration-700" style={{width: `${stats.diseaseRatePercent}%`}}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm flex-1">
              <h3 className="text-sm font-bold text-center mb-6">Most Common Diseases</h3>
              <div className="flex items-center gap-2">
                <div className="w-1/2 h-40 relative">
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <span className="text-lg font-black text-green-900">{activePieValue ? `${activePieValue}%` : ''}</span>
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={dynamicPieData} innerRadius={35} outerRadius={52} paddingAngle={4} dataKey="value"
                           onMouseEnter={(_, index) => setActivePieValue(dynamicPieData[index].value)}
                           onMouseLeave={() => setActivePieValue(null)}>
                        {dynamicPieData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} stroke="none" 
                                style={{ filter: activePieValue === entry.value ? 'brightness(1.2)' : 'none', cursor: 'pointer' }} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-1/2 space-y-3">
                  {dynamicPieData.map((item, i) => (
                    <div key={i} className={`p-2.5 rounded-xl flex justify-between items-center transition-all cursor-pointer 
                        ${activePieValue === item.value ? 'bg-green-200 translate-x-1 shadow-md' : 'bg-green-50'}`}
                        onMouseEnter={() => setActivePieValue(item.value)}
                        onMouseLeave={() => setActivePieValue(null)}>
                      <span className="text-[8px] font-bold text-green-800 break-words w-2/3 leading-tight">{item.name}</span>
                      <span className="text-[10px] font-bold text-green-800">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LeafScanDashboard;