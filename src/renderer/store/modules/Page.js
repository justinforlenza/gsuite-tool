const state = {
    loading: false,
    error: {
        state: false,
        message: null
    }
}

const mutations = {
    LOADING_BEGIN(state) {
        state.loading = false
    },
    LOADING_END(state, payload = {error: false, message: null}) {
        state.loading = false
        state.error.state = payload.error
        state.error.message = payload.message
    },
}

export default {
    state,
    mutations,
}
