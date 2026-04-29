// Colors.tsx
import React from 'react';

const colorGroups = [
  {
    title: 'Main Semantic Colors',
    colors: [
      { name: 'background',  bg: 'bg-background',  text: 'text-foreground',      showOpacity: false },
      { name: 'card',        bg: 'bg-card',        text: 'text-card-foreground', showOpacity: false },
      { name: 'popover',     bg: 'bg-popover',     text: 'text-popover-foreground', showOpacity: false },
      { name: 'primary',     bg: 'bg-primary',     text: 'text-primary-foreground', showOpacity: true  },
      { name: 'secondary',   bg: 'bg-secondary',   text: 'text-secondary-foreground', showOpacity: true  },
      { name: 'accent',      bg: 'bg-accent',      text: 'text-accent-foreground',   showOpacity: true  },
      { name: 'muted',       bg: 'bg-muted',       text: 'text-muted-foreground',    showOpacity: true  },
      { name: 'destructive', bg: 'bg-destructive', text: 'text-destructive-foreground', showOpacity: true },
      { name: 'border',      bg: 'bg-border',      text: 'text-foreground',         showOpacity: false },
      { name: 'input',       bg: 'bg-input',       text: 'text-foreground',         showOpacity: false },
      { name: 'ring',        bg: 'bg-ring',        text: 'text-background',         showOpacity: false },
    ]
  },
  {
    title: 'Sidebar Colors',
    colors: [
      { name: 'sidebar-background', bg: 'bg-sidebar-background', text: 'text-sidebar-foreground', showOpacity: false },
      { name: 'sidebar-foreground', bg: 'bg-sidebar-foreground', text: 'text-sidebar-background', showOpacity: false },
      { name: 'sidebar-primary',    bg: 'bg-sidebar-primary',    text: 'text-sidebar-primary-foreground', showOpacity: true },
      { name: 'sidebar-accent',     bg: 'bg-sidebar-accent',     text: 'text-sidebar-accent-foreground',  showOpacity: true },
      { name: 'sidebar-border',     bg: 'bg-sidebar-border',     text: 'text-sidebar-foreground',         showOpacity: false },
    ]
  },
  {
    title: 'Status Colors',
    colors: [
      { name: 'success', bg: 'bg-success', text: 'text-success-foreground', showOpacity: true },
      { name: 'warning', bg: 'bg-warning', text: 'text-warning-foreground', showOpacity: true },
    ]
  },
] as const;

const opacitySteps = ['5', '10', '20', '30', '40', '50', '60', '70', '80', '90'] as const;

export default function Colors() {
  return (
    <div className="p-6 space-y-14 font-sans">
      <h1 className="text-4xl font-bold tracking-tight mb-10">
        Theme Color Palette — Light & Dark Mode
      </h1>

      {colorGroups.map((group) => (
        <section key={group.title} className="space-y-6">
          <h2 className="text-2xl font-semibold border-b pb-3">{group.title}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {group.colors.map((color) => (
              <div
                key={color.name}
                className="border border-border/40 rounded-xl p-5 bg-card/40 space-y-5 shadow-sm hover:shadow transition-shadow"
              >
                {/* Color swatch + name */}
                <div className="flex items-center gap-4">
                  <div
                    className={`
                      w-20 h-20 rounded-lg shadow-inner flex items-center justify-center
                      text-xs font-semibold tracking-tight ${color.bg} ${color.text}
                    `}
                  >
                    {color.name}
                  </div>

                  <div className="space-y-0.5">
                    <div className="font-medium text-sm">{color.name}</div>
                    <div className="text-xs text-muted-foreground">{color.bg}</div>
                    <div className="text-xs text-muted-foreground">text-…</div>
                  </div>
                </div>

                {/* Border preview */}
                <div className="flex items-center gap-4">
                  <div
                    className={`
                      w-20 h-20 rounded-lg border-4 flex items-center justify-center text-[10px] font-medium
                      bg-transparent
                      border-${color.name === 'border' ? 'border' : ''}
                      border-${color.name === 'primary' ? 'primary' : ''}
                      border-${color.name === 'secondary' ? 'secondary' : ''}
                      border-${color.name === 'accent' ? 'accent' : ''}
                      border-${color.name === 'destructive' ? 'destructive' : ''}
                      border-${color.name === 'success' ? 'success' : ''}
                      border-${color.name === 'warning' ? 'warning' : ''}
                      border-${color.name === 'muted' ? 'muted' : ''}
                      ${!['border','primary','secondary','accent','destructive','success','warning','muted'].includes(color.name)
                        ? 'border-foreground/30'
                        : ''
                      }
                    `}
                  >
                    border
                  </div>
                  <div className="text-xs text-muted-foreground">
                    border-{color.name}
                  </div>
                </div>

                {/* Opacity ramp – only for colors that support it well */}
                {color.showOpacity && (
                  <div className="grid grid-cols-5 gap-2 pt-2">
                    {opacitySteps.map((op) => (
                      <div key={op} className="text-center">
                        <div
                          className={`
                            w-full h-10 rounded-md border border-border/20
                            ${color.bg}/${op}
                          `}
                        />
                        <div className="text-[10px] text-muted-foreground mt-1">/{op}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Quick reference bar */}
      <div className="mt-16 p-6 border border-border rounded-xl bg-muted/30 space-y-5">
        <h3 className="text-2xl font-semibold">Most Common Combinations</h3>
        <div className="flex flex-wrap gap-4">
          {[
            { bg: 'primary',   text: 'primary-foreground'   },
            { bg: 'secondary', text: 'secondary-foreground' },
            { bg: 'accent',    text: 'accent-foreground'    },
            { bg: 'destructive', text: 'destructive-foreground' },
            { bg: 'success',   text: 'success-foreground'   },
            { bg: 'warning',   text: 'warning-foreground'   },
          ].map((c) => (
            <div
              key={c.bg}
              className={`
                px-5 py-2.5 rounded-lg font-medium shadow-sm
                bg-${c.bg} text-${c.text}
              `}
            >
              bg-{c.bg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}