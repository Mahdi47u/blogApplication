const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300",
    secondary: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
    danger: "border border-red-200 bg-white text-red-600 hover:bg-red-50",
};

const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-3 text-sm",
};

export default function Button({
    as: Component = "button",
    variant = "primary",
    size = "md",
    className = "",
    type = "button",
    ...props
}) {
    return (
        <Component
            type={Component === "button" ? type : undefined}
            className={`inline-flex items-center justify-center rounded-lg font-medium transition disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        />
    );
}
