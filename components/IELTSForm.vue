<template>
  <div class="container mt-2">
    <form @submit.prevent="upsertIELTS">
      <div>
        <b-field label="Status" horizontal>
          <b-select v-model.trim="ielts.Status" placeholder="None">
            <option
                v-for="option in status_options"
                :value="option"
                :key="option">
                {{ option }}
            </option>
          </b-select>
        </b-field>
        <template v-if=" ielts.Status && ![,'Not Yet Decided','Interested in Without IELTS'].includes(ielts.Status)">
          <b-field label="IELTS Board" horizontal>
            <b-select v-model.trim="ielts.IELTS_Board">
              <option
                  v-for="option in board_options"
                  :value="option"
                  :key="option">
                  {{ option }}
              </option>
            </b-select>
          </b-field>
          <b-field label="Mode of Exam" horizontal v-if="['Available','Waiting for Results','Exam Date Booked'].includes(ielts.Status)">
            <b-select v-model.trim="ielts.Mode_of_Exam">
              <option
                  v-for="option in exam_modes"
                  :value="option"
                  :key="option">
                  {{ option }}
              </option>
            </b-select>
          </b-field>
          <div class="columns" v-if="['Available'].includes(ielts.Status)">
            <div class="column">
              <b-field label="Band Score">
                <b-select v-model.number="ielts.Total_Score">
                  <option
                      v-for="option in score_options"
                      :value="option"
                      :key="option">
                      {{ option }}
                  </option>
                </b-select>
              </b-field>
            </div>
            <div class="column">
              <b-field label="Listening Score">
                <b-select v-model.number="ielts.Listening_Score">
                  <option
                      v-for="option in score_options"
                      :value="option"
                      :key="option">
                      {{ option }}
                  </option>
                </b-select>
              </b-field>
            </div>
            <div class="column">
              <b-field label="Reading">
                <b-select v-model.number="ielts.Reading_Score">
                  <option
                      v-for="option in score_options"
                      :value="option"
                      :key="option">
                      {{ option }}
                  </option>
                </b-select>
              </b-field>
            </div>
            <div class="column">
              <b-field label="Writing">
                <b-select v-model.number="ielts.Writing_Score">
                  <option
                      v-for="option in score_options"
                      :value="option"
                      :key="option">
                      {{ option }}
                  </option>
                </b-select>
              </b-field>
            </div>
            <div class="column">
              <b-field label="Speaking Score">
                <b-select v-model.number="ielts.Speaking_Score">
                  <option
                      v-for="option in score_options"
                      :value="option"
                      :key="option">
                      {{ option }}
                  </option>
                </b-select>
              </b-field>
            </div>
          </div>
          <template v-if="['Exam Date Booked', 'Waiting for Results', 'Available'].includes(ielts.Status)">
            <b-field label="Test Center" horizontal>
              <b-input v-model="ielts.Test_Center"></b-input>
            </b-field>
            <b-field label="Test Date" horizontal>
              <b-datepicker
                    v-model="ielts.Test_Date"
                    placeholder="Click to select..."
                    :locale="locale"
                    icon="calendar-today"
                    trap-focus>
                </b-datepicker>
            </b-field>
          </template>
          <b-field label="Planned Exam Date" horizontal v-if="['Attended Training', 'Attending Training,Yet to take Exam'].includes(ielts.Status)">
            <b-datepicker
                  v-model="ielts.Planned_Exam_Date"
                  placeholder="Click to select..."
                  :locale="locale"
                  icon="calendar-today"
                  trap-focus>
              </b-datepicker>
          </b-field>
          <b-field label="Expected Result Date" horizontal v-if="['Waiting for Results', 'Exam Date Booked'].includes(ielts.Status)">
            <b-datepicker
                  v-model="ielts.Expected_Result_Date"
                  placeholder="Click to select..."
                  :locale="locale"
                  icon="calendar-today"
                  trap-focus>
              </b-datepicker>
          </b-field>
          <template v-if="['Available','Waiting for Results','Exam Date Booked','Attended Training','Attending Training,Yet to take Exam'].includes(ielts.Status)">
            <b-field label="Traning Center" horizontal>
              <b-input v-model="ielts.Training_Center_Name"></b-input>
            </b-field>
            <b-field label="Traning Center Location" horizontal>
              <b-input v-model="ielts.Training_Center_Location"></b-input>
            </b-field>
          </template>
          <div class="columns" v-if="['Waiting for Results','Exam Date Booked','Attended Training','Attending Training,Yet to take Exam'].includes(ielts.Status)">
            <b-field class="column" label="Training Start Date">
              <b-datepicker
                    v-model="ielts.Training_Started_On"
                    placeholder="Click to select..."
                    :locale="locale"
                    icon="calendar-today"
                    trap-focus>
                </b-datepicker>
            </b-field>
            <b-field class="column" label="Training End Date">
              <b-datepicker
                    v-model="ielts.Training_Ending_On"
                    placeholder="Click to select..."
                    :locale="locale"
                    icon="calendar-today"
                    trap-focus>
                </b-datepicker>
            </b-field>
          </div>
          <b-field>
            <b-switch 
              :value="ielts.Interested_in_Booking_Exam_Date_through_us"
              v-model="ielts.Interested_in_Booking_Exam_Date_through_us"
              type="is-primary"
              horizontal
              v-if="['Attended Training', 'Attending Training,Yet to take Exam'].includes(ielts.Status)"
            >
              Interested in Booking Exam Date through us
            </b-switch>
          </b-field>
        </template>
        <b-field>
          <b-switch
            :value="ielts.Interested_in_Our_Online_Training"
            v-model="ielts.Interested_in_Our_Online_Training"
            type="is-primary"
            horizontal
            v-if="['Not Yet Decided','Interested in Without IELTS'].includes(ielts.Status)"
          >
            Interested in Our Online Training
          </b-switch>
        </b-field>
        </div>
      <div class="field is-grouped is-pulled-right">
        <div class="control">
          <button class="button is-link">Submit</button>
        </div>
        <div class="control">
          <button
            class="button is-link is-light"
            @click="$store.commit('SET_MODE', '')"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { ZOHO } from "@/assets/ZohoEmbededAppSDK.min.js";
