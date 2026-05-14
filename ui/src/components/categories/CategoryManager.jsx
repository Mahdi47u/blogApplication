import { useEffect, useState } from "react";

import CategoryForm from "./CategoryForm";
import CategoryList from "./CategoryList";

import {getCategories, createCategory, updateCategory, deleteCategory} from "../../services/categoryService";

export default function CategoryManager() {
    const [categories, setCategories] = useState([]);
    const [editingCategory, setEditingCategory] = useState(null);

    useEffect(() => {
        loadCategories();
    }, []);

    async function loadCategories() {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (err) {
            console.error(err);
        }
    }

    async function handleCreate(data) {
        try {
            await createCategory(data);
            loadCategories();
        } catch (err) {
            console.error(err);
        }
    }

    async function handleUpdate(data) {
        try {
            await updateCategory(editingCategory.id, data);

            setEditingCategory(null);

            loadCategories();
        } catch (err) {
            console.error(err);
        }
    }

    async function handleDelete(id) {
        const confirmed = window.confirm(
            "Delete this category?"
        );

        if (!confirmed) return;

        try {
            await deleteCategory(id);
            loadCategories();
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="space-y-6">
            <CategoryForm
                initialData={editingCategory || { name: "" }}
                onSubmit={
                    editingCategory
                        ? handleUpdate
                        : handleCreate
                }
                submitText={
                    editingCategory
                        ? "Update Category"
                        : "Create Category"
                }
            />

            <CategoryList
                categories={categories}
                onEdit={setEditingCategory}
                onDelete={handleDelete}
            />
        </div>
    );
}
