import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import clsx from 'clsx';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  /** Uncontrolled: id of the tab selected initially */
  defaultTabId?: string;
  /** Controlled: id of the currently selected tab */
  activeTabId?: string;
  onChange?: (id: string) => void;
  className?: string;
}

/**
 * An accessible tab list following the WAI-ARIA tabs pattern. Supports
 * Left/Right (and Home/End) arrow key navigation between tabs.
 */
export function Tabs({ tabs, defaultTabId, activeTabId, onChange, className }: TabsProps) {
  const enabledTabs = tabs.filter((tab) => !tab.disabled);
  const [internalActiveId, setInternalActiveId] = useState(
    defaultTabId ?? enabledTabs[0]?.id,
  );
  const baseId = useId();

  const isControlled = activeTabId !== undefined;
  const currentId = isControlled ? activeTabId : internalActiveId;

  function selectTab(id: string) {
    if (!isControlled) setInternalActiveId(id);
    onChange?.(id);
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    const currentIndex = enabledTabs.findIndex((tab) => tab.id === currentId);
    if (currentIndex === -1) return;

    let nextIndex: number | null = null;
    if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % enabledTabs.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + enabledTabs.length) % enabledTabs.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = enabledTabs.length - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      const nextTab = enabledTabs[nextIndex];
      selectTab(nextTab.id);
      document.getElementById(`${baseId}-tab-${nextTab.id}`)?.focus();
    }
  }

  const activeTab = tabs.find((tab) => tab.id === currentId);

  return (
    <div className={className}>
      <div role="tablist" aria-label="Tabs" onKeyDown={handleKeyDown} className="flex border-b border-gray-200 dark:border-slate-700">
        {tabs.map((tab) => {
          const isSelected = tab.id === currentId;
          return (
            <button
              key={tab.id}
              id={`${baseId}-tab-${tab.id}`}
              role="tab"
              type="button"
              aria-selected={isSelected}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabIndex={isSelected ? 0 : -1}
              disabled={tab.disabled}
              onClick={() => selectTab(tab.id)}
              className={clsx(
                '-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600',
                isSelected
                  ? 'border-brand-600 text-brand-700 dark:border-brand-400 dark:text-brand-300'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-slate-500 dark:hover:text-slate-300',
                tab.disabled && 'cursor-not-allowed text-gray-300 hover:text-gray-300 dark:text-slate-700 dark:hover:text-slate-700',
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {activeTab && (
        <div
          role="tabpanel"
          id={`${baseId}-panel-${activeTab.id}`}
          aria-labelledby={`${baseId}-tab-${activeTab.id}`}
          className="py-4 text-sm text-gray-700 dark:text-slate-300"
        >
          {activeTab.content}
        </div>
      )}
    </div>
  );
}
