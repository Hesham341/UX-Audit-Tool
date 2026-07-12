import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type OptionItem = {
  id: string;
  label: string;
  color: string;
  icon: string;
};

export type FieldOptions = {
  categories: OptionItem[];
  severities: OptionItem[];
  priorities: OptionItem[];
  efforts: OptionItem[];
  statuses: OptionItem[];
};

export const FIELD_OPTION_DEFAULTS: FieldOptions = {
  categories: [
    { id: 'usability',    label: 'Usability',         color: '#C0375A', icon: 'Pointer'   },
    { id: 'bug',          label: 'Bug',                color: '#D95C4A', icon: 'Bug'       },
    { id: 'ui',           label: 'User Interface',     color: '#D97B3A', icon: 'Monitor'   },
    { id: 'feature',      label: 'Feature',            color: '#3AA68A', icon: 'Sparkles'  },
    { id: 'content',      label: 'Content',            color: '#3A9EB5', icon: 'FileText'  },
    { id: 'ia',           label: 'Info Architecture',  color: '#3A5CA6', icon: 'Network'   },
    { id: 'info-design',  label: 'Info Design',        color: '#7B5EA6', icon: 'PenTool'   },
  ],
  severities: [
    { id: 'low',      label: 'Low',      color: '#6BB5AA', icon: 'AlertCircle' },
    { id: 'medium',   label: 'Medium',   color: '#E8B84B', icon: 'AlertCircle' },
    { id: 'high',     label: 'High',     color: '#FF8D3A', icon: 'AlertCircle' },
    { id: 'critical', label: 'Critical', color: '#C0375A', icon: 'AlertCircle' },
  ],
  priorities: [
    { id: 'low',    label: 'Low',    color: '#6BB5AA', icon: 'Flag' },
    { id: 'medium', label: 'Medium', color: '#E8B84B', icon: 'Flag' },
    { id: 'high',   label: 'High',   color: '#C0375A', icon: 'Flag' },
  ],
  efforts: [
    { id: 'low',    label: 'Low',    color: '#6BB5AA', icon: 'Zap' },
    { id: 'medium', label: 'Medium', color: '#E8B84B', icon: 'Zap' },
    { id: 'high',   label: 'High',   color: '#C0375A', icon: 'Zap' },
  ],
  statuses: [
    { id: 'not-resolved', label: 'Not Resolved', color: '#C0375A', icon: 'Circle'       },
    { id: 'in-progress',  label: 'In Progress',  color: '#E8B84B', icon: 'Clock'        },
    { id: 'resolved',     label: 'Resolved',     color: '#6BB5AA', icon: 'CheckCircle2' },
    { id: 'not-an-issue', label: 'Not an issue', color: '#6B7280', icon: 'XCircle'      },
  ],
};

type FieldKey = keyof FieldOptions;

type FieldOptionsContextValue = {
  options: FieldOptions;
  addOption: (field: FieldKey, item: Omit<OptionItem, 'id'>) => void;
  updateOption: (field: FieldKey, id: string, updates: Partial<Omit<OptionItem, 'id'>>) => void;
  removeOption: (field: FieldKey, id: string) => void;
  resetField: (field: FieldKey) => void;
};

const FieldOptionsContext = createContext<FieldOptionsContextValue | null>(null);

const STORAGE_KEY = 'ux-mosaic-field-options';

function loadFromStorage(): FieldOptions {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as FieldOptions;
  } catch {
    // ignore malformed data
  }
  return FIELD_OPTION_DEFAULTS;
}

export function FieldOptionsProvider({ children }: { children: React.ReactNode }) {
  const [options, setOptions] = useState<FieldOptions>(loadFromStorage);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(options));
    } catch {
      // ignore storage errors
    }
  }, [options]);

  const addOption = useCallback((field: FieldKey, item: Omit<OptionItem, 'id'>) => {
    setOptions(prev => ({
      ...prev,
      [field]: [...prev[field], { ...item, id: crypto.randomUUID() }],
    }));
  }, []);

  const updateOption = useCallback((field: FieldKey, id: string, updates: Partial<Omit<OptionItem, 'id'>>) => {
    setOptions(prev => ({
      ...prev,
      [field]: prev[field].map(item => item.id === id ? { ...item, ...updates } : item),
    }));
  }, []);

  const removeOption = useCallback((field: FieldKey, id: string) => {
    setOptions(prev => ({
      ...prev,
      [field]: prev[field].filter(item => item.id !== id),
    }));
  }, []);

  const resetField = useCallback((field: FieldKey) => {
    setOptions(prev => ({
      ...prev,
      [field]: FIELD_OPTION_DEFAULTS[field],
    }));
  }, []);

  return (
    <FieldOptionsContext.Provider value={{ options, addOption, updateOption, removeOption, resetField }}>
      {children}
    </FieldOptionsContext.Provider>
  );
}

export function useFieldOptions(): FieldOptionsContextValue {
  const ctx = useContext(FieldOptionsContext);
  if (!ctx) throw new Error('useFieldOptions must be used inside FieldOptionsProvider');
  return ctx;
}
