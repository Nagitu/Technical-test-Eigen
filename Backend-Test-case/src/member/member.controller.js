const express = require("express");
const { getExistMember, getById } = require("./member.service");


const router = express.Router();


/**
 * @swagger
 * /members:
 *   get:
 *     summary: Get all existing members
 *     description: Retrieve a list of all existing members.
 *     tags: [Members]
 *     responses:
 *       200:
 *         description: A list of members.
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
 *                       code:
 *                         type: string
 *                         description: The member code.
 *                         example: '1'
 *                       name:
 *                         type: string
 *                         description: The member name.
 *                         example: 'John Doe'
 *                       warningDate:
 *                         type: date
 *                         description: if member have a warning for borrow books
 *                         example: 'null'
 *       500:
 *         description: Internal server error.
 */
router.get("/", async (req, res) => {
  const members = await getExistMember()
  res.status(200)
  res.json({data:members});
});

/**
 * @swagger
 * /members/{code}:
 *   get:
 *     summary: Get member by code
 *     description: Retrieve a member by their code.
 *     tags: [Members]
 *     parameters:
 *       - in: path
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: The member code
 *     responses:
 *       200:
 *         description: A member object.
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
 *                       description: The member ID.
 *                       example: '1'
 *                     name:
 *                       type: string
 *                       description: The member name.
 *                       example: 'John Doe'
 *                     email:
 *                       type: string
 *                       description: The member email.
 *                       example: 'johndoe@example.com'
 *       404:
 *         description: Member not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'member doesnt exist'
 *       500:
 *         description: Internal server error.
 */
router.get("/:code", async (req,res) =>{
  const code = req.params.code;
  const members = await getById(code);
  if (members.length === 0) {
      return res.status(404).json({ message: 'member doesnt exist' });
  }
  return res.status(200).json({data: members});
})




module.exports = router;