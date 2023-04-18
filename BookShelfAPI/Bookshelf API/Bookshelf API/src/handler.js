const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (req, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = req.payload;
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBooks = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBooks);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(501);
  return response;
};

/*
Kamu membuat beberapa kode yang berulang disini. Kamu bisa memperhatikan code snippet berikut sebagai referensi:

const getAllBooksHandler = (request, h) => {
  const { name: qName, reading, finished } = request.query;
  let datas = books;
  if (qName) {
    datas = datas.filter((x) => x.name.toLowerCase().includes(qName.toLowerCase()));
  }
  if (reading) {
    datas = datas.filter((x) => x.reading == Boolean(reading));
  }
  if (finished) {
    datas = datas.filter((x) => x.finished == Boolean(finished));
  }
  const response = h.response({
    status: 'success',
    data: {
      books: datas.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
*/

const getBooksHandler = (req, h) => {
  const { name, reading, finished } = req.query;

  if (name) {
    const booksFilter = books.filter((
      book,
    ) => book.name.toLowerCase().includes(name.toLowerCase()));
    const filterBookyey = booksFilter.map((book) => ({
      id: book.id, name: book.name, publisher: book.publisher,
    }));

    const response = h.response({
      status: 'success',
      data: {
        books: filterBookyey,
      },
    });
    response.code(200);
    return response;
  }

  if (reading) {
    return {
      status: 'success',
      data: {
        books: books.filter((book) => Number(book.reading) === Number(reading)).map((book) => ({
          id: book.id, name: book.name, publisher: book.publisher,
        })),
      },
    };
  }

  if (finished) {
    return {
      status: 'success',
      data: {
        books: books.filter((book) => Number(book.finished) === Number(finished)).map((book) => ({
          id: book.id, name: book.name, publisher: book.publisher,
        })),
      },
    };
  }

  const response = h.response({
    status: 'success',
    data: {
      books: books.map((book) => ({
        id: book.id, name: book.name, publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (req, h) => {
  const { id } = req.params;
  const book = books.filter((n) => n.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (req, h) => {
  const { id } = req.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = req.payload;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const index = books.findIndex((book) => book.id === id);

  if (index < 0) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  const finished = pageCount === readPage;

  const updatedAt = new Date().toISOString();

  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    updatedAt,
  };

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
  response.code(200);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = books.findIndex((book) => book.id === id);
  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler, getBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler,
};
