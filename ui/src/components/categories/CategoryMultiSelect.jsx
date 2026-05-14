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
        <div className="mb-4">
            <label className="block mb-2 font-medium">
                Categories
            </label>

            <Select
                isMulti
                options={options}
                value={selectedOptions}
                onChange={handleChange}
                placeholder="Select categories..."
            />
        </div>
    );
}