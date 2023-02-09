<template>
  <div class="container mt-2">
    <template v-if='getMode'>
      <ExperienceForm :mode="getMode" :current_data="selected" />
    </template> 
    <template v-else>
      <div>
        <b-button class="button is-primary" @click="$store.commit('SET_MODE', 'create')"> Add New</b-button>
      </div>
      <b-table
        :data="getExperience"
        hoverable
        detailed 
      >
        <b-table-column v-slot="props" 
          field="Name"
          label="Title"
          >
            <span>{{ props.row.Name }}</span>
        </b-table-column>
        <b-table-column v-slot="props"
          field="Company"
          label="Company"
          >
            {{ props.row.Company }}
        </b-table-column>
        <b-table-column v-slot="props"
          field="From"
          label="From"
          >
            {{ props.row.From }}
        </b-table-column>
        <b-table-column v-slot="props"
          field="To"
          label="To"
          >
          <span v-if="props.row.Current_Job">Current</span>
          <span v-else>{{ props.row.To }}</span>
        </b-table-column>
        <b-table-column v-slot="props" width="5px">
          <b-button v-if="props.row.$editable === true" icon="pencil" @click="setEditMode(props.row)">Edit</b-button>
        </b-table-column>
        <template #detail="props">
            <strong>Job Responsibilities</strong> <br/> &nbsp;&nbsp; <span>{{ props.row.Job_Responsibility }}</span>
            <div v-if="props.row.Comments">
              <strong>Comments</strong> <br/> &nbsp;&nbsp; <span>{{ props.row.Comments }}</span>
            </div>
        </template>
      </b-table>
      <b-loading :is-full-page="true" v-model="isLoading" :can-cancel="false"></b-loading>
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { ZOHO } from "@/assets/ZohoEmbededAppSDK.min.js";
import ExperienceForm from "@/components/ExperienceForm"

export default {
  name: "EducationList",
  data() {
    return {
      isLoading: false,
      selected: {},
    };
  },
  components: {
    ExperienceForm
  },
  computed: {
    ...mapGetters(["getMode","getEntity","getExperience"])
  },
  methods: {
    setEditMode(payload) {
      this.selected = payload;
      this.$store.commit("SET_MODE", 'edit');
    },
  }
};
</script>

<style>
  .detail-container {
    padding: 0 !important;
  }
</style>
