<template>
  <div class="app-container">
    <router-view class="creat" :times='times' />
    <div class="box" v-show="created">
      <div class="top">
        <el-button type="primary" @click="tocreat()">Create Customer</el-button>
        <span class="selmsg">
          <!-- <el-input
            placeholder="Name,Email or Company"
            v-model="selmsg"
            class="selmsginput"
            clearable
          ></el-input>
          <el-button type="primary" icon="el-icon-search" @click="search"></el-button> -->
          <el-input v-model="selmsg" placeholder="" class="selmsginput" clearable>
                <el-button icon="el-icon-search" type="primary"  @click="search" slot="append"></el-button>
            </el-input>
        </span>
        <span class="selstate">State ：
          <el-select v-model="statevalue" placeholder="select " @change="selstate">
            <el-option
              v-for="item in stateoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </span>
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
        :row-style="rowStyle"
        :cell-style='cellStyle'
        class="datatab"
        @cell-click="tocusinfo"
      >
        <el-table-column prop="nick_name" label="Name" align="center"></el-table-column>
        <el-table-column prop="email" label="Email" align="center"></el-table-column>
        <el-table-column prop="company" label="Company" align="center" width="200px"></el-table-column>
        <el-table-column prop="cstatus" label="State" :formatter="stFormat" width="100px" align="center"></el-table-column>
        <el-table-column label="Creation Time" prop="ctime" :formatter="dateFormat" align="center"></el-table-column>
        <el-table-column prop="cname" label="Creator" align="center"></el-table-column>
        <el-table-column label="Operation" align="center">
          <template slot-scope="scope">
            <svg-icon
              v-if="scope.row.ustatus<3"
              icon-class="jinyong"
              class="idel"
              @click="idel(scope.row)"
            />
            <svg-icon v-else icon-class="huifu" class="idel" @click="refresh(scope.row)"/>
            <el-select
              v-model="scope.row.operasel"
              size='small'
              class="cssoptions"
              @change="opdo(scope.row)"
              :disabled="scope.row.cstatus==0"
            >
              <el-option
                v-for="item in scope.row.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                v-show="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="pagination.total"
        :page-size="pagination.pagesize"
        :current-page.sync = "pagination.current"
        @current-change="currentchange"
        class="pageman"
      ></el-pagination>
    </div>
    <div v-show="0">{{time}}</div>
  </div>
</template>

