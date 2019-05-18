<template>
  <div class="Datadeal-container">
    <div class="tablebody">
      <div class="tablebody-top">
        <div class="tablebody-title">
              <span class="tablename">User</span>
              <div class="description">
                <p>Description:</p>
                <span>{{tabledes}}</span>
              </div>
        </div>
      </div>
      <div class="tablebody-main">
        <ul>
          <li>
            <span class="selmsg">
              <el-select v-if='options.length>0' size="small" v-model="iddata">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <!-- <el-input
                :placeholder="searchph"
                v-model="seldata"
                class="selmsginput"
                size="small"
                clearable
              ></el-input>
              <el-button type="info" class='btncss' size="small" icon="el-icon-search" @click="search"></el-button> -->
              <el-input v-model="seldata" size="small" :placeholder="searchph" class="selmsginput" clearable>
                <el-button icon="el-icon-search" type="primary"  @click="search" slot="append"></el-button>
              </el-input>
            </span>
            <div class="tabchange">
              <el-tabs v-model="activeName" @tab-click='tabClick'>
                <el-tab-pane label="Schema" name="Schema">
                  <schema v-if="!editstatus" @editstatus="editstatu" :selmsg='selmsg' :time='time'></schema>
                  <schemaedit :selmsg='selmsg' :time='time' @editstatus="editstatu" v-else></schemaedit>
                </el-tab-pane>
                <el-tab-pane label="Data" name="Data">
                  <schemadata :seldatamsg='seldatamsg' :time='time'></schemadata>
                </el-tab-pane>
              </el-tabs>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import schema from "./components/schema";
import schemaedit from "./components/schemaedit";
import schemadata from "./components/schemadata";
export default {
  data() {
    return {
      usermsgs: {
        tablename: "",
        size: "",
        rows: "",
        pics: ""
      },
      options:[],
      iddata:'cFBID',
      schemaData: [],
      time: 1,
      editstatus: false,
      seldata: "",
      selmsg:'',
      seldatamsg:'',
      origindata: {},
      activeName: "Schema",
      searchph:'Search Column Name',
      tabledes:
        "User Registration Data，which contain the data of user attributes."
    };
  },
  components: {
    schema,
    schemaedit,
    schemadata
  },
  created() {},
  mounted() {},
  methods: {
    editstatu(value) {
      this.editstatus = value;
      this.selmsg=''
      this.seldata=''
    },
    tabClick(value){
       if(value.index==='1'){
         this.searchph='Search cFBID or custUserId'
         this.options =[{
          value: 'cFBID',
          label: 'cFBID'
        }, {
          value: 'custUserId',
          label: 'custUserId'
        }]
       }else{
         this.searchph='Search Column Name'
         this.options =[]
       }
        this.editstatus = false;
        this.selmsg=''
        this.seldata=''
        this.seldatamsg=''
        this.time =new Date().getTime()
    },
    search(){
      if(this.searchph==='Search cFBID or custUserId'){
        this.seldatamsg=this.iddata+':'+this.seldata
      }else{
        this.selmsg=this.seldata
      }
    }
  },
  computed: {}
};
</script>

<style scoped>
.Datadeal-container {
  width: 100%;
  background-color: rgb(246,246,247);
  margin-bottom: 1px;
}
.tablebody {
  width: 100%;
  background-color: rgb(246,246,247);
}
.tablebody-top {
  position: relative;
  width: 100%;
  font-size: 0px;
  height: 18vh;
  background-color: #fff;
  padding: 1vh 5vh;
}
.tablename {
  position: absolute;
  font-size: 3vh;
  font-weight: 700;
  height: 100px;
  padding: 15px;
}
.msg span {
  display: inline-block;
  width: 60px;
  font-size: 12px;
  padding: 0 20px;
}
.description {
  position: absolute;
  font-size: 1.5vh;
  bottom: 5vh;
  right: 20vh;
}
.description p {
  /* margin-top: 90px; */
}
.tablebody-main {
  width: 96%;
  margin: 0 auto;
  margin-top: 3vh;
  padding: 2vh;
  border: 1px solid rgb(197,197,197);
  background-color: #fff;
  
}
.tabchange{
  padding-top: 2px;
}
img {
  cursor: pointer;
}
.schemaData {
  /* border: 1px solid #ccc; */
}
.edit {
  padding: 10px;
  border: 1px solid #f00;
  height: 50px;
}
.editicon {
  width: 30px;
  height: 30px;
  color: #459ffc;
  float: right;
}
.selmsg {
  position: absolute;
  right: 62px;
  z-index: 990;
  font-size: 0;
}
.selmsg .el-select{
  position: absolute;
  right: 300px;
  z-index: 990;
  width: 150px;
}
.selmsginput {
  width: 280px;
  border: none;
}
</style>    