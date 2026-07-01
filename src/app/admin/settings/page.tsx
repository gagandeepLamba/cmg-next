'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      siteName: 'CMG Immigration Admin',
      siteEmail: 'admin@cmgimmigration.com',
      timezone: 'UTC+4',
      dateFormat: 'MM/DD/YYYY',
      currency: 'USD',
      language: 'en',
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      leadAlerts: true,
      appointmentReminders: true,
      paymentAlerts: true,
    },
    security: {
      sessionTimeout: '30',
      passwordMinLength: '8',
      requireTwoFactor: false,
      maxLoginAttempts: '5',
      lockoutDuration: '15',
    },
    appearance: {
      theme: 'light',
      primaryColor: '#0B3F9F',
      sidebarCollapsed: false,
      compactMode: false,
      showAnimations: true,
    },
  });

  const handleSettingChange = (category: string, setting: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value,
      },
    }));
  };

  const handleSave = () => {
    // Save settings to backend
    console.log('Saving settings:', settings);
    alert('Settings saved successfully!');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage system settings and preferences</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Settings
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">General Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
                    Site Name
                  </label>
                  <input
                    type="text"
                    id="siteName"
                    value={settings.general.siteName}
                    onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="siteEmail" className="block text-sm font-medium text-gray-700">
                    Site Email
                  </label>
                  <input
                    type="email"
                    id="siteEmail"
                    value={settings.general.siteEmail}
                    onChange={(e) => handleSettingChange('general', 'siteEmail', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                    Timezone
                  </label>
                  <select
                    id="timezone"
                    value={settings.general.timezone}
                    onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="UTC+4">UTC+4 (Dubai)</option>
                    <option value="UTC+0">UTC+0 (London)</option>
                    <option value="UTC-5">UTC-5 (New York)</option>
                    <option value="UTC-8">UTC-8 (Los Angeles)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700">
                    Date Format
                  </label>
                  <select
                    id="dateFormat"
                    value={settings.general.dateFormat}
                    onChange={(e) => handleSettingChange('general', 'dateFormat', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                    Default Currency
                  </label>
                  <select
                    id="currency"
                    value={settings.general.currency}
                    onChange={(e) => handleSettingChange('general', 'currency', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="AED">AED - UAE Dirham</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                    Language
                  </label>
                  <select
                    id="language"
                    value={settings.general.language}
                    onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="en">English</option>
                    <option value="ar">العربية</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Notification Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="emailNotifications" className="font-medium text-gray-700">
                      Email Notifications
                    </label>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    checked={settings.notifications.emailNotifications}
                    onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="smsNotifications" className="font-medium text-gray-700">
                      SMS Notifications
                    </label>
                    <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                  </div>
                  <input
                    type="checkbox"
                    id="smsNotifications"
                    checked={settings.notifications.smsNotifications}
                    onChange={(e) => handleSettingChange('notifications', 'smsNotifications', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="pushNotifications" className="font-medium text-gray-700">
                      Push Notifications
                    </label>
                    <p className="text-sm text-gray-500">Receive browser push notifications</p>
                  </div>
                  <input
                    type="checkbox"
                    id="pushNotifications"
                    checked={settings.notifications.pushNotifications}
                    onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="leadAlerts" className="font-medium text-gray-700">
                      Lead Alerts
                    </label>
                    <p className="text-sm text-gray-500">Get notified when new leads are created</p>
                  </div>
                  <input
                    type="checkbox"
                    id="leadAlerts"
                    checked={settings.notifications.leadAlerts}
                    onChange={(e) => handleSettingChange('notifications', 'leadAlerts', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="appointmentReminders" className="font-medium text-gray-700">
                      Appointment Reminders
                    </label>
                    <p className="text-sm text-gray-500">Get reminded about upcoming appointments</p>
                  </div>
                  <input
                    type="checkbox"
                    id="appointmentReminders"
                    checked={settings.notifications.appointmentReminders}
                    onChange={(e) => handleSettingChange('notifications', 'appointmentReminders', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="paymentAlerts" className="font-medium text-gray-700">
                      Payment Alerts
                    </label>
                    <p className="text-sm text-gray-500">Get notified about new payments</p>
                  </div>
                  <input
                    type="checkbox"
                    id="paymentAlerts"
                    checked={settings.notifications.paymentAlerts}
                    onChange={(e) => handleSettingChange('notifications', 'paymentAlerts', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    id="sessionTimeout"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => handleSettingChange('security', 'sessionTimeout', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="passwordMinLength" className="block text-sm font-medium text-gray-700">
                    Minimum Password Length
                  </label>
                  <input
                    type="number"
                    id="passwordMinLength"
                    value={settings.security.passwordMinLength}
                    onChange={(e) => handleSettingChange('security', 'passwordMinLength', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="maxLoginAttempts" className="block text-sm font-medium text-gray-700">
                    Max Login Attempts
                  </label>
                  <input
                    type="number"
                    id="maxLoginAttempts"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="lockoutDuration" className="block text-sm font-medium text-gray-700">
                    Lockout Duration (minutes)
                  </label>
                  <input
                    type="number"
                    id="lockoutDuration"
                    value={settings.security.lockoutDuration}
                    onChange={(e) => handleSettingChange('security', 'lockoutDuration', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="requireTwoFactor" className="font-medium text-gray-700">
                    Two-Factor Authentication
                  </label>
                  <p className="text-sm text-gray-500">Require 2FA for all admin users</p>
                </div>
                <input
                  type="checkbox"
                  id="requireTwoFactor"
                  checked={settings.security.requireTwoFactor}
                  onChange={(e) => handleSettingChange('security', 'requireTwoFactor', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Appearance Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
                    Theme
                  </label>
                  <select
                    id="theme"
                    value={settings.appearance.theme}
                    onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700">
                    Primary Color
                  </label>
                  <input
                    type="color"
                    id="primaryColor"
                    value={settings.appearance.primaryColor}
                    onChange={(e) => handleSettingChange('appearance', 'primaryColor', e.target.value)}
                    className="mt-1 block w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="sidebarCollapsed" className="font-medium text-gray-700">
                      Collapsed Sidebar
                    </label>
                    <p className="text-sm text-gray-500">Keep sidebar collapsed by default</p>
                  </div>
                  <input
                    type="checkbox"
                    id="sidebarCollapsed"
                    checked={settings.appearance.sidebarCollapsed}
                    onChange={(e) => handleSettingChange('appearance', 'sidebarCollapsed', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="compactMode" className="font-medium text-gray-700">
                      Compact Mode
                    </label>
                    <p className="text-sm text-gray-500">Use compact layout with less spacing</p>
                  </div>
                  <input
                    type="checkbox"
                    id="compactMode"
                    checked={settings.appearance.compactMode}
                    onChange={(e) => handleSettingChange('appearance', 'compactMode', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="showAnimations" className="font-medium text-gray-700">
                      Show Animations
                    </label>
                    <p className="text-sm text-gray-500">Enable UI animations and transitions</p>
                  </div>
                  <input
                    type="checkbox"
                    id="showAnimations"
                    checked={settings.appearance.showAnimations}
                    onChange={(e) => handleSettingChange('appearance', 'showAnimations', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
