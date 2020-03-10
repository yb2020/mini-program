<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="content">视频激活</block>
		</cu-custom>
		
		<view class="cu-bar bg-white solid-bottom">
			<view class="action">
				<text class="cuIcon-title text-red"></text>开卡流程
			</view>
		</view>
		<view class="bg-white padding">
			<view class="cu-steps">
				<view class="cu-item" :class="index < basics && basics < basicsList.length ? 'text-blue' :''" v-for="(item,index) in basicsList" :key="index">
					<text :class="'cuIcon-' + item.cuIcon"></text> {{item.name}}
				</view>
			</view>
		</view>
		
		<view class="cu-bar bg-white solid-bottom">
			<view class="action">
				<text class='cuIcon-title text-blue'></text>请在视频中清晰念出下面的数字
			</view>
		</view>
		<view class="grid col-4 padding-sm">
			<view class="padding-sm">
				<view class="padding radius text-center shadow-blur bg-red">
					<view class="text-lg">{{formData.valiCodeArray.length > 0 ? formData.valiCodeArray[0] : ''}}</view>
				</view>
			</view>
			<view class="padding-sm">
				<view class="padding radius text-center shadow-blur bg-red">
					<view class="text-lg">{{formData.valiCodeArray.length > 1 ? formData.valiCodeArray[1] : ''}}</view>
				</view>
			</view>
			<view class="padding-sm">
				<view class="padding radius text-center shadow-blur bg-red">
					<view class="text-lg">{{formData.valiCodeArray.length > 2 ? formData.valiCodeArray[2] : ''}}</view>
				</view>
			</view>
			<view class="padding-sm">
				<view class="padding radius text-center shadow-blur bg-red">
					<view class="text-lg">{{formData.valiCodeArray.length > 3 ? formData.valiCodeArray[3] : ''}}</view>
				</view>
			</view>
		</view>
		<view class="padding flex flex-direction">
			<button @tap="getCode(false)" class="cu-btn bg-green margin-tb-sm lg">刷新激活码</button>
		</view>
		<view class="cu-bar bg-white margin-top">
			<view class="action">
				请拍摄视频，激活有效期为90秒，超时后请点击刷新激活码，重新获取
			</view>
		</view>
		<view class="cu-form-group">
			<view class="grid col-2 grid-square flex-sub">
				<view class="bg-img" :data-url="formData.videoUrl" v-if="formData.videoUrl != ''">
					<video replay="true" :src="formData.videoUrl"></video>
					<view class="cu-tag bg-red" @tap.stop="DelVideo()">
						<text class='cuIcon-close'></text>
					</view>
				</view>
				<view class="solids" @tap="ChooseVideo()" v-if="formData.videoUrl == ''">
					<text class='cuIcon-cameraadd'></text>
				</view>
			</view>
		</view>
		
		<view class="padding flex flex-direction">
			<button @tap="active" class="cu-btn bg-blue margin-tb-sm lg">提交激活</button>
		</view>
	</view>
</template>

<script>
	import telecomApi from "./api/telecom"

	export default {
		data() {
			return {
				basicsList: [{
					cuIcon: 'usefullfill',
					name: '提交照片'
				}, {
					cuIcon: 'radioboxfill',
					name: '等待审核'
				}, {
					cuIcon: 'radioboxfill',
					name: '视频认证'
				}, {
					cuIcon: 'roundcheckfill',
					name: '完成'
				}, ],
				basics: 3,
				formData: {
					orderNumber: '',
					validCode: '',
					randomKey: '',
					valiCodeArray: [],
					videoUrl: '',
					videoData: ''
				}
			}
		},
		onLoad(options) {
			let _this = this
			_this.formData.orderNumber = options.orderNumber
			_this.getCode(true)
		},
		methods: {
			getCode(bool) {
				let _this = this
				
				telecomApi.person.getActiveCode({
					orderNumber: _this.formData.orderNumber
				}).then(result => {
					if(result.status === 0) {
						uni.showToast({
							title: result.message,
							duration: 3000,
							complete() {
								if(bool) {
									uni.navigateBack({
										animationDuration: 1000
									})
								}
							}
						})
						return
					}
					_this.formData.validCode = result.data.readCode
					_this.formData.valiCodeArray = _this.formData.validCode.split("") ;
					_this.formData.randomKey = result.data.randomKey
					
				}).catch(e => {
					console.error(e)
				})
			},
			validate() {
				let _this = this
				
				if(!_this.formData.videoUrl){
					uni.showToast({
						title: "您还没有拍摄激活视频!",
						duration: 2000,
						icon: "none"
					})
					return false
				}

				return true
			},
			active() {
				let _this = this
				if(!_this.$store.state.isLogin) {
					uni.showToast({
						title: '没有登录，无法使用小程序的功能！',
						duration: 2000,
						icon: 'none'
					})
					return false 
				}
				
				if(_this.validate()) {
					uni.showLoading({
						title: "提交中..."
					})
					telecomApi.person.active({
						filePath: _this.formData.videoUrl,
						orderNumber: _this.formData.orderNumber,
						validCode: _this.formData.validCode,
						randomKey: _this.formData.randomKey
					}).then(result => {
						uni.navigateTo({
							url: '/pages/telecom/result?success=' + result.message
						})
						return false ;
						
						uni.showToast({
							title: result.message,
							duration: 2000,
							icon: "none",
							complete() {
								uni.navigateBack({
									animationDuration: 1000
								})
							}
						})
						
					}).catch(e => {
						_this.DelVideo()
						_this.getCode(true)
						console.error(e)
					})
				}
			},
			getVideoData(filepath) {
				let _this = this
				
				uni.getFileSystemManager().readFile({
					filePath: filepath, //选择图片返回的相对路径
					encoding: 'binary',
                    success: ress => {
                        let base64 = 'data:video/'+ filepath.substring(filepath.lastIndexOf(".")+1)+';base64,'  + ress.data
						_this.formData.videoData = base64
						_this.formData.videoUrl = filepath
					}
				})
			},
			ChooseVideo() {
				let _this = this
				uni.chooseVideo({
					sourceType: ['camera'],
					compressed: true,
					maxDuration: 8,
					camera: 'front',
					success(res) {
						_this.getVideoData(res.tempFilePath)
					}
				})
			},
			DelVideo() {
				let _this = this
				_this.formData.videoUrl = ""
				_this.formData.videoData = ""
			},
		}
	}
</script>

<style>
.text-lg {
	font-size: 62rpx;
}
video {
	width: 300px;
	height: 225px;
	display: inline-block;
	line-height: 0;
	overflow: hidden;
	position: null;
	z-index: 0;
}

</style>
