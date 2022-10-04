import axios from "axios";

const apiRequest = axios.create({
  baseURL: "http://localhost:5001/api/v1",
});

const createAPIRequest = () => apiRequest;

export { createAPIRequest };
