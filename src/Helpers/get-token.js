const getToken = req => {
    const tokenHeader = req.headers.authorization;
    const token = tokenHeader.split(" ")[1];
    return token;
};

export default getToken;