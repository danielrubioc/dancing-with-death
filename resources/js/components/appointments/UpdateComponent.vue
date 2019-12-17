<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Modifying your appointment with death</div>
                    <div class="card-body">
                        <form @submit="checkForm">
                            <div class="form-group row">
                                <label for="staticEmail" class="col-sm-2 col-form-label">Name</label>
                                <div class="col-sm-10">
                                    <input type="text" class="form-control" v-model="appointmentUpdate.name" id="staticEmail" placeholder="Name from dancer, only if you want a personalized dance">
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="staticEmail" class="col-sm-2 col-form-label">Day</label>
                                <div class="col-sm-10">
                                    <div v-bind:class="{ 'is-invalid': errors['date'] }">
                                        <datepicker  :format="customFormatter"   v-model="appointmentUpdate.date" @selected="onChange()"  placeholder="Select the day of the dance" :disabled-dates="disabledDates"> </datepicker>
                                    </div>
                                    <div class="invalid-feedback">
                                        {{ errors['date'] }}
                                    </div>
                                    <div class="invalid-feedback" style="display: block;" v-if="empty_times">
                                        {{empty_times}}
                                    </div>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="staticEmail" class="col-sm-2 col-form-label">Init Time</label>
                                <div class="col-sm-10">
                                    <select class="form-control" v-bind:class="{ 'is-invalid': errors['start_time'] }" id="exampleFormControlSelect1" v-model="appointmentUpdate.start_time" :disabled="validated">
                                        <option v-for="(time, k) in times" :value="time.value"  :key="k">{{time.name}}</option>
                                    </select>
                                    <div class="invalid-feedback">
                                        {{errors['start_time']}}
                                    </div>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="staticEmail" class="col-sm-2 col-form-label">Contact</label>
                                <div class="col-sm-10">
                                    <input type="text" class="form-control" v-bind:class="{ 'is-invalid': errors['contact_information'] }"  id="staticEmail"  v-model="appointmentUpdate.contact_information" placeholder="email@example.com" :disabled="validated">
                                    <div class="invalid-feedback">
                                        {{errors['contact_information']}}
                                    </div>
                                </div>
                            </div>
 
                            <div class="text-right">
                                <div v-if="!isLoading">
                                    <br>
                                    <button type="submit" class="btn btn-success">Update appointment</button>
                                    <button type="button"  @click="$router.push('/appointments')" class="btn btn-info">List appointments</button>
                                </div>
                                <div v-if="isLoading">
                                    <div class="spinner-grow" style="width: 2rem; height: 2rem;" role="status">
                                        <span class="sr-only">Loading...</span>
                                    </div> 
                                    <div class="spinner-grow" style="width: 2rem; height: 2rem;" role="status">
                                        <span class="sr-only">Loading...</span>
                                    </div> 
                                    <div class="spinner-grow" style="width: 2rem; height: 2rem;" role="status">
                                        <span class="sr-only">Loading...</span>
                                    </div> 
                                </div>  

                              
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Datepicker from 'vuejs-datepicker';
    import AppointmentService from '../../services/AppointmentService'
    import moment from 'moment'
    import { mapGetters, mapState, mapMutations } from 'vuex'
    export default {
        components: {
            Datepicker
        },
        data() {
            return {
                disabledDates: {
                    days: [6, 0], // Disable Saturday's and Sunday's
                }, 
                errors:[],
                appointmentUpdate: {},
                validated: true,
                empty_times: '',
                times:  [{name: "9:00",  value: 9},
                        {name: "10:00",  value: 10},
                        {name: "11:00",  value: 11},
                        {name: "12:00",  value: 12},
                        {name: "13:00",  value: 13},
                        {name: "14:00",  value: 14},
                        {name: "15:00",  value: 15},
                        {name: "16:00",  value: 16},
                        {name: "17:00",  value: 17},
                        {name: "18:00",  value: 18}]
            }
        },
        computed: {
            ...mapGetters('loading', { isLoading: 'isLoading'}),
        },
        mounted() {
            this.getData( this.$route.params.id );
        },
        methods: {
            customFormatter(date) {
                return moment(date , 'YYYY-MM-DD').format('YYYY-MM-DD');
            },
            onChange(date) {
                this.validated = false;
                this.empty_times = "";
                this.appointmentUpdate.start_time = false;
                this.$nextTick(function () {
                    let date =  moment(this.appointmentUpdate.date , 'YYYY.MM.DD').format('YYYY-MM-DD');
                    let params = '?date=' + date;
                    AppointmentService.getTimes(params).then(resp => {
                        this.times = resp.data;
                        if(this.times.length == 0) {
                           this.validated = true;
                           this.empty_times = "sorry there are no hours available for the day";
                        }  
                    }); 
                });
            },
            getData( id ) {
                AppointmentService.find(id).then(resp => {
                    this.appointmentUpdate = resp.data;
                    this.appointmentUpdate.date =  moment(this.appointmentUpdate.date , 'YYYY.MM.DD').format('YYYY-MM-DD');
                })
            },
    
            checkForm: function (e) {
                this.errors = [];
                if (!this.appointmentUpdate.date) {
                    this.errors['date'] = 'date is required.';
                }
                if (!this.appointmentUpdate.start_time) {
                    this.errors['start_time'] = 'init time is required.';
                }
                if (!this.appointmentUpdate.contact_information) {
                    this.errors['contact_information'] = 'contact is required.';
                }

                if (this.appointmentUpdate.date && this.appointmentUpdate.start_time && this.appointmentUpdate.contact_information) {
                    this.registerUpdate();
                }
                e.preventDefault();
            },

            registerUpdate() {
                this.isLoading  = true;
                this.appointmentUpdate.date = moment(this.appointmentUpdate.date , 'YYYY.MM.DD').format('YYYY-MM-DD');
                AppointmentService.updateRegister(this.appointmentUpdate.id, this.appointmentUpdate).then(resp => {
                    this.isLoading  = false;
                    if (resp.status == 200 || resp.status == 201) {
                        this.getData( this.$route.params.id );
                        this.validated = true;
                        this.appointmentUpdate.start_time = false;
                    }
                }) 
 
            },

        }
    }
     
</script>
