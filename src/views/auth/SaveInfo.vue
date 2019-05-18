<template>
  <div class="si">
    <div class="user-top">
      <div class="top-title">Edit authorization</div>
      <div class="top-des">
              <p>Description:</p>
              <span>Selected columns will be authorized to other customers</span>
      </div>
    </div>
    <div class="contain">
      <p class="contain-title">Save Authorization</p>
      <div class="contain-main">
        <el-form label-position="left" label-width="150px">
          <el-form-item label="Authorization Field">
            <el-tag
              v-for="(item,index) in tags"
              :index="index"
              :key="index"
              style="margin: 0 3px 3px 0"
            >{{item.name}}</el-tag>
          </el-form-item>
          <el-form-item label="Schema Name">
            <span>{{schemaName}}</span>
          </el-form-item>
          <el-form-item label="Grantee">
            <el-select v-model="item" filterable disabled :placeholder="selectedName"></el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="step">
        <el-button type="info" size='small' @click="toPrev()">Previous</el-button>
        <el-button type="primary" size='small' @click="toConfirm()">Confirm</el-button>
        <el-button type="info" size='small' @click="toConceal()">Cancel</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuthList, addPermission, getEditList } from "@/api/auth";
export default {
  data() {
    return {
      form: [],
      schemaName: "",
      tags: [],
      selected: this.$route.query.selected,
      options: [],
      item: "",
      schema: 0,
      selectedSchema: 4,
      selectedName: "",
      schemaName: "",
      selectedId: ""
    };
  },
  methods: {
    getAuthList() {
      getAuthList({
        custId: this.$route.query.custId
      }).then(res => {
        this.selectedSchema = res.data.data.grants[this.$route.query.id];
        this.selectedName = this.selectedSchema.toCust.name;
        this.selectedId = this.selectedSchema.toCust.id;
        this.schemaName = this.selectedSchema.schema.schema;
        this.getEditList();
      });
    },
    getEditList() {
      getEditList({
        tarCustId: Number(this.$route.query.custId),
        custId: this.$route.query.custId,
        schemaId: this.selectedSchema.schema.id
      }).then(res => {
        var selectedArr = new Array();
        selectedArr = this.selected.split(",");
        res.data.data.schema.fields.forEach(item => {
          if (selectedArr.indexOf(String(item.id)) !== -1) {
            this.tags.push(item);
          }
        });
      });
    },
    toPrev() {
      this.$router.push({
        path: `/auth/editauth?custId=${this.$route.query.custId}&id=${
          this.$route.query.id
        }&selected=${this.$route.query.selected}&search=${
          this.$route.query.search
        }&name=${this.$route.query.name}`
      });
    },
    toConfirm() {
      const data = {};
      data.custId = Number(this.$route.query.custId);
      (data.tarCustId = this.selectedId),
        (data.schemaId = this.selectedSchema.schema.id),
        (data.fields = new Array());
      this.tags.forEach(item => {
        data.fields.push(item.id);
      });
      addPermission(data).then(res => {
        this.$alert(
          "Authorization is completed and  jumps to authorization list page!",
          "Information",
          {
            confirmButtonText: "Yes",
            callback: action => {
              this.$router.push({
                path: `/auth/al?custId=${this.$route.query.custId}&name=${this.$route.query.name}`
              });
            }
          }
        );
      });
    },
    toConceal() {
      this.$confirm(
        "Click Yes will not to save any edit, sure to continue?",
        "Information",
        {
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          type: "warning"
        }
      )
        .then(() => {
          this.$router.push({
            path: `/auth/al?custId=${this.$route.query.custId}&name=${this.$route.query.name}`
          });
        })
        .catch(e => {
          console.log(e);
        });
    }
  },
  created() {
    this.getAuthList();
  }
};
</script>
<style scoped>
.si {
  background-color: rgb(246, 246, 247);
  padding-bottom: 3vw;
  overflow: scroll;
}
.user-top {
  position: relative;
  width: 100%;
  font-size: 0px;
  height: 18vh;
  background-color: #fff;
  padding: 1vh 5vh;
}
.top-title {
  position: absolute;
  font-size: 3vh;
  font-weight: 700;
  height: 100px;
  padding: 15px;
  width: 25%;
}
.top-des {
  position: absolute;
  font-size: 1.5vh;
  bottom: 5vh;
  right: 20vh;
}
.contain {
  width: 50%;
  margin: 3vw auto 0 auto;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.contain-title {
  font-size: 2.3vh;
  width: 100%;
  padding: 0 0 1% 1%;
  border-bottom: 1px solid #ccc;
}
.contain-main {
  padding: 1%;
}
.step {
  text-align: center;
  padding-bottom: 1%;
}
.step .el-button{
    width: 100px;
    text-align: center;
}
</style>

