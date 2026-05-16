
import apiRequest from "./apiRequest";


export const singlePageLoader = async ({ params }) => {
    try {
        const res = await apiRequest(`/posts/${params.id}`);
        return { property: res.data };
    } catch (error) {   
        console.log(error)
    }   
}

export const listPageLoader = async ({request, params}) => { 
    try {
        const query = request.url.split("?")[1];
        const postPromise = apiRequest("/posts?" + query);
        return {
            postResponse: postPromise,
        };
    } catch (error) {
        console.log(error)
    }
}


export const profilePageLoader = async () => {
    const postPromise = apiRequest("/users/profilePosts");
    const chatPromise = apiRequest("/chats");
    return {
        postResponse: postPromise,
        chatResponse: chatPromise,
    };
};