const {Router} = require('express')

const {createPost, getPosts, getPost, getCatPosts, getUserPosts, editPost, removePost,getAllCommentsForPost} = require('../controllers/postControllers');
const { addComment, deleteComment } = require('../controllers/postControllers');

const authMiddleware = require('../middleware/authMiddleware');

const router = Router();

router.post('/', authMiddleware, createPost);
router.get('/', getPosts);
router.get('/:id', getPost);
router.patch('/:id', authMiddleware, editPost);
router.delete('/:id', authMiddleware, removePost);
router.get('/categories/:category', getCatPosts)
router.get('/users/:id', getUserPosts)
router.post('/:id/comments', authMiddleware, addComment);
router.get('/:id/comments',  getAllCommentsForPost);
router.delete('/:id/comments/:commentId', authMiddleware, deleteComment);

module.exports = router;