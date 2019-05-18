<template>
  <div>
    <div>
      <el-table :data="schemaData" class="schemaData" max-height="430" width='150%'>
        <el-table-column prop="ts" label="Ts" width='300' align="center" ></el-table-column>
        <el-table-column prop="lng" label="Lng" width='100' align="center" ></el-table-column>
        <el-table-column prop="lat" label="Lat" width='100' align="center" ></el-table-column>
        <el-table-column prop="address" label="Address" width='300' align="center" ></el-table-column>
        <el-table-column  v-for="(v,i) in fields"
                          :key="i" :prop="v.name" :label="v.name"  v-if='v.status===1' :width="fields.length>5?200:null" align="center"></el-table-column>
      </el-table>
      <div class="pagination"></div>
    </div>
  </div>
</template>

<script>
import { getSchemaList } from "@/api/event";
import { eventDatalist } from "@/api/getlist";
import { getToken } from '@/utils/auth'
export default {
  data() {
    return {
      schemaData:[],
      editstatus: true,
      pagination: {
        currentPage: 1
      },
      selid:'',
      userinfo:{},
      fields:[]
    };
  },
  created() {
    // this.getschemadata();
  },
  mounted() {},

  props: ["seldatamsg","time"],
  watch: {
    seldatamsg: "search",
    time:"timechange"
  },
  methods: {
    getschemadata() {
      this.schemaData.id = this.$route.query.scid
      getSchemaList().then(Response => {
        if (Response.data.code === 0) {
          Response.data.data.schema.forEach(item=>{
            if(item.id===Number(this.schemaData.id)){
              this.fields =item.fields
              this.fields.forEach((val, index) => {
                if(val.status===0){
                  this.fields.splice(index,1)
                }
              });
            }
          });
          const data ={}
          data.schemaId=this.$route.query.scid
           data.limit =20
              data.access_token=getToken()
              eventDatalist(data).then(Response=>{
                if(Response.data.code === 0){
                  this.schemaData = Response.data.data.attrs
                }else{
                  this.$message.error(Response.data.msg);
                }
              })
        } else {
          this.$message.error(Response.data.msg);
        }
      });
    },
    handleSizeChange(val) {
      console.log("handleSizeChange", val);
    },
    handleCurrentChange(val) {
      console.log("handleCurrentChange", val);
    },
    search(val){
      if(val.split(':')[1]===''||val.split(':')[0]===''){
        this.getschemadata()
      }else{
        const seamsg=val.split(':')
        const data={}
        data[seamsg[0]]=seamsg[1]
        const schemaId=this.userinfo.id
        let attrNames=[]
        this.fields.forEach(item =>{
          if(item.status===1&&(item.name!=='custUserId')){
            attrNames.push(item.name)
          }
        })
        data.attrs=[{
          schemaId,
          attrNames
        }]
        searchByid(data).then(Response=>{
          if(Response.data.code === 0){
            if(Response.data.data.attrs.length===0){
              this.schemaData=[{}]
            }else{
              this.schemaData =Response.data.data.attrs
            }
            this.schemaData.forEach((val,index) => {
              val['cfbid']=Response.data.data.cFBID
              val['custUserId']=Response.data.data.custUserId
            });
          }else{
            this.schemaData =null
          }
        })
      }
    },
  timechange(val){
      this.getschemadata();
    }
  },
  computed: {}
};
</script>

<style scoped>
.schemaData {
  /* border: 1px solid #ccc; */
  overflow: auto;
  margin-top: 50px;
}
.edit {
  padding: 10px;
  height: 50px;
}
.editicon {
  width: 30px;
  height: 30px;
  color: #459ffc;
  float: right;
}
.pagination {
  width: 100%;
  padding: 10px;
}
.el-pagination {
  margin-left: 50%;
  transform: translate(-50%);
}
</style>
