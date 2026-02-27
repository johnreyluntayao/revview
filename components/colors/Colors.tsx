// Colors.tsx
import React from 'react';

const colorGroups = [
  {
    title: 'Main Semantic Colors',
    colors: [
      { name: 'background', class: 'bg-background', text: 'text-foreground' },
      { name: 'foreground', class: 'bg-foreground', text: 'text-background' },
      { name: 'primary', class: 'bg-primary', text: 'text-primary-foreground' },
      { name: 'secondary', class: 'bg-secondary', text: 'text-secondary-foreground' },
      { name: 'accent', class: 'bg-accent', text: 'text-accent-foreground' },
      { name: 'muted', class: 'bg-muted', text: 'text-muted-foreground' },
      { name: 'destructive', class: 'bg-destructive', text: 'text-destructive-foreground' },
      { name: 'border', class: 'bg-border', text: 'text-foreground' },
      { name: 'input', class: 'bg-input', text: 'text-foreground' },
      { name: 'ring', class: 'bg-ring', text: 'text-background' },
    ]
  },
  {
    title: 'Sidebar Colors',
    colors: [
      { name: 'sidebar-background', class: 'bg-sidebar-background', text: 'text-sidebar-foreground' },
      { name: 'sidebar-foreground', class: 'bg-sidebar-foreground', text: 'text-sidebar-background' },
      { name: 'sidebar-primary', class: 'bg-sidebar-primary', text: 'text-sidebar-primary-foreground' },
      { name: 'sidebar-accent', class: 'bg-sidebar-accent', text: 'text-sidebar-accent-foreground' },
    ]
  },
  {
    title: 'Status Colors',
    colors: [
      { name: 'success', class: 'bg-success', text: 'text-success-foreground' },
      { name: 'warning', class: 'bg-warning', text: 'text-warning-foreground' },
    ]
  },
] as const;

const opacitySteps = ['10', '20', '30', '40', '50', '60', '70', '80', '90', '95'] as const;

export default function Colors() {
  return (
    <div className="p-6 space-y-12 font-sans">
      <h1 className="text-3xl font-bold mb-8">Theme Color Palette (light & dark mode)</h1>

      {colorGroups.map((group) => (
        <section key={group.title} className="space-y-6">
          <h2 className="text-2xl font-semibold border-b pb-2">{group.title}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {group.colors.map((color) => (
              <div key={color.name} className="space-y-3">
                {/* Main color row */}
                <div className="flex items-center gap-4">
                  <div
                    className={`w-24 h-24 rounded-lg shadow-sm border border-border flex items-center justify-center text-sm font-medium ${color.class} ${color.text}`}
                  >
                    {color.name}
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className={`${color.text} font-medium`}>{color.name}</div>
                    <div className="text-muted-foreground">bg-{color.name}</div>
                    <div className="text-muted-foreground">text-{color.name}</div>
                  </div>
                </div>

                {/* Border only version */}
                <div className="flex items-center gap-4">
                  <div
                    className={`w-24 h-24 rounded-lg border-4 bg-transparent flex items-center justify-center text-xs ${color.class.replace('bg-', 'border-')}`}
                  >
                    border
                  </div>
                  <div className="text-sm text-muted-foreground">border-{color.name}</div>
                </div>

                {/* Opacity steps (skip for foreground/border/input/ring when they’re very light/dark) */}
                {!(
                  color.name.includes('foreground') ||
                  color.name === 'border' ||
                  color.name === 'input' ||
                  color.name === 'ring' ||
                  color.name === 'background'
                ) && (
                  <div className="grid grid-cols-5 gap-2 text-xs">
                    {opacitySteps.map((op) => (
                      <div key={op} className="space-y-1 text-center">
                        <div
                          className={`w-full h-10 rounded border border-border/30 ${color.class}/10`}
                        />
                        <div className="text-muted-foreground">/{op}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="mt-12 p-6 border border-border rounded-lg bg-muted/40">
        <h3 className="text-xl font-semibold mb-4">Quick reference – most used combinations</h3>
        <div className="flex flex-wrap gap-6">
          <div className="px-5 py-3 bg-primary text-primary-foreground rounded-md font-medium">
            bg-primary + text-primary-foreground
          </div>
          <div className="px-5 py-3 bg-secondary text-secondary-foreground rounded-md">
            bg-secondary + text-secondary-foreground
          </div>
          <div className="px-5 py-3 bg-accent text-accent-foreground rounded-md">
            bg-accent + text-accent-foreground
          </div>
          <div className="px-5 py-3 bg-destructive text-destructive-foreground rounded-md">
            bg-destructive + text-destructive-foreground
          </div>
          <div className="px-5 py-3 bg-success text-success-foreground rounded-md">
            bg-success + text-success-foreground
          </div>
          <div className="px-5 py-3 bg-warning text-warning-foreground rounded-md">
            bg-warning + text-warning-foreground
          </div>
        </div>
      </div>
    </div>
  );
}