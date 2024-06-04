
const db = require("../db");
const { findAvailBook,findByCode,UpdateStockBook,createBorrow,createReturn ,countActiveBorrowsByMember, findBorrowById} = require("./book.repository");

const getAvailableBook = async () => {
  try {
    return await findAvailBook()
  } catch (error) {
    console.error('Error get available book:', error);
    throw new Error('Could show available book');
  }
};

const getBookByCode = async(id) =>{
  try {
    return await findByCode(id);
  } catch (error) {
    console.error('Error show book info:', error);
    throw new Error('Could not show book');
  }
};


const createNewBorrow = async (memberCode, bookCode) => {
  try {
    await createBorrow(memberCode,bookCode,new Date)
    await UpdateStockBook(bookCode,'borrow')
  } catch (error) {
    console.error('Error creating new borrow and updating book stock:', error);
    throw new Error('Could not create new borrow');
  }
};

const updateReturn = async (borrowId, bookCode, Date) => {
  try {
    await createReturn(borrowId, Date)
    await UpdateStockBook(bookCode,'return')
  } catch (error) {
    console.error('Error creating new borrow and updating book stock:', error);
    throw new Error('Could not create new borrow');
  }
};
const getCountBorrowed = async (memberCode)=> {
  try {
    return await countActiveBorrowsByMember(memberCode)
  } catch (error) {
    console.error('Error creating new borrow and updating book stock:', error);
    throw new Error('Could not create new borrow');
  }

};

const getBorrowById = async (Id)=> {
  try {
    return await findBorrowById(Id)
  } catch (error) {
    console.error('Error creating new borrow and updating book stock:', error);
    throw new Error('Could not create new borrow');
  }

};

module.exports = {
 getAvailableBook,
  getBookByCode,
  createNewBorrow,
  updateReturn,
  getCountBorrowed,
 getBorrowById
};