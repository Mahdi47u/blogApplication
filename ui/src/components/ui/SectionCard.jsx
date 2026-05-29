export default function SectionCard({
    as: Component = "section",
    title,
    description,
    action,
    children,
    className = "",
}) {
    return (
        <Component className={`rounded-lg border border-slate-200 bg-white shadow-sm ${className}`}>
            {(title || description || action) && (
                <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        {title && <h2 className="text-base font-semibold text-slate-950">{title}</h2>}
                        {description && <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>}
                    </div>
                    {action && <div className="shrink-0">{action}</div>}
                </div>
            )}
            <div className="p-5">{children}</div>
        </Component>
    );
}
