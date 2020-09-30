import serviceAPI from '@/common/serviceAPI'

const serviceId = '/microService-user'

export default {
	user: {
	    getById(id) {
	      return serviceAPI.request({
	        url: serviceId + '/user/getById/' + id,
	        method: 'get',
	        data: null
	      })
	    },
		getByToken() {
		  return serviceAPI.request({
			url: serviceId + '/user/getByToken',
			method: 'post'
		  })
		}
	},
	authorization: {
		wxLogon(params) {
			return serviceAPI.request({
			  url: serviceId + '/user/authorization/wxLogon',
			  method: 'get',
			  data: params
			})
		},
		getWxUserInfo(params) {
			return serviceAPI.request({
			  url: serviceId + '/user/authorization/getWxUserInfo',
			  method: 'get',
			  data: params
			})
		}
	}
}