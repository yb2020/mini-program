<template name="personal">
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="content">激活结果</block>
		</cu-custom>
		<scroll-view :scroll-y="modalName==null" bgColor="bg-blue" class="page" :class="modalName!=null?'show':''">
			<view class="solids-bottom padding-xs flex align-center">
				<view class="padding"></view>
				<view class="flex-sub text-center">
					<view class="solid-bottom text-xxl padding">
						<text class="text-red">{{getMessage()}}</text>
					</view>
				</view>
			</view>
			
			<view class="cu-bar bg-white margin-top">
				<view class="action">
					<text class="cuIcon-title text-black"></text>点击按钮保存二维码
				</view>
			</view>
			
			<view class="bg-img bg-mask flex align-center" :style="'background-image: url('+imgUrl+');height: 1600upx;'">
				<view class="padding-xl text-white">
					<view class="padding-xs text-xxl text-bold">
						关注本微信公众号
					</view>
					<view class="padding-xs text-xl text-lg">
						了解“商业与技术结合如何变现”！
					</view>
				</view>
			</view>
			
			<view class=" padding flex flex-direction">
				<button class="cu-btn bg-blue margin-tb-sm lg" withCredentials="true" lang="zh_CN" open-type="follow" @click="save">
					保存到相册并返回首页
				</button>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import store from '@/store'
	
	export default {
		data() {
			return {
				message: '',
				imgUrl: 'https://mmbiz.qpic.cn/mmbiz_png/kaI5jJfvU3KOtibaayPeRevJTPmjhsYec8anxfWuMF0mKwUOKRaqfhv3JwjFic62kMMvFGe6ag7kvV3sRdZZVCEQ/0?wx_fmt=png',
				height: 500
			};
		},
		onLoad(options) {
			let _this = this
			this.message = options.success
		},
		onShareAppMessage(res) {
			return {
				title: '来自' + this.$store.state.nickName + '的分享',
				desc: '和我一起做任务吧',
				path: '/pages/telecom/index?scene=' + this.$store.state.agent
			}
		},
		methods: {
			getMessage() {
				return this.$store.state.nickName + "，" + this.message
			},
			previewImage(e) {
				var current = e.target.dataset.src;   //这里获取到的是一张本地的图片
				uni.previewImage({
					current: current,//需要预览的图片链接列表
					urls: [current]  //当前显示图片的链接
				})
			},
			save() {
				var _this = this
				uni.downloadFile({
					url: _this.imgUrl,//图片地址
					success: (res) =>{
						if (res.statusCode === 200){
							uni.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								success: function() {
									uni.showToast({
										title: "保存成功,请扫描二维码关注",
										icon: "none"
									});
									setTimeout(()=>{
										uni.navigateBack({
											url: '/pages/telecom/index'
										})
									}, 1000)
								},
								fail: function() {
									uni.showToast({
										title: "保存失败",
										icon: "none"
									});
									setTimeout(()=>{
										uni.navigateBack({
											url: '/pages/telecom/index'
										})
									}, 1000)
								}
							});
						} 
					}
				})
			}
		}
	}
</script>

<style>
	.page {
		height: 100Vh;
		width: 100vw;
	}

	.page.show {
		overflow: hidden;
	}

</style>
