export default function Card({ as: Component = "section", className = "", children }) {
    return (
        <Component className={`rounded-lg border border-slate-200 bg-white shadow-sm ${className}`}>
            {children}
        </Component>
    );
}

export function CardHeader({ className = "", children }) {
    return (
        <div className={`border-b border-slate-100 px-6 py-5 ${className}`}>
            {children}
        </div>
    );
}

export function CardBody({ className = "", children }) {
    return <div className={`p-6 ${className}`}>{children}</div>;
}
