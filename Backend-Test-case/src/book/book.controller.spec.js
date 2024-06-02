const request = require('supertest');
const express = require('express');
const bookRouter = require('../book/book.controller'); // Path ke file router Anda
const bookService = require('../book/book.service');
const memberService = require('../member/member.service');

jest.mock('../book/book.service.js', () => ({
  getAvailableBook: jest.fn(),
  getBookById: jest.fn(),
  createNewBorrow: jest.fn(),
  getCountBorrowed: jest.fn(),
  getBorrowById: jest.fn(),
  updateReturn: jest.fn(),
}));

jest.mock('../member/member.service', () => ({
  getById: jest.fn(),
  updateWarningMember: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use('/books', bookRouter);

describe('Book Router', () => {
  let server;

  beforeAll(async () => {
    server = await new Promise((resolve) => {
      const serverInstance = app.listen(3000, () => resolve(serverInstance));
    });
  });

  afterAll(async () => {
    await new Promise((resolve, reject) => {
      if (server) {
        server.close((err) => {
          if (err) return reject(err);
          resolve();
        });
      } else {
        resolve();
      }
    });
  });

  describe('GET /books/available', () => {
    it('should return available books', async () => {
      const mockBooks = [{ id: '1', title: 'Test Book' }];
      bookService.getAvailableBook.mockResolvedValue(mockBooks);

      const res = await request(app).get('/books/available');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({ data: mockBooks });
      expect(bookService.getAvailableBook).toHaveBeenCalled();
    });


    it('should return 500 on server error', async () => {
      bookService.getAvailableBook.mockRejectedValue(new Error('Server error'));

      const res = await request(app).get('/books/available');

      expect(res.statusCode).toEqual(500);
      expect(res.text).toBe('Server error');
      expect(bookService.getAvailableBook).toHaveBeenCalled();
    });
  });

  describe('GET /books/:code', () => {
    it('should return book data for given code', async () => {
      const mockBook = [ {
        "code": "SHR-1",
        "title": "A Study in Scarlet",
        "author": "Arthur Conan Doyle",
        "stock": 1
    }];
      bookService.getBookById.mockResolvedValue(mockBook);

      const res = await request(app).get('/books/SHR-1');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({ data: mockBook });
      expect(bookService.getBookById).toHaveBeenCalledWith('SHR-1');
    });

    it('should return 404 if book not found', async () => {
      bookService.getBookById.mockResolvedValue([]);

      const res = await request(app).get('/books/2');

      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ message: 'book not found' });
      expect(bookService.getBookById).toHaveBeenCalledWith('2');
    });

    it('should return 500 on server error', async () => {
      bookService.getBookById.mockRejectedValue(new Error('Server error'));

      const res = await request(app).get('/books/2');

      expect(res.statusCode).toEqual(500);
      expect(res.text).toBe('Server error');
      expect(bookService.getBookById).toHaveBeenCalledWith('2');
    });
  });

  describe('POST /books/borrow', () => {
    it('should borrow a book successfully', async () => {
      const mockMember = { memberCode: '1', warningDate: new Date(Date.now() - 86400000) };
      const mockBook = [{ id: '1', stock: 1 }];
      bookService.getBookById.mockResolvedValue(mockBook);
      memberService.getById.mockResolvedValue(mockMember);
      bookService.getCountBorrowed.mockResolvedValue(1);

      const res = await request(app)
        .post('/books/borrow')
        .send({ memberCode: '1', bookCode: '1' });

      expect(res.statusCode).toEqual(200);
      expect(res.text).toBe('Book borrowed successfully');
      expect(bookService.createNewBorrow).toHaveBeenCalled();
    });
    // Tambahkan pengujian lain untuk skenario lainnya seperti input tidak lengkap, buku tidak tersedia, dll.
  });
  // describe('POST /books/return', () => {
  //   it('should return the book successfully', async () => {
  //     const mockBorrow = [{ id: '1', memberCode: '1', bookCode: '1', borrowedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) }];
  //     const mockBook = [{ id: '1', memberCode: '1', bookCode: '1', borrowedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) , returnDate: new Date}];
  //     bookService.getBorrowById.mockResolvedValue(mockBorrow);
  //     bookService.updateReturn.mockResolvedValue(mockBook);

  //     const res = await request(app)
  //       .post('/books/return')
  //       .send({ id: '1', memberCode: '1' });

  //     expect(res.statusCode).toEqual(200);
  //     expect(res.body).toEqual(mockBorrow);
  //     expect(bookService.getBorrowById).toHaveBeenCalledWith('1');
  //     expect(bookService.updateReturn).toHaveBeenCalledWith('1', '1', expect.any(Date));
  //   });

  //   it('should return 404 if borrow record not found', async () => {
  //     bookService.getBorrowById.mockResolvedValue(null);

  //     const res = await request(app)
  //       .post('/books/return')
  //       .send({ id: '2', memberCode: '1' });

  //     expect(res.statusCode).toEqual(404);
  //     expect(res.body).toEqual({ message: 'Borrow record not found' });
  //     expect(bookService.getBorrowById).toHaveBeenCalledWith('2');
  //   });

  //   it('should return 404 if member did not borrow the book', async () => {
  //     const mockBorrow = [{ id: '1', memberCode: '2', bookCode: '1', borrowedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) }];
  //     bookService.getBorrowById.mockResolvedValue(mockBorrow);

  //     const res = await request(app)
  //       .post('/books/return')
  //       .send({ id: '1', memberCode: '1' });

  //     expect(res.statusCode).toEqual(404);
  //     expect(res.body).toEqual({ message: 'This not borrowed by you' });
  //     expect(bookService.getBorrowById).toHaveBeenCalledWith('1');
  //   });

  //   it('should update warning member if return is late', async () => {
  //     const mockBorrow = [{ id: '1', memberCode: '1', bookCode: '1', borrowedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) }];
  //     const mockBook = [{ id: '1', stock: 1 }];
  //     bookService.getBorrowById.mockResolvedValue(mockBorrow);
  //     memberService.updateWarningMember.mockResolvedValue();

  //     const res = await request(app)
  //       .post('/books/return')
  //       .send({ id: '1', memberCode: '1' });

  //     expect(res.statusCode).toEqual(200);
  //     expect(memberService.updateWarningMember).toHaveBeenCalledWith('1', expect.any(Date));
  //     expect(bookService.updateReturn).toHaveBeenCalledWith('1', '1', expect.any(Date));
  //   });
  // });
});
