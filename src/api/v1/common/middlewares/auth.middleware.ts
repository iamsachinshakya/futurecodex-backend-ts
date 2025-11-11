// import { ACCESS_TOKEN_SECRET } from "../../../../app/config/env.js";
// import { verifyToken } from "../../modules/auth/utils/jwt.util.js";
// import { RepositoryProvider } from "../../RepositoryProvider.js";
// import { ApiError } from "../utils/ApiError.js";
// import { asyncHandler } from "../utils/asyncHandler.js";

// // Middleware: authenticate user using JWT
// export const authenticateJWT = asyncHandler(async (req, res, next) => {
//   const token =
//     req.cookies?.accessToken ||
//     req.header("Authorization")?.replace("Bearer ", "");

//   if (!token) {
//     throw new ApiError("Unauthorized request – token missing", 401);
//   }

//   const decodedToken = verifyToken(token, ACCESS_TOKEN_SECRET);

//   const user = await RepositoryProvider.userRepository.findById(
//     decodedToken?.id
//   );

//   if (!user) {
//     throw new ApiError("Invalid or expired access token", 401);
//   }

//   req.user = user;
//   next();
// });
