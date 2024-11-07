import bcrypt from 'bcrypt';

export const hashed = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 12)
}

export const compareHash = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword)
}