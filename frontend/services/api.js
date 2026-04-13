import axios from "axios";

const API = axios.create({
  baseURL: "https://recruit-flow-autonomous-hr-system.onrender.com",
});

export default API;