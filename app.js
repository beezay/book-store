/**
 * This is demo for Js Doc
 */

//* Book Class: Represents a Book
class Books {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

//* UI Class: Handle UI Tasks
class UI {
    static displayBooks() {
        const StoredBooks = [{
                title: 'Book one',
                author: 'John Doe',
                isbn: '343434'
            },
            {
                title: 'Book Two',
                author: 'Jane Doe',
                isbn: '454545'
            }, {
                title: 'Book one',
                author: 'John Doe',
                isbn: '343434'
            },
            {
                title: 'Book Two',
                author: 'Jane Doe',
                isbn: '454545'
            }
        ];
        const books = StoredBooks;
        console.log('Books=>', books);
        books.forEach(book => (
            UI.addBookToList(book)
        ));
    }

    static addBookToList(book) {
        const list = document.getElementById('book-list');

        const row = document.createElement('tr');
        // console.log(book);
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-info edit">Edit</a></td>
            <td><a href="#" class="btn btn-danger delete">X</a></td>
            `;

        list.append(row);
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container')
        const form = document.querySelector('#book-form')
        container.insertBefore(div, form);

        //* Vanish after sometime
        setTimeout(() => {
            document.querySelector('.alert').remove();
        },2000);
    }

    static clearFields() {
        document.querySelector('#title').value = ''
        document.querySelector('#author').value = ''
        document.querySelector('#isbn').value = ''
    }

    static deleteBook(event) {
        if (event.classList.contains('delete')) {
            event.parentElement.parentElement.remove();
            UI.showAlert('Book Deleted', 'warning')
        }
    }
}

//* Store Class: Handles Storage
class Store {
    static getBooks () {
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }else {
            books = JSON.parse(localStorage.getItem('books'))
        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks()
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books))
    }

    static removeBook(isbn) {
        const books = Store.getBooks( );
        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}


//* Event: Display Books
window.addEventListener('DOMContentLoaded', UI.displayBooks);

//* Event: Add Book
document.querySelector('#book-form').addEventListener('submit', e => {
    e.preventDefault();
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    //* Validate Forms
    if (title === '' || author === '' || isbn === '') {
        UI.showAlert('Please fill in all fields', 'danger')
    } else {

        //* Instantitate Book
        const book = new Books(title, author, isbn);

        //* Add Book to UI
        UI.addBookToList(book);

        //* Show Success message
        UI.showAlert('New Book Added', 'success')

        //* Clear UI FORM FIELDS
        UI.clearFields();

        console.log(book);
    }

})


//* Event: Delete Book
document.querySelector('#book-list').addEventListener('click', e => {
    UI.deleteBook(e.target);
    
})