import { format, parseISO,addDays } from "date-fns";

export default {
  name: "IELTSForm",
  props: {
    mode : {
      type: String,
      default: 'edit'
    },
    current_data: {
      type: Object,
    }
  },
  data() {
    return {
      isLoading: false,
      ielts: {},
      locale: "en-IN",
      status_options: ["Available","Waiting for Results","Exam Date Booked","Attended Training","Attending Training,Yet to take Exam","Not Yet Decided","Interested in Without IELTS"],
      score_options: [9,8.5,8,7.5,7,6.5,6,5.5,5,4.5,4,3.5,3,2.5,2,1.5,1,0.5,0],
      board_options: ['IDP'],
      exam_modes: ['Online', 'Offline'],
    }
  },
  computed: {
    ...mapGetters(["getRecord", "getMode"]),
  },
  mounted() {
    if(this.getMode == 'edit' && this.current_data) {
      this.ielts = this.current_data;
      if(this.ielts.Test_Date) {
        this.ielts.Test_Date = new Date(parseISO(this.ielts.Test_Date));
      }
      if(this.ielts.Planned_Exam_Date) {
        this.ielts.Planned_Exam_Date = new Date(parseISO(this.ielts.Planned_Exam_Date));
      }
      if(this.ielts.Expected_Result_Date) {
        this.ielts.Expected_Result_Date = new Date(parseISO(this.ielts.Expected_Result_Date));
      }
      if(this.ielts.Training_Started_On) {
        this.ielts.Training_Started_On = new Date(parseISO(this.ielts.Training_Started_On));
      }
      if(this.ielts.Training_Ending_On) {
        this.ielts.Training_Ending_On = new Date(parseISO(this.ielts.Training_Ending_On));
      }
    };
  },
  watch: {
    'ielts.Test_Date': function(newValue) {
      if(newValue) {
        console.log(`Setting expected result date for ${newValue}`)
        if(this.ielts.Mode_of_Exam === 'Offline') {
          console.log('Offline mode, adding 14 days');
          this.ielts.Expected_Result_Date = addDays(newValue, 14);
        } else if(this.ielts.Mode_of_Exam === 'Online') {
          console.log('Online mode, adding 7 days');
          this.ielts.Expected_Result_Date = addDays(newValue, 7);
        }
      }
    },
  },
  methods: {
    upsertIELTS() {
      console.log(`Upserting IELTS Record`);
      if(this.mode === 'create') {
        this.ielts.Lead = this.getRecord.id;
      }
      this.ielts.Test_Date = this.ielts.Test_Date ? format(this.ielts.Test_Date, 'yyyy-MM-dd') : '';
      this.ielts.Planned_Exam_Date = this.ielts.Planned_Exam_Date ? format(this.ielts.Planned_Exam_Date, 'yyyy-MM-dd') : '';
      this.ielts.Expected_Result_Date = this.ielts.Expected_Result_Date ? format(this.ielts.Expected_Result_Date, 'yyyy-MM-dd') : '';
      this.ielts.Training_Started_On = this.ielts.Training_Started_On ? format(this.ielts.Training_Started_On, 'yyyy-MM-dd') : '';
      this.ielts.Training_Ending_On = this.ielts.Training_Ending_On ? format(this.ielts.Training_Ending_On, 'yyyy-MM-dd') : '';
      ZOHO.CRM.API.upsertRecord({
        Entity: "IELTS_Applications",
        APIData: this.ielts,
        duplicate_check_fields: ["id"]
      })
      .then((response) => {
        console.log("Success");
        console.log(response);
        this.$store.dispatch("setIELTS");
      })
      .catch((error) => {
        console.error("Failed");
        console.error(error);
      })
      .finally(() => {
        this.$store.commit("SET_MODE", '');
      })
    },
  }
};
</script>

<style></style>
