import { login, logout, getInfo } from "@/api/user";
import { resetRouter } from "@/router";

const state = {
  token: localStorage.getItem("token_key"),
  name: "",
  avatar: ""
};

const mutations = {
  RESET_STATE: state => {
    state.token = "";
    state.name = "";
    state.avatar = "";
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_USER_INFO: (state, userInfo) => {
    state.name = userInfo.name;
    state.avatar = userInfo.avatar;
  }
};

const actions = {
  // user login
  async login({ commit }, userInfo) {
    const { username, password } = userInfo;
    const result = await login({
      username: username.trim(),
      password: password
    });
    if (result.code === 20000 || result.code === 200) {
      localStorage.setItem("token_key", result.data.token);
      commit("SET_TOKEN", result.data.token);
      return "ok";
    } else {
      return Promise.reject(new Error("failed"));
    }
  },

  // get user info
  async getInfo({ commit, state }) {
    const result = await getInfo(state.token);
    if (result.code === 20000 || result.code === 200) {
      commit("SET_USER_INFO", result.data);
      return "ok";
    } else {
      return Promise.reject(new Error("failed"));
    }
  },

  // user logout  remove token
  async logout({ commit, state }) {
    const result = await logout(state.token);
    if (result.code === 20000 || result.code === 200) {
      localStorage.removeItem("token_key");
      resetRouter();
      commit("RESET_STATE");
    } else {
      return Promise.reject(new Error("failed"));
    }
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
