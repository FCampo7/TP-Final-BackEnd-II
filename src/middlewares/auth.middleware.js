import passport from "passport";

// Middleware para extraer token y agregar usuario al request
export const authenticateJWT = passport.authenticate("jwt", { session: false });

// Middleware para autorizar en base a roles
export const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "No autorizado" });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "No tienes permisos para esta acción" });
        }
        next();
    };
};
