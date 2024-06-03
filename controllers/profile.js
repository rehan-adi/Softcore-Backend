import userModel from "../models/Blog_user.model.js";
import postModel from "../models/post.model.js";

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const checkProfile = await userModel.findById(userId);

    if (!checkProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    const userPosts = await postModel.find({ author: userId });

    return res.status(200).json({
      success: true,
      profile: checkProfile,
      posts: userPosts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get profile",
      error: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { username, profilePicture, bio } = req.body;
    const userId = req.user.id;
    const profile = await userModel.findById(userId);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    const updatedProfileData = {
      ...(username && { username }), // Update username if provided
      ...(profilePicture && { profilePicture }), // Update profile picture if provided
      ...(bio && { bio }), // Update bio if provided
    };

    const updatedProfile = await userModel.findByIdAndUpdate(
      userId,
      updatedProfileData,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get profile",
      error: error.message,
    });
  }
};
