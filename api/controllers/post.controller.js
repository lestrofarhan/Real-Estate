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

        res.status(200).json(posts);

    }catch (error) {
        console.log(err);
        res.status(500).json({ message: "Failed to get posts" });
    }


}
export const getPost = async (req, res) => {

    res.send("Get all posts");

}


export const addPost = async (req, res) => {
    const userId = req.userID;
    const body = req.body;

    try {
        const newPost = await prisma.post.create({
            date: {
                ...body.postData,
                userId: userId,
                postDetails: {
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

    res.send("Get all posts");

}
export const deletePost = async (req, res) => {

    res.send("Get all posts");

}