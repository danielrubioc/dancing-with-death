const API_URL = "/api";

export default {
    //listado de usuarios
    getData(params) {
    	return axios.get( API_URL + '/appointments'+params);
    },

    createRegister(data_user) {
    	return axios.post( API_URL + '/appointments', data_user);
    },

    find(id) {
    	return axios.get( API_URL + '/appointments/'+ id );
    },

    getTimes(params) {
    	return axios.get( API_URL + '/appointments/get_times'+ params);
    },

    deleteRegister(id) {
      	return axios.delete( API_URL + '/appointments/' + id);
    },

    updateRegister(id, data) {
        return axios.put(API_URL + '/appointments/' + id, data);
    }
   
}