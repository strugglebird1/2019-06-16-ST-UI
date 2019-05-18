<template>
  <div class="schemaedit">
    <div class="edit">
      <div class="editicon">
        <!-- <el-button type="primary" size="mini">添加</el-button> -->
        <svg-icon icon-class="add" class="idel" @click="addMasterUser()"/>
        <svg-icon
          v-if="multipleSelection.length>0"
          icon-class="jinyong"
          class="idel"
          @click="allidel"
        />
        <svg-icon v-else icon-class="jinyong" class="idel idelc"/>
      </div>
    </div>
    <el-row>
      <el-col :span="24" v-show="master_user.data">
        <el-table
          ref="table"
          :row-style="rowStyle"
          size="mini"
          :data="master_user.data.fields"
          highlight-current-row
          @selection-change="handleSelectionChange"
          max-height="382"
        >
          >
          <el-table-column type="selection" align="center" disabled :selectable="selectable"></el-table-column>
          <el-table-column
            v-for="(v,i) in master_user.columns"
            :key="i"
            :prop="v.field"
            :label="v.title"
            :width="v.width"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.isSet">
                <el-select
                  v-if="v.field==='type'"
                  v-model="master_user.sel[v.field]"
                  placeholder="Column Type"
                  size="mini"
                >
                  <el-option
                    v-for="item in optionstype"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-select
                  v-else-if="v.field==='optional'"
                  v-model="master_user.sel[v.field]"
                  placeholder="Optional"
                  size="mini"
                >
                  <el-option
                    v-for="item in optionsop"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <span v-else-if="v.field==='status'"></span>
                <el-input
                  v-else
                  size="mini"
                  :placeholder="v.title"
                  v-model="master_user.sel[v.field]"
                ></el-input>
              </span>
              <span v-else>{{scope.row[v.field]}}</span>
            </template>
          </el-table-column>
          <el-table-column label="Operation" width="160" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.isSet" style="cursor: pointer;">
                <el-button-group class="elbtng">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="pwdChange(scope.row,scope.$index,true)"
                  >Save</el-button>
                  <el-button size="mini" @click="pwdChange(scope.row,scope.$index,false)">Cancel</el-button>
                </el-button-group>
              </span>
              <span v-else style="cursor: pointer;">
                <svg-icon
                  v-if="scope.row.status==='Normal'"
                  icon-class="jinyong"
                  class="idel"
                  @click="idel(scope.row)"
                />
                <svg-icon v-else icon-class="huifu" class="idel" @click="refresh(scope.row)"/>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="24">
        <div class="el-table-add-row" style="width: 100%;" @click="addMasterUser()">
          <span>
            <i class="el-icon-plus"></i>
          </span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  getSchemaList,
  disableColumn,
  enableColumn,
  setColumn
} from "@/api/event";
export default {
  data() {
    return {
      generateId: {
        _count: 1,
        get() {
          return +new Date() + "_" + this._count++;
        }
      },
      master_user: {
        sel: {}, //选中行
        columns: [
          { field: "name", title: "Column Name" },
          { field: "type", title: "Column Type" },
          { field: "optional", title: "Optional" },
          { field: "description", title: "Description" },
          { field: "status", title: "State" }
        ],
        data: {}
      },
      multipleSelection: [],
      add: { type: "", optional: "" },
      optionstype: [
        {
          value: "number",
          label: "Number"
        },
        {
          value: "string",
          label: "String"
        }
      ],
      optionsop: [
        {
          value: false,
          label: "Required"
        },
        {
          value: true,
          label: "Optional"
        }
      ],
      editswitch: "",
      pagination: {
        currentPage: 1
      },
      statusq: {
        "1": "Normal",
        "0": "Forbidden"
      },
      optionalq: {
        true: "Optional",
        false: "Required"
      },
      columnty: {
        number: "Number",
        string: "String"
      },
      addstatus: null
    };
  },
  props: ["selmsg", "time"],
  watch: {
    selmsg: "search",
    time: "timechange"
  },
  created() {
    this.getcolumn();
  },
  mounted() {},
  methods: {
    getcolumn() {
      this.master_user.data.id = this.$route.query.scid
      this.getschemalist()
    },
    getschemalist() {
      getSchemaList().then(Response => {
        if (Response.data.code === 0) {
          Response.data.data.schema.forEach(item => {
            if (item.id === Number(this.master_user.data.id)) {
              this.master_user.data = item;
              this.master_user.data.fields.forEach((val, index) => {
                val["status"] = this.statusq[val["status"]];
                val["optional"] = this.optionalq[val["optional"]];
                val.type = 'string' === val.type.toLowerCase() ? 'String' : 'Number';
              });
            }
          });
        } else {
          this.$message.error(Response.data.msg);
        }
      });
    },
    // 向父组件传值
    tofather() {
      this.$emit("addstatus", this.addstatus);
    },
    rowStyle(row, rowIndex) {
      if (row.row.status === "Forbidden") {
        return "color: #ddd";
      } else {
        return "";
      }
    },
    selectable(row, index) {
      if (row.status === "Forbidden") {
        return false;
      } else if (row.name === "custUserId") {
        return false;
      } else {
        return true;
      }
    },
    handleSizeChange(val) {
      console.log("handleSizeChange", val);
    },
    handleCurrentChange(val) {
      console.log("handleCurrentChange", val);
    },
    insertEvent() {
      console.log("to add schema");
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    allidel() {
      const data = {};
      data.schemaId = this.master_user.data.id;
      data.fields = [];
      this.multipleSelection.forEach((val, index) => {
        data.fields.push(val.id);
      });
      this.$confirm(
        "This operation will disable this Column. Do you want to continue?",
        "Information",
        {
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          type: "warning"
        }
      )
        .then(() => {
          this.disable(data);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Forbid cancel!"
          });
        });
    },
    idel(row) {
      const data = {};
      data.schemaId = this.master_user.data.id;
      data.fields = [];
      data.fields.push(row.id);
      this.$confirm(
        "This operation will disable this Column. Do you want to continue?",
        "Information",
        {
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          type: "warning"
        }
      )
        .then(() => {
          this.disable(data);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Forbid cancel!"
          });
        });
    },
    refresh(row) {
      const data = {};
      data.schemaId = this.master_user.data.id;
      data.fields = [];
      data.fields.push(row.id);
      this.$confirm(
        "This operation will reactivate this Column. Do you want to continue?",
        "Information",
        {
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          type: "warning"
        }
      )
        .then(() => {
          this.enable(data);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Reactivate cancel!"
          });
        });
    },
    addMasterUser() {
      for (let i of this.master_user.data.fields) {
        if (i.isSet)
          return this.$message.warning("Save the current edit item first!");
      }
      let j = {
        id: 0,
        type: "String",
        status: "Forbidden",
        optional: true,
        name: "",
        default: "",
        description: "",
        isSet: true,
        _temporary: true
      };
      this.master_user.data.fields.push(j);
      this.master_user.sel = JSON.parse(JSON.stringify(j));
      this.addstatus = "ing";
      const timeout = setTimeout(() => {
        this.$refs.table.bodyWrapper.scrollTop = this.$refs.table.bodyWrapper.scrollHeight;
      }, 30);
      // clearTimeout(timeout)
    },
    //修改
    pwdChange(row, index, cg) {
      //是否是取消操作
      if (!cg) {
        if (!this.master_user.sel.id)
          this.master_user.data.fields.splice(index, 1);
        return (row.isSet = !row.isSet);
      }
      const startLetterReg = /^[a-zA-z]/;
      const nameRegLetter = /^[a-zA-Z0-9_]*$/;
      //提交数据
      if (row.isSet) {
        if (this.master_user.sel.name === "") {
          this.$message.error("Column name can't be empty!");
        } else if (!startLetterReg.test(this.master_user.sel.name)) {
          this.$message.error("Column name must start with a letter!");
        } else if (!nameRegLetter.test(this.master_user.sel.name)) {
          this.$message.error("Column names can contain only letters, numbers, or the underscore character!");
        } else if (this.master_user.sel.name.length > 20) {
          this.$message.error("Column name up to 20 characters allowed!");
        } else if (this.master_user.sel.description.length > 120) {
          this.$message.error("Description up to 120 characters allowed!");
        } else {
          const data = {};
          data.schemaId = this.master_user.data.id;
          const field = {};
          field.optional = this.master_user.sel.optional;
          field.name = this.master_user.sel.name;
          field.type = this.master_user.sel.type;
          field.description = this.master_user.sel.description;
          data.fields = [];
          data.fields.push(field);
          setColumn(data).then(Response => {
            if (Response.data.code === 0) {
              this.$message({
                type: "success",
                message: "Column add successfully!"
              });
              this.addstatus = "done";
              this.master_user.data = Response.data.data.schema;
              this.master_user.data.fields.forEach((val, index) => {
                val["status"] = this.statusq[val["status"]];
                val["optional"] = this.optionalq[val["optional"]];
                val.type ='string' === val.type.toLowerCase() ? 'String' : 'Number';
              });
              row.isSet = false;
            } else {
              this.$message.error(Response.data.msg);
              row.isSet = true;
            }
          });
        }
      } else {
        this.master_user.sel = JSON.parse(JSON.stringify(row));
        row.isSet = true;
      }
    },
    disable(data) {
      disableColumn(data).then(Response => {
        if (Response.data.code === 0) {
          this.$message({
            type: "success",
            message: "Forbid sucessfully!"
          });
          this.master_user.data = Response.data.data.schema;
          // const custUserId ={name:'custUserId',status:1,type:'String',optional:false}
          // this.master_user.data.fields.unshift(custUserId)
          this.master_user.data.fields.forEach((val, index) => {
            val["status"] = this.statusq[val["status"]];
            val["optional"] = this.optionalq[val["optional"]];
            val.type ='string' === val.type.toLowerCase() ? 'String' : 'Number';
          });
        } else {
          this.$message.error(Response.data.msg);
        }
      });
    },
    enable(data) {
      enableColumn(data).then(Response => {
        if (Response.data.code === 0) {
          this.$message({
            type: "success",
            message: "Reactivate sucessfully!"
          });
          this.master_user.data = Response.data.data.schema;
          // const custUserId ={name:'custUserId',status:1,type:'String',optional:false}
          // this.master_user.data.fields.unshift(custUserId)
          this.master_user.data.fields.forEach((val, index) => {
            val["status"] = this.statusq[val["status"]];
            val["optional"] = this.optionalq[val["optional"]];
            val.type ='string' === val.type.toLowerCase() ? 'String' : 'Number';
          });
        } else {
          this.$message.error(Response.data.msg);
        }
      });
    },
    formatters(row, column) {},
    // column查询
    search(str) {
      this.listcallback(str);
      getSchemaList().then(Response => {
        if (Response.data.code === 0) {
          Response.data.data.schema.forEach(item => {
            if (item.id === this.master_user.data.id) {
              this.master_user.data = item;
            }
            this.listcallback(str);
          });
        } else {
          this.$message.error(Response.data.msg);
        }
      });
    },
    //从column数组中选择所需要的数据
    listcallback(str) {
      if (str != "") {
        const arr = [];
        this.master_user.data.fields.forEach((val, index) => {
          if (val.name.indexOf(str) != -1) {
            arr.push(val);
          }
        });
        this.master_user.data.fields = arr;
        this.master_user.data.fields.forEach((val, index) => {
          val["status"] = this.statusq[val["status"]];
          val["optional"] = this.optionalq[val["optional"]];
          val.type ='string' === val.type.toLowerCase() ? 'String' : 'Number';
        });
      } else {
        this.getschemalist();
      }
    },
    timechange(val) {
      this.getschemalist();
    }
  },
  computed: {}
};
</script>

<style scoped>
.edit {
  padding: 10px;
  height: 50px;
}
.editicon {
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
.add .el-icon-plus {
  font-size: 25px;
  color: #459ffc;
  margin-left: 15px;
  cursor: pointer;
}
.idel {
  cursor: pointer;
  color: #fff;
  width: 30px;
  height: 30px;
  background: #409eff;
  padding: 2px;
}
.idelc {
  background: #ccc;
}
.el-table-add-row {
  margin-top: 10px;
  width: 100%;
  height: 34px;
  border: 1px dashed #c1c1cd;
  border-radius: 3px;
  cursor: pointer;
  justify-content: center;
  display: flex;
  line-height: 34px;
}
.elbtng .el-button {
  width: 70px;
  font-size: 10px;
}
</style>
