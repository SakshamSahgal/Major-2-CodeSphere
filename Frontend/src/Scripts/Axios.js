import axios from 'axios';
import { toast } from 'react-toastify';

export async function fetchAPI(apiRoute) {
    try {
        let response = await axios.get(apiRoute, { withCredentials: true });
        return response;
    } catch (error) {
        console.log(error.response);
        const invalidMessages = ["Invalid Token", "Token not found", "You are not authorized to access this route"];
        if (error.response.data.success === false && invalidMessages.includes(error.response.data.message)) {
            toast.error("Please login to continue");
            localStorage.clear();
            setTimeout(() => {
                window.location.href = "/";
            }, 1000);
        } else
            console.log(error)
        throw error; // Re-throw error for the caller to handle if needed
    }
}

export async function deleteAPI(apiRoute) {
    try {
        let response = await axios.delete(apiRoute, { withCredentials: true });
        return response;
    } catch (error) {
        console.log(error.response);
        const invalidMessages = ["Invalid Token", "Token not found", "You are not authorized to access this route"];
        if (error.response.data.success === false && invalidMessages.includes(error.response.data.message)) {
            toast.error("Please login to continue");
            localStorage.clear();
            setTimeout(() => {
                window.location.href = "/";
            }, 1000);
        } else
            console.log(error)
        throw error; // Re-throw error for the caller to handle if needed
    }
}