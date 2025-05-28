import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSecurityData, AuditLog } from '../contexts/SecurityDataContext';
import { 
  ClipboardListIcon, 
  SearchIcon, 
  CalendarIcon, 
  FilterIcon, 
  DownloadIcon,
  TagIcon,
  UserIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronDownIcon,
  BarChart2Icon,
  PieChartIcon,
  ListIcon,
  EyeIcon,
  UserPlusIcon,
  UserMinusIcon,
  KeyIcon,
  ShieldIcon,
  Settings2Icon,
  AlertOctagonIcon,
  ServerIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

// Action categories with their respective colors and subcategories
const ACTION_CATEGORIES = {
  'User Management': {
    color: '#3B82F6',
    icon: UserIcon,
    subcategories: {
      'User Creation': { icon: UserPlusIcon, color: '#3B82F6' },
      'User Deletion': { icon: UserMinusIcon, color: '#EF4444' },
      'Role Changes': { icon: KeyIcon, color: '#10B981' },
      'Permission Updates': { icon: ShieldIcon, color: '#8B5CF6' }
    }
  },
  'Security': {
    color: '#EF4444',
    icon: AlertTriangleIcon,
    subcategories: {
      'Threats': { icon: AlertOctagonIcon, color: '#EF4444' },
      'Policy Changes': { icon: ShieldIcon, color: '#F59E0B' },
      'Access Attempts': { icon: KeyIcon, color: '#3B82F6' }
    }
  },
  'Access Control': {
    color: '#10B981',
    icon: CheckCircleIcon,
    subcategories: {
      'Authentication': { icon: KeyIcon, color: '#10B981' },
      'Authorization': { icon: ShieldIcon, color: '#8B5CF6' },
      'Policy Updates': { icon: Settings2Icon, color: '#F59E0B' }
    }
  },
  'System': {
    color: '#6366F1',
    icon: ClipboardListIcon,
    subcategories: {
      'Configuration': { icon: Settings2Icon, color: '#6366F1' },
      'Server Events': { icon: ServerIcon, color: '#8B5CF6' },
      'Updates': { icon: ClipboardListIcon, color: '#10B981' }
    }
  },
  'Other': {
    color: '#9CA3AF',
    icon: TagIcon,
    subcategories: {}
  }
};

const getActionCategory = (action: string): keyof typeof ACTION_CATEGORIES => {
  const actionLower = action.toLowerCase();
  if (actionLower.includes('user') || actionLower.includes('role') || actionLower.includes('permission')) {
    if (actionLower.includes('create') || actionLower.includes('add')) return 'User Management';
    if (actionLower.includes('delete') || actionLower.includes('remove')) return 'User Management';
    if (actionLower.includes('role')) return 'User Management';
    if (actionLower.includes('permission')) return 'User Management';
  }
  if (actionLower.includes('security') || actionLower.includes('threat')) return 'Security';
  if (actionLower.includes('access') || actionLower.includes('auth')) return 'Access Control';
  if (actionLower.includes('system') || actionLower.includes('config')) return 'System';
  return 'Other';
};

const getActionSubcategory = (action: string, category: keyof typeof ACTION_CATEGORIES): string => {
  const actionLower = action.toLowerCase();
  const subcategories = ACTION_CATEGORIES[category].subcategories;
  
  switch (category) {
    case 'User Management':
      if (actionLower.includes('create') || actionLower.includes('add')) return 'User Creation';
      if (actionLower.includes('delete') || actionLower.includes('remove')) return 'User Deletion';
      if (actionLower.includes('role')) return 'Role Changes';
      if (actionLower.includes('permission')) return 'Permission Updates';
      break;
    case 'Security':
      if (actionLower.includes('threat')) return 'Threats';
      if (actionLower.includes('policy')) return 'Policy Changes';
      if (actionLower.includes('attempt')) return 'Access Attempts';
      break;
    case 'Access Control':
      if (actionLower.includes('login') || actionLower.includes('logout')) return 'Authentication';
      if (actionLower.includes('authorize')) return 'Authorization';
      if (actionLower.includes('policy')) return 'Policy Updates';
      break;
    case 'System':
      if (actionLower.includes('config')) return 'Configuration';
      if (actionLower.includes('server')) return 'Server Events';
      if (actionLower.includes('update')) return 'Updates';
      break;
  }
  
  return Object.keys(subcategories)[0] || '';
};

const AuditTrail: React.FC = () => {
  const { auditLogs, loading } = useSecurityData();
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'pie' | 'bar'>('list');
  const [sortBy, setSortBy] = useState<'timestamp' | 'action' | 'address'>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  
  // Handle click outside for category dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle click outside for calendar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter and sort logs
  const processedLogs = useMemo(() => {
    return auditLogs
    .filter(log => {
      // Apply search query
      if (searchQuery) {
          const searchLower = searchQuery.toLowerCase();
          return (
            log.action.toLowerCase().includes(searchLower) ||
            log.address.toLowerCase().includes(searchLower) ||
            log.details.toLowerCase().includes(searchLower)
          );
      }
      return true;
    })
    .filter(log => {
      // Apply time filter
        if (startDate && endDate) {
          const logDate = new Date(log.timestamp);
          const start = new Date(startDate);
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999); // Include the entire end date
          return logDate >= start && logDate <= end;
        }
        
      const now = Date.now();
      const logTime = log.timestamp;
      
      switch (timeFilter) {
        case 'hour':
          return now - logTime <= 60 * 60 * 1000;
        case 'day':
          return now - logTime <= 24 * 60 * 60 * 1000;
        case 'week':
          return now - logTime <= 7 * 24 * 60 * 60 * 1000;
          case 'month':
            return now - logTime <= 30 * 24 * 60 * 60 * 1000;
        default:
          return true;
      }
    })
      .filter(log => {
        // Apply category filter
        if (selectedCategories.length === 0) return true;
        return selectedCategories.includes(getActionCategory(log.action));
      })
      .sort((a, b) => {
        // Apply sorting
        let comparison = 0;
        switch (sortBy) {
          case 'timestamp':
            comparison = a.timestamp - b.timestamp;
            break;
          case 'action':
            comparison = a.action.localeCompare(b.action);
            break;
          case 'address':
            comparison = a.address.localeCompare(b.address);
            break;
        }
        return sortOrder === 'desc' ? -comparison : comparison;
      });
  }, [auditLogs, searchQuery, timeFilter, startDate, endDate, selectedCategories, sortBy, sortOrder]);

  // Calculate statistics
  const stats = useMemo(() => {
    const categoryStats = Object.keys(ACTION_CATEGORIES).map(category => ({
      name: category,
      value: processedLogs.filter(log => getActionCategory(log.action) === category).length,
      color: ACTION_CATEGORIES[category as keyof typeof ACTION_CATEGORIES].color
    }));

    const timeStats = [
      { name: 'Last Hour', value: processedLogs.filter(log => Date.now() - log.timestamp <= 60 * 60 * 1000).length },
      { name: 'Last Day', value: processedLogs.filter(log => Date.now() - log.timestamp <= 24 * 60 * 60 * 1000).length },
      { name: 'Last Week', value: processedLogs.filter(log => Date.now() - log.timestamp <= 7 * 24 * 60 * 60 * 1000).length }
    ];

    return { categoryStats, timeStats };
  }, [processedLogs]);
  
  // Format address
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  // Export logs
  const exportLogs = () => {
    const csvContent = [
      ['ID', 'Address', 'Action', 'Category', 'Details', 'Timestamp', 'Source'],
      ...processedLogs.map(log => [
        log.id,
        log.address,
        log.action,
        getActionCategory(log.action),
        log.details,
        new Date(log.timestamp).toISOString(),
        log.source
      ])
    ]
      .map(row => row.join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 relative overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse-slow2" />
      </div>
      <div className="relative z-10 p-4 lg:p-8 max-w-[1920px] mx-auto">
        <div className="bg-dark-800/60 backdrop-blur-2xl rounded-3xl border-2 border-primary-500/20 p-8 shadow-2xl mb-8 animate-fade-in">
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary-300 via-slate-100 to-pink-400 animate-gradient-text mb-2">Audit Trail</h1>
          <p className="text-slate-400 text-lg">Comprehensive audit logs and activity history.</p>
        </div>

        {/* Control Panel */}
        <div className="bg-dark-800 rounded-lg border border-dark-700 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon size={18} className="text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search logs..."
                className="w-full pl-10 pr-4 py-2 bg-dark-700 border border-dark-600 rounded-lg
                         text-slate-200 placeholder-slate-400 focus:outline-none focus:border-primary-500"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Time Filter */}
            <div className="flex items-center space-x-2 relative" ref={calendarRef}>
              <button
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className={`p-2 rounded hover:bg-dark-600 ${isCalendarOpen ? 'bg-dark-600 text-primary-400' : 'text-slate-400'}`}
              >
                <CalendarIcon size={18} />
              </button>
              <div className="flex-1">
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg
                           text-slate-200 focus:outline-none focus:border-primary-500"
                  value={startDate && endDate ? `${format(new Date(startDate), 'MMM d, yyyy')} - ${format(new Date(endDate), 'MMM d, yyyy')}` : 'Select date range'}
                  readOnly
                  placeholder="Select date range"
                />
              </div>
              {isCalendarOpen && (
                <div className="absolute top-full left-0 mt-2 p-4 bg-dark-700 border border-dark-600 rounded-lg shadow-xl z-50 w-[300px]">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Start Date</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg
                                 text-slate-200 focus:outline-none focus:border-primary-500"
                        value={startDate}
                        onChange={(e) => {
                          setStartDate(e.target.value);
                          setTimeFilter('custom');
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">End Date</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg
                                 text-slate-200 focus:outline-none focus:border-primary-500"
                        value={endDate}
                        min={startDate}
                        onChange={(e) => {
                          setEndDate(e.target.value);
                          setTimeFilter('custom');
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setTimeFilter('hour');
                        setStartDate('');
                        setEndDate('');
                        setIsCalendarOpen(false);
                      }}
                      className={`w-full px-3 py-2 rounded text-left ${
                        timeFilter === 'hour' ? 'bg-primary-500 text-white' : 'hover:bg-dark-600 text-slate-300'
                      }`}
                    >
                      Last Hour
                    </button>
                    <button
                      onClick={() => {
                        setTimeFilter('day');
                        setStartDate('');
                        setEndDate('');
                        setIsCalendarOpen(false);
                      }}
                      className={`w-full px-3 py-2 rounded text-left ${
                        timeFilter === 'day' ? 'bg-primary-500 text-white' : 'hover:bg-dark-600 text-slate-300'
                      }`}
                    >
                      Last 24 Hours
                    </button>
                    <button
                      onClick={() => {
                        setTimeFilter('week');
                        setStartDate('');
                        setEndDate('');
                        setIsCalendarOpen(false);
                      }}
                      className={`w-full px-3 py-2 rounded text-left ${
                        timeFilter === 'week' ? 'bg-primary-500 text-white' : 'hover:bg-dark-600 text-slate-300'
                      }`}
                    >
                      Last Week
                    </button>
                    <button
                      onClick={() => {
                        setTimeFilter('month');
                        setStartDate('');
                        setEndDate('');
                        setIsCalendarOpen(false);
                      }}
                      className={`w-full px-3 py-2 rounded text-left ${
                        timeFilter === 'month' ? 'bg-primary-500 text-white' : 'hover:bg-dark-600 text-slate-300'
                      }`}
                    >
                      Last Month
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Category Filter */}
            <div className="relative" ref={categoryDropdownRef}>
              <button
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className={`w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg
                         text-slate-200 flex items-center justify-between ${
                           isCategoryDropdownOpen ? 'border-primary-500' : 'hover:border-dark-500'
                         }`}
              >
                <span className="flex items-center">
                  <FilterIcon size={18} className="text-slate-400 mr-2" />
                  <span>
                    {selectedCategories.length === 0 
                      ? 'All Categories' 
                      : `${selectedCategories.length} selected`}
                  </span>
                </span>
                <ChevronDownIcon 
                  size={18} 
                  className={`text-slate-400 transform transition-transform duration-200 ${
                    isCategoryDropdownOpen ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              {isCategoryDropdownOpen && (
                <div className="absolute z-10 w-[300px] mt-2 py-2 bg-dark-700 border border-dark-600 rounded-lg shadow-xl">
                  <div className="px-3 py-2 border-b border-dark-600">
                    <h3 className="text-sm font-medium text-slate-300">Filter by Category</h3>
                  </div>
                  {Object.entries(ACTION_CATEGORIES).map(([category, { color, icon: Icon, subcategories }]) => (
                    <div key={category} className="px-2 py-1">
                      <label className="flex items-center px-2 py-2 hover:bg-dark-600 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          className="mr-3"
                          checked={selectedCategories.includes(category)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCategories([...selectedCategories, category]);
                            } else {
                              setSelectedCategories(selectedCategories.filter(c => c !== category));
                            }
                          }}
                        />
                        <Icon size={16} style={{ color }} className="mr-2" />
                        <span className="text-slate-200 flex-1">{category}</span>
                        <span className="text-xs text-slate-400 bg-dark-800 px-2 py-1 rounded">
                          {processedLogs.filter(log => getActionCategory(log.action) === category).length}
                        </span>
                      </label>
                      {Object.entries(subcategories).length > 0 && (
                        <div className="ml-8 mt-1 space-y-1 border-l border-dark-600 pl-2">
                          {Object.entries(subcategories).map(([subcat, { icon: SubIcon, color: subColor }]) => (
                            <div key={subcat} className="flex items-center px-2 py-1.5 text-sm text-slate-400 hover:text-slate-300">
                              <SubIcon size={14} style={{ color: subColor }} className="mr-2" />
                              <span>{subcat}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {selectedCategories.length > 0 && (
                    <div className="px-3 py-2 border-t border-dark-600 mt-1">
                      <button
                        onClick={() => setSelectedCategories([])}
                        className="text-sm text-slate-400 hover:text-slate-300"
                      >
                        Clear all filters
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* View Mode */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-500/20 text-primary-400' : 'text-slate-400 hover:bg-dark-700'}`}
              >
                <ListIcon size={18} />
              </button>
              <button
                onClick={() => setViewMode('pie')}
                className={`p-2 rounded ${viewMode === 'pie' ? 'bg-primary-500/20 text-primary-400' : 'text-slate-400 hover:bg-dark-700'}`}
              >
                <PieChartIcon size={18} />
              </button>
              <button
                onClick={() => setViewMode('bar')}
                className={`p-2 rounded ${viewMode === 'bar' ? 'bg-primary-500/20 text-primary-400' : 'text-slate-400 hover:bg-dark-700'}`}
              >
                <BarChart2Icon size={18} />
              </button>
            <button
              onClick={exportLogs}
                className="ml-2 px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg
                         text-slate-200 hover:bg-dark-600 flex items-center"
            >
              <DownloadIcon size={18} className="mr-2" />
                Export
            </button>
            </div>
          </div>
        </div>
        
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Category Distribution */}
          <div className="bg-dark-800 rounded-lg border border-dark-700 p-4">
            <h3 className="text-lg font-medium mb-4">Category Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.categoryStats}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    label
                  >
                    {stats.categoryStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderColor: '#334155',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Time Distribution */}
        <div className="bg-dark-800 rounded-lg border border-dark-700 p-4">
            <h3 className="text-lg font-medium mb-4">Activity Timeline</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.timeStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    dataKey="name"
                    stroke="#94A3B8"
                    tick={{ fill: '#94A3B8' }}
                  />
                  <YAxis stroke="#94A3B8" tick={{ fill: '#94A3B8' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderColor: '#334155',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-dark-800 rounded-lg border border-dark-700">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              <span className="ml-2 text-slate-400">Loading audit logs...</span>
            </div>
          ) : processedLogs.length === 0 ? (
            <div className="text-center py-20">
              <ClipboardListIcon size={48} className="mx-auto text-slate-400 mb-4" />
              <h3 className="text-xl font-medium text-slate-300 mb-2">No logs found</h3>
              <p className="text-slate-400">Try adjusting your search or filter criteria</p>
            </div>
          ) : viewMode === 'list' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 border-b border-dark-700">
                    <th className="p-4 font-medium cursor-pointer hover:text-slate-300"
                        onClick={() => {
                          if (sortBy === 'timestamp') {
                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                          } else {
                            setSortBy('timestamp');
                            setSortOrder('desc');
                          }
                        }}
                    >
                      <div className="flex items-center">
                        Timestamp
                        {sortBy === 'timestamp' && (
                          <ChevronDownIcon
                            size={16}
                            className={`ml-1 transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`}
                          />
                        )}
                      </div>
                    </th>
                    <th className="p-4 font-medium cursor-pointer hover:text-slate-300"
                        onClick={() => {
                          if (sortBy === 'address') {
                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                          } else {
                            setSortBy('address');
                            setSortOrder('desc');
                          }
                        }}
                    >
                      <div className="flex items-center">
                        Address
                        {sortBy === 'address' && (
                          <ChevronDownIcon
                            size={16}
                            className={`ml-1 transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`}
                          />
                        )}
                      </div>
                    </th>
                    <th className="p-4 font-medium cursor-pointer hover:text-slate-300"
                        onClick={() => {
                          if (sortBy === 'action') {
                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                          } else {
                            setSortBy('action');
                            setSortOrder('desc');
                          }
                        }}
                    >
                      <div className="flex items-center">
                        Action
                        {sortBy === 'action' && (
                          <ChevronDownIcon
                            size={16}
                            className={`ml-1 transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`}
                          />
                        )}
                      </div>
                    </th>
                    <th className="p-4 font-medium hidden md:table-cell">Category</th>
                    <th className="p-4 font-medium hidden lg:table-cell">Details</th>
                    <th className="p-4 font-medium text-center">Source</th>
                    <th className="p-4 font-medium text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-700">
                  {processedLogs.map((log) => {
                    const category = getActionCategory(log.action);
                    const { color, icon: Icon } = ACTION_CATEGORIES[category];
                    
                    return (
                    <tr key={log.id} className="hover:bg-dark-700/50">
                        <td className="p-4 text-slate-400 whitespace-nowrap">
                        {format(new Date(log.timestamp), 'MMM d, HH:mm:ss')}
                      </td>
                        <td className="p-4 text-slate-300 font-mono">
                        {formatAddress(log.address)}
                      </td>
                        <td className="p-4 text-white">
                        {log.action}
                      </td>
                        <td className="p-4 hidden md:table-cell">
                          <div className="flex items-center">
                            <Icon size={16} style={{ color }} className="mr-2" />
                            <span className="text-slate-300">{category}</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-400 hidden lg:table-cell truncate max-w-xs">
                        {log.details}
                      </td>
                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          log.source === 'on-chain' 
                            ? 'bg-primary-500/20 text-primary-300' 
                            : 'bg-slate-500/20 text-slate-300'
                        }`}>
                          {log.source === 'on-chain' ? 'On-Chain' : 'Off-Chain'}
                        </span>
                      </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => setSelectedLog(log)}
                            className="p-1.5 hover:bg-dark-600 rounded-lg transition-colors"
                          >
                            <EyeIcon size={16} className="text-slate-400" />
                          </button>
                        </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4">
              {viewMode === 'pie' ? (
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.categoryStats}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        label
                      >
                        {stats.categoryStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1E293B',
                          borderColor: '#334155',
                          borderRadius: '0.5rem'
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.timeStats}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis
                        dataKey="name"
                        stroke="#94A3B8"
                        tick={{ fill: '#94A3B8' }}
                      />
                      <YAxis stroke="#94A3B8" tick={{ fill: '#94A3B8' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1E293B',
                          borderColor: '#334155',
                          borderRadius: '0.5rem'
                        }}
                      />
                      <Bar dataKey="value" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Log Details Modal */}
        {selectedLog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-dark-800 rounded-lg border border-dark-700 p-6 max-w-2xl w-full mx-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-medium text-slate-200">Log Details</h3>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-slate-400 hover:text-slate-300"
                >
                  <XCircleIcon size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400">Timestamp</label>
                  <p className="text-slate-200">
                    {format(new Date(selectedLog.timestamp), 'MMM d, yyyy HH:mm:ss')}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm text-slate-400">Address</label>
                  <p className="text-slate-200 font-mono">{selectedLog.address}</p>
                </div>
                
                <div>
                  <label className="text-sm text-slate-400">Action</label>
                  <p className="text-slate-200">{selectedLog.action}</p>
                </div>
                
                <div>
                  <label className="text-sm text-slate-400">Category</label>
                  <div className="flex items-center mt-1">
                    {(() => {
                      const category = getActionCategory(selectedLog.action);
                      const { color, icon: Icon } = ACTION_CATEGORIES[category];
                      return (
                        <>
                          <Icon size={16} style={{ color }} className="mr-2" />
                          <span className="text-slate-200">{category}</span>
                        </>
                      );
                    })()}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-slate-400">Details</label>
                  <p className="text-slate-200 whitespace-pre-wrap">{selectedLog.details}</p>
                </div>
                
                <div>
                  <label className="text-sm text-slate-400">Source</label>
                  <p className="text-slate-200">{selectedLog.source}</p>
                </div>
                
                <div>
                  <label className="text-sm text-slate-400">Log ID</label>
                  <p className="text-slate-200 font-mono">{selectedLog.id}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditTrail;