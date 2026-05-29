import Select from "react-select";

export default function CategoryMultiSelect({
                                                categories,
                                                selectedCategories,
                                                onChange,
                                            }) {
    const options = categories.map(category => ({
        value: category.id,
        label: category.name,
    }));

    const selectedOptions = selectedCategories.map(category => ({
        value: category.id,
        label: category.name,
    }));

    function handleChange(selected) {
        const mapped = selected.map(item => ({
            id: item.value,
            name: item.label,
        }));

        onChange(mapped);
    }

    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
                Categories
            </label>

            <Select
                isMulti
                options={options}
                value={selectedOptions}
                onChange={handleChange}
                placeholder="Select categories..."
                classNamePrefix="category-select"
                styles={{
                    control: (base, state) => ({
                        ...base,
                        minHeight: 46,
                        borderRadius: 8,
                        borderColor: state.isFocused ? "#3b82f6" : "#cbd5e1",
                        boxShadow: state.isFocused ? "0 0 0 4px rgba(59, 130, 246, 0.14)" : "none",
                        "&:hover": { borderColor: state.isFocused ? "#3b82f6" : "#94a3b8" },
                    }),
                    multiValue: (base) => ({
                        ...base,
                        borderRadius: 999,
                        backgroundColor: "#eff6ff",
                    }),
                    multiValueLabel: (base) => ({
                        ...base,
                        color: "#1d4ed8",
                        fontWeight: 500,
                    }),
                    multiValueRemove: (base) => ({
                        ...base,
                        color: "#2563eb",
                        borderRadius: 999,
                        ":hover": {
                            backgroundColor: "#dbeafe",
                            color: "#1d4ed8",
                        },
                    }),
                }}
            />
        </div>
    );
}
