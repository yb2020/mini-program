import serviceAPI from '@/common/serviceAPI'

const serviceId = '/MICROSERVICE-APP-TELECOM'

export default {
	location: {
		list() {
			return serviceAPI.request({
				url: serviceId + '/location/list',
				method: 'get',
				data: null
			})
		}
	},
	person: {
		order(params) {//下单
			return serviceAPI.request({
				url: serviceId + '/person/telecomOrder/order',
				contentType: 'form',
				business: null,
				method: 'POST',
				data: params
			})
		},
		getActiveCode(params) {//获取验证码
			return serviceAPI.request({
				url: serviceId + '/person/telecomOrder/getActiveCode',
				contentType: 'form',
				business: null,
				method: 'POST',
				data: params
			})
		},
		active(params) {//激活
			return serviceAPI.request({
				url: serviceId + '/person/telecomOrder/active',
				filePath: params.filePath,
				name: 'file',
				contentType: 'file',
				business: null,
				method: 'POST',
				data: params
			})
		},
		getMyOrderList(params) {
			return serviceAPI.request({
				url: serviceId + '/person/telecomOrder/getMyOrderList',
				contentType: 'form',
				method: 'POST',
				data: params
			})
		}
	}
}