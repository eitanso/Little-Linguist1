import { Injectable } from '@angular/core';
import { Category } from '../../shared/model/categories';


@Injectable({
  providedIn: 'root'
})

export class EditCategoriesService {
  category: any;
  update(lastModifiedDate:Category): void {
    if (this.category.has(Category.lastModifiedDate)) {
      this.category.set(Category.lastModifiedDate, lastModifiedDate);
    }
  }
} 

export class DeleteCategoriesService{
  Category: any;
  delete(id: number): void {
   this.Category.delete(id);
 }
}

export class AddCategoriesService{
  add(NewCategory : Category) {
    let newId = this.nextId;
    Category.id = newId;
    this.categories.set(newId,this.category);
    ++ this.nextId;
   }
  category(newId: number, category: any) {
    throw new Error('Method not implemented.');
  }
  categories = new Map<number, Category>();
  nextId= 0;

}


/*
 
  list(): Category[] {
    return Array.from(this.categories.values())
 
  }
  get(id: number): Category | undefined {
    return this.categories.get(id);
   }
   
 

*/
