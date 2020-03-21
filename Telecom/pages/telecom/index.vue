<template>
	<view>
		<index v-if="PageCur=='index'" ref="indexPage"></index>
		<personal v-if="PageCur=='personal'" @changeNav="changeNav"></personal>
		<view class="cu-bar tabbar bg-white foot">
			<view :class="SelectedClass" @tap="NavChange" data-cur="index">
				<view class="cuIcon-home"></view> 首页
			</view>
			<view class="action add-action text-black" @tap="toChild" data-url="./orderFlow">
				<button class="cu-btn cuIcon-add bg-gradual-blue shadow"></button>
			</view>
			<view :class="UnSelectClass" @tap="NavChange" data-cur="personal">
				<view class="cuIcon-my">
					<!-- <view class="cu-tag badge">10</view> -->
				</view>
				我的
			</view>
		</view>
			
	</view>
</template>

<script>
	export default {
		data() {
			return {
				PageCur: 'index',
				SelectedClass: 'action text-blue',
				UnSelectClass: 'action text-black'
			}
		},
		onLoad(options) {
			// setTimeout(()=>{
			// 	console.log(this.$store.state.orgId)
			// }, 100)
		},
		onShow() {
			if("index" == this.PageCur && this.$store.state.isLogin) {
				setTimeout(()=>this.$refs.indexPage.getMyOrderList(), 100)
			}
		},
		methods: {
			NavChange: function(e) {
				this.changeNav(e.currentTarget.dataset.cur)
			},
			changeNav(page) {
				
				let nowPage = page
				if(nowPage === this.PageCur) {
					return false
				}
				let tmp = this.SelectedClass
				
				this.SelectedClass = this.UnSelectClass
				this.UnSelectClass = tmp
				this.PageCur = nowPage
				if("index" == nowPage && this.$store.state.isLogin) {
					setTimeout(()=>this.$refs.indexPage.getMyOrderList(), 100)
				}
			},
			toChild(e) {
				uni.navigateTo({
					url: e.currentTarget.dataset.url
				})
			}
		}
	}
</script>

<style>
</style>