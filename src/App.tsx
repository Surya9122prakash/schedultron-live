import { Calendar, DayView, WeekView, MonthView, DatePicker, SlotDatePicker } from "schedultron";
import moment, { Moment } from "moment-timezone";
import { useState, useRef, useEffect } from "react";
import "./App.css";

// SVG Icons for buttons
const Icons = {
  Calendar: () => <svg className="w-4 h-4 calendar-icon-align" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Day: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Week: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>,
  Month: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  Pointer: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
};

type Option = {
  label: string;
  value: string;
};

type CustomDropdownProps = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  searchable?: boolean;
};

const CustomDropdown = ({
  options,
  value,
  onChange,
  className,
  searchable = false
}: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt: any) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) setSearchTerm("");
        }}
        className={`appearance-none bg-black/30 border border-white/10 text-white pl-4 pr-10 py-2 rounded-lg text-sm outline-none cursor-pointer transition-colors hover:border-white/30 hover:bg-black/50 focus:border-white/30 text-left truncate flex items-center justify-between ${className}`}
      >
        <span className="truncate">{options.find((o: any) => o.value === value)?.label || value}</span>
        <div className="absolute right-3 pointer-events-none text-[#8b92a5] flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={isOpen ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6"} /></svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 min-w-[200px] bg-[#1f232b] border border-white/10 rounded-lg shadow-2xl flex flex-col z-50 py-1 overflow-hidden" style={{ maxHeight: '350px' }}>
          {searchable && (
            <div className="px-3 py-2 border-b border-white/5 bg-[#1f232b] flex-shrink-0">
              <input
                type="text"
                autoFocus
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded px-3 py-1.5 text-sm text-white outline-none focus:border-blue-500/50 transition-colors"
                onKeyDown={(e) => e.stopPropagation()}
              />
            </div>
          )}
          <div className="overflow-y-auto no-scrollbar flex-1 pb-1">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-[#8b92a5] text-center italic">No templates found</div>
            ) : (
              filteredOptions.map((opt: any) => (
                <div
                  key={opt.value}
                  className={`px-4 py-2.5 cursor-pointer text-sm transition-colors hover:bg-white/10 ${value === opt.value ? 'text-blue-400 bg-blue-500/10 font-medium' : 'text-[#8b92a5]'}`}
                  onMouseDown={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                >
                  <div className="truncate">{opt.label}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [selectedDate, setSelectedDate] = useState<Moment>(moment());
  const [view, setView] = useState<"calendar" | "day" | "week" | "month" | "datepicker" | "slotdatepicker">("calendar");
  const [calendarTheme, setCalendarTheme] = useState<any>("dark_night");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [timezone, setTimezone] = useState<string>(moment.tz.guess() || "UTC");

  const mockSlots = [
    {
      group: "Morning",
      items: [
        { time: "09:00 AM" }, { time: "09:30 AM" }, { time: "10:00 AM" }, { time: "10:30 AM" }, { time: "11:00 AM" }
      ]
    },
    {
      group: "Afternoon",
      items: [
        { time: "12:00 PM" }, { time: "12:30 PM" }, { time: "01:00 PM" }, { time: "01:30 PM" }, { time: "02:00 PM" }, { time: "02:30 PM" }, { time: "03:00 PM" }
      ]
    }
  ];

  const [events, setEvents] = useState([
    {
      id: "1",
      title: "Morning Sync",
      start: moment().hour(9).minute(0).toISOString(),
      end: moment().hour(10).minute(0).toISOString(),
      color: "#3b82f6",
      status: "confirmed"
    },
    {
      id: "2",
      title: "Design Review",
      start: moment().hour(13).minute(0).toISOString(),
      end: moment().hour(14).minute(0).toISOString(),
      color: "#8b5cf6",
      status: "scheduled"
    }
  ]);

  // Sync selectedDate when timezone changes to maintain consistency
  useEffect(() => {
    setSelectedDate(prev => moment(prev).tz(timezone));
  }, [timezone]);

  const handleAddEvent = (event: any) => setEvents([...events, event]);
  const handleEditEvent = (updated: any) => setEvents(events.map(e => e.id === updated.id ? updated : e));
  const handleDeleteEvent = (id: string) => setEvents(events.filter(e => e.id !== id));

  const commonProps = {
    timezone,
    timezoneLabelInclude: true,
    selectedDate,
    onDateChange: setSelectedDate,
    events,
    onAddEvent: handleAddEvent,
    onEditEvent: handleEditEvent,
    onDeleteEvent: handleDeleteEvent,
    dateFormat: "DD/MM/YYYY",
    timeFormat: "hh:mm A",
    calendarThemeVariant: calendarTheme,
    plugins: []
  };

  const views = [
    { id: "calendar", label: "Full Calendar", icon: <Icons.Calendar /> },
    { id: "day", label: "Day", icon: <Icons.Day /> },
    { id: "week", label: "Week", icon: <Icons.Week /> },
    { id: "month", label: "Month", icon: <Icons.Month /> },
    { id: "datepicker", label: "Date Picker", icon: <Icons.Calendar /> },
    { id: "slotdatepicker", label: "Slot Picker", icon: <Icons.Calendar /> }
  ] as const;

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0f1115] text-[#ffffff] selection:bg-purple-600/30 overflow-hidden relative">
      {/* Background Animated Blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#0f1115]">
        <div className="absolute opacity-40 blur-[100px] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.6)_0%,rgba(139,92,246,0)_70%)] -top-[200px] -left-[200px]" />
        <div className="absolute opacity-60 blur-[120px] w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.5)_0%,rgba(59,130,246,0)_70%)] -bottom-[300px] -right-[200px]" />
        <div className="absolute opacity-50 blur-[100px] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.4)_0%,rgba(16,185,129,0)_70%)] bottom-[20%] left-[30%]" />
      </div>

      {/* Top Application Header */}
      <header className="relative z-20 flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#14161b]/80 backdrop-blur-2xl">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 font-['Outfit'] text-xl font-extrabold tracking-tight bg-gradient-to-br from-white to-indigo-300 bg-clip-text text-transparent mr-4">
            <svg className="w-7 h-7 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Schedultron
          </div>

          <div className="hidden lg:flex bg-black/20 p-1 rounded-xl border border-white/5 gap-1">
            {views.map((v) => (
              <button
                key={v.id}
                onClick={() => setView(v.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${view === v.id
                    ? 'bg-blue-500/20 text-blue-400 shadow-[0_4px_15px_rgba(59,130,246,0.1)]'
                    : 'text-[#8b92a5] hover:text-white hover:bg-white/5'
                  }`}
              >
                <span className={`w-4 h-4 flex items-center justify-center ${view === v.id ? 'opacity-100' : 'opacity-70'}`}>{v.icon}</span>
                {v.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-xs text-[#8b92a5] font-medium hidden xl:block">Timezone:</label>
            <CustomDropdown
              className="w-[200px]"
              value={timezone}
              onChange={setTimezone}
              options={moment.tz.names().map((tz: string) => ({ label: tz, value: tz }))}
              searchable={true}
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-[#8b92a5] font-medium hidden xl:block">Themes:</label>
            <CustomDropdown
              className="w-[160px]"
              value={calendarTheme}
              onChange={setCalendarTheme}
              options={[
                { label: "Dark Night", value: "dark_night" },
                { label: "Classic Light", value: "classic_light" },
                { label: "Slate", value: "slate_modern" },
                { label: "Emerald", value: "emerald_forest" },
                { label: "Black Mono", value: "black_mono" },
                { label: "Ocean Breeze", value: "ocean_breeze" },
                { label: "Midnight Purple", value: "midnight_purple" },
                { label: "Cyber Punk", value: "cyber_punk" }
              ]}
            />
          </div>

          <div className="h-6 w-px bg-white/10 mx-2 hidden md:block" />

          <a href="https://github.com/Surya9122prakash/schedultron" target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-2 text-sm text-[#8b92a5] hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
            GitHub
          </a>
        </div>
      </header>

      {/* Main Workspace - Full Width rendering */}
      <main className="relative z-10 flex-1 w-full h-full p-6 overflow-hidden flex flex-col">
        <div className="bg-[#14161b]/80 backdrop-blur-3xl border border-white/10 rounded-[24px] shadow-2xl flex-1 flex flex-col overflow-hidden relative">

          {/* subtle inside glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-[radial-gradient(circle,rgba(255,255,255,0.02)_0%,transparent_70%)] pointer-events-none z-0" />

          {/* Render Area */}
          <div className="relative z-10 flex-1 w-full h-full overflow-y-auto animate-[fadeIn_0.5s_ease-out_forwards] no-scrollbar p-6 flex flex-col items-center">

            {(view === "calendar" || view === "day" || view === "week" || view === "month") && (
              <div className="flex-1 w-full h-full bg-black/20 rounded-2xl border border-white/5 overflow-hidden shadow-inner flex flex-col min-h-0">
                <div className="flex-1 w-full relative flex flex-col min-h-0 [&>div]:flex-1 [&>div]:min-h-0">
                  {view === "calendar" && <Calendar {...commonProps} />}
                  {view === "day" && <DayView {...commonProps} slotInterval={60} showTimeSlots={true} showEmptyState={true} navigateToFirstEvent={true} />}
                  {view === "week" && <WeekView {...commonProps} showTodayBelow={false} />}
                  {view === "month" && <MonthView {...commonProps} showTodayBelow={false} />}
                </div>
              </div>
            )}

            {view === "datepicker" && (
              <div className="flex flex-col items-center justify-center h-full w-full">
                <div className="bg-black/40 border border-white/10 rounded-2xl p-10 shadow-2xl w-full max-w-[500px] backdrop-blur-md">
                  <h3 className="text-2xl font-semibold text-white mb-3">Standard Input Widget</h3>
                  <p className="text-[#8b92a5] text-sm mb-8 leading-relaxed">A sleek dropdown calendar mapping to an input field. Integrates smoothly within limited height applications.</p>

                  <div className="max-w-[400px]">
                    <DatePicker
                      value={selectedDate}
                      onChange={(date: Moment) => setSelectedDate(date)}
                      timezone={timezone}
                      calendarThemeVariant={calendarTheme}
                      placeholder="Select a date"
                    />
                  </div>

                  {selectedDate && (
                    <div className="mt-10 p-5 px-6 bg-emerald-500/10 border border-dashed border-emerald-500/30 rounded-xl text-emerald-300 flex flex-col gap-2">
                      <span className="text-xs uppercase tracking-widest opacity-80 font-semibold">Value binding</span>
                      <strong className="text-xl">{selectedDate.format("MMMM Do YYYY")}</strong>
                    </div>
                  )}
                </div>
              </div>
            )}

            {view === "slotdatepicker" && (
              <div className="flex flex-col items-center justify-center h-full w-full">
                {/* Made Slot Picker UI sprawling using flex by applying a max-width of 1200px and letting its internal properties stretch out! */}
                <div className="w-full flex-1 max-w-[1200px] flex flex-col">
                  <div className="mb-6">
                    <h3 className="text-3xl font-bold text-white mb-2">Booking Flow UI</h3>
                    <p className="text-[#8b92a5] text-base leading-relaxed">
                      A beautiful flex split layout featuring calendar selection natively alongside time slots.
                    </p>
                  </div>

                  <div className="flex-1 w-full flex [&>div]:!w-full [&>div]:!min-w-0 [&>div]:flex-1">
                    {/* Notice we force SlotDatePicker to use 100% of flex container */}
                    <SlotDatePicker
                      value={selectedDate}
                      onChange={(date: Moment) => setSelectedDate(date)}
                      timezone={timezone}
                      calendarThemeVariant={calendarTheme}
                      slots={mockSlots}
                      onSlotSelect={setSelectedSlot}
                      selectedSlot={selectedSlot}
                    />
                  </div>

                  {(selectedDate || selectedSlot) && (
                    <div className="mt-8 p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 flex flex-col gap-2">
                      <span className="text-xs uppercase tracking-widest opacity-80 font-bold">Reservation Details</span>
                      <div className="flex gap-12 mt-4 text-white">
                        <div>
                          <div className="text-sm text-[#8b92a5] mb-1">Selected Date</div>
                          <strong className="text-2xl font-['Outfit']">{selectedDate.format("MMMM Do, YYYY")}</strong>
                        </div>
                        <div>
                          <div className="text-sm text-[#8b92a5] mb-1">Time Slot</div>
                          <strong className="text-2xl font-['Outfit']">{selectedSlot || "None selected"}</strong>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default App;
