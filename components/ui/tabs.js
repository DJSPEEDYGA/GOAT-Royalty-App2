import React from 'react';

export const Tabs = ({ children, defaultValue, className = '' }) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue);

  return (
    <div className={`tabs ${className}`} data-active-tab={activeTab}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { activeTab, setActiveTab })
      )}
    </div>
  );
};

export const TabsList = ({ children, activeTab, setActiveTab, className = '' }) => {
  return (
    <div className={`tabs-list ${className}`} style={{
      display: 'flex',
      borderBottom: '2px solid #e5e7eb',
      marginBottom: '1rem'
    }}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { activeTab, setActiveTab })
      )}
    </div>
  );
};

export const TabsTrigger = ({ children, value, activeTab, setActiveTab, className = '' }) => {
  const isActive = activeTab === value;
  
  return (
    <button
      className={`tabs-trigger ${className} ${isActive ? 'active' : ''}`}
      onClick={() => setActiveTab(value)}
      style={{
        padding: '0.75rem 1.5rem',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        fontSize: '0.95rem',
        fontWeight: isActive ? '600' : '400',
        color: isActive ? '#2563eb' : '#6b7280',
        borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent',
        marginBottom: '-2px',
        transition: 'all 0.2s'
      }}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ children, value, activeTab, className = '' }) => {
  if (activeTab !== value) return null;
  
  return (
    <div className={`tabs-content ${className}`}>
      {children}
    </div>
  );
};