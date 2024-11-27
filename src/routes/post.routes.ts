import express from 'express';
import upload from '../middlewares/multer.middleware.js';
import {
    createPost,
    getAllPosts,
    updatePost,
    deletePost,
    getPostsById,
    getPostsByCategory
} from '../controllers/post.js';

//middlware to check login
import { checkLogin } from '../middlewares/auth.middleware.js';

const postRouter = express.Router();

// Route to create a new blog post, requires user to be logged in
postRouter.post('/create', checkLogin, upload.single('image'), createPost);

// Route to get all blog posts
postRouter.get('/allpost', getAllPosts);

// Get one post by ID
postRouter.get('/post/:postId', getPostsById);

// Route to get posts by category
postRouter.get('/category/:categoryId', getPostsByCategory);

// Route to update a blog post by ID, requires user to be logged in
postRouter.patch('/update/:id', checkLogin, updatePost);

// Route to delete a blog post by ID, requires user to be logged in
postRouter.delete('/delete/:id', checkLogin, deletePost);

export default postRouter;
