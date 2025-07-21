import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { doctorsTable, TUserInsert, TUserSelect, usersTable } from "../drizzle/schema";


//Register a new user
export const createUserServices = async(user: TUserInsert):Promise<string> => {
    await db.insert(usersTable).values(user).returning();
    return "User created successfully 🎉";
}


// Get user by email
export const  getUserByEmailService = async(email:string): Promise<TUserSelect | undefined> => {
    return await db.query.usersTable.findFirst({
        where:(eq(usersTable.email,email))
    });
}

//Get user by contactPhone

export const getUserByPhoneService = async (contactPhone: string): Promise<TUserSelect | undefined> => {
  return await db.query.usersTable.findFirst({
    where: eq(usersTable.contactPhone, contactPhone),
  });
};


export const updateUserPasswordService = async (email: string, newPassword: string): Promise<string> => {
    const result = await db.update(usersTable)
        .set({ password: newPassword })
        .where(eq(usersTable.email, email))
        .returning();

    if (result.length === 0) {
        throw new Error("User not found or password update failed");
    }
    
    return "Password updated successfully";
}

export const getDoctorByUserIdService = async (userId: number) => {
  return await db.query.doctorsTable.findFirst({
    where: eq(doctorsTable.userId, userId),
    with: {
      appointments: true,
      prescriptions: true,
      user: true,
    },
  });
};