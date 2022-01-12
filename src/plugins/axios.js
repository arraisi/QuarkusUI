"use strict";

import Vue from 'vue';
import axios from "axios";

axios.defaults.baseURL = "";

if (window.location.origin.includes("localhost")) {
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = "http://localhost:9090/theta";
}

axios.interceptors.request.use(
  request => {
    // this.load();
    return request;
  },
  error => {
    // this.unload();
    let notification = { title: "Unknown error", content: "" };
    if (error.response) {
      if (error.response.status === 400) {
        notification.title = "Bad request";
      } else if (error.response.status === 500) {
        notification.title = "Server error";
      } else if (error.response.status === 401) {
        notification.title = "Unauthorized";
      } else if (error.response.status === 403) {
        console.log("forbidden");
        notification.title = "Forbidden";
      } else if (error.response.status === 404) {
        notification.title = "Not found";
      } else {
        notification.title = "Notification (" + error.response.status + ")";
      }
      notification.content = error.response.data;
    }
    this.$store.commit("showNotification", notification);
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response;
  },
  function (error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

Vue.use(axios)

export default axios;
