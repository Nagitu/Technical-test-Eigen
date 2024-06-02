const express = require("express");
const { getAvailableBook ,getBookById, createNewBorrow,getCountBorrowed, getBorrowById, updateReturn} = require("./book.service");
const {getById,updateWarningMember} = require('../member/member.service');


const router = express.Router();

/**
 * @swagger
 * /books/available:
 *   get:
 *     summary: Get all available books
 *     description: Retrieve a list of all available books.
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: A list of available books.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The book ID.
 *                         example: '1'
 *                       title:
 *                         type: string
 *                         description: The book title.
 *                         example: 'Book Title'
 *                       author:
 *                         type: string
 *                         description: The book author.
 *                         example: 'Author Name'
 *                       stock:
 *                         type: number
 *                         description: The number of available copies.
 *                         example: 5
 *       400:
 *         description: No Book Available for now.
 *       500:
 *         description: Internal server error.
 */
router.get("/available", async (req, res) => {
  try{
    const books = await getAvailableBook()
    if(books === 0){return res.status(400).send('No Book Available for now');}
    return res.status(200).json({data :books});
  }catch(err){
    return res.status(500).send(err.message);
  }

});

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get book by ID
 *     description: Retrieve a book by its ID.
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book ID
 *     responses:
 *       200:
 *         description: A book object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The book ID.
 *                       example: '1'
 *                     title:
 *                       type: string
 *                       description: The book title.
 *                       example: 'Book Title'
 *                     author:
 *                       type: string
 *                       description: The book author.
 *                       example: 'Author Name'
 *                     stock:
 *                       type: number
 *                       description: The number of available copies.
 *                       example: 5
 *       404:
 *         description: Book not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'book not found'
 *       500:
 *         description: Internal server error.
 */
router.get("/:id", async (req,res) =>{
  try{
    const id = req.params.id
    const book = await getBookById(id)
    if (book.length === 0) {
      return res.status(404).json({ message: 'book not found' });
  }
    return res.status(200).json({data:book})
  }catch(err){
    return res.status(500).send(err.message);
  }
})

/**
 * @swagger
 * /books/borrow:
 *   post:
 *     summary: Borrow a book
 *     description: Borrow a book by providing member code and book code.
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               memberCode:
 *                 type: string
 *                 description: The member code.
 *                 example: 'M001'
 *               bookCode:
 *                 type: string
 *                 description: The book code.
 *                 example: 'JK-45'
 *     responses:
 *       200:
 *         description: Book borrowed successfully.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: 'Book borrowed successfully'
 *       400:
 *         description: Bad request.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               examples:
 *                 missingCode:
 *                   value: 'Member code and book code are required'
 *                 bookBorrowed:
 *                   value: 'Book is borrowed by another member'
 *                 maxBooksBorrowed:
 *                   value: 'Member cannot borrow more than 2 books'
 *                 underWarning:
 *                   value: 'Member is under warning and cannot borrow books'
 *       500:
 *         description: Internal server error.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: 'Internal server error'
 */
router.post("/borrow", async (req, res) => {
  try {
    const {memberCode, bookCode } = req.body;
    const member = await getById(memberCode)
    if (!memberCode || !bookCode) {
      return res.status(400).send('Member code and book code are required');
    }

    const availableBook = await getBookById(bookCode);
    const borrowedBooksCount = await getCountBorrowed(memberCode);
    console.log(availableBook[0].stock)
    // const member = await memberService.getMemberByCode(memberCode);
    if (availableBook[0].stock < 1) {
      return res.status(400).send('Book is borrowed by another member');
    }
    if (borrowedBooksCount >= 2) {
      return res.status(400).send('Member cannot borrow more than 2 books');
    }
   
    if (new Date(member.warningDate) > new Date()) {
      return res.status(400).send('Member is under warning and cannot borrow books');
    }

    await createNewBorrow(memberCode, bookCode, new Date);
    return res.status(200).send('Book borrowed successfully');
  } catch (error) {
    console.error('Error borrowing book:', error);
    return res.status(500).send('Internal server error');
  }
});

/**
 * @swagger
 * /books/return:
 *   post:
 *     summary: Return a borrowed book
 *     description: Return a book that was borrowed by a member.
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The borrow record ID.
 *                 example: 'BR123'
 *               memberCode:
 *                 type: string
 *                 description: The member code.
 *                 example: 'MEM123'
 *     responses:
 *       200:
 *         description: Book returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 borrow:
 *                   type: object
 *                   description: The borrow record.
 *       404:
 *         description: Borrow record not found or not borrowed by the member.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     borrowNotFound:
 *                       value: 'Borrow record not found'
 *                     notBorrowedByYou:
 *                       value: 'This not borrowed by you'
 *       500:
 *         description: Internal server error.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: 'Internal server error'
 */

router.post('/return',async  (req, res) => {
  const { id, memberCode } = req.body;
  const borrow = await getBorrowById(id)
  console.log(borrow);
  if (borrow.length === 0) {
    return res.status(404).json({ message: 'Borrow record not found' });
  }
  if(borrow[0].returned === true){return res.status(404).json({message:'this book already returned'})}
  if(borrow[0].memberCode != memberCode){return res.status(404).json({ message: 'This not borrowed by you' });}
  const returnDate = new Date();
  const borrowedDate = new Date(borrow.borrowedDate);
  const diffDays = Math.ceil((returnDate - borrowedDate) / (1000 * 60 * 60 * 24));

  if (diffDays > 7) {
    const member = members.find(m => m.id === parseInt(memberId));
    const newDate = new Date(currentDate.setDate(currentDate.getDate() + 3));
    return updateWarningMember(memberCode,newDate)
  }

  const thisTime = new Date;
  const book = await updateReturn(id,borrow[0].bookCode,thisTime)

  res.status(200).json(borrow);
});




module.exports = router;