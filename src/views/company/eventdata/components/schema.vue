<template>
  <div>
    <div class="edit">
      <svg-icon icon-class="edit" class="editicon" @click="toedit"/>
    </div>
    <el-table
      :data="schemaData.fields"
      class="schemaData"
      max-height="430"
      :row-style="rowstyle"
    >
      <!-- 一行48px -->
      <el-table-column prop="schemaId" label="SchemaId" align="center"></el-table-column>
      <el-table-column prop="name" label="Column Name" align="center"></el-table-column>
      <el-table-column prop="type" label="Column Type" align="center"></el-table-column>
      <el-table-column prop="optional" label="Optional" :formatter="optionalma" align="center"></el-table-column>
      <el-table-column prop="description" label="Description" align="center"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getSchemaList } from "@/api/event";
import { resolve, reject } from "q";
export default {
  data() {
    return {
      schemaData: {},
      editstatus: true,
      pagination: {
        currentPage: 1
      },
      optional: {
        true: "Optional",
        false: "Required"
      },
      seldata: "",
      num: 0
    };
  },
  props: ["selmsg","time"],
  created() {
    this.getcolumn()
  },
  watch: {
    selmsg: "search",
    time:"timechange"
  },
  methods: {
    getcolumn() {
      this.schemaData.id = this.$route.query.scid
      this.getschemalist()
    },
    getschemalist() {
      getSchemaList().then(Response => {
        if (Response.data.code === 0) {
          Response.data.data.schema.forEach(item=>{
            if(item.id===Number(this.schemaData.id)){
              this.schemaData =item
              this.schemaData.fields.forEach((val, index) => {
                val.schemaId =this.schemaData.id
                val.type = 'string' === val.type.toLowerCase() ? 'String' : 'Number';
              });
              this.splicearr(this.schemaData.fields)
            }
          });
        } else {
          this.$message.error(Response.data.msg);
        }
      });
    },
    rowstyle(row, rowIndex) {
      //禁用的不显示
      if (row.status === 0) {
        // console.log("设置")
      } else {
        // return {'color':'#f00'}
      }
    },
    toedit() {
      this.$emit("editstatus", this.editstatus);
    },
    handleSizeChange(val) {
      console.log("handleSizeChange", val);
    },
    handleCurrentChange(val) {
      console.log("handleCurrentChange", val);
    },
    optionalma(row, column) {
      return this.optional[row.optional];
    },
    search(str) {
      console.log(str)
      getSchemaList().then(Response => {
        if (Response.data.code === 0) {
          Response.data.data.schema.forEach(item=>{
            if(item.id===this.schemaData.id){
              this.schemaData =item
              this.schemaData.fields.forEach((val, index) => {
                val.schemaId =this.schemaData.id
                val.type = 'string' === val.type.toLowerCase() ? 'String' : 'Number';
              });
            }
          });
          this.splicearr(this.schemaData.fields).then(()=>{
           this.listcallback(str);
          })

        } else {
          this.$message.error(Response.data.msg);
        }
      });
    },
    splicearr(arr) {
      return new Promise(function(resolve){
        let count = arr.length;
        let num =0
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].status === 0) {
            arr.splice(i--, 1);
          }
          num++;
          if(num ===count){
            resolve()
          }
        }

      })
    },
    listcallback(str){
      if (str != "") {
        const arr = [];
        // console.log("valval");
        this.schemaData.fields.forEach((val, index) => {
          if (val.name.indexOf(str) != -1) {
            arr.push(val);
          }
        });
        this.schemaData.fields = arr;
      } else {
        this.getschemalist();
      }
    },
    timechange(val){
      this.getschemalist();
    }
  },
  computed: {}
};
</script>

<style scoped>
.schemaData {
  /* border: 1px solid #ccc; */
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
  cursor: pointer;
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
