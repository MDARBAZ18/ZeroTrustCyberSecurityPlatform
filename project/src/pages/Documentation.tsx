import React, { useState, useMemo } from 'react';
import { 
  Book,
  Shield,
  Lock,
  Key,
  Users,
  AlertTriangle,
  FileText,
  ChevronRight,
  ExternalLink,
  Code,
  Terminal,
  Cpu,
  Network,
  Search,
  Eye,
  EyeOff,
  Layers,
  Database,
  Server,
  GitBranch,
  Workflow,
  Settings
} from 'lucide-react';
import DocContent from '../components/documentation/DocContent';

// Documentation sections data
const sections = [
  {
    id: 'overview',
    label: 'Overview',
    icon: <Shield size={18} />,
    keywords: ['overview', 'introduction', 'features', 'blockchain', 'security', 'ai', 'monitoring']
  },
  {
    id: 'architecture',
    label: 'Architecture',
    icon: <Layers size={18} />,
    keywords: ['architecture', 'system', 'design', 'layers', 'frontend', 'backend', 'database', 'blockchain']
  },
  {
    id: 'smart-contract',
    label: 'Smart Contract',
    icon: <Code size={18} />,
    keywords: ['smart contract', 'solidity', 'ethereum', 'blockchain', 'functions', 'events']
  },
  {
    id: 'security',
    label: 'Security',
    icon: <Lock size={18} />,
    keywords: ['security', 'protection', 'zero trust', 'authentication', 'authorization', 'encryption']
  },
  {
    id: 'roles',
    label: 'User Roles',
    icon: <Users size={18} />,
    keywords: ['roles', 'permissions', 'admin', 'manager', 'auditor', 'guest', 'access control']
  },
  {
    id: 'monitoring',
    label: 'Monitoring',
    icon: <AlertTriangle size={18} />,
    keywords: ['monitoring', 'alerts', 'dashboard', 'metrics', 'events', 'logs', 'analytics']
  },
  {
    id: 'api',
    label: 'API Reference',
    icon: <Terminal size={18} />,
    keywords: ['api', 'endpoints', 'rest', 'http', 'authentication', 'requests', 'responses']
  }
];

const Documentation: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter sections based on search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    
    const query = searchQuery.toLowerCase().trim();
    return sections.filter(section => {
      // Check if query matches section label
      if (section.label.toLowerCase().includes(query)) return true;
      
      // Check if query matches any keywords
      if (section.keywords.some(keyword => keyword.toLowerCase().includes(query))) return true;
      
      return false;
    });
  }, [searchQuery]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // If there's a search query and we have filtered results, select the first matching section
    if (e.target.value.trim() && filteredSections.length > 0) {
      setActiveSection(filteredSections[0].id);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 relative overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse-slow2" />
      </div>
      <div className="relative z-10 p-4 lg:p-8 max-w-[1920px] mx-auto">
        <div className="bg-dark-800/60 backdrop-blur-2xl rounded-3xl border-2 border-primary-500/20 p-8 shadow-2xl mb-8 animate-fade-in">
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary-300 via-slate-100 to-pink-400 animate-gradient-text mb-2">Documentation</h1>
          <p className="text-slate-400 text-lg">Platform documentation and API reference.</p>
        </div>

        {/* Header with Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Book className="text-primary-400" />
              Documentation
            </h1>
            <p className="text-slate-400 mt-2">
              Complete guide to the Blockchain Security Monitoring System
            </p>
          </div>
          
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full md:w-64 pl-10 pr-10 py-2 bg-dark-800 border border-dark-700 rounded-lg
                       text-slate-300 placeholder-slate-500 focus:outline-none focus:border-primary-500
                       focus:ring-1 focus:ring-primary-500"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <EyeOff size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-dark-800 rounded-lg border border-dark-700 p-4 sticky top-4">
              <nav className="space-y-1">
                  {filteredSections.map((section) => (
                  <button
                    key={section.id}
                      onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      activeSection === section.id
                          ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                        : 'hover:bg-dark-700 text-slate-300'
                    }`}
                  >
                    <span className="mr-2">{section.icon}</span>
                    {section.label}
                  </button>
                ))}
              </nav>
                {filteredSections.length === 0 && (
                  <div className="text-center py-4 text-slate-400 text-sm">
                    No matching sections found
                </div>
              )}
                      </div>
                    </div>
                    
          {/* Content Area */}
          <div className="md:col-span-3">
            <div className="bg-dark-800 rounded-lg border border-dark-700 p-6">
              <DocContent activeSection={activeSection} />
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;