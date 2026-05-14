export default function CategoryList({categories, onEdit, onDelete,}) {
    return (
        <div className="bg-white shadow rounded p-4">

            <h2 className="text-xl font-semibold mb-4">
                Categories
            </h2>

            <div className="space-y-3">
                {categories.map(category => (
                    <div
                        key={category.id}
                        className="flex items-center justify-between border-b pb-2"
                    >
                        <div>
                            <p className="font-medium">
                                {category.name}
                            </p>

                            <p className="text-sm text-gray-500">
                                /{category.slug}
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => onEdit(category)}
                                className="bg-yellow-500 text-white px-3 py-1 rounded"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => onDelete(category.id)}
                                className="bg-red-600 text-white px-3 py-1 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
