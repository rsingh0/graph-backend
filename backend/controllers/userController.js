import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import { UserInputError } from 'apollo-server';
import {
  validateRegisterInput,
  validateLoginInput,
} from '../utils/validators.js';

const registerUser = async (username, password, confirmPassword, email) => {
  try {
    // Validate User Input
    const { valid, error } = validateRegisterInput(
      username,
      password,
      confirmPassword,
      email
    );

    if (!valid) {
      throw new UserInputError('Error', { errors });
    }

    // Verify if user exists already
    const user = await User.findOne({ username });
    if (user) {
      const errorPayload = {
        errors: {
          username: 'This username is taken',
        },
      };

      throw new UserInputError('Username is taken', errorPayload);
    }
    console.log(`Registering new user ${username}...`.blue);

    // Encrypt new user password
    const salt = await bcrypt.getSalt(10);
    password = await bcrypt.hash(password, salt);

    // Create/Register new User
    const newUser = new User({
      email,
      username,
      password,
      createdAt: new Date().toISOString(),
    });

    const res  =await newUser.save();
  } catch (error) {}
};
