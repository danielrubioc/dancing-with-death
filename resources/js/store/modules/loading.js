const LOADING_ON = "LOADING_ON";
const LOADING_OFF = "LOADING_OFF";

// initial state
const state = {
    isLoading: false
}

// getters
const getters = {
    isLoading: state => {
        return state.isLoading
    }
}

// actions
const actions = {
    initLoading({ commit }) {
        commit(LOADING_ON); 
    },
    endLoading({ commit }) {
        commit(LOADING_OFF);
    }
}

// mutations
const mutations = {
    [LOADING_ON] (state) {
        state.isLoading = true;
        console.log("init");
    },
    [LOADING_OFF] (state) {
        state.isLoading = false;
        console.log("end");
    },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}