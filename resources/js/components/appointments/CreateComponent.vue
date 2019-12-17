<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Do you want to dance with death ? request your appointment</div>
                    <div class="card-body">
                        <form @submit="checkForm">
                            <div class="form-group row">
                                <label for="staticEmail" class="col-sm-2 col-form-label">Name</label>
                                <div class="col-sm-10">
                                    <input type="text" class="form-control" v-model="newAppointment.name" id="staticEmail" placeholder="Name from dancer, only if you want a personalized dance">
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="staticEmail" class="col-sm-2 col-form-label">Day</label>
                                <div class="col-sm-10">
                                    <div v-bind:class="{ 'is-invalid': errors['date'] }">
                                        <datepicker  :format="customFormatter" v-model="newAppointment.date" @selected="onChange(newAppointment.date)"  placeholder="Select the day of the dance" :disabled-dates="disabledDates"> </datepicker>
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
                                    <select class="form-control" v-bind:class="{ 'is-invalid': errors['start_time'] }" id="exampleFormControlSelect1" v-model="newAppointment.start_time" :disabled="validated">
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
                                    <input type="text" class="form-control" v-bind:class="{ 'is-invalid': errors['contact_information'] }"  id="staticEmail"  v-model="newAppointment.contact_information" placeholder="email@example.com" :disabled="validated">
                                    <div class="invalid-feedback">
                                        {{errors['contact_information']}}
                                    </div>
                                </div>
                            </div>
 
                            <div class="text-right">
                                <div v-if="!isLoading">
                                    <br>
                                    <button type="button"  @click="$router.push('/appointments')" class="btn btn-info">List appointments</button>
                                    <button type="submit" class="btn btn-success">Request appointment</button>
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
        computed: {
            ...mapGetters('loading', { isLoading: 'isLoading'}),
        },
        data() {
            return {
                disabledDates: {
                    days: [6, 0], // Disable Saturday's and Sunday's
                }, 
                errors:[],
                newAppointment: {},
                empty_times: '',
                validated: true,
                times: []
            }
        },
 
        methods: {
            onChange(date) {
                this.validated = true;
                this.empty_times = ""; 
                this.newAppointment.start_time = false;
                this.$nextTick(function () {
                    let date =  moment(this.newAppointment.date).format('YYYY-MM-DD');
                    let params = '?date=' + date;
                    AppointmentService.getTimes(params).then(resp => {
                        this.times = resp.data;
                        this.validated = false;
                        this.empty_times = "";    
                        if(this.times.length == 0) {
                           this.validated = true;
                           this.empty_times = "sorry there are no hours available for the day";
                        }  
                    }); 
                });
            },
            customFormatter(date) {
                return moment(date).format('YYYY-MM-DD');
            },
            checkForm: function (e) {
                this.errors = [];

                if (!this.newAppointment.date) {
                    this.errors['date'] = 'date is required.';
                }
                if (!this.newAppointment.start_time) {
                    this.errors['start_time'] = 'init time is required.';
                }
                if (!this.newAppointment.contact_information) {
                    this.errors['contact_information'] = 'contact is required.';
                }

                if (this.newAppointment.date && this.newAppointment.start_time && this.newAppointment.contact_information) {
                    this.registerCreate();
                }
                e.preventDefault();
            },

            registerCreate() {
                this.newAppointment.date =  moment(this.newAppointment.date).format('YYYY-MM-DD');
                AppointmentService.createRegister(this.newAppointment).then(resp => {
                    this.newAppointment = {};
                }); 
            },
        }
    }
     
</script>
