import axios from 'axios';
import { toast } from 'react-toastify';

//this function handles the error response from the API in cases where the token is invalid or not found
async function handleAPIError(error) {
    console.log(error.response);
    const invalidMessages = ["Invalid Token", "Token not found", "You are not authorized to access this route"];
    if (error.response && error.response.data && error.response.data.success === false && invalidMessages.includes(error.response.data.message)) {
        toast.error("Please login to continue");
        localStorage.clear();
        setTimeout(() => {
            window.location.href = "/";
        }, 1000);
    } else {
        console.log(error);
    }
    throw error; // Re-throw error for the caller to handle if needed
}

export async function fetchAPI(apiRoute) {
    try {
        let response = await axios.get(apiRoute, { withCredentials: true });
        return response;
    } catch (error) {
        await handleAPIError(error);
    }
}

export async function postAPI(apiRoute, data = {}) {
    try {
        let response = await axios.post(apiRoute, data, { withCredentials: true });
        return response;
    } catch (error) {
        await handleAPIError(error);
    }
}

export async function deleteAPI(apiRoute) {
    try {
        let response = await axios.delete(apiRoute, { withCredentials: true });
        return response;
    } catch (error) {
        await handleAPIError(error);
    }
}

export async function putAPI(apiRoute, data = {}) {
    try {
        let response = await axios.put(apiRoute, data, { withCredentials: true });
        return response;
    } catch (error) {
        await handleAPIError(error);
    }
}

//This function fetches data from the specified endpoint and sets the state with the specified dataKey and shows the errorMessage if any error occurs
export async function fetchData(endpoint, setterFunction, dataKey, errorMessage) {
    try {
        const response = await fetchAPI(endpoint);
        if (response.data.success) {
            setterFunction(response.data[dataKey]); // Set the state with the specified dataKey
        } else {
            toast.error(response.data.message);
        }
    } catch (err) {
        toast.error(`${errorMessage}, error ${err.message}`);
    }
};

export async function postData(endpoint, data, errorMessage, successCallback) {
    try {
        const response = await postAPI(endpoint, data);
        console.log(response.data);
        if (response.data.success) {
            toast.success(response.data.message);
            successCallback(); // Call the successCallback function if the request is successful
        }
        else
            toast.error(response.data.message);
    }
    catch (err) {
        toast.error(`${errorMessage}, error: ${err.response.data.message}`);
    }
}

export async function DeleteData(endpoint, errorMessage, successCallback) {
    try {
        const response = await deleteAPI(endpoint);
        console.log(response.data);
        if (response.data.success) {
            toast.success(response.data.message);
            successCallback(); // Call the successCallback function if the request is successful
        }
        else
            toast.error(`${errorMessage}, error : ${response.data.message}`);
    }
    catch (err) {
        toast.error(`An error occurred while deleting the assignment, err: ${err}`);
    }
}

