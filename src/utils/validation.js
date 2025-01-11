const validateEditProfileData = (req) => {
  const allowedEditFields = ["firstName", "lastName", "skills", "emailId"];
  if(req.body.skills.length>3){
    throw new Error("Only 3 skills are allowed");
  }
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  return isEditAllowed;
};

module.exports = validateEditProfileData;
