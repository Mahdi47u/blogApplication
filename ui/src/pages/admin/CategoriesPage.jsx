import CategoryManager from "../../components/categories/CategoryManager";

export default function CategoriesPage() {
    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">
                Category Management
            </h1>

            <CategoryManager />
        </div>
    );
}
