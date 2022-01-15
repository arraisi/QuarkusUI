"use strict";

import Vue from 'vue';
import axios from "axios";

axios.defaults.baseURL = "";

if (window.location.origin.includes("localhost")) {
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = "http://localhost:9090";
}

Vue.use(axios)

export default axios;
