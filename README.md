# Books API

## About

A RESTful API for managing a collection of books. The API supports basic CRUD (Create, Read, Update, Delete) operations.

## API endpoints

### Get All Books

- **URL:** `localhost:port/api/books`
- **Method:** `GET`
- **Description:** Retrieve a list of all books.
- **Response:**
  - `200 OK`: Returns a list of all books.

### Create a New Book

- **URL:** `localhost:port/api/books`
- **Method:** `POST`
- **Description:** Create a new book.
- **Request Body:**
  - `title` (string, required): The title of the book.
  - `author` (string, required): The author of the book.
  - `publishedYear` (number, required): The year the book was published.
  - `ISBN` (string, required): The ISBN number of the book.
- **Response:**
  - `201 Created`: Returns the created book.

### Get a Book by ID

- **URL:** `localhost:port/api/books/:id`
- **Method:** `GET`
- **Description:** Retrieve details of a specific book by ID.
- **Response:**
  - `200 OK`: Returns the book details.

### Update a Book by ID

- **URL:** `localhost:port/api/books/:id`
- **Method:** `PATCH`
- **Description:** Update the details of a specific book by ID.
- **Request Body:** Any book field that needs to be updated.
- **Response:**
  - `200 OK`: Returns the updated book.

### Delete a Book by ID

- **URL:** `localhost:port/api/books/:id`
- **Method:** `DELETE`
- **Description:** Delete a specific book by its ID.
- **Response:**
  - `204 No Content`: Indicates successful deletion.

### Update Book Cover Image

- **URL:** `localhost:port/api/books/cover-image/:id`
- **Method:** `PATCH`
- **Description:** Update the cover image of a specific book.
- **Request:** Multipart form data with the key `photo` and the image file.
- **Response:**
  - `200 OK`: Returns the book with the updated cover image.

## Getting started

### Clone the repository

```
$ git clone https://github.com/gitEricsson/Books-API.git
cd books-api
```

### Install dependencies

After cloning book-management-api, install the dependencies by running:

```
$ npm install
```

### Initialize server

To start the server, run:

```
$ npm start
```

### Run tests

To run the tests, use the following command:

```
$ npm test
```
