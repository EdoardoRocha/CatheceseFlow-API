import jwt from "jsonwebtoken";
import getToken from "../Helpers/get-token.js";

const checkToken = (req, res, next) => {
  if (!req.headers.authorization)
    return res.status(401).json({ message: "Acesso negado!" });

  const token = getToken(req);
  if (!token) return res.status(401).json({ message: "Acesso negado!" });

  try {
    const verifed = jwt.verify(token, process.env.AUTH_SECRET);
    req.user = verifed;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export default checkToken;
