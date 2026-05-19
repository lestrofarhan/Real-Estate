import prisma from "../lib/prisma.js";

export const getPosts = async (req, res) => {
    const { query } = req;

    try {
        const posts = await prisma.post.findMany({
            where: {
                city: query.city || undefined,
                type: query.type || undefined,
                property: query.property || undefined,
                bedrooms: parseInt(query.bedrooms) || undefined,
                price: {
                    gte: parseInt(query.minPrice) || undefined,
                    lte: parseInt(query.maxPrice) || undefined,
                },
            }
        })

        if (posts.length === 0) {
            return res.status(404).json({ message: "No posts found" });
        }

        res.status(200).json(posts);

    } catch (error) {
        console.log(err);
        res.status(500).json({ message: "Failed to get posts" });
    }


}
export const getPost = async (req, res) => {

    const { id } = req.params;

    try {
        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                postDetail: true,
                user: {
                    select: {
                        username: true,
                        avatar: true,
                    },
                },
            },
        });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json(post);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to get post" });
    }

}



export const addPost = async (req, res) => {
    const userId = req.userID;
    const body = req.body;

    try {
        const newPost = await prisma.post.create({
            data: {
                ...body.postData,
                userId: userId,
                postDetail: {
                    create: body.postDetail
                }
            }
        })

        res.status(200).json(newPost);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to add post" });
    }

}


export const updatePost = async (req, res) => {
    const postID = req.params.id;
    const body = req.body;
    const userID = req.userID;

    try {
        const post = await prisma.post.findUnique({
            where: { id: postID },
        });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.userId !== userID) {
            return res.status(403).json({ message: "You are not authorized to update this post" });
        }
        await prisma.post.update({
            where: { id: postID },
            data: {
                ...body.postData,
                postDetail: {
                    update: body.postDetail
                }
            },
        });

        res.status(200).json({ message: "Post updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to update post" });
    }


}
export const deletePost = async (req, res) => {
    const postID = req.params.id;
    const userID = req.userID;

    try {
        const post = await prisma.post.findUnique({
            where: { id: postID },
        });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.userId !== userID) {
            return res.status(403).json({ message: "Not Authorized!" });
        }

        // the YT didn't mention this but we also need to delete the post details and any saved entries for this post to avoid orphaned records and maintain data integrity. We can do this in a transaction to ensure all related deletions succeed or fail together.

        await prisma.$transaction([

            // Delete the post details first
            prisma.postDetail.deleteMany({
                where: { postId: postID },
            }),
            // Delete any bookmarks/saved entries for this post
            prisma.savedPost.deleteMany({
                where: { postId: postID },
            }),
            // Finally, delete the main Post
            prisma.post.delete({
                where: { id: postID },
            }),
        ]);


        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to delete post" });
    }
}