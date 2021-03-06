import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({  
    state: {  
        isLogin: false,  
        token: '',  
        avatarUrl: '',
		nickName: '',
        username: '',
		orgId: '',
		appName: '',
		isAgent: false,
		agent: '',
		expiresAt: 0,
		level: -1
    },
	actions: {
		login(params) {
			return params
		}
	},
    mutations: {
		init(state, initParams) {
			state.orgId = initParams.orgId
			state.appName = initParams.appName
			state.agent = initParams.agent
			uni.setStorage({
				key: "systemParams",
				data: initParams
			})
		},
		setInit(state, initParams) {
			state.orgId = initParams.orgId
			state.appName = initParams.appName
			state.agent = initParams.agent
		},
        login(state, user) {
			state.token = user.token
			state.avatarUrl = user.avatarUrl
			state.username = user.username
			state.nickName = user.nickName
			state.agent = user.agent
			state.isAgent = user.isAgent
			state.isLogin = true
			state.level = user.level
			state.expiresAt = user.expiresAt
			
			//let storeUser = uni.getStorageSync("userInfo") 
			uni.setStorage({
				key: "userInfo",
				data: user
			})
			
        }, 
		refreshUserInfo(state, user) {
			state.token = user.token
			state.avatarUrl = user.avatarUrl
			state.username = user.username
			state.nickName = user.nickName
			state.agent = user.agent
			state.isAgent = user.isAgent
			state.isLogin = true
			state.level = user.level
			state.expiresAt = user.expiresAt
		},
		refreshToken(state, token) {
			state.token = token
			uni.getStorage({
				key: "userInfo",
				success:(res) => {
					res.token = token
					uni.setStorage({
						key: "userInfo",
						data: res
					})
				}
			})
		}, 
        logout(state) {  
			state.isLogin = false
			state.token = '' 
			state.avatarUrl = ''
			state.nickName = ''
			state.username = ''
			state.orgId = ''
			state.appName = ''
        }  
    }  
})

export default store