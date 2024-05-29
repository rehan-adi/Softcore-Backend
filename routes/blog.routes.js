import express from 'express';
import { createBlog, getAllBlogPosts, updateBlog, deleteBlog } from '../controllers/blog.js';

//middlware to check login
import checkLogin from '../middleware/auth.middleware.js'

const blogRouter = express.Router();

// Route to create a new blog post, requires user to be logged in
blogRouter.post('/create', checkLogin, createBlog);

// Route to get all blog posts
blogRouter.get('/allblogs', getAllBlogPosts);

// Route to update a blog post by ID, requires user to be logged in
blogRouter.patch('/update/:id', checkLogin, updateBlog);

// Route to delete a blog post by ID, requires user to be logged in
blogRouter.delete('/delete/:id', checkLogin, deleteBlog);


export default blogRouter;