<template>
  <div class="container mt-2">
    <template v-if='getMode'>
      <IELTSForm :mode="getMode" :current_data="selected" />
    </template> 
    <template v-else>
      <div>
        <b-button class="button is-primary" @click="$store.commit('SET_MODE', 'create')"> Add New</b-button>
      </div>
      <b-table
        :data="getIELTS"
        hoverable
        detailed
      >
        <b-table-column v-slot="props" 
          field="Status"
          label="Status"
          >
            {{ props.row.Status }}
        </b-table-column>
        <b-table-column v-slot="props">
          <div class="column" v-if="['Available'].includes(props.row.Status)">
            <b-field grouped group-multiline>
              <div class="control">
                <b-taglist attached>
                  <b-tag type="is-info is-light">Overall</b-tag>
                  <b-tag type="is-info">{{ props.row.Total_Score }}</b-tag >
                </b-taglist>
              </div>
            </b-field>
          </div>
        </b-table-column>
        <b-table-column v-slot="props" width="5px">
          <b-button v-if="props.row.$editable === true" icon="pencil" @click="setEditMode(props.row)">Edit</b-button>
        </b-table-column>
        <template #detail="props">
          <template v-if=" props.row.Status && ![,'Not Yet Decided','Interested in Without IELTS'].includes(props.row.Status)">
            <b-field grouped group-multiline v-if="['Available'].includes(props.row.Status)">
              <div class="control">
                <b-taglist attached>
                  <b-tag type="is-info is-light">Listening</b-tag>
                  <b-tag type="is-info">{{ props.row.Listening_Score }}</b-tag >
                </b-taglist>
              </div>
              <div class="control">
                <b-taglist attached>
                  <b-tag type="is-info is-light">Reading</b-tag>
                  <b-tag type="is-info">{{ props.row.Reading_Score }}</b-tag >
                </b-taglist>
              </div>
              <div class="control">
                <b-taglist attached>
                  <b-tag type="is-info is-light">Writing</b-tag>
                  <b-tag type="is-info">{{ props.row.Writing_Score }}</b-tag >
                </b-taglist>
              </div>
              <div class="control">
                <b-taglist attached>
                  <b-tag type="is-info is-light">Speaking</b-tag>
                  <b-tag type="is-info">{{ props.row.Speaking_Score }}</b-tag >
                </b-taglist>
              </div>
            </b-field>
            <table>
              <tbody>
                <tr>
                  <td><strong>Board</strong></td>
                  <td>{{ props.row.IELTS_Board}}</td>
                </tr>
                <tr v-if="['Available','Waiting for Results','Exam Date Booked'].includes(props.row.Status)">
                  <td><strong>Mode of Exam</strong></td>
                  <td>{{ props.row.Mode_of_Exam}}</td>
                </tr>
                <tr v-if="['Exam Date Booked'].includes(props.row.Status)">
                  <td><strong>Test Center</strong></td>
                  <td>{{ props.row.Test_Center}}</td>
                </tr>
                <tr v-if="['Exam Date Booked'].includes(props.row.Status)">
                  <td><strong>Test Date</strong></td>
                  <td>{{ props.row.Test_Date}}</td>
                </tr>
                <tr v-if="['Attended Training', 'Attending Training,Yet to take Exam'].includes(props.row.Status)">
                  <td><strong>Planned Exam Date</strong></td>
                  <td>{{ props.row.Planned_Exam_Date}}</td>
                </tr>
                <tr v-if="['Available','Waiting for Results','Exam Date Booked','Attended Training','Attending Training,Yet to take Exam'].includes(props.row.Status)">
                  <td><strong>Training Center</strong></td>
                  <td>
                    {{ props.row.Training_Center_Name}}
                    <span v-if="props.row.Training_Center_Location">{{props.row.Training_Center_Location}}</span>
                  </td>
                </tr>
                <tr v-if="['Available','Waiting for Results','Exam Date Booked','Attended Training','Attending Training,Yet to take Exam'].includes(props.row.Status)">
                  <td><strong>Training Period</strong></td>
                  <td>{{ props.row.Training_Started_On}} - {{ props.row.Training_Ending_On}} </td>
                </tr>
              </tbody>
            </table>
          </template>
        </template>
      </b-table>
      <b-loading :is-full-page="true" v-model="isLoading" :can-cancel="false"></b-loading>
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { ZOHO } from "@/assets/ZohoEmbededAppSDK.min.js";
import IELTSForm from "@/components/IELTSForm"

export default {
  name: "EducationList",
  data() {
    return {
      isLoading: false,
      selected: {},
    };
  },
  components: {
    IELTSForm
  },
  computed: {
    ...mapGetters(["getMode","getEntity","getIELTS"])
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
