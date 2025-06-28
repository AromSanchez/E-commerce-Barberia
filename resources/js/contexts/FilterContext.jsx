import React, { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

export function FilterProvider({ children }) {
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedMainCategories, setSelectedMainCategories] = useState([]);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
    const [expandedMainCategories, setExpandedMainCategories] = useState({});

    const addBrandFilter = (brandId) => {
        setSelectedBrands(prev => 
            prev.includes(brandId) ? prev : [...prev, brandId]
        );
    };

    const removeBrandFilter = (brandId) => {
        setSelectedBrands(prev => prev.filter(id => id !== brandId));
    };

    const addCategoryFilter = (categoryId) => {
        // Limpiar filtros de categorías principales cuando se selecciona una categoría individual
        setSelectedMainCategories([]);
        setSelectedCategories(prev => 
            prev.includes(categoryId) ? prev : [...prev, categoryId]
        );
    };

    const expandMainCategory = (mainCategoryId) => {
        setExpandedMainCategories(prev => ({
            ...prev,
            [mainCategoryId]: true
        }));
    };

    const addMainCategoryFilter = (mainCategoryId) => {
        // Limpiar filtros de categorías individuales cuando se selecciona una categoría principal
        setSelectedCategories([]);
        setSelectedMainCategories(prev => 
            prev.includes(mainCategoryId) ? prev : [...prev, mainCategoryId]
        );
        // Expandir automáticamente la categoría principal seleccionada
        expandMainCategory(mainCategoryId);
    };

    const clearAllFilters = () => {
        setSelectedBrands([]);
        setSelectedCategories([]);
        setSelectedMainCategories([]);
        setPriceRange({ min: 0, max: 0 });
        setExpandedMainCategories({});
    };

    return (
        <FilterContext.Provider value={{
            selectedBrands,
            setSelectedBrands,
            selectedCategories,
            setSelectedCategories,
            selectedMainCategories,
            setSelectedMainCategories,
            priceRange,
            setPriceRange,
            expandedMainCategories,
            setExpandedMainCategories,
            expandMainCategory,
            addBrandFilter,
            removeBrandFilter,
            addCategoryFilter,
            addMainCategoryFilter,
            clearAllFilters
        }}>
            {children}
        </FilterContext.Provider>
    );
}

export function useFilter() {
    const context = useContext(FilterContext);
    if (context === undefined) {
        throw new Error('useFilter must be used within a FilterProvider');
    }
    return context;
}
