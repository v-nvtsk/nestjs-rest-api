import bcrypt from 'bcrypt';

const saltRounds = 10;
const defaultSecretKey = process.env.SECRET_KEY;

export const hashPassword = async (
  password: string,
  secretKey: string = defaultSecretKey,
) => {
  const saltedPassword = password + secretKey;

  const hashedPassword = await bcrypt.hash(saltedPassword, saltRounds);
  return hashedPassword;
};

export const checkPassword = async (
  enteredPassword: string,
  hashedPassword: string,
  secretKey: string = defaultSecretKey,
) => {
  const saltedPassword = enteredPassword + secretKey;
  const isMatch = await bcrypt.compare(saltedPassword, hashedPassword);
  return isMatch;
};
