/**
 * This is demo for Js Doc
 */

const editBook = {
    title: '',
    author: '',
    isbn: ''
}

const modalBox = document.getElementById('modal-wrapper');
const modalBox2 = document.getElementById('modal-wrapper-2');



const displayModal1 = () => {
    modalBox.style.display = 'block';
}

const displayModal2 = () => {
    modalBox2.style.display = 'block';

}

const hideModal = () => {
    modalBox.style.display = 'none';
    modalBox2.style.display = 'none';
}

document.querySelector('.cancel').addEventListener('click', () => {
    hideModal();
})

document.querySelector('.close').addEventListener('click', () => {
    hideModal();
})


// console.log(document.querySelector('#deleteBtn'));
document.getElementById('delete-btn').addEventListener('click', () => {
    console.log('Clicked');
})




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
        // const StoredBooks = [{
        //         title: 'Book one',
        //         author: 'John Doe',
        //         isbn: '343434'
        //     }
        // ];
        const books = Store.getBooks();
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
            <td><a href="#" class="btn btn-danger delete" aria-label="${book.isbn}">X</a></td>
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
        }, 2000);
    }

    static clearFields() {
        document.querySelector('#title').value = ''
        document.querySelector('#author').value = ''
        document.querySelector('#isbn').value = ''
    }

    static editBook(event) {
        if (event.classList.contains('edit')) {

            //* Removing Add Event
            document.querySelector('#book-form').removeEventListener('submit', addEvent)

            //* Getting Previous Values
            const titleVal = event.parentElement.parentElement.firstElementChild.innerHTML;
            const authorVal = event.parentElement.parentElement.firstElementChild.nextElementSibling.innerHTML;
            const isbnVal = event.parentElement.parentElement.firstElementChild.nextElementSibling.nextElementSibling.innerHTML;

            editBook.title = titleVal
            editBook.author = authorVal
            editBook.isbn = isbnVal

            //* Setting Value to the Form 
            document.querySelector('#title').value = titleVal
            document.querySelector('#author').value = authorVal
            document.querySelector('#isbn').value = isbnVal
            document.querySelector('.btn').value = 'Update Book'

            //* Removing Previous matched Editing data
            Store.removeBook(editBook.isbn)

            const editData = e => {
                e.preventDefault();

                const title = document.querySelector('#title').value;
                const author = document.querySelector('#author').value;
                const isbn = document.querySelector('#isbn').value;

                editBook.title = title;
                editBook.author = author;
                editBook.isbn = isbn;


                //* Validate Forms
                if (title === '' || author === '' || isbn === '') {
                    UI.showAlert('Please fill in all fields', 'danger')
                } else {
                    //* Updating DOM with Updated Values
                    event.parentElement.parentElement.innerHTML = `
                    <td>${title}</td>
                    <td>${author}</td>
                    <td>${isbn}</td>
                    <td><a href="#" class="btn btn-info edit">Edit</a></td>
                    <td><a href="#" class="btn btn-danger delete">X</a></td>
                    `;

                    //* Edit to Store

                    Store.editBook(editBook)

                    //* Show Success message
                    UI.showAlert('Book Details Updated', 'info')

                    //* Clear UI FORM FIELDS
                    UI.clearFields();

                    document.querySelector('.btn').value = 'Add Book'

                }

            }

            //* Updating the New values
            document.querySelector('#book-form').addEventListener('submit', editData)
            console.log('Edit Button Clicked', event.parentElement.parentElement.innerHTML);

        }
    }

    static deleteBook(event) {
        if (event.classList.contains('delete')) {
            displayModal2();
            document.getElementById('delete-single-btn').addEventListener('click', () => {
                event.parentElement.parentElement.remove();
                UI.showAlert('Book Deleted', 'warning')
                hideModal();
            })

        }
    }

    static deleteAllBooks() {
        const list = document.getElementById('book-list');

        const row = document.createElement('tr');
        // console.log(book);
        list.innerHTML = '';
        modalBox.style.display = 'none'
        console.log('UI Cleared');
    }
}

//* Store Class: Handles Storage
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'))
        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks()
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books))
    }

    static editBook(book) {
        const books = Store.getBooks();
        books.unshift(book);

        localStorage.setItem('books', JSON.stringify(books))
    }

    static removeBook(isbn) {
        const books = Store.getBooks();
        console.log(isbn);
        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeAllBooks() {
        console.log('local storage cleared')
        localStorage.clear();
    }
}

//* Functions Decalartions for using in EVENT LISTENERS
const addEvent = (e) => {
    // document.querySelector('#book-list').removeEventListener('click', editBookData);
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

        //* Add Book to Store
        Store.addBook(book)

        //* Show Success message
        UI.showAlert('New Book Added', 'success')

        //* Clear UI FORM FIELDS
        UI.clearFields();

        console.log(book);
    }

}

const editBookData = e => {
    UI.editBook(e.target);
}

//* Event: Display Books
window.addEventListener('DOMContentLoaded', UI.displayBooks);

//* Event: Add Book
document.querySelector('#book-form').addEventListener('submit', addEvent)

//* Edit Book Details
document.querySelector('#book-list').addEventListener('click', editBookData);
document.querySelector('.btn').replaceWith(document.querySelector('.btn').cloneNode(true));

//* Event: Delete Book
document.querySelector('#book-list').addEventListener('click', e => {

    //* Remove Book from UI
    UI.deleteBook(e.target);

    //* Remove Book from Store
    Store.removeBook(e.target.ariaLabel);
})

//** Delete All Book */
document.getElementById('delete-btn').addEventListener('click', () => {
    UI.deleteAllBooks();

    Store.removeAllBooks();
})