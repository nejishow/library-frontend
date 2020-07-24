import { BooksService } from './../../services/books.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {
  id;
  Books = [];
  book;
  borrow = false;
  prets;
  constructor(
    private aR: ActivatedRoute,
    private router: Router,
    private bookS: BooksService
  ) {
    this.aR.params.subscribe(params => {
      this.id = params.id;
      bookS.getBook(this.id).subscribe((data: any) => {
        this.book = data[0];
        this.bookS
          .getPretBook(this.book.idBook)
          .subscribe(results => (this.prets = results));
      });
    });
  }
  borrowBook() {
    this.borrow = true;
  }
  ngOnInit() {}
}