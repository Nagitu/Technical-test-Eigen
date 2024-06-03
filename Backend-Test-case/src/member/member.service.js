
const db = require("../db/index");
const {
 findExistMember,
 findById,
 updateWarningDate
} = require("./member.repository");

const getExistMember = async () => {
  const members = await findExistMember();
  return members;
};
const getById = async(id) =>{
    const members = await findById(id);
    return members;
}

const updateWarningMember= async(id,date) =>{
  const members = await updateWarningDate(id,date)
  return members;
}

module.exports = {
  getExistMember,
  getById,
  updateWarningMember
};