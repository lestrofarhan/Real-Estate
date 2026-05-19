import prisma from "../lib/prisma.js"

export const getChats =  async (req,res) => {
    const { userID } = req
    
    try {
        const chats = await prisma.chat.findMany({
            where: {
                userIDs: {
                    hasSome: [userID],
                },
            },
        });

        for (const chat of chats) { 
            const recieverId = chat.userIDs.find(userId => userId !== userID);

            const reciever = await prisma.user.findUnique({
                where: { id: recieverId },
                select: { username: true, id: true , avatar: true},
            })

            chat.reciever = reciever;
        }

        res.status(200).json(chats);
        
    } catch (error) {
        console.log(err);
        res.status(500).json({ message: "Failed to get chats!" });
    }
}


export const addChat = async (req, res) => {
    const tokenUserId = req.userID;
    const receiverId = req.body.receiverId;

    if (!receiverId) {
        return res.status(400).json({ message: "Receiver ID is required!" });
    }

    try {

        const chat = await prisma.chat.findFirst({
            where: { userIDs: { hasEvery: [tokenUserId, receiverId] } },
        });

        if (chat) {
            return res.status(200).json(chat);
        }
        const newChat = await prisma.chat.create({
            data: {
                userIDs: [tokenUserId,receiverId],
            },
        });
        res.status(200).json(newChat);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to add chat!" });
    }
};

export const getChat = async (req, res) => {
    const userID = req.userID;
    const chatId = req.params.id;

    try {
        const chat = await prisma.chat.findUnique({
            where: { id: chatId, userIDs: { hasSome: [userID] } },
            select: {
                seenBy: true,
                id: true,
                messages: {
                    orderBy: { createdAt: "asc" },
                }
            }
        })

        await prisma.chat.update({
            where: { id: chatId },
            data: {
                seenBy: {
                    push: userID,
                },
            },
        });

        res.status(200).json(chat);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get chat!" });
    }
}
 
export const readChat = async (req, res) => {
    const userID = req.userID;
    const chatId = req.params.id;


    try {
        const chat = await prisma.chat.update({
            where: { id: chatId },
            data: {
                seenBy: {
                    push: userID,
                },
            },
        });
        res.status(200).json(chat);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to read chat" });
    }

}