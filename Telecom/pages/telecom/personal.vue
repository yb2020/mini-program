<template name="personal">
	<view>
		<cu-custom bgColor="bg-gradual-blue">
			<block slot="content">个人中心</block>
		</cu-custom>
		<scroll-view :scroll-y="modalName==null" class="page" :class="modalName!=null?'show':''">
			
			<view class="cu-list menu-avatar">
				<view class="cu-item">
					<view class="cu-avatar round lg" :style="avatorUrl"></view>
					<view class="content">
						<view class="text-black">{{nickName}}</view>
						<view class="text-gray text-sm flex">
							<view class="text-cut">
								{{username}}
							</view>
						</view>
					</view>
					<view class="action">
						<!--view class="cu-tag round bg-red sm">会员</view-->
					</view>
				</view>
			</view>
			
			
			<view class="cu-list grid" :class="['col-' + gridCol,gridBorder?'':'no-border']">
				<view class="cu-item" v-for="(item,index) in cuIconList" :key="index" v-if="index<gridCol*2">
					<view :class="['cuIcon-' + item.cuIcon,'text-' + item.color]">
						<view class="cu-tag badge" v-if="item.badge!=0">
							<block v-if="item.badge!=1">{{item.badge>99?'99+':item.badge}}</block>
						</view>
					</view>
					<text>{{item.name}}</text>
				</view>
			</view>


			<view class="cu-bar bg-white solid-bottom margin-top">
				<view class="action">
					</text> 菜单列表
				</view>
			</view>
			<view class="cu-list menu" :class="[menuBorder?'sm-border':'',menuCard?'card-menu margin-top':'']">
				<view class="cu-item" :class="menuArrow?'arrow':''">
					<view class="content" @tap="toOrder">
						<image src="/static/logo.png" class="png" mode="aspectFit"></image>
						<text class="text-grey">我的订单</text>
					</view>
				</view>
				<view class="cu-item" :class="menuArrow?'arrow':''">
					<view class="content">
						<text class="cuIcon-circlefill text-grey"></text>
						<text class="text-grey">我的账户</text>
					</view>
				</view>
			</view>

		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cuIconList: [{
					cuIcon: 'medal',
					color: 'orange',
					badge: 0,
					name: '申请会员'
				}, {
					cuIcon: 'share',
					color: 'green',
					badge: 1,
					name: '我要分享'
				}],
				gridCol: 2,
				gridBorder: true,
				menuArrow: true,
				avatorUrl: "",
				nickName: "",
				username: ""
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
		},
		methods: {
			toOrder() {
				this.$emit("changeNav", "index")
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
