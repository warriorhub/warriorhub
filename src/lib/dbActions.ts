'use server';

import { hash } from 'bcrypt';
import { prisma } from './prisma';

/**
 * Creates a new user with server-side validation.
 * @param credentials - Object with email and password
 * @returns Object with success status and optional error message
 */
export async function signUp(credentials: { email: string; password: string }) {
  try {
    // Server-side validation: Check email ends with @hawaii.edu
    if (!credentials.email.endsWith('@hawaii.edu')) {
      return {
        success: false,
        error: 'Email must end with @hawaii.edu',
      };
    }

    // Server-side validation: Check password length
    if (credentials.password.length < 6) {
      return {
        success: false,
        error: 'Password must be at least 6 characters',
      };
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: credentials.email },
    });

    if (existingUser) {
      return {
        success: false,
        error: 'An account with this email already exists',
      };
    }

    // Hash password
    const hashedPassword = await hash(credentials.password, 10);

    // Create user
    await prisma.user.create({
      data: {
        email: credentials.email,
        password: hashedPassword,
        role: 'USER', // Default role
        organization: null,
      },
    });

    // Success!
    return {
      success: true,
    };
  } catch (error) {
    console.error('Sign up error:', error);
    return {
      success: false,
      error: 'An error occurred during sign up. Please try again.',
    };
  }
}

/**
 * Creates a new user in the database.
 * @param credentials an object with the following properties: email, password.
 */
export async function createUser(credentials: { email: string; password: string }) {
  // console.log`createUser data: ${JSON.stringify(credentials, null, 2)}`);
  const password = await hash(credentials.password, 10);
  await prisma.user.create({
    data: {
      email: credentials.email,
      password,
    },
  });
}

/**
 * Changes the password of an existing user in the database.
 * @param credentials an object with the following properties: email, password.
 */
export async function changePassword(credentials: { email: string; password: string }) {
  // console.log`changePassword data: ${JSON.stringify(credentials, null, 2)}`);
  const password = await hash(credentials.password, 10);
  await prisma.user.update({
    where: { email: credentials.email },
    data: {
      password,
    },
  });
}

/**
 * Edits the role of an existing user in the database.
 * @param user a user object with the following properties: id, email, role.
 */
export async function editUser(user: { id: number; email: string; role: 'USER' | 'ORGANIZER' | 'ADMIN' }) {
  await prisma.user.update({
    where: { id: user.id },
    data: {
      role: user.role,
    },
  });
}
