import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgModelGroup, NgForm, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Category } from '../../shared/model/wordCategory';
import { Language } from '../../shared/model/language';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'new-category',
  standalone: true,
  imports: [FormsModule, MatInputModule, MatButtonModule, CommonModule, MatIconModule],
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.css'],
})
export class CategoryFormComponent implements OnInit {
  category: Category;
  @ViewChild('wordsGroup') wordsGroup?: NgModelGroup;
  id: any;

  constructor(private router: Router, private route: ActivatedRoute, private localStorageService: LocalStorageService) {
    this.category = new Category(this.getNewCategoryId(), "", Language.English, Language.Hebrew, []);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        let categoryFromService = this.localStorageService.get(parseInt(this.id));
        if (categoryFromService) {
          this.category = categoryFromService;
        }
      }
    });
  }

  getNewCategoryId(): number {
    const lastId = parseInt(localStorage.getItem('lastCategoryId') || '0');
    return lastId + 1;
  }

  saveCategoryToLocalStorage(): void {
    if (this.category && this.category.categoryName) {
      const newId = this.getNewCategoryId();
      this.category.id = newId; 
      this.localStorageService.add(this.category);
      localStorage.setItem('lastCategoryId', newId.toString());
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const isValid = this.atLeastOneWordPair()(control);
    return isValid ? null : { 'invalidCategory': true };
  }

  atLeastOneWordPair(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const words = (control.value as Category).Words || [];
      if (!words.length || words.some(word => !word.sourceWord || !word.targetWord)) {
          return { 'noWords': true };
      }
      return null; 
    };
  }

  onSubmitRegistration(form: NgForm) {
    if (form.valid) {
      const words = this.category.Words || [];
      const hasWordPair = words.length > 0 && words.every(word => word.sourceWord && word.targetWord);

      if (hasWordPair) {
        let existingCategories = this.localStorageService.list();

        const categoryExists = existingCategories.some((cat: Category) => cat && cat.categoryName === this.category.categoryName);

        if (!categoryExists) {
          const newId = this.getNewCategoryId();
          this.category.id = newId;
          this.localStorageService.add(this.category);
          localStorage.setItem('lastCategoryId', newId.toString());

          this.router.navigate(['/']);
        }else{
          this.localStorageService.update(this.category);
          this.category.lastModificationDate = new Date();
          this.localStorageService.update(this.category);
          this.router.navigate(['/']);

        }
      } else {
        alert('חייב להזין לפחות צמד מילים אחד');
      }
    }
  }

  addNewWord() {
    this.category.Words.push({ sourceWord: '', targetWord: '' });
  }

  deleteNewWord(index: number) {
    this.category.Words.splice(index, 1);
  }

  updateCategory() {
    this.localStorageService.update(this.category);
    this.router.navigate(['/']);
  }
}
