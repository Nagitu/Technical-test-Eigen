const db = require('../db');

async function findAvailBook() {
  try {
    const members = await db('books').where('stock','>',0).select('*');
    return members
    console.log(members)
  } catch (err) {
    console.error('Error fetching users:', err);
  }
}

async function findAllBook() {
  try {
    const datas = await db('books').select('*');
    return datas
    console.log(datas)
  } catch (err) {
    console.error('Error fetching books:', err);
  }
}

async function findByCode(code){
    try {
        const datas = await db('books').where('code', code).select('*');
        // console.log(datas); 
        return datas
    }
    catch(err){
        console.error('Error fetching users:', err);
    }
}

async function UpdateStockBook(code,operation){
    try {
      if (operation === 'return') {
          await db('books')
              .where({ code })
              .increment('stock', 1);
      } else if (operation === 'borrow') {
          await db('books')
              .where({ code })
              .decrement('stock', 1);
      } else {
          throw new Error('Invalid operation');
      }
      console.log('Stock updated successfully');
  } catch (error) {
      console.error('Error updating stock:', error);
      throw new Error('Could not update stock');
  }
}

async function createBorrow(memberCode, bookCode, borrowedDate) {
  try{
    const datas = db('borrows').insert({ memberCode, bookCode, borrowedDate }).returning('*');
    return datas
    }catch(err){
      console.error('Error create borrow:', error);
      throw new Error('Could not make a borrow');
    }
}

async function createReturn(borrowId,returnedDate) {
  try{
    const datas = db('borrows').update({returnedDate, returned : true }).where('id',borrowId).returning('*');
    return datas
    }catch(err){
      console.error('Error create Return:', error);
      throw new Error('Could not make a Return');
    }
}

async function countActiveBorrowsByMember(memberCode) {
  try{
    const result = await db('borrows').where({ memberCode, returned: false }).count('id as count').first();
  return result.count;
    }catch(err){
      console.error('Error create Return:', error);
      throw new Error('Could not make a Return');
    }
 
}

async function findBorrowById(borrowId) {
  try{
    const result = await db('borrows').where('id',borrowId).returning('*')
  return result
    }catch(err){
      console.error('Error create Return:', err);
      throw new Error('Could not make a Return');
    }
 
}

module.exports = {
    findAllBook,
    findAvailBook,
    findByCode,
    UpdateStockBook,
    createBorrow,
    createReturn,
    countActiveBorrowsByMember,
    findBorrowById
}
