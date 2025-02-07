import { AuthService } from './../../services/auth.service';
import { BooksService } from './../../services/books.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss']
})
export class AddBookComponent implements OnInit {
  bookForm: FormGroup;
  book;
  $event; // uploaded image
  picTab: Array<any> = []; // display
  picSend: (File | Blob)[] = []; // send to firebase
  message; // for the pic
  genres;
  idGenre;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private bookS: BooksService,
    private auth: AuthService
  ) {
    bookS.getGenres().subscribe(
      (data) => {this.genres = data}
      , (error) => {
        this.auth.checkAuthError(error);
      }
    );
  }

  ngOnInit() {
    this.initForm();
    //  this.compS.getCompany(localStorage.getItem('id')).subscribe(
    //  (data) => this.user = data
    // );
  }
  initForm() {
    this.bookForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      author: ['', [Validators.required]],
      year: ['', [Validators.required]],
      genre: [Validators.required]
    });
  }
  onSubmit() {
    this.book = {
      title: this.bookForm.get('title').value,
      author: this.bookForm.get('author').value,
      year: this.bookForm.get('year').value,
      enabled: 1,
      image: '',
      disponible: 1
    };
    this.idGenre = this.bookForm.get('genre').value;

    this.openDialog();
  }
  // upload(event) {
  //   this.picSend = event.target.files[0];
  //   const reader = new FileReader();
  //   const mimeType = event.target.files[0].type;
  //   if (mimeType.match(/image\/*/) == null) {
  //     this.message = 'Only images are supported.';
  //     return;
  //   }
  //   console.log(this.picSend);

  //   reader.readAsDataURL(event.target.files[0]);
  //   reader.onload = () => {
  //     this.picTab.push({ image: reader.result });
  //   };
  // }
  openDialog(): void {
    const dialogRef = this.dialog.open(Dialog, {
      width: '250px',
      data: this.book
    });

    dialogRef.afterClosed().subscribe((data: any) => {
      if (data) {
        this.bookS.addBook(this.book, this.idGenre).subscribe(() =>{
          this.router.navigate(['/bookDashboard']);
        });
      }
    });
  }
}

@Component({
  selector: 'app-dialog',
  templateUrl: 'dialog-overview-example-dialog.html'
})
// tslint:disable-next-line:component-class-suffix
export class Dialog {
  constructor(
    public dialogRef: MatDialogRef<Dialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }
  save() {
    this.dialogRef.close(true);
  }
}
