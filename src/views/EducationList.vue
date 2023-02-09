<template>
  <div class="container mt-2">
    <template v-if='getMode'>
      <EducationForm :mode="getMode" :current_data="selected" />
    </template>
        <template v-else>
          <div>
            <b-button class="button is-primary" @click="$store.commit('SET_MODE', 'create')"> Add New</b-button> 
          </div>
       <b-table
        :data="getEducation"
        hoverable
        detailed
      >
      <b-table-column v-slot="props"
      >
        <span v-if="props.row.$editable === true">
          <b-icon icon="check" type="is-success"></b-icon>
        </span>
        <span v-else>
          <b-icon icon="lock" type="is-danger"></b-icon>
        </span>
      </b-table-column>
      <b-table-column v-slot="props" 
        field="Name"
        label="Qualification"
        >
          <span v-if="props.row.Stream">{{ props.row.Stream }}</span>
          <span v-else-if="props.row.Name == 'Plus Two' && props.row.Major_in_12th">{{ props.row.Name }} {{ props.row.Major_in_12th}}</span>
          <span v-else>{{ props.row.Name }}</span>

      </b-table-column>
       <b-table-column v-slot="props"
        field="Institution"
        label="Institution"
        >
          {{ props.row.Institution }}
          <template v-if="props.row.State_of_University">, {{props.row.State_of_University}}</template>
          <p v-if="setType(props.row.Name) == 'School'"><small>{{ props.row.Board}}</small></p>
          <p v-else-if="setType(props.row.Name) == 'College'"><small>{{ props.row.University}}</small></p>
     </b-table-column>
      <b-table-column v-slot="props"
        field="Year_of_Completion"
        label="Year of Completion"
        >
          {{ props.row.Year_of_Completion }}
      </b-table-column>
      <b-table-column v-slot="props" width="5px">
        <b-button v-if="props.row.$editable === true" icon="pencil" @click="setEditMode(props.row)">Edit</b-button>
      </b-table-column>

      <template #detail="props">
          <div class="column">
            <template v-if="props.row.Name == 'Plus Two' && props.row.Major_in_12th?.includes('PCM')">
              <table>
                <tbody>
                  <tr><td>Physics</td><td>{{props.row.Physics_Score}}</td></tr>
                  <tr><td>Chemistry</td><td>{{props.row.Chemistry_Score}}</td></tr>
                  <tr><td>Maths</td><td>{{props.row.Maths_Score}}</td></tr>
                  <tr v-if="props.row.Major_in_12th == 'PCMB'"><td>Biology</td><td>{{props.row.Biology_Score}}</td></tr>
                </tbody>
              </table>
            </template>
            <template v-if="setType(props.row.Name) == 'College'">
              <table>
                <tbody>
                  <tr>
                    <td>Number of Backlogs</td>
                      <td v-if="props.row.Number_of_Backlogs > 0">{{props.row.Number_of_Backlogs}}</td>
                      <td v-else>0</td> 
                  </tr>
                  <tr>
                    <td>List of Backlogs</td>
                    <td v-if="props.row.Number_of_Backlogs > 0">{{props.row.Backlogs}}</td>
                    <td v-else>None</td>
                  </tr>
                  <tr>
                    <td >Subjects below 50%</td>
                    <td v-if="props.row.Number_of_Subjects_Below_50">{{props.row.Number_of_Subjects_Below_50}}</td>
                    <td v-else>None</td>
                  </tr>
                </tbody>
              </table>
            </template>
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
import EducationForm from "@/components/EducationForm"

export default {
  name: "EducationList",
  data() {
    return {
      isLoading: false,
      selected: {},
    };
  },
  components: {
    EducationForm
  },
  computed: {
    ...mapGetters(["getMode","getEducation"])
  },
  methods: {
    setType(type){
      if(type == '' || type == "Plus Two" || type == "SSLC") {
        return "School";
      } else {
        return "College";
      }
    },
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
