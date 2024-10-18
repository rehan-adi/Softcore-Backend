import express from 'express';
import upload from '../middlewares/multer.middleware.js';
import {
    createBlog,
    getAllBlogPosts,
    getPostsByCategory,
    updateBlog,
    deleteBlog,
    getPostsById
} from '../controllers/blog.js';

//middlware to check login
import { checkLogin } from '../middlewares/auth.middleware.js';

const blogRouter = express.Router();

// Route to create a new blog post, requires user to be logged in
blogRouter.post('/create', checkLogin, upload.single('image'), createBlog);

// Route to get all blog posts
blogRouter.get('/post/allpost', getAllBlogPosts);

// Get one post by ID
blogRouter.get('/post/:postId', getPostsById);

// Route to get posts by category
blogRouter.get('/category/:categoryId', getPostsByCategory);

// Route to update a blog post by ID, requires user to be logged in
blogRouter.patch('/update/:id', checkLogin, updateBlog);

// Route to delete a blog post by ID, requires user to be logged in
blogRouter.delete('/delete/:id', checkLogin, deleteBlog);

export default blogRouter;
