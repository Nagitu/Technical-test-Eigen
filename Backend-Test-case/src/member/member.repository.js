// exampleUsage.js
const db = require('../db');

async function findExistMember() {
  try {
    const members = await db('members')
    .leftJoin('borrows', 'members.code', 'borrows.memberCode')
    .select('members.code', 'members.name')
    .count('borrows.bookCode as borrowedBooksCount')
    .where('borrows.returned', false)
    .groupBy('members.code', 'members.name');
    return members
  } catch (err) {
    console.error('Error fetching users:', err);
  }
}
async function findById(code){
    try {
        const member = await db('members').where('code', code).select('*');
        return member
    }
    catch(err){
        console.error('Error fetching users:', err);
    }
  }

  async function updateWarningDate(date,code){
    try {
        const data = await db('members').update('warningDate', date).where('code', code).returning('*')
        return data
    }
    catch(err){
        console.error('Error fetching users:', err);
    }
  }

module.exports = {
    findExistMember,
    findById,
    updateWarningDate
}
