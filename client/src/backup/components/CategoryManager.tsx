import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog } from '@headlessui/react';
import { PlusIcon, XMarkIcon, TagIcon } from '@heroicons/react/24/outline';
import type { EventCategory } from '../types';
import { EVENT_COLORS } from '../utils/eventUtils';

interface CategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: EventCategory[];
  onSaveCategory: (category: EventCategory) => void;
  onDeleteCategory: (categoryId: string) => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({
  isOpen,
  onClose,
  categories,
  onSaveCategory,
  onDeleteCategory
}) => {
  const { t } = useTranslation();
  const [newCategory, setNewCategory] = useState({
    name: '',
    color: EVENT_COLORS[0].value,
    icon: '📅'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;

    const category: EventCategory = {
      id: `category-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: newCategory.name.trim(),
      color: newCategory.color,
      icon: newCategory.icon
    };

    onSaveCategory(category);
    setNewCategory({ name: '', color: EVENT_COLORS[0].value, icon: '📅' });
  };

  const handleDelete = (categoryId: string) => {
    if (window.confirm(t('categories.deleteConfirm'))) {
      onDeleteCategory(categoryId);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-6 shadow-2xl border border-white/20 dark:border-gray-700/20">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              {t('categories.title')}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Add New Category */}
          <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('categories.addNew')}
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('categories.name')}
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                  placeholder={t('categories.namePlaceholder')}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('events.form.color')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {EVENT_COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setNewCategory({ ...newCategory, color: color.value })}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        newCategory.color === color.value
                          ? 'border-gray-800 dark:border-gray-200 scale-110'
                          : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('categories.icon')}
                </label>
                <input
                  type="text"
                  value={newCategory.icon}
                  onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                  placeholder="📅"
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <PlusIcon className="w-4 h-4" />
                {t('common.save')}
              </button>
            </div>
          </form>

          {/* Existing Categories */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('categories.existing')}
            </h3>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{category.icon}</span>
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {category.name}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    title={t('common.delete')}
                  >
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
              
              {categories.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <TagIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>{t('categories.noCategories')}</p>
                  <p className="text-sm">{t('categories.createFirst')}</p>
                </div>
              )}
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CategoryManager; 