'use client'
import { useState } from "react";
import { Category, Settings } from "@/types";
import { SettingsForm } from "./SettingsForm";
import { CategoriesTable } from "./CategoriesTable";
import { CategoryModal } from "./CategoryModal";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    name: "My Store",
    address: "123 Main St, City",
    bannerUrl: "",
    deliveryFee: 5.00,
    serviceFee: 2.50,
  });

  const [categories, setCategories] = useState<Category[]>([
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
      title: "Food",
      description: "Delicious meals from local restaurants",
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle settings update
    console.log("Settings updated:", settings);
  };

  const handleAddCategory = () => {
    setSelectedCategory(undefined);
    setModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setModalOpen(true);
  };

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter(category => category.id !== id));
  };

  const handleSaveCategory = (categoryData: Partial<Category>) => {
    if (selectedCategory) {
      // Edit existing category
      setCategories(categories.map(category => 
        category.id === selectedCategory.id ? { ...category, ...categoryData } : category
      ));
    } else {
      // Add new category
      const newCategory: Category = {
        id: categories.length + 1,
        image: categoryData.image || "",
        title: categoryData.title || "",
        description: categoryData.description || "",
      };
      setCategories([...categories, newCategory]);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <SettingsForm 
        settings={settings}
        setSettings={setSettings}
        onSubmit={handleSubmit}
      />

      <CategoriesTable 
        categories={categories}
        onAddCategory={handleAddCategory}
        onEditCategory={handleEditCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      <CategoryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveCategory}
        category={selectedCategory}
      />
    </div>
  );
}