export function EmptyState({ title, description, action }) {
    return (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h3 className="text-base font-semibold text-slate-950">{title}</h3>
            {description && <p className="mt-2 text-sm text-slate-600">{description}</p>}
            {action && <div className="mt-5">{action}</div>}
        </div>
    );
}

export function ErrorState({ message }) {
    return (
        <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {message}
        </div>
    );
}

export function GridSkeleton({ count = 3, className = "" }) {
    return (
        <div className={`grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3 ${className}`}>
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="h-80 animate-pulse rounded-lg bg-slate-100" />
            ))}
        </div>
    );
}
