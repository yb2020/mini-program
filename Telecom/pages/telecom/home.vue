<template name="index">
	<view>
		
		<cu-custom bgColor="bg-gradual-blue">
			<block slot="content">无忧开卡</block>
		</cu-custom>
		<scroll-view scroll-y class="page">
			<view class="screen-swiper-view">
				<swiper class="screen-swiper" :class="dotStyle?'square-dot':'round-dot'" :indicator-dots="true" :circular="true"
				 :autoplay="true" interval="5000" duration="500">
					<swiper-item @click="ad(item)" v-for="(item,index) in swiperList" :key="index">
						<image :src="item.url" mode="aspectFill" v-if="item.type=='image'"></image>
						<video :src="item.url" autoplay loop muted :show-play-btn="false" :controls="false" objectFit="cover" v-if="item.type=='video'"></video>
					</swiper-item>
				</swiper>
			</view>
		
		
			<view class="cu-bar bg-white solid-bottom margin-top">
				<view class="action">
					我的订单
				</view>
			</view>
			<view class="cu-list menu align-center" v-if="!myOrderList || myOrderList.length == 0">
				<view class="cu-item">
					<view class="text-gray">
						暂无数据
					</view>
				</view>
			</view>
			<view class="cu-list menu-avatar">
				<view class="cu-item" @tap="activeCard(order)" v-if="myOrderList && myOrderList.length > 0" v-for="(order,index) in myOrderList" :key="index">
					<view class="cu-avatar round lg" :style="'background-image:url(' + order.avatarUrl +');'"></view>
					<view class="content">
						<view class="text-black">{{order.nickName + "(" + order.contactMobile + ")"}}</view>
						<view class="text-gray text-sm flex">
							<view class="text-cut text-red" v-if="order.status == 'exception' || order.status == 'fail'">
								原因：{{order.reason}}
							</view>
							<view class="text-cut" v-if="order.status != 'exception' && order.status != 'fail'">
								订单号：{{order.orderNumber}}
							</view>
						</view>
					</view>
					<view class="action">
						<view class="text-grey text-xs">{{order.createDate}}</view>
						<!-- getStatusClass(status) {
							// waitSign("待实名", "waitSign"),
							// billing("提单中", "billing"), 
							// completed("完成","completed"), 
							// fail("失败","fail"), 
							// cancel("取消","cancel"), 
							// waitExamine("待审核","waitExamine"), 
							// waitChoosenNum("待选号","waitChoosenNum"), 
							// exception("异常", "exception");
							switch(status) {
								case 'cancel': return "bg-red"
								case 'completed': return "bg-green"
								case 'exception': return "bg-red"
								case 'fail': 
									return "bg-red"
								default: 
									return "bg-blue"
							}
							
						}, -->
						
						<view v-if="order.status == 'exception' || order.status == 'fail'" 
							class="cu-tag round bg-red sm">{{order.statusName}}</view>
						<view v-if="order.status == 'cancel'"
								class="cu-tag round bg-gray sm">{{order.statusName}}</view>
						<view v-if="order.status == 'waitSign' || order.status == 'billing' || order.status == 'waitExamine' || order.status == 'waitChoosenNum'"
							class="cu-tag round bg-blue sm">{{order.statusName}}</view>
						<view v-if="order.status == 'completed'" class="cu-tag round bg-blue sm">{{order.statusName}}</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<navigator open-type="exit" target="miniProgram" v-if="completeBtnSTtus" class="close-btn complete">完成</navigator>

		<!--view>
			<web-view :src="adurl"></web-view>
		</view-->
		<!--components></components-->
		<!--basics></basics-->
		<!--plugin></plugin-->
	</view>
</template>

