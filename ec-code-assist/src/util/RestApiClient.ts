import axios from 'axios';







const baseApiUrl = "http://localhost:11434/api";

// callRestAPI(chatEndpoint, 'POST', chatQueryData)
//     .then((reply) => {showResponse(reply)})
//     .then(() => console.log("======================================"));

/**
 * 
 * @param url 
 * @param method 
 * @param data 
 * @returns 
 */
async function callRestAPI(url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', data?: any) {
    try {
        const response = await axios({
            method,
            url,
            data,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

