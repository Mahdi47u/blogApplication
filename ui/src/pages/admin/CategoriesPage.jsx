import AdminSubnav from "../../components/admin/AdminSubnav.jsx";
import CategoryManager from "../../components/categories/CategoryManager";
import PageHeader from "../../components/ui/PageHeader.jsx";

export default function CategoriesPage() {
    return (
        <div className="space-y-6">
            <AdminSubnav />

            <PageHeader
                eyebrow="Admin"
                title="Categories"
                description="Keep the publishing taxonomy clear and easy to browse."
            />

            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <CategoryManager />
            </section>
        </div>
    );
}
