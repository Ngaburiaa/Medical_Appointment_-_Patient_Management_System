
import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TUserInsert, TUserSelect, usersTable } from "../drizzle/schema";

//Get all users
export const getUsersServices = async():Promise<TUserSelect[] | null> => {
    return await db.query.usersTable.findMany({
    with: {
      appointments: true,
      prescriptions: true,
      complaints: true,
    },
  });
}

export const getUserByIdServices = async (userId: number): Promise<TUserSelect | undefined> => {
  return await db.query.usersTable.findFirst({
    where: eq(usersTable.userId, userId),
    with: {
      doctorProfile: {
        with: {
          appointments: {
            with: {
              user: true,
              payments: true,
              prescription: {
                with: {
                  items: true,
                  doctor: {
                    with: {
                      user: true,
                    },
                  },
                  patient: true,
                  appointment: true,
                },
              },
            },
          },
          prescriptions: {
            with: {
              appointment: true,
              doctor: {
                with: {
                  user: true,
                },
              },
              patient: true,
              items: true,
            },
          },
        },
      },

      appointments: {
        with: {
          doctor: {
            with: {
              user: true,
            },
          },
          payments: true,
          prescription: {
            with: {
              items: true,
              doctor: {
                with: {
                  user: true,
                },
              },
              patient: true,
              appointment: true,
            },
          },
        },
      },

      prescriptions: {
        with: {
          doctor: {
            with: {
              user: true,
            },
          },
          appointment: true,
          patient: true,
          items: true,
        },
      },

      complaints: true,
    },
  });
};


// Create a new user
export const createUserServices = async(user: TUserInsert):Promise<string> => {
    await db.insert(usersTable).values(user).returning();
    return "User created successfully 🎉";
}

// Update an existing user
export const updateUserServices = async(userId: number, user: Partial<TUserInsert>):Promise<string> => {
    await db.update(usersTable).set(user).where(eq(usersTable.userId, userId));
    return "User updated successfully 😎";
}


// Delete a user

export const deleteUserServices = async(userId: number):Promise<string> => {
  await db.delete(usersTable).where(eq(usersTable.userId, userId));
  return "User deleted successfully 🎉"
}