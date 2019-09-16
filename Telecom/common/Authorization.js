import userApi from "./user"
import store from '@/store'

export default {
	wx:{
		login() {
			let _this = this;
			uni.showLoading({
				title: '登录中...'
			});
		 
		   // 1.wx获取登录用户code
			uni.login({
				provider: 'weixin',
				success: function(loginRes) {
					let code = loginRes.code;
					// console.log(code)
					// console.log(store.state.orgId)
					userApi.authorization.wxLogon({code: code, orgId: store.state.orgId, appName: store.state.appName}).then(result => {
						//console.log(result)
						//先登录微信，拿到openId后，给用户提示登录成功
						let openId = result.openId
						let unionid = result.unionid
						if(!unionid && openId) {
							uni.hideLoading();
							uni.showLoading({
								title: '初始化用户信息...'
							});
							
							//微信需要登录成功后，才能根据信息拿到unionid
							uni.getUserInfo({
								withCredentials: true,
								success: function(infoRes) {
									let nickName = infoRes.userInfo.nickName; //昵称
									let avatarUrl = infoRes.userInfo.avatarUrl; //头像
									//JSON.stringify()
									//通过拿到的用户信息，后台去找用户相关的unionid,同时，如果unionid在平台中不存在，那么初化一个用户并绑定到这个用户的unionid
									userApi.authorization.getWxUserInfo({
										sessionKey: result.sessionKey ,
										rawData: infoRes.rawData,
										signature: infoRes.signature ,
										encryptedData: infoRes.encryptedData ,
										iv: infoRes.iv,
										orgId: store.state.orgId, 
										appName: store.state.appName
									}).then(result2 => {
										store.commit("login", {
											nickName: nickName,
											avatarUrl: avatarUrl,
											token: result2.token,
											username: result2.username,
											isLogin: true
										})
										uni.hideLoading()
										//console.log(store.state.token)
										uni.navigateTo({
											url: '/pages/telecom/index'
										})
										//console.log(result)
									})
									
								},
								fail(res) {}
							});
						}else {
							uni.showModal({
								title: "提示",
								content: "登录失败！",
								success: () => {
									//TODO: 退出小程序
								}
							})
							
							
						}
						
						
					}).catch(e => {
						console.log(e)
					})
		
				},
			});
		}
	}
}
				
			 
			  
				