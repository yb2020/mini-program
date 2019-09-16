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
		appName: ''
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
			uni.setStorage({
				key: "systemParams",
				data: initParams
			})
		},
        login(state, user) {
			
			state.token = user.token
			state.avatarUrl = user.avatarUrl
			state.username = user.username
			state.nickName = user.nickName
			state.isLogin = true
			
			if(!user.isLogin) {
				uni.setStorage({
					key: "userInfo",
					data: user
				})
			}
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