<script>
	import telecomApi from "./api/telecom"
	import { formatTime, parseTime } from '@/utils'
	import Authorization from "@/common/Authorization"
	import ACLApi from '@/common/ACL'

	export default {
		data() {
			return {
				swiperList: [{
					id: 0,
					type: 'image',
					url: 'https://mmbiz.qpic.cn/mmbiz_png/kaI5jJfvU3KOtibaayPeRevJTPmjhsYec8anxfWuMF0mKwUOKRaqfhv3JwjFic62kMMvFGe6ag7kvV3sRdZZVCEQ/0?wx_fmt=png'
					//url: 'https://mmbiz.qpic.cn/mmbiz_png/kaI5jJfvU3KOtibaayPeRevJTPmjhsYec8anxfWuMF0mKwUOKRaqfhv3JwjFic62kMMvFGe6ag7kvV3sRdZZVCEQ/0?wx_fmt=png'
				// }, {
				// 	id: 1,
				// 	type: 'image',
				// 	url: 'https://mmbiz.qpic.cn/mmbiz_jpg/niblT1iaDrJFnHhkMnSnVqNC75bOH4P2CrhJjtfKFhfaQjmfJD341n5MiahZ0e1jRopOyqA4rBRwbtdZyu9Qjb9FQ/0',
				// }, {
				// 	id: 2,
				// 	type: 'image',
				// 	url: 'https://mmbiz.qpic.cn/mmbiz_jpg/niblT1iaDrJFnHhkMnSnVqNC75bOH4P2CrYLDWCym4ned8Sv2BGdNzG2yUBfZaBxnVo0nltgicgvaMCc9BXWSnXcQ/0'
				// }, {
				// 	id: 3,
				// 	type: 'image',
				// 	url: 'https://mmbiz.qpic.cn/mmbiz_jpg/niblT1iaDrJFnHhkMnSnVqNC75bOH4P2CrzQuY8qNgib9lmvpVg7hZS962SOlDH1wyWLYdJ6frWYIXrAJH9tUcK6g/0'
				// },
				// {
				// 	id: 1,
				// 	type: 'image',
				// 	url: 'https://mmbiz.qpic.cn/mmbiz_png/kaI5jJfvU3KOtibaayPeRevJTPmjhsYechKltTibmOzpRNQ89oZTptWtqCl03VDGSVmMibib6HQYUxUxPrNNPeySRw/0?wx_fmt=png'
				}
				],
				myOrderList: []
			}
		},
		onReady() {
			let _this = this
			//_this.$store.commit("logout")
			
			// 初始化towerSwiper 传已有的数组名即可
			ACLApi.dic.common.getListByParentId("telecomAD").then(result => {
				let tmpList = result
				if(tmpList && tmpList.length > 0) {
					this.swiperList = []
					tmpList.forEach(row => {
						var type = ACLApi.dic.utils.get(row, "type") ;
						if(type === "image") {
							this.swiperList.push({
								type: "image",
								targetType: type,
								id: row.idName,
								url: ACLApi.dic.utils.get(row, "url"),
								event: ACLApi.dic.utils.get(row, "event")
							})
						}else if(type === "mini-program") {
							this.swiperList.push({
								type: "image",
								targetType: type,
								id: row.idName,
								url: ACLApi.dic.utils.get(row, "url"),
								wxAppId: ACLApi.dic.utils.get(row, "wxAppId"),
								inviteCode: ACLApi.dic.utils.get(row, "inviteCode"),
								event: ACLApi.dic.utils.get(row, "event")
							})
						}
					})
					_this.TowerSwiper('swiperList');
				}
				
			}).catch(e => {
				_this.TowerSwiper('swiperList');
			})
			
			let user = uni.getStorageSync("userInfo")
			
			let nowTime = new Date().getTime()
			
			
			if(user && user.isLogin && nowTime < user.expiresAt) {
				user = JSON.parse(JSON.stringify(user))
				_this.$store.commit("refreshUserInfo", user)
				_this.getMyOrderList()
			}else {
				uni.showModal({
					title: "登录提示",
					content: "应用需要登录才能使用，请先登录！",
					success(result) {
						if(!result.cancel)  {
							_this.login()
						}else {
							uni.showToast({
							    title: '没有登录，将无法使用小程序的功能！',
							    duration: 2000,
								icon: 'none'
							})
						}
					},
					fail() {
					}
				})
			}
			
		},
		onShow() {
			if(this.$store.state.isLogin) {
				this.getMyOrderList()
			}
		},
		methods: {
			getMyOrderList() {
				let _this = this
				telecomApi.person.getMyOrderList({
					orgId: _this.$store.state.orgId,
					token: _this.$store.state.token
				}).then(result=> {
					if(result) {
						result.forEach(row => {
						  row.createDate = parseTime(row.createDate, '{m}-{d} {h}:{i}')
						  row.modifyDate = formatTime(row.modifyDate)
						})
						_this.myOrderList = result
					}
				}).catch(e=>console.log(e))
			},
			ad(item) {
				// uni.navigateTo({
				// 	url: '/pages/telecom/result?success=恭喜，激活成功！'
				// })
				// return false ;
				switch(item.targetType) {
					case 'image':
						uni.downloadFile({
							url: item.url,//图片地址
							success: (res) =>{
								if (res.statusCode === 200){
									uni.saveImageToPhotosAlbum({
										filePath: res.tempFilePath,
										success: function() {
											uni.showToast({
												title: "保存成功,请扫描二维码关注",
												icon: "none"
											});
										},
										fail: function() {
											uni.showToast({
												title: "保存失败",
												icon: "none"
											});
										}
									});
								} 
							}
						})
					break
					case 'mini-program':
						uni.navigateToMiniProgram({
							appId: item.wxAppId,
							path: `/pages/index/main?inviteCode=${item.inviteCode}` ,
							extraData: {
							},
							success(res) {
								console.log(res)
							},
							fail(e) {
								console.log(e)
							}
						})
					break
				}
			},
			activeCard(order) {
				if("waitSign"  === order.status) {
					uni.navigateTo({
						url: 'activeCard?orderNumber=' + order.orderNumber,
						success: res => {},
						fail: () => {},
						complete: () => {}
					});
				}
			},
			//登录
			login() {
				Authorization.wx.login()
				// uni.reLaunch({
				// 	url: '/pages/telecom/Authorization'
				// })
			},
			
			// towerSwiper
			// 初始化towerSwiper
			TowerSwiper(name) {
				let list = this[name];
				for (let i = 0; i < list.length; i++) {
					list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
					list[i].mLeft = i - parseInt(list.length / 2)
				}
				this.swiperList = list
			},
			// towerSwiper触摸开始
			TowerStart(e) {
				this.towerStart = e.touches[0].pageX
			},
			
			// towerSwiper计算方向
			TowerMove(e) {
				this.direction = e.touches[0].pageX - this.towerStart > 0 ? 'right' : 'left'
			},
			
			// towerSwiper计算滚动
			TowerEnd(e) {
				let direction = this.direction;
				let list = this.swiperList;
				if (direction == 'right') {
					let mLeft = list[0].mLeft;
					let zIndex = list[0].zIndex;
					for (let i = 1; i < this.swiperList.length; i++) {
						this.swiperList[i - 1].mLeft = this.swiperList[i].mLeft
						this.swiperList[i - 1].zIndex = this.swiperList[i].zIndex
					}
					this.swiperList[list.length - 1].mLeft = mLeft;
					this.swiperList[list.length - 1].zIndex = zIndex;
				} else {
					let mLeft = list[list.length - 1].mLeft;
					let zIndex = list[list.length - 1].zIndex;
					for (let i = this.swiperList.length - 1; i > 0; i--) {
						this.swiperList[i].mLeft = this.swiperList[i - 1].mLeft
						this.swiperList[i].zIndex = this.swiperList[i - 1].zIndex
					}
					this.swiperList[0].mLeft = mLeft;
					this.swiperList[0].zIndex = zIndex;
				}
				this.direction = ""
				this.swiperList = this.swiperList
			},
		}
	}
</script>

<style>
.tower-swiper .tower-item {
	transform: scale(calc(0.5 + var(--index) / 10));
	margin-left: calc(var(--left) * 100upx - 150upx);
	z-index: var(--index);
}

</style>
