const state = {
    firstName: null,
    lastName: null,
    email: null,
    picture: null,
    organization: {
        name: null,
        domains: [],
        users: []
    },
    authenticated: false
}

const mutations = {
    SET_USER_DATA(state, data) {
        state.firstName = data.ofa
        state.lastName = data.wea
        state.picture = data.Paa
        state.email = data.U3
        state.authenticated = true
    },
    RESET_USER_DATA(state) {
        state.firstName = null
        state.lastName = null
        state.picture = null
        state.email = null
        state.authenticated = false
    },
    SET_ORG_NAME(state, name) {
        state.organization.name = name
    },
    ADD_ORG_DOMAIN(state, domain) {
        state.organization.domains.push(domain)
    },
    RESET_ORG_USERS(state) {
        state.organization.users = []
    },
    ADD_ORG_USER(state, user){
        state.organization.users.push(user)
    }
}

const actions = {}

export default {
    state,
    mutations,
    actions
}
