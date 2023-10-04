const errorHandler = (error, req, res, next) => {
    const statusCode = error.status || 500;
    const message = error.message || "Internal Server Error";
    res.status(statusCode).json({ message });
};

export { errorHandler }