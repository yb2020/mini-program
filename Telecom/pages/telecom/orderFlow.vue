<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="content">免费开卡</block>
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
		<view class="cu-form-group margin-top">
			<view class="title">手机号码</view>
			<input v-model="formData.mobile" type="number" maxlength="11" placeholder="用于接收激活码" name="input"></input>
			<view class="cu-capsule radius">
				<view class='cu-tag bg-green'>
					+86
				</view>
				<view class="cu-tag line-green">
					中国大陆
				</view>
			</view>
		</view>
		
		<view class="cu-bar bg-white margin-top">
			<view class="action">
				身份证正面
			</view>
		</view>
		<view class="cu-form-group">
			<view class="grid col-2 grid-square flex-sub">
				<view class="bg-img" :data-url="formData.idZUrl" v-if="formData.idZUrl != ''">
					<image :src="formData.idZUrl" mode="aspectFill"></image>
					<view class="cu-tag bg-red" @tap.stop="DelImg(1)">
						<text class='cuIcon-close'></text>
					</view>
				</view>
				<view class="solids" @tap="ChooseImage(1)" v-if="formData.idZUrl == ''">
					<text class='cuIcon-cameraadd'></text>
				</view>
			</view>
		</view>
		
		<view class="cu-bar bg-white margin-top">
			<view class="action">
				身份证反面
			</view>
		</view>
		<view class="cu-form-group">
			<view class="grid col-2 grid-square flex-sub">
				<view class="bg-img" :data-url="formData.idFUrl" v-if="formData.idFUrl != ''">
					<image :src="formData.idFUrl" mode="aspectFill"></image>
					<view class="cu-tag bg-red" @tap.stop="DelImg(2)">
						<text class='cuIcon-close'></text>
					</view>
				</view>
				<view class="solids" @tap="ChooseImage(2)" v-if="formData.idFUrl == ''">
					<text class='cuIcon-cameraadd'></text>
				</view>
			</view>
		</view>
		
		<view class="cu-bar bg-white margin-top">
			<view class="action">
				人像照
			</view>
		</view>
		<view class="cu-form-group">
			<view class="grid col-2 grid-square flex-sub">
				<view class="bg-img" :data-url="formData.faceUrl" v-if="formData.faceUrl != ''">
					<image :src="formData.faceUrl" mode="aspectFill"></image>
					<view class="cu-tag bg-red" @tap.stop="DelImg(3)">
						<text class='cuIcon-close'></text>
					</view>
				</view>
				<view class="solids" @tap="ChooseImage(3)" v-if="formData.faceUrl == ''">
					<text class='cuIcon-cameraadd'></text>
				</view>
			</view>
		</view>
		
		<view class="padding flex flex-direction">
			<button @tap="order" class="cu-btn bg-blue margin-tb-sm lg">提交审核</button>
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
				basics: 1,
				formData: {
					mobile: '',
					idZUrl: '',
					idZData: '',
					idFUrl: '',
					idFData: '',
					faceUrl: '',
					faceData: ''
				}
			}
		},
		methods: {
			validate() {
				let _this = this
				
				if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(_this.formData.mobile))){ 
					uni.showToast({
						title: "手机号码有误，请重填!",
						duration: 2000,
						icon: "none"
					})
					return false
				}
				
				if(!_this.formData.idZUrl){
					uni.showToast({
						title: "您还没有拍摄身份证正面!",
						duration: 2000,
						icon: "none"
					})
					return false
				}

				if(!_this.formData.idFUrl){
					uni.showToast({
						title: "您还没有拍摄身份证反面!",
						duration: 2000,
						icon: "none"
					})
					return false
				}
				
				if(!_this.formData.faceUrl){
					uni.showToast({
						title: "您还没有拍摄正面人像照!",
						duration: 2000,
						icon: "none"
					})
					return false
				}
				
				
				return true
			},
			order() {
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
					telecomApi.person.order({
						token: _this.$store.state.token,
						mobile: _this.formData.mobile,
						idZData: _this.formData.idZData,
						idFData: _this.formData.idFData,
						faceData: _this.formData.faceData,
						orgId: _this.$store.state.orgId,
						appId: _this.$store.state.appName
					}).then(result => {
						uni.showToast({
							title: result.message,
							duration: 3000,
							complete() {
								uni.navigateBack({
									animationDuration: 1000
								})
							}
						})
					}).catch(e => {
						console.error(e)
					})
				}
			},
			getImageData(filepath, index) {
				let _this = this
				
				uni.getFileSystemManager().readFile({
					filePath: filepath, //选择图片返回的相对路径
					encoding: 'base64',
                    success: ress => {
                        let base64 = 'data:image/'+ filepath.substring(filepath.lastIndexOf(".")+1)+';base64,'  + ress.data
						switch(index) {
							case 1:
								_this.formData.idZData = base64
								_this.formData.idZUrl = filepath
								break;
							case 2:
								_this.formData.idFData = base64
								_this.formData.idFUrl = filepath
								break;
							case 3:
								_this.formData.faceData = base64
								_this.formData.faceUrl = filepath
								break;
							default:
								break;
						}
					}
				})
			},
			ChooseImage(index) {
				let _this = this
				uni.store
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['camera'], //只能拍照
					success: (res) => {
						_this.getImageData(res.tempFilePaths[0], index)
					}
				});
			},
			DelImg(index) {
				let _this = this
				switch(index) {
					case 1:
						_this.formData.idZUrl = ""
						_this.formData.idZData = ""
						break;
					case 2:
						_this.formData.idFUrl = ""
						_this.formData.idFData = ""
						break;
					case 3:
						_this.formData.faceUrl = ""
						_this.formData.faceData = ""
						break;
					default:
						break;
				}
			},
		}
	}
</script>

<style>

</style>
