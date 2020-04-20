const express = require('express');
// import db
const db = require('./data/db.js');

const router = express.Router();

// Get All Posts
router.get('/', (req, res) => {
    const posts = db.find()

    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
        error: "The posts information could not be retrieved"
        })
    })
})

// Get Single Post

router.get('/:id', (req, res) => {
    postId = req.params.id
    db.findById(postId)
        .then(post => {
            if (!post.length) {
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            } else {
                res.status(200).json(post)
            }
        })
        .catch(err => {
            res.status(500).json({
                error: "The comments information could not be retrieved."
            })
        })
})

// Get All Comments For Specified ID

router.get('/:id/comments', (req, res) => {
    postId = req.params.id
    db.findPostComments(postId)
        .then(comments => {
            if (comments) {
                res.status(200).json(comments)
            } else {
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: "The comments information could not be retrieved."
            })
        })
})

// Delete Post With Specified ID

router.delete('/:id', (req, res) => {

    // db.findById(req.params.id)
    //     .then(post => {
    //         if (!post) {
    //             res.status(404).json({
    //                 message: "The post with the specified ID does not exist."
    //             })
    //         } else {
    //             db.remove(req.params.id)
    //                 .then(prom => {
    //                     res.status(200).json({
    //                         deletedRecords: prom, message: "The post has been deleted"
    //                     })
    //                 })
    //                 .catch(err => {
    //                     res.status(500).json({
    //                         error: "The post could not be removed"
    //                     })
    //                 })

    //         }
    //     })
    //     .catch(err => {
    //         res.status(500).json({
    //             message: "Error."
    //         })
    //     })

    db.remove(req.params.id)
        .then(post => {
            if (post === 0) {
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            } else {
                // deletedPost = db.findById(req.params.id)
                res.status(200).json({ message: "This post has been deleted"})
            }
        })
        .catch(err => {
            res.status(500).json({
                error: "The post could not be removed"
            })
        })
    
})

// Create Post
router.post('/', (req, res) => {
    if ((req.body.title) && (req.body.contents)) {
        db.insert(req.body)
            .then(post => {
                res.status(201).json(req.body)
            })
            .catch(err => {
                res.status(500).json({
                    error: "There was an error while saving the post to the database"
                })
            })
    } else {
        res.status(400).json({
            errorMessage: "Please provide title and contents for the post."
        })
    }
})

// Create Comment
router.post('/:id/comments', (req, res) => {
    // comment = { ...req.body, post_id: req.}
    db.findById(req.params.id)
        .then(post => {
            if (!post.length) {
                res.status(404).json({
                    id: req.params.id, message: "The post with the specified ID does not exist."
                })
            } else if (!req.body.text) {
                res.status(400).json({
                    errorMessage: "Please provide text for the comment."
                })
            } else {
                db.insertComment({ ...req.body, post_id: req.params.id }) // remove post_id?
                    .then(obj => {
                        res.status(201).json(obj)
                        })
                    .catch(err => {
                        res.status(500).json({
                            error: "There was an error while saving the comment to the database."
                        })
                    })
            } 
        })
        .catch(err => {
            res.status(500).json(err)
        })
})

module.exports = router;