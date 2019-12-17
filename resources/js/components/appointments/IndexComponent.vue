<template>
    <div class="container">
        <div class="card">
            <div class="card-header">
                Appointment list
            </div>
            <div class="card-body text-center">

                <div class="text-right">
                    <a @click="$router.push('/')" class="btn btn-success" style="color:white">New Appointment</a>
                    <br> <br>
                </div>
                <div class="progress" v-if="isLoading" style="position: relative;">
                    <div class="progress-bar progress-bar-striped indeterminate"></div>
                </div>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Date</th>
                            <th>Init Time</th>
                            <th>Contact Information</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr  v-for="(data, k) in datas" :key="k">
                            <td>{{data.name}}</td>
                            <td>{{data.date}}</td>
                            <td>{{data.start_time}}:00</td>
                            <td>{{data.contact_information}}</td>
                            <td>
                                <button type="button" @click="deleteRegister(data.id)" class="btn btn-danger">Delete</button>
                                <button type="button"  @click="$router.push('/appointments/view/'+data.id)" class="btn btn-primary">Edit</button>
                            </td>
        
                        </tr>
                    </tbody>
                </table>
                <div class="text-right">
                    <pagination class="text-right" v-if="data_laravel"  :data="data_laravel" :limit="limit" @pagination-change-page="getData"></pagination>
                </div>    
            </div>
        </div>
        
    </div>
</template>

<script>
    import AppointmentService from '../../services/AppointmentService'
    import { mapGetters, mapState, mapMutations } from 'vuex'
    export default {
        data() {
            return {
                datas:[],
                data_laravel: {}, 
                page: 1, 
            limit: 4, // limite para mostrar paginas - paginacion,
            }     
        },
        computed: {
            ...mapGetters('loading', { isLoading: 'isLoading'}),
        },
        mounted() {
            this.getData();
 
        },
        methods: {
            getData(page = 1) {
                this.$router.push({ path: 'appointments', query: { page: page }}).catch(err => {})
                let params = "?page="+page;
                if(this.string_filters){
                    params = params + this.string_filters;
                }
                AppointmentService.getData(params).then(resp => {
                    this.datas = resp.data.data;
                    this.data_laravel = resp.data;
                })
            },
            deleteRegister(id){
                AppointmentService.deleteRegister(id).then(resp => {
                    this.getData();
                })
            },
        },
    }
</script>
