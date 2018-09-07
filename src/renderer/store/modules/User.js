const state = {
    firstName: null,
    lastName: null,
    email: null,
    picture: null,
    organization: {
        name: null,
        domains: []
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
    SET_ORG_NAME(state, name) {
        state.organization.name = name
    },
    ADD_ORG_DOMAIN(state, domain) {
        state.organization.domains.push(domain)
    },
}

const actions = {
    login(context){

    }
}

export default {
    state,
    mutations,
    actions
}
