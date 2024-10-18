import { ZodError } from 'zod';
import mongoose from 'mongoose';
import { Request, Response } from 'express';
import postModel from '../models/post.model.js';
import categoryModel from '../models/category.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { createBlogValidation } from '../validations/blog.validation.js';

// create a new blog
export const createBlog = async (req: Request, res: Response) => {
    try {
        // Parse and validate the request body using Zod
        const parsedData = createBlogValidation.parse(req.body);
        const { content, tags, category } = parsedData;
        const author = req.user?.id;

        // Handle file upload if present
        const image = req.file ? req.file.path : null;
        console.log(image);

        // Check if the category already exists, if not, create it
        let categoryName = await categoryModel.findOne({ name: category });
        if (!categoryName) {
            categoryName = new categoryModel({ name: category });
            await categoryName.save();
        }

        let imageUrl = null;

        if (req.file) {
            try {
                const uploadedImage = await uploadOnCloudinary(req.file.path);
                imageUrl = uploadedImage ? uploadedImage.secure_url : null;
                console.log('Uploaded Image URL:', imageUrl);
            } catch (uploadError) {
                return res.status(500).json({
                    success: false,
                    message: 'Image upload to Cloudinary failed',
                    error: uploadError instanceof Error ? uploadError.message : 'Unknown error'
                });
            }
        }  else {
            console.log('No file received'); // Log if no file is received
        }

        // Create a new blog post
        const newBlog = await postModel.create({
            content,
            author,
            image: imageUrl,
            tags,
            category: categoryName._id
        });

        console.log('Uploaded Image URL:', imageUrl);

        // Respond with the created blog details
        return res.status(201).json({
            success: true,
            data: {
                content: newBlog.content,
                author: newBlog.author,
                image: imageUrl,
                tags: newBlog.tags,
                category: categoryName.name
            },
            message: 'Blog created successfully'
        });
    } catch (error) {
        // Handle validation errors from Zod
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: error.errors.map((e) => e.message)
            });
        }
        // Log the error and return a server error response
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create blog',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// get all blog
export const getAllBlogPosts = async (req: Request, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const skip = (page - 1) * limit;

    try {
        const allBlogPosts = await postModel
            .find()
            .skip(skip)
            .limit(limit)
            .populate({
                path: 'author',
                select: 'username profilePicture fullname',
                model: 'User'
            })
            .populate('category', 'name');
        const totalBlogPosts = await postModel.countDocuments();
        return res.status(200).json({
            success: true,
            data: {
                blogPost: allBlogPosts
            },
            pagination: {
                total: totalBlogPosts,
                page,
                limit,
                totalPages: Math.ceil(totalBlogPosts / limit)
            },
            message: 'All blogs retrieved successfully'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get all blog posts',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// get post by id 
export const getPostsById = async (req: Request, res: Response) => {
    const postId = req.params.postId;

    try {
        const postExists = await postModel.findById(postId);

        if (!postExists) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        const posts = await postModel
            .findById(postId)
            .populate('author', 'fullname')

        return res.status(200).json({
            success: true,
            data: {
                posts
            },
            message: 'Posts retrieved successfully'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get post details',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// get posts by category
export const getPostsByCategory = async (req: Request, res: Response) => {
    const categoryId = req.params.categoryId;

    try {
        const categoryExists = await categoryModel.findById(categoryId);

        if (!categoryExists) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        const posts = await postModel
            .find({ category: categoryId })
            .populate('author', 'name')
            .populate('category', 'name');

        return res.status(200).json({
            success: true,
            data: {
                posts
            },
            message: 'Posts retrieved successfully'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get posts by category',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// update a blog post
export const updateBlog = async (req: Request, res: Response) => {
    try {
        const postId = req.params.id;
        const userId = req.user?.id;

        const parsedData = createBlogValidation.partial().parse(req.body);

        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Failed to update: Post not found'
            });
        }

        if (post.author?.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this post'
            });
        }

        const updatedPost = await postModel.findByIdAndUpdate(
            postId,
            { $set: parsedData },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({
                success: false,
                message: 'Failed to update: Post not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                post: updatedPost
            },
            message: 'Blog post updated successfully'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update blog',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// delete a blog post
export const deleteBlog = async (req: Request, res: Response) => {
    try {
        const postId = req.params.id;
        const userId = req.user?.id;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res
                .status(400)
                .json({ success: false, message: 'Invalid post ID' });
        }

        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Failed to delete: Post not found'
            });
        }

        if (post.author?.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this post'
            });
        }

        const deletePost = await postModel.findByIdAndDelete(postId);

        if (!deletePost) {
            return res.status(404).json({
                success: false,
                message: 'Failed to delete: Post not found'
            });
        }

        return res.status(200).json({
            success: true,
            deletedPostId: postId,
            message: 'Post deleted successfully'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete blog post',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
