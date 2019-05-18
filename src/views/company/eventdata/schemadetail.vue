<template>
  <div class="Datadeal-container">
    <div class="tablebody">
      <div class="tablebody-top">
        <div class="tablebody-title">
              <span class="tablename">{{schemaDetail.schema}}</span>
              <div class="description">
                <p>Description:</p>
                 <div class="edit">
                    <svg-icon icon-class="edit" class="editicon" @click="toedit" v-if='!scdes'/>
                </div>
                <span v-if='!scdes' class="desmsg">{{schemaDetail.description}}</span>
                <div class="desbtn" v-else>
                  <el-input type="text" size="small" class="scdescription" v-model="tabledesin"></el-input>
                  <el-button class='btng' type="primary" icon="el-icon-check" size="mini"  @click="editconfirm()"></el-button>
                  <el-button class='btng' icon="el-icon-close" size="mini" @click="editcancel()"></el-button>
                </div>
              </div>
        </div>
      </div>
      <div class="tablebody-main">
        <ul>
          <li>
            <span v-if='showSearch' class="selmsg">
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
import { getSchemaList, updateSchema } from "@/api/event";
export default {
  data() {
    return {
      scdes:false,
      showSearch:true,
      schemaDetail:{},
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
      tabledesin:''
    };
  },
  components: {
    schema,
    schemaedit,
    schemadata
  },
  created() {
    this.getschemalist()
  },
  mounted() {},
  methods: {
     getschemalist() {
      getSchemaList().then(Response => {
        if (Response.data.code === 0) {
         Response.data.data.schema.forEach(item => {
           if(item.id===Number(this.$route.query.scid)){
             this.schemaDetail=item
           }
         });
        } else {
          this.$message.error(Response.data.msg);
        }
      })
     },
    editstatu(value) {
      this.editstatus = value;
      this.selmsg=''
      this.seldata=''
    },
    tabClick(value){
       if(value.index==='1'){
         this.showSearch=false;
       }else{
         this.searchph='Search Ccolumn '
         this.showSearch=true;
         this.options =[]
       }
        this.editstatus = false;
        this.selmsg=''
        this.seldata=''
        this.seldatamsg=''
        this.time =new Date().getTime()
        this.getschemalist()
    },
    search(){
      if(this.searchph==='Search cFBID'){
        this.seldatamsg='cFBID:'+this.seldata
      }else{
        this.selmsg=this.seldata
      }
    },
    toedit(){
      this.scdes=true
      this.tabledesin=this.schemaDetail.description
    },
    editcancel(){
       this.$confirm('Click Yes will not to save any edit, sure to continue?', 'Information', {
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                type: 'warning'
                }).then(() => {
                    this.scdes=false
                }).catch((e) => {
                console.log(e)
        });
    },
    editconfirm(){
      const data={}
      data.schemaId=this.schemaDetail.id
      data.description=this.tabledesin
      if (data.description.length > 200) {
        return this.$message.warning(
          "The maximum length of Description is 200 characters."
        )
      }
      updateSchema(data).then(Response=>{
        if(Response.data.code===0){
          this.schemaDetail = Response.data.data.schema
          this.scdes=false
        }else{
          return  this.$message.error(Response.data.msg);
        }
      })
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
.desmsg{
  border: 1px solid #fff;
  display: block;
  width: 200px;
  word-wrap: break-word;
  white-space: normal;
}
.scdescription{
  width:450px;
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
  height: 50px;
  right: 0;
  top: -10px;
  position: absolute;
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
.desbtn{
  width: 400px;
}
.btng{
  float: right;
  margin-left: 5px;
  padding: 5px;
}
</style>
