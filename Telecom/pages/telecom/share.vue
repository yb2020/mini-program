<template name="personal">
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="content">分享有礼</block>
		</cu-custom>
		<scroll-view :scroll-y="modalName==null" bgColor="bg-blue" class="page" :class="modalName!=null?'show':''">
			<view>
				<canvas style="width:100%;" :style="{ height: height + 'px' }" canvas-id="canvas" ></canvas>
			</view>
			<view class=" padding flex flex-direction">
				<button class="cu-btn bg-blue margin-tb-sm lg" withCredentials="true" lang="zh_CN" @tap="saveShare">
					保存
				</button>
				<!--button class="cu-btn bg-blue margin-tb-sm lg" withCredentials="true" lang="zh_CN" open-type="share">
					分享
				</button-->
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import ACLApi from '@/common/ACL'
	import base64src from '@/common/base64src'
	
	export default {
		data() {
			return {
				qrCode: '',
				height: 500,
				menuArrow: true,
				avatorUrl: "",
				nickName: "",
				username: "",
				isAgent: false,
				agent: ""
			};
		},
		onLoad() {
			let _this = this
			if(!_this.avatorUrl) {
				_this.avatorUrl = 'background-image:url("' + this.$store.state.avatarUrl + '");'
			}
			if(!_this.nickName) {
				_this.nickName = this.$store.state.nickName
			}
			if(!_this.username) {
				_this.username = this.$store.state.username
			}
			if(!_this.agent) {
				_this.agent = this.$store.state.agent
			}
			if(!_this.isAgent) {
				_this.isAgent = this.$store.state.isAgent
			}
			
			ACLApi.qr.app.getPersonalQRCode({
				agent: this.$store.state.agent,
				appId: this.$store.state.appName
			}).then(result => {
				this.qrCode = result.data
				_this.toDrawCanvas()
			})
			
		},
		onShareAppMessage(res) {
			return {
				title: '来自' + this.$store.state.nickName + '的分享',
				desc: '和我一起做任务吧',
				path: '/pages/telecom/index?scene=' + this.$store.state.agent
			}
		},
		methods: {
			toDrawCanvas() {
				let that=this
				
				uni.getSystemInfo({
					success: function(e) {
						//获取屏幕宽高设置画布宽高
						let width = e.windowWidth;
						let height= e.screenHeight - 200 ;
						that.height = height;
						let topheight = 180;//图片距离上边距离
						const ctx = uni.createCanvasContext('canvas');
						// 底色
						ctx.fillStyle = '#FFFFFF';  //填充颜色
						ctx.fillRect(0, 0, width, height); 
						
						var avatarSize = 100;    //绘制的头像宽度
						var avatarurl_heigth = 100;   //绘制的头像高度
						var avatarurl_x = 50;   //绘制的头像在画布上的位置
						var avatarurl_y = 50;   //绘制的头像在画布上的位置
						
						uni.getImageInfo({
							src: that.$store.state.avatarUrl,
							success(res) {
								// ctx.arc(
								// 	avatarurl_width / 2 + avatarurl_x, avatarurl_heigth / 2 + avatarurl_y, avatarurl_width / 2, 0, Math.PI * 2, false
								// ); 
								// ctx.clip()  //裁剪
								ctx.drawImage(res.path, (width - avatarSize) / 2, 30 , avatarSize, avatarSize);
								
								//绘制序列从上到下， 通过距离上边高度来排列显示
								// 文字内容
								ctx.setTextAlign('center'); // 文字居中
								
								ctx.setFillStyle('#333333'); // 文字颜色：黑色
								ctx.setFontSize(14); // 文字字号：22px
								ctx.fillText(that.$store.state.nickName, width / 2, topheight - 30);
								
								ctx.setFillStyle('#0081FF'); 
								ctx.setFontSize(20); 
								ctx.fillText('一起来做任务吧！', width / 2, topheight);
								// 小程序码
								const qrImgSize = 170;
								base64src(that.qrCode).then(filePath =>{
									ctx.drawImage(filePath, (width - qrImgSize) / 2, topheight + 20 , qrImgSize, qrImgSize);
									ctx.stroke();
									ctx.draw();
								})
								
							}
						})
						
					}
				});
				
			},
			saveShare() {
				let that = this
				uni.canvasToTempFilePath({
					canvasId: 'canvas',
					success: (res) => {
						//返回文件路径
						that.imageUrl=res.tempFilePath
						//保存图片到系统相册
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: (res) => {
								uni.showToast({
									title: '保存成功'
								})
							},
							fail() {
								uni.showToast({
									icon: 'none',
									title: '保存小程序码失败'
								})
							}
						})
						
					}
				})
			},
			appShare() {
				//unii-app分享,我在这里是微信分享好友
				uni.canvasToTempFilePath({
					canvasId: 'canvas',
					success: (res) => {
						uni.share({
							provider: "weixin",
							scene: "WXSceneSession",
							type: 2,
							imageUrl: res.tempFilePath,
							success: function (res) {
								console.log(res);
							},
							fail: function (err) {
								console.log("fail:" + JSON.stringify(err));
							}
						});
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
