import axios from "axios";

const API = axios.create({
  baseURL: `${window.location.protocol}//${window.location.hostname}:5001/api`,
});

export default API;
