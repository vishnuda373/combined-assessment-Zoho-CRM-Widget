<template>
  <div class="container mt-2">
    <form @submit.prevent="upsertExperience">
      <b-switch :value="experience.Current_Job" v-model="experience.Current_Job" type="is-success" horizontal>Current Job</b-switch>
      <b-switch :value="isGap" v-model="isGap" type="is-danger" horizontal> Is Gap Year </b-switch>
      <b-field v-if="!isGap" label="Title" horizontal>
        <b-input v-model.trim="experience.Name"></b-input>
      </b-field>
      <b-field v-if="!isGap" label="Company" horizontal>
        <b-input v-model.trim="experience.Company"></b-input>
      </b-field>
      <b-field label="From" horizontal>
        <b-datepicker
              v-model="experience.From"
              placeholder="Click to select..."
              icon="calendar-today"
              :max-date="experience.To"
              :locale="locale"
              :icon-right="experience.From ? 'close-circle' : ''"
              @icon-right-click="clearFromDate"
              icon-right-clickable
              trap-focus
              >
          </b-datepicker>
      </b-field>
      <b-field v-if="!experience.Current_Job" label="To" horizontal>
        <b-datepicker
              v-model="experience.To"
              placeholder="Click to select..."
              icon="calendar-today"
              :min-date="experience.From"
              :max-date="currentDate"
              :locale="locale"
              :icon-right="experience.To ? 'close-circle' : ''"
              @icon-right-click="clearToDate"
              trap-focus
              icon-right-clickable
              >
          </b-datepicker>
      </b-field>
      <b-field v-if="!isGap" label="Job Responsibilities" horizontal>
          <b-input v-model.trim="experience.Job_Responsibility" maxlength="200" type="textarea"></b-input>
      </b-field>
      <b-field label="Comments" horizontal>
          <b-input v-model.trim="experience.Comments" maxlength="200" type="textarea"></b-input>
      </b-field>
      <b-switch :value="experience.Is_Experience_Related_to_Higher_Qualification" v-model="experience.Is_Experience_Related_to_Higher_Qualification"
        type="is-info">
             Experience related to Highest Qualification
      </b-switch>
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
import { format,parseISO,addDays } from "date-fns";

export default {
  name: "ExperienceForm",
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
      experience: {
        From: new Date(),
        To: new Date(),
      },
      isGap: false,
      currentDate: new Date(),
      locale: "en-IN",
    }
  },
  computed: {
    ...mapGetters(["getRecord", "getMode", "getEducation", "getExperience"]),
  },
  mounted() {
    if(this.getMode == 'edit' && this.current_data) {
      this.experience = this.current_data;
      if(this.experience.From) {
        this.experience.From = new Date(parseISO(this.experience.From));
      }
      if(this.experience.To) {
        this.experience.To = new Date(parseISO(this.experience.To));
      }
    } else if( this.getMode == 'create') {
      this.setDates();
      this.experience.Is_Experience_Related_to_Higher_Qualification = true;
    }
  },
  methods: {
    setDates(){
      if(this.getExperience){
        this.experience.From = addDays(new Date(parseISO(this.getExperience[0].To)),1);
        this.experience.To = new Date();
      } else if(this.getEducation){
        this.experience.From = addDays(new Date(parseISO(this.getEducation[0].Year_of_Completion)),1);
        this.experience.To = new Date();
      }
    },
    upsertExperience() {
      if(this.mode === 'create') {
        this.experience.Lead = this.getRecord.id;
      }
      console.log(this.experience);
      this.experience.From = this.experience.From ? format(this.experience.From, 'yyyy-MM-dd') : '';
      if(!this.experience.Current_Job) {
        this.experience.To = format(this.experience.To, 'yyyy-MM-dd');
      } else {
        this.experience.To = null;
      }
      ZOHO.CRM.API.upsertRecord({
        Entity: "Experiences",
        APIData: this.experience,
        duplicate_check_fields: ["id"]
      })
      .then((response) => {
        console.log("Success");
        console.log(response);
        this.$store.dispatch("setExperience");
      })
      .catch((error) => {
        console.error("Failed");
        console.error(error);
      })
      .finally(() => {
        this.$store.commit("SET_MODE", '');
      })
    },
    clearFromDate () {
      this.experience.From = null;
    },
    clearToDate () {
      this.experience.To = null;
    },
  },
  beforeDestroy() {
    this.getExperience.filter((item) => {
      if(item.id == this.experience.id) {
        item.From = item.From ? format(item.From, 'yyyy-MM-dd') : '';
        item.To = item.To ? format(item.To, 'yyyy-MM-dd') : '';
      }
    })
  },
};
</script>

<style></style>
