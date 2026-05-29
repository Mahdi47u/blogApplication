export default function StatCard({ label, value, description, className = "" }) {
    return (
        <div className={`rounded-lg border border-slate-200 bg-white p-4 shadow-sm ${className}`}>
            <p className="text-2xl font-semibold text-slate-950">{value}</p>
            <p className="mt-1 text-sm font-medium text-slate-700">{label}</p>
            {description && (
                <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>
            )}
        </div>
    );
}
