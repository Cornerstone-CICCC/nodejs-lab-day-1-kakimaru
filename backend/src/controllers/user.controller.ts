import { Request, response, Response } from "express";
import userModel from "../models/user.model";
import { User } from "../types/user";
import { compareHash, hashed } from "../utils/hash.util";

// get users
const getUsers = (req: Request, res: Response) => {
  const users = userModel.findAll();
  res.json(users);
};

// get user by id
const getUserById = (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const user = userModel.findById(id);
  if (!user) {
    res.status(404).send(`User not found`);
    return;
  }
  res.json(user);
};

// get user by username
const getUserByUsername = (
  req: Request<{ username: string }>,
  res: Response
) => {
  const { username } = req.params;
  const user = userModel.findByUsername(username);
  if (!user) {
    res.status(404).send(`User not found`);
    return;
  }
  res.json(user);
};

// create user
const addUser = async (
  req: Request<{}, {}, Omit<User, "id">>,
  res: Response
) => {
  const { username, password, firstname, lastname } = req.body;
  const hashedPassword = await hashed(password);
  const user = userModel.create({
    username,
    password: hashedPassword,
    firstname,
    lastname,
  });
  res.status(201).json(user);
};

// update user
const updateUserById = (
  req: Request<{ id: string }, {}, User>,
  res: Response
) => {
  const { id } = req.params;
  const { username, password, firstname, lastname } = req.body;
  const user = userModel.update(id, {
    username,
    password,
    firstname,
    lastname,
  });
  if (!user) {
    res.status(404).send(`User not found`);
    return;
  }
  res.status(200).json(user);
};

// delete user
const deleteUserById = (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const isDeleted = userModel.delete(id);
  if (!isDeleted) {
    res.status(404).send(`User not found`);
    return;
  }
  res.status(200).send(`User deleted.`);
};

// login
const loginUser = async (req: Request<{}, {}, User>, res: Response) => {
  const { username, password } = req.body;
  const user = userModel.findByUsername(username);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const isMatch = await compareHash(password, user.password);
  if (!isMatch) {
    res.status(401).json({ message: "Password is invalid" });
    return;
  }

  res.cookie("isAuthenticated", true, {
    maxAge: 3 * 60 * 1000,
    signed: true,
    httpOnly: true,
  });
  res.cookie("userId", user.id, {
    maxAge: 3 * 60 * 1000,
    signed: true,
    httpOnly: true,
  });
  res.status(200).json({ message: "Login authenticated." });
};

// check auth
const userProfile = (req: Request, res: Response) => {
  const userId = req.signedCookies.userId;
  if(userId) {
    const user = userModel.findById(userId)
    if(user) {
      res.json(user)
    } else {
      res.status(404).send({message: "User not found."})
    }
  }
  res.status(200).send(`You are allowed to view the page.`)
}

// logout
const logoutUser = (req: Request, res: Response) => {
  res.clearCookie('isAuthenticated')
  res.clearCookie('userId')
  res.status(200).send({ message: "Logged out." })
}

export default {
  getUsers,
  getUserById,
  getUserByUsername,
  addUser,
  updateUserById,
  deleteUserById,
  loginUser,
  userProfile,
  logoutUser,
};