<script>
import { setToken, setCustId } from '@/utils/auth'
import { isCorrectsel } from '@/utils/index'
import { getcuslist, disableCustomer, activeCustomer } from "@/api/getlist";
import { pseudologin, pseudologout } from "@/api/login";
import store from "@/store";
import { getRoleID } from "@/utils/auth";
import { dateformat } from "@/utils/dateformat";
export default {
  data() {
    return {
      times:1,
      tableData: [],
      multipleSelection: [],
      pagination: {
        total: 2,
        pagesize: 10,
        current: 1
      },
      stateoptions: [
        {
          value: "active",
          label: "Normal"
        },
        {
          value: "disable",
          label: "Forbidden "
        },
        {
          value: "all",
          label: "All"
        }
      ],
      statevalue: "all",
      selmsg: "",
      roleId: "",
      created:true,
      status: {
        "1": "Normal",
        "0": "Forbidden "
      }
    };
  },
  //  beforeRouteEnter (to, from, next) {
  //   console.log('to',to,'from',from)
  // },
  beforeRouteUpdate (to, from, next) {
    //  console.log('to',to,'from',from)
    //  this.pagination.current=1
    this.selmsg=''
     this.getlist("1,0")
     if(to.path==='/creat/customer'){
       this.created=false;
       next()
     }else if(to.path==='/cusinfor'){
       this.created=false;
       next()
     }else if(to.path==='/customer/list'){
       this.created=true;
       next()
     }else if(to.path==='/auth/al'){
       this.created=false;
       this.times =new Date().getTime()
       next()
     }else if(to.path==='/auth/addauth'){
        // console.log('to /auth/addauth')
       this.created=false;
       next()
     }else{
       next()
     }
  },
  created() {
    this.getlist("0,1");
  },
  methods: {
    rowStyle(row, rowIndex) {
      if (row.row.cstatus == 0) {
        return "color: #ccc";
      } else {
        return "";
      }
    },
    cellStyle(row, column, rowIndex, columnIndex){
      if(row.columnIndex===0||row.columnIndex===1||row.columnIndex===2){
        return "cursor:pointer";
      }else{
        return "";
      }
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // console.log("multipleSelection", this.multipleSelection)
    },
    currentchange(index) {
      // console.log("index", index);
      // 传idnex和要显示的数目获取数据 修改tableData数据
      this.pagination.current = index;
      let str = "";
      if (this.statevalue === "active") {
        str = "1";
      } else if (this.statevalue === "disable") {
        str = "0";
      } else {
        str = "1,0";
      }
      const data = {
        page: this.pagination.current,
        search: this.selmsg,
        roleId: Number(getRoleID()) + 1,
        status: str
      };
      // console.log('data', data)
      getcuslist(data).then(Response => {
        // console.log('Response',Response)
        this.tableData = Response.data.data.users;
        this.pagination.total = Response.data.data.count;
        this.tableData.forEach(obj => {
          (obj.options = [
            {
              value: 0,
              label: "OP"
            },
            {
              value: "login",
              label: "Pseudo Login"
            },
            {
              value: "Authorization",
              label: "Authorize"
            }
          ]),
            (obj.operasel = 0);
        });
      });
    },
    idel(row) {
      //  console.log('row', row);
      const data = { custId: row.cid };
      //  console.log("data  disable", data)
      this.$confirm(
        "Are you sure to forbid this account?",
        "Information",
        {
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          type: "warning"
        }
      ).then(() => {
        disableCustomer(data).then(Response => {
          // console.log('disableCustomer Response',Response)
          if (Response.data.code === 0) {
            this.$message({
              type: "success",
              message: "Forbid sucessfully!"
            });
            this.getlist("0,1");
          } else {
            this.$message.error("error" + Response.data.msg);
          }
        });
      });
    },
    refresh(row) {
      // console.log('row.cstatus', row.cstatus);
      const data = { custId: row.cid };
      //  console.log("data  disable", data)
      this.$confirm(
        "Are you sure to reactivate this account?",
        "Information",
        {
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          type: "warning"
        }
      ).then(() => {
        activeCustomer(data).then(Response => {
          // console.log('activeCustomer Response',Response)
          if (Response.data.code === 0) {
            this.$message({
              type: "success",
              message: "Reactive sucessfully!"
            });
            this.getlist("0,1");
          } else {
            this.$message.error("Activation fails");
          }
        });
      });
    },
    selstate(value) {
      // console.log("value",value);
      if (value == "active") {
        this.getlist("1");
      } else if (value == "disable") {
        this.getlist("0");
      } else {
        this.getlist("0,1");
      }
    },
    getlist(str) {
      const data = {
        page: 1,
        search: isCorrectsel(this.selmsg),
        roleId: Number(getRoleID()) + 1,
        status: str
      };
      // console.log(getRoleID())
      //  console.log(data)
      getcuslist(data).then(Response => {
        this.tableData = Response.data.data.users;
        this.pagination.total = Response.data.data.count;
        this.pagination.current = 1
        this.tableData.forEach(obj => {
          (obj.options = [
            {
              value: 0,
              label: "OP"
            },
            {
              value: "login",
              label: "Pseudo Login"
            },
            {
              value: "Authorization",
              label: "Authorize"
            }
          ]),
            (obj.operasel = 0);
        });
      });
    },
    tocreat() {
      // this.created=false;
      this.$router.push({ path: "/creat/customer" });
    },
    opdo(row) {
      if (row.operasel === "login") {
        // 伪登录
        const custUserId = row.uid;
        pseudologin({ custUserId }).then(Response => {
           console.log("伪登录",Response)
          if (Response.data.code === 0) {
            //  console.log('--------OK')
            const data = Response.data.data;
            store.dispatch("Operator", { data }).then(res => {
              this.$router.push({ path: "/home" });
              location.reload(); // 为了重新实例化vue-router对象 避免bug
            });
          }else{
            this.$message.error(Response.data.msg);
          }
        });
      } else {
        // 授权
        console.log("custId=" + row.cid);
        setCustId(row.cid)
        this.$router.push({ path: '/auth/al', query: {custId:row.cid,time:new Date().getTime(),name:row.nick_name}})
      }
    },
    tocusinfo(row, column, cell, event) {
      const obj = {
        Name: "1",
        Email: "1",
        Company: "1"
      };
      // console.log('row',row)
      if (obj[column.label]) {
        this.$router.push({ path: "/cusinfor", query: { custId: row.cid } });
      }
    },
    dateFormat(row, column) {
      let date = row.ctime;
      return dateformat(date);
    },
    stFormat(row, column) {
      // console.log(row.cstatus)
      return this.status[row.cstatus];
    },
    search() {
      let str = "";
      if (this.statevalue === "active") {
        str = "1";
      } else if (this.statevalue === "disable") {
        str = "0";
      } else {
        str = "1,0";
      }
      this.getlist(str)
    }
  },
  computed: {
    showeroleId() {
      this.roleId = getRoleID();
      return this.roleId;
    },
    time() {
      if (this.$route.query.time) {
        this.getlist("1,0");
        return this.$route.query.time;
      } else {
        return new Date().getTime();
      }
    }
  }
};
</script>
<style scoped>
.app-container {
  width: 100%;
  overflow: auto;
}
.box {
  width: 90%;
  margin: 0 auto;
}
.top {
  padding: 30px 0px 30px 0px;
}
.idel {
  cursor: pointer;
  color: #fff;
  width: 25px;
  height: 25px;
  background: #409EFF;
  padding: 2px;
  vertical-align:-5.5px;
}
.selstate {
  margin-left: 30px;
  float: right;
}
.selmsg {
  margin-left: 30px;
  float: right;
}
.selmsginput {
  width: 270px;
}
.datatab {
  width: 100%;
  border: 1px solid #ccc;
  text-align: center;
}
.pageman {
  margin-top: 10px;
  text-align: center;
}
.datatab .cssoptions {
  width: 70px;
}
.cssoptions ::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #000;
}
.cssoptions :-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #000;
}
.cssoptions ::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #000;
}
.cssoptions :-ms-input-placeholder {
  /* Internet Explorer 10+ */
  color: #000;
}
.creat {
  position: absolute;
  top: 10px;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 100;
}
</style>


