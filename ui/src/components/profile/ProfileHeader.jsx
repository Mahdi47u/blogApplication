import Badge from "../ui/Badge.jsx";
import StatCard from "../ui/StatCard.jsx";

export default function ProfileHeader({
    username,
    avatarUrl,
    bio,
    subtitle,
    badges = [],
    stats = [],
    actions,
}) {
    const initials = username?.slice(0, 2).toUpperCase() || "U";

    return (
        <header className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-2xl font-semibold text-slate-500">
                        {avatarUrl ? (
                            <img src={avatarUrl} alt={username} className="h-full w-full object-cover" />
                        ) : (
                            initials
                        )}
                    </div>

                    <div>
                        <p className="text-sm font-medium uppercase tracking-wide text-blue-600">Profile</p>
                        <h1 className="mt-1 text-3xl font-semibold text-slate-950">{username}</h1>
                        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
                        {badges.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {badges.map((badge) => (
                                    <Badge key={badge.label} tone={badge.tone}>
                                        {badge.label}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {actions && <div className="shrink-0">{actions}</div>}
            </div>

            <p className="mt-6 max-w-3xl text-sm leading-6 text-slate-700">
                {bio || "No bio yet."}
            </p>

            {stats.length > 0 && (
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {stats.map((stat) => (
                        <StatCard
                            key={stat.label}
                            label={stat.label}
                            value={stat.value}
                            description={stat.description}
                            className="bg-slate-50 shadow-none"
                        />
                    ))}
                </div>
            )}
        </header>
    );
}
