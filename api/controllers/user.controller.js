import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";



export const deleteUser = async (req, res) => {

    const { id } = req.params;
    const userID = req.userID;
    const { password, avatar, ...inputs } = req.body;

    if (userID !== id) {
        return res.status(403).send("User not Authorized");
    }

    try {

        await prisma.user.delete({
            where: { id }
        })

        res.status(200).send("User deleted successfully");
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).send("Failed to delete user");
    }


}
export const getUser = async (req,res)=>{
    const { id } = req.params;
    if (!id) {
        return res.status(400).send("User ID is required");
    }


    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id
            }
        })

        if (!user) {
            return res.status(404).send("User not found");
        }
        
        const userwithoutPassword = (({ password, ...userWithoutPassword }) => userWithoutPassword)(user);

        if (!userwithoutPassword) {
            return res.status(404).send("User not found");
        }
        res.status(200).json(userwithoutPassword);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).send("failed to get User");
    }

}


export const getUsers = async (req,res)=>{
    try {
        const users = await prisma.user.findMany();

        const usersWithoutPassword = users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });


        if (!usersWithoutPassword) {
            return res.status(404).send("Users not found");
        }

        res.status(200).json(usersWithoutPassword);
    } catch (error) {
        res.status(500).send("failed to get Users");
    }
}



export const updateUser =  async (req, res) => {
    const { id } = req.params;
    const userID = req.userID;
    const { password, avatar, id : bodyId ,...inputs } = req.body;

    if (userID !== id) {
        return res.status(403).send("User not Authorized");
    }

    let updatedPassword = null;

    try {
        if (password) {
            updatedPassword = await bcrypt.hash(password, 10);
        }
        
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                ...inputs,
                ...(password && { password: updatedPassword }),
                ...(avatar && { avatar })
            }
        });

        const { password: _, ...userWithoutPassword } = updatedUser;

        res.status(200).json(userWithoutPassword);
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).send("Failed to update user");
    }

}




export const savePost = async (req,res)=>{

    const { postId } = req.body;
    const tokenuserId = req.userID

    try {
        const savedPost = await prisma.savedPost.findUnique({
            where: {
                userId_postId: {
                    userId: tokenuserId,
                    postId
                }
            }
        })

        if (savedPost) {
            await prisma.savedPost.delete({
                where: {
                    id: savedPost.id,
                }
            })
            res.status(200).json({ message: "Post removed from saved list" });
        } else {
            await prisma.savedPost.create({
                data: {
                    userId: tokenuserId,
                    postId,
                },
            });
            res.status(200).json({ message: "Post saved" });
        }
    } catch (error) {
        console.log("error: ", error)
        res.status(500).json({ message: "Failed to save post!" })
    }


}
export const profilePosts = async (req, res) => {
    const tokenuserId = req.userID;

    try {
        const userPosts = await prisma.post.findMany({
            where: {
                userId: tokenuserId
            }
        });

        const saved = await prisma.savedPost.findMany({
            where: { userId: tokenuserId },
            include: {
                post: true,
            },
        })
        
        const savedPosts = saved.map(item => item.post);

        res.status(200).json({ userPosts, savedPosts });
    } catch (error) {
        console.error("Error fetching user posts:", error);
        res.status(500).json({ message: "Failed to fetch user posts!" });
    }
};


export const getNotificationNumber = async (req, res) => {

    const tokenuserId = req.userID;

    try {
        const number = await prisma.chat.count({
            where: {
                userIDs: {
                    hasSome: [tokenuserId]
                },
                NOT: {
                    seenBy: {
                        hasSome: [tokenuserId]
                    }
                }
            }
        })

        res.status(200).json({ number });

    } catch (error) {
        console.error("Error fetching notification number:", error);
        res.status(500).json({ message: "Failed to fetch notification number!" });
    }
}



