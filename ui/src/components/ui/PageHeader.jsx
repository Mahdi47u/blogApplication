import Card, { CardBody } from "./Card";

export default function PageHeader({
    eyebrow,
    title,
    description,
    meta,
    actions,
    children,
}) {
    return (
        <Card>
            <CardBody>
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div className="min-w-0">
                        {eyebrow && (
                            <p className="text-sm font-medium text-blue-600">{eyebrow}</p>
                        )}
                        <h1 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">
                            {title}
                        </h1>
                        {description && (
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                                {description}
                            </p>
                        )}
                        {children}
                    </div>

                    {(meta || actions) && (
                        <div className="flex w-full flex-col items-start gap-3 sm:w-auto sm:items-end">
                            {meta}
                            {actions}
                        </div>
                    )}
                </div>
            </CardBody>
        </Card>
    );
}
