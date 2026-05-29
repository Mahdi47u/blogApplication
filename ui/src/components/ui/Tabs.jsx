export default function Tabs({ tabs, active, onChange, className = "" }) {
    return (
        <div className={`overflow-x-auto ${className}`}>
            <div className="inline-flex min-w-full gap-2 rounded-lg border border-slate-200 bg-white p-1 shadow-sm sm:min-w-0">
                {tabs.map((tab) => {
                    const selected = tab.id === active;

                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => onChange(tab.id)}
                            className={`
                                whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition
                                ${selected
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"}
                            `}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
