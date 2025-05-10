import jwt from "jsonwebtoken";
import User from "../models/User.js";

//generating token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1hr",
  });
};

export const registerUser = async (req, res) => {
  const { fullName, email, password, profilePicUrl } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "all the fields are required" });
  }
  try {
    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      return res.status(400).json({ message: "user already exists" });
    }

    const newUser = await User.create({
      fullName,
      email,
      password,
      profilePicUrl: profilePicUrl || null,
    });
    res.status(200).json({
        _id:newUser.id,
        fullName:newUser.fullName,
        email:newUser.email,
        profilePicUrl:newUser.profilePicUrl,
        token:generateToken(newUser.id)
    })
    
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
};
export const loginUser = async(req,res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "all the fields are required" });
    }
    try {

        const user = await User.findOne({ where: { email: email } });

        if(!user){
            return res.status(400).json({ message: "invalid credentials" });
        }
      console.log(user);
      
        const isMatch = await user.comparePassword(password);
        if(!isMatch) return res.status(400).json({ message: "invalid credentials" });
        

        res.status(200).json({
            id:user.id,
            user,
            token:generateToken(user.id)
        })
    } catch (error) {
        res.status(500).json({ message: "Error logging in ", error: error.message });        
    }
};
export const getUserInfo = async(req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
    
  } catch (error) {
    res.status(500).json({message:"Error getting user info", error:error.message})
  }
};
