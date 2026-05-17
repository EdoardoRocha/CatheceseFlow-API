import jwt from "jsonwebtoken";

export const createUserToken = (user) => {
  const token = jwt.sign(
    {
      name: user.name,
      role: user.role,
      ParishId: user.ParishId,
      id: user.id,
    },
    process.env.AUTH_SECRET,
    {
      expiresIn: "1d",
    },
  );

  return token;
};
