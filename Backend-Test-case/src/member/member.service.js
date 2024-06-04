
const db = require("../db/index");
const {
 findExistMember,
 findByCode,
 updateWarningDate
} = require("./member.repository");

const getExistMember = async () => {
  const members = await findExistMember();
  return members;
};
const getByCode = async(id) =>{
    const members = await findByCode(id);
    return members;
}

const updateWarningMember= async(id,date) =>{
  const members = await updateWarningDate(id,date)
  return members;
}

module.exports = {
  getExistMember,
  getByCode,
  updateWarningMember
};