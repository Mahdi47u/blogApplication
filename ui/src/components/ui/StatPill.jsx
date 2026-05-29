export default function StatPill({ value, label }) {
    return (
        <div className="w-fit rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 sm:text-right">
            <p className="text-2xl font-semibold leading-none text-slate-950">{value}</p>
            <p className="mt-1 text-sm text-slate-500">{label}</p>
        </div>
    );
}
