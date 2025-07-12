import { Router } from "express";
import { createUser, deleteUser, getUserById, getUsers, updateUser } from "./user.controller";
import { allRolesAuth, bothRolesAuth,adminRoleAuth } from "../middleware/bearAuth";


export const userRouter = Router();


// Get all users
userRouter.get('/users',adminRoleAuth, getUsers);
// Get user by ID
userRouter.get('/users/:id',allRolesAuth, getUserById);

// Create a new user
userRouter.post('/users',allRolesAuth, createUser);

// Update an existing user
userRouter.put('/users/:id',allRolesAuth,updateUser);

// Delete an existing user
userRouter.delete('/users/:id',bothRolesAuth,deleteUser);
