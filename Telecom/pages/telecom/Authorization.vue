<template name="index">
	<view>
		
		<cu-custom bgColor="bg-gradual-blue">
			<block slot="content">登录授权</block>
		</cu-custom>
		<view class="cu-bar bg-white margin-top">
			<view class="action">
				小程序需要获取头像、昵称
			</view>
		</view>
		<view class="padding  bg-white flex flex-direction">
			<button class="cu-btn bg-blue margin-tb-sm lg" open-type="getUserInfo" withCredentials="true" lang="zh_CN" @getuserinfo="login">
				授权登录
			</button>
		</view>
	</view>
</template>

<script>
	import Authorization from "@/common/Authorization"
	export default {
		data() {
		},
		methods: {
	　　　　　//登录
			login() {
				Authorization.wx.login()
			}
			
		}
	}
</script>

<style>
</style>
