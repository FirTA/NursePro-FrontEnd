import React, { useState } from 'react';
import { 
  Calendar, 
  FileText, 
  Award, 
  BarChart2, 
  Menu, 
  X, 
  Home,
  ChevronDown,
  Bell
} from 'lucide-react';

const Sidebar = ({ isMobile, isOpen, setIsOpen }) => {
  const [expandedMenu, setExpandedMenu] = useState(null);

  const menuItems = [
    {
      icon: <Home className="w-5 h-5" />,
      title: 'Dashboard',
      path: '/dashboard'
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      title: 'Schedule',
      submenu: [
        { title: 'View Schedule', path: '/schedule/view' },
        { title: 'Create Consultation', path: '/schedule/create' },
        { title: 'My Meetings', path: '/schedule/meetings' },
        { title: 'Calendar View', path: '/schedule/calendar' }
      ]
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: 'Materials',
      submenu: [
        { title: 'Browse Materials', path: '/materials/browse' },
        { title: 'Upload Documents', path: '/materials/upload' },
        { title: 'Required Reading', path: '/materials/required' },
        { title: 'Archives', path: '/materials/archives' }
      ]
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: 'Level',
      submenu: [
        { title: 'Current Level', path: '/level/current' },
        { title: 'Improvement Path', path: '/level/improvement' },
        { title: 'Requirements', path: '/level/requirements' },
        { title: 'Certifications', path: '/level/certifications' }
      ]
    },
    {
      icon: <BarChart2 className="w-5 h-5" />,
      title: 'Performance',
      submenu: [
        { title: 'Metrics Dashboard', path: '/performance/metrics' },
        { title: 'Performance History', path: '/performance/history' },
        { title: 'Goals & KPIs', path: '/performance/goals' },
        { title: 'Reviews', path: '/performance/reviews' }
      ]
    }
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white z-30
        ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
        transition-transform duration-300 ease-in-out
        ${isMobile ? 'w-64' : 'w-64'}
        border-r border-gray-200
      `}>
        {/* Logo and mobile close button */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <span className="text-xl font-bold text-blue-600">NurseManager</span>
          {isMobile && (
            <button onClick={() => setIsOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Navigation items */}
        <nav className="mt-4">
          {menuItems.map((item, index) => (
            <div key={index}>
              <button
                onClick={() => setExpandedMenu(expandedMenu === item.title ? null : item.title)}
                className="w-full flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100"
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.title}</span>
                {item.submenu && (
                  <ChevronDown 
                    className={`ml-auto w-4 h-4 transform transition-transform ${
                      expandedMenu === item.title ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </button>
              
              {/* Submenu */}
              {item.submenu && expandedMenu === item.title && (
                <div className="bg-gray-50 py-2">
                  {item.submenu.map((subItem, subIndex) => (
                    <a
                      key={subIndex}
                      href={subItem.path}
                      className="block px-12 py-2 text-sm text-gray-600 hover:bg-gray-100"
                    >
                      {subItem.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </>
  );
};

const TopBar = ({ setIsSidebarOpen }) => {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="sm:hidden"
      >
        <Menu className="w-6 h-6" />
      </button>
      
      <div className="flex items-center ml-auto">
        <button className="p-2 rounded-full text-gray-500 hover:text-gray-700">
          <Bell className="h-6 w-6" />
        </button>
        <div className="ml-3">
          <div className="flex items-center">
            <img
              className="h-8 w-8 rounded-full"
              src="/api/placeholder/32/32"
              alt="User"
            />
            <span className="ml-2 text-sm text-gray-700">Admin</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        isMobile={true}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      
      <div className="sm:ml-64">
        <TopBar setIsSidebarOpen={setIsSidebarOpen} />
        <main className="p-4">
          {/* Your page content goes here */}
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          {/* Add your dashboard components here */}
        </main>
      </div>
    </div>
  );
};

export default Layout;