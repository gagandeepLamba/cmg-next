'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
    };
    fontWeight: {
      light: number;
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  availableThemes: Theme[];
  updateThemeColors: (colors: Partial<Theme['colors']>) => void;
  resetTheme: () => void;
}

const defaultThemes: Theme[] = [
  {
    name: 'Professional Blue',
    colors: {
      primary: '#3B82F6',
      secondary: '#6366F1',
      accent: '#8B5CF6',
      background: '#F9FAFB',
      surface: '#FFFFFF',
      text: '#111827',
      textSecondary: '#6B7280',
      border: '#E5E7EB',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#06B6D4'
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        md: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem'
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700
      }
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem'
    },
    borderRadius: {
      sm: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem'
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
    }
  },
  {
    name: 'Modern Purple',
    colors: {
      primary: '#8B5CF6',
      secondary: '#A78BFA',
      accent: '#C084FC',
      background: '#FAFAFA',
      surface: '#FFFFFF',
      text: '#1F2937',
      textSecondary: '#6B7280',
      border: '#E5E7EB',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#06B6D4'
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        md: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem'
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700
      }
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem'
    },
    borderRadius: {
      sm: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem'
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
    }
  },
  {
    name: 'Dark Mode',
    colors: {
      primary: '#60A5FA',
      secondary: '#818CF8',
      accent: '#A78BFA',
      background: '#111827',
      surface: '#1F2937',
      text: '#F9FAFB',
      textSecondary: '#D1D5DB',
      border: '#374151',
      success: '#34D399',
      warning: '#FBBF24',
      error: '#F87171',
      info: '#22D3EE'
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        md: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem'
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700
      }
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem'
    },
    borderRadius: {
      sm: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem'
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.4)'
    }
  }
];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(defaultThemes[0]);

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        setThemeState(parsedTheme);
      } catch (error) {
        console.error('Error parsing saved theme:', error);
      }
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('selectedTheme', JSON.stringify(newTheme));
    applyThemeToDocument(newTheme);
  };

  const updateThemeColors = (colors: Partial<Theme['colors']>) => {
    const updatedTheme = {
      ...theme,
      colors: {
        ...theme.colors,
        ...colors
      }
    };
    setTheme(updatedTheme);
  };

  const resetTheme = () => {
    setTheme(defaultThemes[0]);
  };

  const applyThemeToDocument = (themeToApply: Theme) => {
    const root = document.documentElement;
    
    // Apply CSS custom properties
    Object.entries(themeToApply.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Apply font family
    root.style.setProperty('--font-family', themeToApply.typography.fontFamily);

    // Apply spacing
    Object.entries(themeToApply.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });

    // Apply border radius
    Object.entries(themeToApply.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value);
    });

    // Apply shadows
    Object.entries(themeToApply.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });
  };

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme,
      availableThemes: defaultThemes,
      updateThemeColors,
      resetTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
