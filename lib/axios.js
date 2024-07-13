import axios from "axios";

const domain = process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN_NAME;
const baseURL = domain ? domain + "/api" : "http://localhost:3000/api";

export const axiosInstance = axios.create({
  baseURL: baseURL,
});
