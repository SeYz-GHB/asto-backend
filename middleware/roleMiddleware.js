// ✅ FIXED: The issue was here
export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: "User not authenticated"
            });
        }

        console.log("🔍 User role:", req.user.role);
        console.log("🔍 Allowed roles:", allowedRoles);

        // ✅ Now allowedRoles is correctly spread as individual arguments
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Role '${req.user.role}' is not permitted to access this resource. Allowed roles: ${allowedRoles.join(', ')}`
            });
        }

        console.log("✅ Authorization successful for role:", req.user.role);
        next();
    };
};