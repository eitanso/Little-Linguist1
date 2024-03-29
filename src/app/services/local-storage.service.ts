import { Injectable } from '@angular/core';
import { Category } from '../../shared/model/wordCategory';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private storageKey = 'categories'; 

  constructor() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify({})); 
    }
  }

  list(): Category[] {
    const categoriesObj = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
    return Object.values(categoriesObj);
  }

  get(id: number): Category | undefined {
    const categoriesObj = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
    return categoriesObj[id];
  }

  add(newCategoryData: Category): void {
    const categoriesObj = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
    const nextId = Object.keys(categoriesObj).length + 1; 
    newCategoryData.id = nextId;
    categoriesObj[nextId] = newCategoryData;
    localStorage.setItem(this.storageKey, JSON.stringify(categoriesObj));
  }

  update(existingCategory: Category): void {
    if (existingCategory.id) {
      const categoriesObj = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
      if (categoriesObj[existingCategory.id]) {
        categoriesObj[existingCategory.id] = existingCategory;
        localStorage.setItem(this.storageKey, JSON.stringify(categoriesObj));
      } else {
        console.error(`Category with id ${existingCategory.id} does not exist.`);
      }
    } else {
      console.error('Category id is missing.');
    }
  }

  delete(categoryId: number): void {
    const categoriesObj = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
    if (categoriesObj[categoryId]) {
      delete categoriesObj[categoryId];
      localStorage.setItem(this.storageKey, JSON.stringify(categoriesObj));
    } else {
      console.error(`Category with id ${categoryId} does not exist.`);
    }
  }
  
  getWordCountInCategory(categoryId: number): number {
    const category = this.get(categoryId);
    return category ? category.Words.length : 0;
  }
  
  getCategoryById(id: number): Category | undefined {
    const categories = this.list();
    const category = categories.find(category => category.id === id);
    if (!category) {
      console.error(`Category with id ${id} does not exist.`);
    }
    return category;
  }
}
