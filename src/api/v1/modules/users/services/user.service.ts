import { ApiError } from "../../../common/utils/apiError";
import { uploadOnCloudinary } from "../../../common/utils/cloudinary.util";
import { RepositoryProvider } from "../../../RepositoryProvider";
import {
  IUpdateUser,
  IUserEntity,
  IUserPreferences,
  ISocialLinks,
} from "../../users/models/user.model.interface";
import { IUserService } from "./user.service.interface";

export class UserService implements IUserService {
  async getAllUsers(): Promise<IUserEntity[]> {
    return await RepositoryProvider.userRepository.findAll();
  }

  async getUserById(userId: string): Promise<IUserEntity> {
    const user = await RepositoryProvider.userRepository.findById(userId);
    if (!user) throw new ApiError("User not found", 404);
    return user;
  }

  async updateAccountDetails(
    userId: string,
    body: IUpdateUser
  ): Promise<IUserEntity | null> {
    const allowedFields: (keyof IUpdateUser)[] = [
      "fullName",
      "email",
      "username",
      "bio",
    ];

    const updates: Partial<IUpdateUser> = {};

    for (const key of allowedFields) {
      const value = body[key];

      if (typeof value === "string" && value.trim() !== "") {
        updates[key] = value.trim() as any;
      } else if (value && typeof value === "object") {
        updates[key] = value as any;
      }
    }

    if (Object.keys(updates).length === 0) {
      throw new ApiError("At least one valid field is required to update", 400);
    }

    if (updates.username) {
      const existingUser =
        await RepositoryProvider.userRepository.isUsernameTaken(
          updates.username.toLowerCase()
        );
      if (existingUser) throw new ApiError("Username already taken", 409);
    }

    return await RepositoryProvider.userRepository.updateAccountDetails(
      userId,
      updates
    );
  }

  async updateAvatar(userId: string, file: Express.Multer.File): Promise<IUserEntity> {
    if (!file?.buffer) throw new ApiError("Avatar file is missing", 400);

    const avatar = await uploadOnCloudinary(file.buffer, userId, "avatars");
    if (!avatar?.secure_url) throw new ApiError("Failed to upload avatar", 400);

    const user = await RepositoryProvider.userRepository.updateById(userId, {
      avatar: avatar.secure_url,
    });

    if (!user) throw new ApiError("User not found", 404);
    return user;
  }

  async deleteUser(userId: string): Promise<boolean> {
    const user = await RepositoryProvider.userRepository.deleteById(userId);
    if (!user) throw new ApiError("User not found", 404);
    return true;
  }

  async updateSocialLinks(userId: string, links: ISocialLinks): Promise<IUserEntity> {
    if (!links || Object.keys(links).length === 0) {
      throw new ApiError("At least one social link is required", 400);
    }

    const user = await RepositoryProvider.userRepository.updateById(userId, {
      socialLinks: links,
    });

    if (!user) throw new ApiError("User not found", 404);
    return user;
  }

  async followUser(userId: string, targetUserId: string): Promise<void> {
    if (userId === targetUserId) {
      throw new ApiError("You cannot follow yourself", 400);
    }

    const [user, targetUser] = await Promise.all([
      RepositoryProvider.userRepository.findById(userId),
      RepositoryProvider.userRepository.findById(targetUserId),
    ]);

    if (!user) throw new ApiError("User not found", 404);
    if (!targetUser) throw new ApiError("Target user not found", 404);

    // Prevent duplicate follow
    if (targetUser.followers?.some(f => f.toString() === userId)) {
      throw new ApiError("Already following this user", 409);
    }

    await Promise.all([
      RepositoryProvider.userRepository.addFollower(targetUserId, userId),
      RepositoryProvider.userRepository.addFollowing(userId, targetUserId),
    ]);
  }

  async unfollowUser(userId: string, targetUserId: string): Promise<void> {
    if (userId === targetUserId) {
      throw new ApiError("You cannot unfollow yourself", 400);
    }

    const [user, targetUser] = await Promise.all([
      RepositoryProvider.userRepository.findById(userId),
      RepositoryProvider.userRepository.findById(targetUserId),
    ]);

    if (!user) throw new ApiError("User not found", 404);
    if (!targetUser) throw new ApiError("Target user not found", 404);

    await Promise.all([
      RepositoryProvider.userRepository.removeFollower(targetUserId, userId),
      RepositoryProvider.userRepository.removeFollowing(userId, targetUserId),
    ]);
  }

  async getFollowers(userId: string): Promise<IUserEntity[]> {
    return await RepositoryProvider.userRepository.findFollowers(userId);
  }

  async getFollowing(userId: string): Promise<IUserEntity[]> {
    return await RepositoryProvider.userRepository.findFollowing(userId);
  }

  async updatePreferences(userId: string, preferences: IUserPreferences): Promise<IUserEntity> {
    if (!preferences || Object.keys(preferences).length === 0) {
      throw new ApiError("Preferences object cannot be empty", 400);
    }

    const user = await RepositoryProvider.userRepository.updateById(userId, {
      preferences,
    });

    if (!user) throw new ApiError("User not found", 404);
    return user;
  }

  async getPreferences(userId: string): Promise<IUserPreferences> {
    const user = await RepositoryProvider.userRepository.findById(userId);
    if (!user) throw new ApiError("User not found", 404);
    return user.preferences || {};
  }
}
