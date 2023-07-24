import Vue from 'vue'
import axios from 'axios'

Vue.prototype.$axios = axios
axios.defaults.headers.common["Content-Type"] = "application/json"

export const axiosInstance = axios.create({
  baseURL: process.env.BASE_URL,
  withCredentials: false,
  headers: {
    Accept: "application/json"
  },
});

export const anotherAxiosInstance = () => {
  const cashDrawerAPIPort = JSON.parse(
    localStorage.getItem("CashdrawerAPIPortLocalStorage")
  );

  return axios.create({
    baseURL: `http://localhost:${cashDrawerAPIPort ? cashDrawerAPIPort : 8080}/`,
    withCredentials: false,
    headers: {
      Accept: "application/json"
    },
  });
}
