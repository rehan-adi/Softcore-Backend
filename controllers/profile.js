import userModel from "../models/Blog_user.model.js";
import postModel from "../models/post.model.js";


// create profile 
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const checkProfile = await userModel.findById(userId).select("-password");

    if (!checkProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    const userPosts = await postModel.find({ author: userId }).populate('author', 'username profilePicture fullname').populate('image');

    return res.status(200).json({
      success: true,
      profile: checkProfile,
      postCount: userPosts.length,
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

// update profile
export const updateProfile = async (req, res) => {
  try {
    const { username, bio } = req.body;
    // const image = req.file ? `/uploads/${req.file.filename}` : null;
    const image = req.file ? req.file.path : null;
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
      ...(image && { profilePicture: image }), // Update profile picture if provided
      ...(bio && { bio }), // Update bio if provided
    };

    const updatedProfile = await userModel.findByIdAndUpdate(
      userId,
      updatedProfileData,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      profile: updatedProfile,
      message: "Profile updated successfully",
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

// get other users profile
export const getUsersProfile = async(req, res) => {
   try {
     const userId = req.params.id;
     const profile = await userModel.findById(userId);

     if(!profile) {
       return res.status(404).json({
         success: false,
         message: "User Profile not found",
       });
     };

     const userPosts = await postModel.find({ author: userId });

     return res.status(200).json({
       success: true,
       profile: profile,
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