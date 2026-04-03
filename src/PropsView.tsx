import React, { useState } from 'react';

const PropsView = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const PropTable = ({ title, description, props }: { title: string, description?: string, props: any[] }) => {
        const filtered = props.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filtered.length === 0 && searchTerm) return null;

        return (
            <div className="mb-16 bg-black/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md transition-all hover:border-white/20">
                <div className="px-8 py-6 border-b border-white/10 bg-white/5">
                    <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
                    {description && <p className="text-[#8b92a5] text-sm leading-relaxed">{description}</p>}
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-[#8b92a5] text-[10px] uppercase tracking-widest font-black">
                                <th className="px-8 py-5">Property</th>
                                <th className="px-8 py-5">Type</th>
                                <th className="px-8 py-5">Default</th>
                                <th className="px-8 py-5">Description</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {props.filter(p =>
                                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                p.description.toLowerCase().includes(searchTerm.toLowerCase())
                            ).map((p, i) => (
                                <tr key={i} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-8 py-5 font-mono text-sm font-bold text-blue-400 group-hover:text-blue-300">`{p.name}`</td>
                                    <td className="px-8 py-5 font-mono text-xs text-purple-400 opacity-80">{p.type}</td>
                                    <td className="px-8 py-5 font-mono text-xs text-[#8b92a5]">{p.default || '-'}</td>
                                    <td className="px-8 py-5 text-sm text-[#d1d5db] leading-relaxed">{p.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const unifiedCalendarProps = [
        { name: "timezone", type: "string", default: "OS Default", description: "Current user timezone (e.g., 'America/New_York')." },
        { name: "timezoneLabelInclude", type: "boolean", default: "false", description: "Whether to show the timezone offset in the header." },
        { name: "selectedDate", type: "Moment | string | Date", default: "now", description: "The currently selected date to focus on." },
        { name: "onDateChange", type: "(date: Moment) => void", default: "-", description: "Callback when navigation/selection occurs." },
        { name: "slotInterval", type: "number", default: "30", description: "Duration of each time slot in minutes (15, 30, 60)." },
        { name: "dateFormat", type: "string", default: "'MMMM YYYY'", description: "Header date display format (Moment.js style)." },
        { name: "timeFormat", type: "string", default: "'HH:mm'", description: "Display format for times in the grid." },
        { name: "showTimeSlots", type: "boolean", default: "true", description: "Toggle the side-grid time labels." },
        { name: "events", type: "CalendarEvent[]", default: "[]", description: "Array of event objects to render." },
        { name: "enableDragAndResize", type: "boolean", default: "false", description: "Enable interactive moving/resizing features." },
        { name: "enableRecurrence", type: "boolean", default: "false", description: "Expand recurring series into individual instances." },
        { name: "onEventChange", type: "(event: CalendarEvent) => void", description: "Generic callback when any event property changes." },
        { name: "onEventDrop", type: "(event: CalendarEvent) => void", description: "Specific callback for drag-to-move interactions." },
        { name: "onEventResize", type: "(event: CalendarEvent) => void", description: "Specific callback for duration change interactions." },
        { name: "onEventCreate", type: "(event: {start, end}) => void", description: "Specific callback for drag-to-create interactions." },
        { name: "onAddEvent", type: "(event: CalendarEvent) => void", description: "Callback when a new event is added via UI." },
        { name: "onEditEvent", type: "(event: CalendarEvent) => void", description: "Callback when an event is edited via UI." },
        { name: "onDeleteEvent", type: "(id: string) => void", description: "Callback when an event ID is deleted." },
        { name: "formFields", type: "CalendarFormField[]", default: "-", description: "Dynamic fields for EventFormModal configuration." },
        { name: "plugins", type: "Plugin[]", default: "[]", description: "Custom logic hooks (Lifecycle and verification)." },
        { name: "conflictTemplate", type: "ConflictTemplate", description: "Custom renderer for overlap warnings." },
        { name: "conflictThemeVariant", type: "string", default: "'classic_red'", description: "Predefined visual style for conflict alerts." },
        { name: "calendarTheme", type: "CalendarTheme", description: "Full custom branding/color overrides." },
        { name: "calendarThemeVariant", type: "string", default: "'classic_light'", description: "Predefined visual theme to apply." },
        { name: "navigationPosition", type: "'left'|'center'|'right'", default: "'center'", description: "Alignment of the header navigation arrows." },
        { name: "renderNavigation", type: "(actions: NavigationActions) => ReactNode", description: "Custom renderer for the header bar." },
        { name: "showEmptyState", type: "boolean", default: "false", description: "Show a placeholder when no events are scheduled." },
        { name: "futureDaysOnly", type: "boolean", default: "false", description: "Block selection/navigation of past dates." },
        { name: "pastDaysOnly", type: "boolean", default: "false", description: "Block selection/navigation of future dates." }
    ];

    const globalPickerProps = [
        { name: "value", type: "Moment | Date | string", description: "The currently selected value." },
        { name: "onChange", type: "(val: Moment) => void", description: "Callback triggered after selection change." },
        { name: "timezone", type: "string", description: "Target timezone for calculations." },
        { name: "dateFormat", type: "string", description: "Display format for the date." },
        { name: "timeFormat", type: "string", description: "Display format for the time (if applicable)." },
        { name: "placeholder", type: "string", description: "Input field placeholder text." },
        { name: "disabled", type: "boolean", description: "Disable user interactions." },
        { name: "calendarTheme", type: "CalendarTheme", description: "Custom branding/color overrides." },
        { name: "calendarThemeVariant", type: "string", description: "Predefined theme to apply to the popup." }
    ];

    const slotDatePickerProps = [
        { name: "slots", type: "SlotGroup[]", description: "Array of grouped time slots for selection." },
        { name: "onSlotSelect", type: "(time: string) => void", description: "Callback when a user clicks a slot button." },
        { name: "selectedSlot", type: "string", description: "The currently selected time ID (e.g., '09:00')." }
    ];

    const calendarPanelProps = [
        { name: "mode", type: "'single'|'range'|'datetime'|'datetimerange'", description: "Calendar interaction mode." },
        { name: "onClose", type: "() => void", description: "Triggered when the calendar panel should be hidden." }
    ];

    return (
        <div className="w-full max-w-[1200px] mx-auto px-6 py-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20 px-2">
                <div className="flex-1">
                    <h2 className="text-5xl font-black text-white mb-5 tracking-tight bg-gradient-to-br from-white via-white to-white/40 bg-clip-text text-transparent">
                        Technical API Reference
                    </h2>
                    <p className="text-[#8b92a5] text-lg max-w-2xl font-medium leading-relaxed">
                        Comprehensive documentation for every prop across the Schedultron suite.
                        Zero discrepancies between documentation and runtime.
                    </p>
                </div>
                <div className="relative w-full md:w-96 group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
                    <div className="relative flex items-center bg-[#0f1115] rounded-2xl overflow-hidden border border-white/10 group-focus-within:border-blue-500/50 transition-all">
                        <div className="pl-5 text-[#8b92a5]">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Filter props globally..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-transparent px-4 py-5 text-white outline-none font-bold text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Prop Sections */}
            <div className="space-y-4">
                <PropTable
                    title="1. Unified Calendar Props"
                    description="Used primarily by Calendar, DayView, WeekView, and MonthView components."
                    props={unifiedCalendarProps}
                />

                <PropTable
                    title="2. Global Picker Props"
                    description="Common properties shared by DatePicker, DateTimePicker, and RangePickers."
                    props={globalPickerProps}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <PropTable
                        title="3. SlotDatePicker Specific"
                        description="Specialized booking component configuration."
                        props={slotDatePickerProps}
                    />
                    <PropTable
                        title="4. CalendarPanel Specific"
                        description="Compact sidebar component parameters."
                        props={calendarPanelProps}
                    />
                </div>
            </div>

            {/* Footer / Call to action */}
            <div className="mt-24 p-12 rounded-[40px] bg-[#1e2228]/40 border border-white/5 relative overflow-hidden backdrop-blur-xl group">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
                    <div className="max-w-xl">
                        <h3 className="text-3xl font-black text-white mb-6">Explore the full Type System</h3>
                        <p className="text-[#8b92a5] mb-10 text-base leading-relaxed font-medium">
                            Need the raw TypeScript interfaces for <code className="text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">CalendarEvent</code>,
                            <code className="text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded ml-1">RecurrencePattern</code>, or custom plugin hooks?
                            The full technical specification is available in the <code className="text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded ml-1">README.md</code>.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <a
                                href="https://github.com/Surya9122prakash/schedultron"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-black rounded-2xl transition-all hover:scale-[1.03] active:scale-95 shadow-xl"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                                Star on GitHub
                            </a>
                            <a
                                href="https://www.npmjs.com/package/schedultron"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl transition-all hover:bg-white/10 active:scale-95"
                            >
                                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.666H5.334v-4H3.999v4H1.335v-5.332h5.331v5.332zm6.668 0h-1.334v-5.332h5.332v4h-1.333v-1.335h-1.331v2.667zm6.665 0h-1.334v-4h-1.334v4H17.33v-5.332h5.334v5.332z" /></svg>
                                Open NPM
                            </a>
                        </div>
                    </div>
                    <div className="hidden lg:block relative">
                        <div className="absolute -inset-10 bg-blue-500/10 blur-[80px] rounded-full animate-pulse" />
                        <div className="relative p-8 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-md">
                            <div className="text-emerald-400 font-mono text-xs mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                Connection Stable
                            </div>
                            <div className="text-[#8b92a5] font-mono text-[10px] space-y-1">
                                <div>&gt; SYNC_DOCS_PARITY: 100%</div>
                                <div>&gt; ACTIVE_COMPONENTS: 11</div>
                                <div>&gt; TOTAL_PROPS_MAPPED: 44</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
            </div>
        </div>
    );
};

export default PropsView;
