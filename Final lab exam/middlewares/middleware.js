const validateTaskLength = (req, res, next) => {
    const task = req.body.task;

    if (typeof task !== 'string' || task.length < 10) {
        return res.status(400).json({
            error: `Task must be a string (received ${typeof task}) and at least 10 characters long`
        });
    }

    next();
};

module.exports = { validateTaskLength };
