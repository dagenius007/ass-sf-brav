export const state = () => ({
  users: [],
});

export const mutations = {
  add(state, users) {
    state.users = users;
  },
};

export const getters = {
  getUsers(state) {
    return state.users;
  },
};
