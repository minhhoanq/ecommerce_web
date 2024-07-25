import axios from "axios";
const instance = axios.create({
    baseURL: "http://localhost:8000/api/v1",
});

// Add a request interceptor
instance.interceptors.request.use(
    function (config) {
        // Do something before request is sent
        let localStorageData = window.localStorage.getItem("persist:shop/user");
        if (localStorageData && typeof localStorageData === "string") {
            localStorageData = JSON.parse(localStorageData);
            console.log("localStorageData", localStorageData);
            const accessToken = JSON.parse(localStorageData?.token);
            config.headers = { authorization: `Bearer ${accessToken}` };
            const user = JSON.parse(localStorageData?.current);
            console.log(user);
            console.log(JSON.parse(localStorageData?.current));
            config.headers["x-client-id"] = `${user?.id ? user?.id : null}`;
            return config;
        } else return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Add a response interceptor
instance.interceptors.response.use(
    function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response.data;
    },
    function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return error.response.data;
    }
);

export default instance;
