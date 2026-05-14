import { useState } from "react";

export default function CategoryForm({initialData = { name: "" }, onSubmit, submitText = "Save",}) {

    const [name, setName] = useState(initialData.name);

    async function handleSubmit(e) {
        e.preventDefault();

        await onSubmit({
            name,
        });

        setName("");
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-4 rounded shadow"
        >
            <div className="mb-4">
                <label className="block mb-2 font-medium">
                    Category Name
                </label>

                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Enter category name"
                    required
                />
            </div>

            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                {submitText}
            </button>
        </form>
    );
}