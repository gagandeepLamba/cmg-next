'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Palette, Type, Square, Layers, RotateCcw, Save } from 'lucide-react';

export default function ThemeCustomizer() {
  const { theme, setTheme, availableThemes, updateThemeColors, resetTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'spacing' | 'borders'>('colors');
  const [customColors, setCustomColors] = useState(theme.colors);
  const [selectedTheme, setSelectedTheme] = useState(theme.name);

  const handleColorChange = (colorKey: keyof typeof theme.colors, value: string) => {
    setCustomColors(prev => ({
      ...prev,
      [colorKey]: value
    }));
  };

  const applyCustomColors = () => {
    updateThemeColors(customColors);
  };

  const selectPresetTheme = (themeName: string) => {
    const presetTheme = availableThemes.find(t => t.name === themeName);
    if (presetTheme) {
      setTheme(presetTheme);
      setCustomColors(presetTheme.colors);
      setSelectedTheme(themeName);
    }
  };

  const ColorPicker = ({ label, colorKey, value }: { label: string; colorKey: keyof typeof theme.colors; value: string }) => (
    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
      <div className="flex items-center space-x-3">
        <div 
          className="w-8 h-8 rounded border-2 border-gray-300"
          style={{ backgroundColor: value }}
        />
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="color"
          value={value}
          onChange={(e) => handleColorChange(colorKey, e.target.value)}
          className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => handleColorChange(colorKey, e.target.value)}
          className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
        />
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 w-80">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Palette className="w-5 h-5 mr-2" />
          Theme Customizer
        </h3>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('colors')}
          className={`flex-1 py-2 px-4 text-sm font-medium ${
            activeTab === 'colors'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Colors
        </button>
        <button
          onClick={() => setActiveTab('typography')}
          className={`flex-1 py-2 px-4 text-sm font-medium ${
            activeTab === 'typography'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Typography
        </button>
        <button
          onClick={() => setActiveTab('spacing')}
          className={`flex-1 py-2 px-4 text-sm font-medium ${
            activeTab === 'spacing'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Spacing
        </button>
        <button
          onClick={() => setActiveTab('borders')}
          className={`flex-1 py-2 px-4 text-sm font-medium ${
            activeTab === 'borders'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Square className="w-4 h-4 inline mr-1" />
          Borders
        </button>
      </div>

      <div className="p-4 max-h-96 overflow-y-auto">
        {activeTab === 'colors' && (
          <div className="space-y-4">
            {/* Preset Themes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preset Themes</label>
              <select
                value={selectedTheme}
                onChange={(e) => selectPresetTheme(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {availableThemes.map(t => (
                  <option key={t.name} value={t.name}>{t.name}</option>
                ))}
              </select>
            </div>

            {/* Color Pickers */}
            <div className="space-y-2">
              <ColorPicker label="Primary" colorKey="primary" value={customColors.primary} />
              <ColorPicker label="Secondary" colorKey="secondary" value={customColors.secondary} />
              <ColorPicker label="Accent" colorKey="accent" value={customColors.accent} />
              <ColorPicker label="Background" colorKey="background" value={customColors.background} />
              <ColorPicker label="Surface" colorKey="surface" value={customColors.surface} />
              <ColorPicker label="Text" colorKey="text" value={customColors.text} />
              <ColorPicker label="Text Secondary" colorKey="textSecondary" value={customColors.textSecondary} />
              <ColorPicker label="Border" colorKey="border" value={customColors.border} />
              <ColorPicker label="Success" colorKey="success" value={customColors.success} />
              <ColorPicker label="Warning" colorKey="warning" value={customColors.warning} />
              <ColorPicker label="Error" colorKey="error" value={customColors.error} />
              <ColorPicker label="Info" colorKey="info" value={customColors.info} />
            </div>
          </div>
        )}

        {activeTab === 'typography' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
              <select
                value={theme.typography.fontFamily}
                onChange={(e) => setTheme({
                  ...theme,
                  typography: { ...theme.typography, fontFamily: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Inter, system-ui, sans-serif">Inter</option>
                <option value="system-ui, sans-serif">System UI</option>
                <option value="'Helvetica Neue', Arial, sans-serif">Helvetica</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="'Courier New', monospace">Courier New</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Font Scale</label>
              <div className="space-y-2">
                {Object.entries(theme.typography.fontSize).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">{key}</span>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => setTheme({
                        ...theme,
                        typography: {
                          ...theme.typography,
                          fontSize: { ...theme.typography.fontSize, [key]: e.target.value }
                        }
                      })}
                      className="w-24 px-2 py-1 text-sm border border-gray-300 rounded"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'spacing' && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Spacing Scale</label>
            <div className="space-y-2">
              {Object.entries(theme.spacing).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">{key}</span>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setTheme({
                      ...theme,
                      spacing: { ...theme.spacing, [key]: e.target.value }
                    })}
                    className="w-24 px-2 py-1 text-sm border border-gray-300 rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'borders' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Border Radius</label>
              <div className="space-y-2">
                {Object.entries(theme.borderRadius).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">{key}</span>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => setTheme({
                        ...theme,
                        borderRadius: { ...theme.borderRadius, [key]: e.target.value }
                      })}
                      className="w-24 px-2 py-1 text-sm border border-gray-300 rounded"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shadows</label>
              <div className="space-y-2">
                {Object.entries(theme.shadows).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">{key}</span>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => setTheme({
                        ...theme,
                        shadows: { ...theme.shadows, [key]: e.target.value }
                      })}
                      className="w-32 px-2 py-1 text-sm border border-gray-300 rounded"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-gray-200 flex space-x-2">
        <button
          onClick={applyCustomColors}
          className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Save className="w-4 h-4 mr-2" />
          Apply
        </button>
        <button
          onClick={resetTheme}
          className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
