import {
  Calendar, DayView, WeekView, MonthView,
  DatePicker, DateRangePicker, DateTimePicker, DateTimeRangePicker,
  DatePickerField, DateRangePickerField, DateTimePickerField, DateTimeRangePickerField,
  TimePicker, TimeRangePicker,
  SlotDatePicker, type CalendarEvent
} from "schedultron";
import moment, { Moment } from "moment-timezone";
import { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import "./App.css";
import PropsView from "./PropsView";

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
          <div className="overflow-y-auto  flex-1 pb-1">
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
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      single: moment(),
      range: { start: null, end: null },
      datetime: null,
      datetimeRange: { start: null, end: null },
      time: null,
      timeRange: { start: null, end: null }
    }
  });

  const [selectedDate, setSelectedDate] = useState<Moment>(moment());
  const [submittedData, setSubmittedData] = useState<any>(null);

  const onFormSubmit = (data: any) => {
    // Process moment objects into ISO strings for clean JSON display
    const processedData = {
      single: data.single?.toISOString(),
      range: {
        start: data.range?.start?.toISOString(),
        end: data.range?.end?.toISOString()
      },
      datetime: data.datetime?.toISOString(),
      datetimeRange: {
        start: data.datetimeRange?.start?.toISOString(),
        end: data.datetimeRange?.end?.toISOString()
      },
      time: data.time?.toISOString(),
      timeRange: {
        start: data.timeRange?.start?.toISOString(),
        end: data.timeRange?.end?.toISOString()
      }
    };
    console.log("Form Demo Data:", processedData);
    setSubmittedData(processedData);
  };
  const [selectedRange, setSelectedRange] = useState<any>({ start: null, end: null });
  const [selectedDateTime, setSelectedDateTime] = useState<Moment | null>(null);
  const [selectedDateTimeRange, setSelectedDateTimeRange] = useState<any>({ start: null, end: null });
  const [selectedTime, setSelectedTime] = useState<Moment | null>(moment());
  const [selectedTimeRange, setSelectedTimeRange] = useState<any>({ start: null, end: null });
  const [view, setView] = useState<"calendar" | "day" | "week" | "month" | "datepicker" | "slotdatepicker" | "form-demo" | "props">("calendar");
  const [calendarTheme, setCalendarTheme] = useState<any>("dark_night");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [timezone, setTimezone] = useState<string>(moment.tz.guess() || "UTC");
  const [enableDragAndResize, setEnableDragAndResize] = useState(true);
  const [enableRecurrence, setEnableRecurrence] = useState(true);
  const [dateFormat, setDateFormat] = useState<string>("DD/MM/YYYY");
  const [timeFormat, setTimeFormat] = useState<string>("hh:mm A");

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

  const [events, setEvents] = useState<CalendarEvent[]>([
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
    },
    {
      id: "3",
      title: "Weekly Sync (Every 1 week)",
      start: moment().hour(11).minute(0).toISOString(),
      end: moment().hour(12).minute(0).toISOString(),
      color: "#ec4899",
      recurrence: {
        frequency: "weekly",
        interval: 1
      }
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
    onEventChange: handleEditEvent, // Add this for drag/resize
    dateFormat,
    timeFormat,
    calendarThemeVariant: calendarTheme,
    plugins: [],
    enableDragAndResize,
    enableRecurrence
  };

  const views = [
    { id: "calendar", label: "Full Calendar", icon: <Icons.Calendar /> },
    { id: "day", label: "Day", icon: <Icons.Day /> },
    { id: "week", label: "Week", icon: <Icons.Week /> },
    { id: "month", label: "Month", icon: <Icons.Month /> },
    { id: "datepicker", label: "Date Picker", icon: <Icons.Calendar /> },
    { id: "slotdatepicker", label: "Slot Picker", icon: <Icons.Calendar /> },
    { id: "form-demo", label: "Form Demo", icon: <Icons.Pointer /> },
    { id: "props", label: "Props Reference", icon: <Icons.Calendar /> }
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
      <header className="relative z-[200] flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#14161b]/80 backdrop-blur-2xl">
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
          <a href="https://github.com/Surya9122prakash/schedultron" target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-2 text-sm text-[#8b92a5] hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
            GitHub
          </a>
        </div>
      </header>

      {/* Global Controls Toolbar */}
      <div className="relative z-[190] flex-shrink-0 flex items-center gap-6 px-8 py-3 border-b border-white/[0.05] bg-[#0f1115]/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <label className="text-[10px] text-[#8b92a5] font-bold uppercase tracking-wider">Timezone</label>
          <CustomDropdown
            className="w-[200px]"
            value={timezone}
            onChange={setTimezone}
            options={moment.tz.names().map((tz: string) => ({ label: tz, value: tz }))}
            searchable={true}
          />
        </div>

        <div className="h-4 w-px bg-white/10" />

        <div className="flex items-center gap-3">
          <label className="text-[10px] text-[#8b92a5] font-bold uppercase tracking-wider">Theme</label>
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

        <div className="h-4 w-px bg-white/10" />

        <div className="flex items-center gap-3">
          <label className="text-[10px] text-[#8b92a5] font-bold uppercase tracking-wider">Date Format</label>
          <CustomDropdown
            className="w-[140px]"
            value={dateFormat}
            onChange={setDateFormat}
            options={[
              "YYYY-MM-DD",
              "YYYY/MM/DD",
              "YYYY.MM.DD",
              "YYYY MM DD",
              "YYYYMMDD",

              "DD-MM-YYYY",
              "DD/MM/YYYY",
              "DD.MM.YYYY",
              "DD MM YYYY",
              "DDMMYYYY",

              "MM-DD-YYYY",
              "MM/DD/YYYY",
              "MM.DD.YYYY",
              "MM DD YYYY",
              "MMDDYYYY",

              "YY-MM-DD",
              "DD-MM-YY",
              "MM-DD-YY",

              "DD MMM YYYY",
              "DD MMMM YYYY",
              "MMM DD, YYYY",
              "MMMM DD, YYYY",
              "YYYY MMM DD",
              "YYYY MMMM DD",

              "DD-MMM-YYYY",
              "DD.MMM.YYYY",
              "MMM-DD-YYYY",
              "YYYY-MMM-DD",

              "YYYY-DDD",
              "YYYY-[W]WW",
              "YYYY-[W]WW-E",

              "dddd, DD MMMM YYYY",
              "ddd, DD MMM YYYY",

              "DD/MM/YYYY dddd",
              "MMMM DD YYYY",
              "DD MMM YYYY dddd"
            ].map(fmt => ({ label: fmt, value: fmt }))}
          />
        </div>

        <div className="h-4 w-px bg-white/10" />

        <div className="flex items-center gap-3">
          <label className="text-[10px] text-[#8b92a5] font-bold uppercase tracking-wider">Time Format</label>
          <CustomDropdown
            className="w-[180px]"
            value={timeFormat}
            onChange={setTimeFormat}
            options={[
              "HH:mm",
              "HH:mm:ss",
              "HH:mm:ss.SSS",
              "HHmm",
              "HHmmss",

              "hh:mm A",
              "hh:mm:ss A",
              "hh:mm:ss.SSS A",

              "hh:mm a",
              "hh:mm:ss a",

              "H:m",
              "H:m:s",

              "HH:mm:ss.SSSZ",
              "HH:mm:ssZ",
              "HH:mmZ",

              "HH:mm:ss ZZ",
              "HH:mm ZZ",

              "HH:mm:ss z",
              "HH:mm z"
            ].map(fmt => ({ label: fmt, value: fmt }))}
          />
        </div>

        <div className="h-4 w-px bg-white/10" />

        <div className="flex items-center gap-6 px-4 py-1.5 bg-white/5 rounded-lg border border-white/5">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="drag-resize"
              checked={enableDragAndResize}
              onChange={(e) => setEnableDragAndResize(e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-black/40 text-blue-500 cursor-pointer"
            />
            <label htmlFor="drag-resize" className="text-[10px] text-[#8b92a5] font-bold uppercase tracking-wider cursor-pointer">Drag & Resize</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="recurrence"
              checked={enableRecurrence}
              onChange={(e) => setEnableRecurrence(e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-black/40 text-blue-500 cursor-pointer"
            />
            <label htmlFor="recurrence" className="text-[10px] text-[#8b92a5] font-bold uppercase tracking-wider cursor-pointer">Recurrence</label>
          </div>
        </div>
      </div>

      {/* Main Workspace - Full Width rendering */}
      <main className="flex-1 w-full p-0 overflow-y-auto flex flex-col">
        <div className="bg-[#14161b]/80 border-b border-white/10 w-full h-auto flex flex-col overflow-visible relative">

          {/* subtle inside glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-[radial-gradient(circle,rgba(255,255,255,0.02)_0%,transparent_70%)] pointer-events-none z-0" />

          {/* Render Area */}
          <div id="calendar-render-area" className="w-full h-auto overflow-visible p-0 flex flex-col items-center">
            <style>{`
              /* 1. Primary Nav Header (Date/Navigation) */
              #calendar-render-area [class*="text-center"][class*="flex"][class*="flex-col"][class*="items-center"],
              #calendar-render-area [class*="sticky"][class*="top-0"][class*="z-20"][class*="border-b"],
              #calendar-render-area [class*="schedultron-calendar"] > div:first-child {
                position: sticky !important;
                top: 0 !important;
                z-index: 100 !important;
                background: #111318 !important; /* Slightly darker to contrast with main body */
                width: 100% !important;
                padding: 12px 24px !important;
                margin: 0 !important;
                border-bottom: 2px solid rgba(255,255,255,0.1) !important;
              }
              
              /* 2. Month & Week Secondary Headers (Day Names/Dates) */
              /* Targeted specifically to headers, NOT day cells or grid bodies */
              #calendar-render-area [class*="grid"][class*="grid-cols-7"][class*="border-b"],
              #calendar-render-area [class*="schedultron-week-view"] [class*="sticky"][class*="top-0"],
              #calendar-render-area thead.sticky.top-0 {
                position: sticky !important;
                top: 80px !important; /* height of primary header */
                z-index: 90 !important;
                background: #111318 !important;
                width: 100% !important;
                padding: 0 24px !important;
                margin: 0 !important;
                border: none !important;
                border-bottom: 2px solid rgba(255,255,255,0.05) !important;
              }
              
              /* Ensure Month header is definitely below navigation */
              #calendar-render-area [class*="schedultron-month-view"] > [class*="grid-cols-7"][class*="border-b"] {
                 top: 104px !important; /* Offset for Month View specifically if nested differently */
              }

              /* 3. Dynamic Height & Layout Integrity */
              /* Only top-level library components should expand to full height */
              #calendar-render-area [class*="schedultron-calendar"],
              #calendar-render-area [class*="schedultron-month-view"],
              #calendar-render-area [class*="schedultron-week-view"],
              #calendar-render-area [class*="schedultron-day-view"],
              #calendar-render-area [class*="flex-1"][class*="flex-col"]:has([class*="schedultron"]) {
                overflow: visible !important;
                height: auto !important;
                min-height: 0 !important;
                max-height: none !important;
                width: 100% !important;
                max-width: none !important;
              }

              /* Restore internal grid scrollbars and slots when needed */
              [class*="overflow-y-"],
              [class*="overflow-hidden"],
              .no-scrollbar {
                scrollbar-width: auto !important;
              }

              /* Restore side padding for layout consistency */
              [class*="grid-cols-7"],
              [class*="schedultron-week-view"] > div,
              [class*="schedultron-day-view"] > div:not(:first-child) {
                 padding-left: 24px !important;
                 padding-right: 24px !important;
              }
              *::-webkit-scrollbar {
                width: 8px;
                height: 8px;
              }
              *::-webkit-scrollbar-track {
                background: transparent;
              }
              *::-webkit-scrollbar-thumb {
                background-color: ${calendarTheme === 'dark_night' ? '#3b82f6' :
                calendarTheme === 'blueish' ? '#3b82f6' :
                  calendarTheme === 'purpleish' ? '#8b5cf6' :
                    '#64748b'}4d !important;
                border-radius: 20px !important;
                border: 2px solid transparent !important;
                background-clip: content-box !important;
              }
              *::-webkit-scrollbar-thumb:hover {
                background-color: ${calendarTheme === 'dark_night' ? '#3b82f6' :
                calendarTheme === 'blueish' ? '#3b82f6' :
                  calendarTheme === 'purpleish' ? '#8b5cf6' :
                    '#64748b'}99 !important;
              }
              * {
                scrollbar-width: thin !important;
                scrollbar-color: ${calendarTheme === 'dark_night' ? '#3b82f6' :
                calendarTheme === 'blueish' ? '#3b82f6' :
                  calendarTheme === 'purpleish' ? '#8b5cf6' :
                    '#64748b'}4d transparent !important;
              }

              .schedultron-modal-overlay {
                position: fixed !important;
                z-index: 100000 !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                display: flex !important;
                justify-content: center !important;
                align-items: flex-start !important;
                padding: 160px 16px 80px 16px !important;
                background: transparent !important;
                backdrop-filter: none !important;
                overflow-y: auto !important;
                pointer-events: auto !important;
              }
              .schedultron-modal-content {
                height: auto !important;
                max-height: none !important;
                overflow: visible !important;
                margin: 0 auto !important;
                transform: none !important;
                position: relative !important;
                z-index: 100001 !important;
                pointer-events: auto !important;
              }
            `}</style>

            {(view === "calendar" || view === "day" || view === "week" || view === "month") && (
              <div className="w-full h-auto bg-black/20 rounded-2xl border border-white/5 overflow-visible shadow-inner flex flex-col">
                <div className="w-full relative flex flex-col h-auto [&>div]:flex-1 [&>div]:h-auto">
                  {view === "calendar" && <Calendar {...commonProps} />}
                  {view === "day" && <DayView {...commonProps} slotInterval={60} showTimeSlots={true} showEmptyState={true} navigateToFirstEvent={true} />}
                  {view === "week" && <WeekView {...commonProps} showTodayBelow={false} navigateToFirstEvent={true} />}
                  {view === "month" && <MonthView {...commonProps} showTodayBelow={false} />}
                </div>
              </div>
            )}

            {view === "datepicker" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 py-10 px-4 w-full max-w-[1100px] mx-auto overflow-visible place-items-center h-auto items-start content-start">

                {/* Standard Single Picker */}
                <div className="bg-black/40 border border-white/10 rounded-2xl p-8 shadow-2xl w-full backdrop-blur-md hover:border-white/20 transition-all duration-300 transform hover:-translate-y-1 group relative z-[30] focus-within:z-[50]">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                      <Icons.Calendar />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Standard Picker</h3>
                  </div>
                  <p className="text-[#8b92a5] text-xs mb-6 px-1">Traditional single-date selection mode.</p>
                  <DatePicker
                    value={selectedDate}
                    onChange={(date) => setSelectedDate(date!)}
                    timezone={timezone}
                    calendarThemeVariant={calendarTheme}
                    placeholder="Select a date"
                  />
                </div>

                {/* Range Picker */}
                <div className="bg-black/40 border border-white/10 rounded-2xl p-8 shadow-2xl w-full backdrop-blur-md hover:border-white/20 transition-all duration-300 transform hover:-translate-y-1 group relative z-[30] focus-within:z-[50]">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                      <Icons.Calendar />
                    </div>
                    <h3 className="text-xl font-semibold text-white font-['Outfit']">Range Selector</h3>
                  </div>
                  <p className="text-[#8b92a5] text-xs mb-6 px-1 font-['Inter']">Select a start and end date with premium highlighting.</p>
                  <DateRangePicker
                    value={selectedRange}
                    onChange={setSelectedRange}
                    timezone={timezone}
                    calendarThemeVariant={calendarTheme}
                    placeholder="Select range..."
                  />
                </div>

                {/* Datetime Picker */}
                <div className="bg-black/40 border border-white/10 rounded-2xl p-8 shadow-2xl w-full backdrop-blur-md hover:border-white/20 transition-all duration-300 transform hover:-translate-y-1 group relative z-[20] focus-within:z-[50]">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                      <Icons.Day />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Datetime Precision</h3>
                  </div>
                  <p className="text-[#8b92a5] text-xs mb-6 px-1">Integrated time selection for detailed scheduling.</p>
                  <DateTimePicker
                    value={selectedDateTime}
                    onChange={setSelectedDateTime}
                    timezone={timezone}
                    calendarThemeVariant={calendarTheme}
                  />
                </div>

                {/* Datetime Range Picker */}
                <div className="bg-black/40 border border-white/10 rounded-2xl p-8 shadow-2xl w-full backdrop-blur-md hover:border-white/20 transition-all duration-300 transform hover:-translate-y-1 group relative z-[20] focus-within:z-[50]">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                      <Icons.Day />
                    </div>
                    <h3 className="text-xl font-semibold text-white font-['Outfit']">Datetime Range</h3>
                  </div>
                  <p className="text-[#8b92a5] text-xs mb-6 px-1 font-['Inter']">Full control over start and end times.</p>
                  <DateTimeRangePicker
                    value={selectedDateTimeRange}
                    onChange={setSelectedDateTimeRange}
                    timezone={timezone}
                    calendarThemeVariant={calendarTheme}
                    placeholder="Select datetime range..."
                  />
                </div>

                {/* Standalone Time Picker */}
                <div className="bg-black/40 border border-white/10 rounded-2xl p-8 shadow-2xl w-full backdrop-blur-md hover:border-white/20 transition-all duration-300 transform hover:-translate-y-1 group relative z-[10] focus-within:z-[50]">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400 group-hover:bg-pink-500/20 transition-colors">
                      <Icons.Pointer />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Time Precision</h3>
                  </div>
                  <p className="text-[#8b92a5] text-xs mb-6 px-1">Dedicated time selection with premium scroll UI.</p>
                  <TimePicker
                    value={selectedTime}
                    onChange={setSelectedTime}
                    timezone={timezone}
                    calendarThemeVariant={calendarTheme}
                    placeholder="Select time..."
                  />
                </div>

                {/* Standalone Time Range Picker */}
                <div className="bg-black/40 border border-white/10 rounded-2xl p-8 shadow-2xl w-full backdrop-blur-md hover:border-white/20 transition-all duration-300 transform hover:-translate-y-1 group relative z-[10] focus-within:z-[50]">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400 group-hover:bg-orange-500/20 transition-colors">
                      <Icons.Pointer />
                    </div>
                    <h3 className="text-xl font-semibold text-white font-['Outfit']">Time Range</h3>
                  </div>
                  <p className="text-[#8b92a5] text-xs mb-6 px-1 font-['Inter']">Select start and end intervals with high precision.</p>
                  <TimeRangePicker
                    value={selectedTimeRange}
                    onChange={setSelectedTimeRange}
                    timezone={timezone}
                    calendarThemeVariant={calendarTheme}
                    placeholder="Select time range..."
                  />
                </div>
              </div>
            )}

            {view === "slotdatepicker" && (
              <div className="flex flex-col items-center justify-start h-auto w-full gap-8 py-10 overflow-visible">
                <div className="bg-black/40 border border-white/10 rounded-3xl p-10 shadow-3xl w-full max-w-[1000px] backdrop-blur-xl transition-all duration-500">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                      <Icons.Calendar />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white font-['Outfit']">Premium Slot Picker</h3>
                      <p className="text-[#8b92a5] text-xs">Seamless date & time slot selection experience.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <SlotDatePicker
                      value={selectedDate}
                      onChange={setSelectedDate}
                      timezone={timezone}
                      calendarThemeVariant={calendarTheme}
                      slots={mockSlots}
                      onSlotSelect={setSelectedSlot}
                      selectedSlot={selectedSlot}
                    />
                  </div>

                  {(selectedDate || selectedSlot) && (
                    <div className="mt-12 p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl text-emerald-400 flex flex-col gap-6 shadow-sm backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[10px] uppercase tracking-[0.2em] opacity-80 font-black">Booking Summary</span>
                      </div>
                      <div className="flex flex-col md:flex-row gap-12 text-white">
                        <div className="flex-1">
                          <div className="text-[10px] text-[#8b92a5] font-bold uppercase tracking-widest mb-2 opacity-50">Appointment Date</div>
                          <strong className="text-3xl font-extrabold font-['Outfit'] block bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
                            {selectedDate.format("MMMM Do, YYYY")}
                          </strong>
                        </div>
                        <div className="w-px bg-white/5 hidden md:block" />
                        <div className="flex-1">
                          <div className="text-[10px] text-[#8b92a5] font-bold uppercase tracking-widest mb-2 opacity-50">Reserved Slot</div>
                          <strong className="text-3xl font-extrabold font-['Outfit'] block text-blue-400">
                            {selectedSlot || "Pending selection"}
                          </strong>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {view === "form-demo" && (
              <div className="w-full max-w-[1100px] mx-auto relative px-6 py-10 overflow-visible h-auto">
                <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-10">
                  <div className="bg-[#1e2228]/50 border border-white/10 rounded-3xl p-10 shadow-3xl backdrop-blur-xl hover:border-white/20 transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                      <div>
                        <h2 className="text-3xl font-extrabold text-white mb-2 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Enterprise Form Integration</h2>
                        <p className="text-[#8b92a5] text-sm max-w-2xl">Demonstrating seamless integration with <code className="text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">react-hook-form</code>. Pickers handle complex objects while providing unified validation.</p>
                      </div>
                      <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="text-right">
                          <div className="text-[10px] text-[#8b92a5] font-bold uppercase tracking-widest">Selected Theme</div>
                          <div className="text-sm font-bold text-white capitalize">{calendarTheme.replace('_', ' ')}</div>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                          <Icons.Pointer />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-8">
                        <Controller
                          name="single"
                          control={control}
                          rules={{ required: "Deployment date is mandatory" }}
                          render={({ field }) => (
                            <DatePickerField
                              {...field}
                              label="Single Deployment Date"
                              error={errors.single?.message}
                              timezone={timezone}
                              calendarThemeVariant={calendarTheme}
                              placeholder="Choose date"
                            />
                          )}
                        />

                        <Controller
                          name="range"
                          control={control}
                          render={({ field }) => (
                            <DateRangePickerField
                              {...field}
                              label="Maintenance Window"
                              error={errors.range?.message}
                              timezone={timezone}
                              calendarThemeVariant={calendarTheme}
                              placeholder="Select range"
                            />
                          )}
                        />
                      </div>

                      <div className="space-y-8">
                        <Controller
                          name="datetime"
                          control={control}
                          render={({ field }) => (
                            <DateTimePickerField
                              {...field}
                              label="Go-Live Precision Time"
                              error={errors.datetime?.message}
                              timezone={timezone}
                              calendarThemeVariant={calendarTheme}
                              placeholder="Pick time"
                            />
                          )}
                        />

                        <Controller
                          name="datetimeRange"
                          control={control}
                          render={({ field }) => (
                            <DateTimeRangePickerField
                              {...field}
                              label="Full Operational Cycles"
                              error={errors.datetimeRange?.message}
                              timezone={timezone}
                              calendarThemeVariant={calendarTheme}
                              placeholder="Select intervals"
                            />
                          )}
                        />
                      </div>
                    </div>

                    <div className="mt-12 flex justify-end">
                      <button
                        type="submit"
                        className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-blue-600/20 hover:shadow-2xl hover:shadow-blue-600/30 hover:scale-[1.02] transition-all duration-300 active:scale-95 uppercase tracking-[0.2em] text-[10px]"
                      >
                        Submit Transaction Form
                      </button>
                    </div>
                  </div>
                </form>

                {submittedData && (
                  <div className="mt-8 bg-black/40 border border-emerald-500/20 p-6 rounded-2xl animate-in fade-in slide-in-from-top-2">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4">Payload Preview</h4>
                    <pre className="text-xs text-[#8b92a5] overflow-auto">{JSON.stringify(submittedData, null, 2)}</pre>
                  </div>
                )}
              </div>
            )}

            {view === "props" && <PropsView />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
