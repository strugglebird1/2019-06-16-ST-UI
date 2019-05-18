<template>
  <div class='app-container'>
    <router-view class="creat"/>
      <div class="box" v-show="created">
        <div class="top">
          <el-button type="primary" @click="tocreat()">Create Account</el-button>
          <span class="selmsg">
            <!-- <el-input
              placeholder="Name,Email or Creator"
              v-model="selmsg"
              class="selmsginput"
              clearable>
            </el-input>
            <el-button type="primary" icon="el-icon-search" @click='search'></el-button> -->
            <el-input v-model="selmsg" placeholder="Name,Email or Creator" class="selmsginput" clearable>
                <el-button icon="el-icon-search" type="primary"  @click="search" slot="append"></el-button>
            </el-input>
          </span>
          <span class="selstate">State ：
            <el-select v-model="statevalue" placeholder="select " @change="selstate">
                <el-option
                  v-for="item in stateoptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </span>
        </div>
        <el-table
          ref='multipleTable'
          :data='tableData'
          tooltip-effect='dark'
          :row-style='rowStyle'
          :cell-style='cellStyle'
          class="datatab"
        >
          <el-table-column prop='nick_name' label='Name' align='center'></el-table-column>
          <el-table-column prop='email' label='Email' align='center' width="250"></el-table-column>
          <el-table-column prop='role_name' label='Role' align='center'></el-table-column>
          <el-table-column prop='status' label='State' :formatter="stFormat" align='center'></el-table-column>
          <el-table-column label='Creation Time' prop='create_time' :formatter="dateFormat" align='center'></el-table-column>
          <el-table-column prop='createname' label='Creator' align='center'></el-table-column>
          <el-table-column label='Operation' align='center'>
            <template slot-scope='scope'>
              <svg-icon  v-if="scope.row.status<3"  icon-class='jinyong' class='idel' @click='idel(scope.row)'/>
              <svg-icon v-else icon-class='huifu' class='idel' @click='refresh(scope.row)'/>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          layout='prev, pager, next'
          :total='pagination.total'
          :page-size.sync='pagination.pagesize'
          :current-page.sync = "pagination.current"
          @current-change='currentchange'
          class="pageman"
        ></el-pagination>
      </div>
      <div v-show="0">{{time}}</div>
  </div>
</template>

<script>
import { isCorrectsel } from '@/utils/index'
import { getlist, disableUser, activeUser } from "@/api/getlist";
import { store } from '@/store';
import { getRoleID } from '@/utils/auth'
import { dateformat } from '@/utils/dateformat'

export default {
  data() {
    return {
      tableData: [
      ],
      created:true,
      multipleSelection: [],
      pagination: {
        total: 1,
        pagesize: 10,
        current: 1
      },
      stateoptions: [
        {
          value: 'active',
          label: 'Normal'
        },
         {
          value: 'disable',
          label: 'Forbidden'
        },{
          value: 'all',
          label: 'All'
        }
      ],
      statevalue:'all',
      selmsg:'',
      roleId:'',
      allroles:{
        'admin' : 'Admin',
        'operatoradmin' : 'Operator Admin',
        'operator' : 'Operator', 
        'customer' : 'Customer'
      },
      status:{
        '1' : 'Normal',
        '2' : 'Normal',
        '3' : 'Forbidden ',
        '4' : 'Forbidden'
      }
    };
  },
  created(){
    this.getlist('1,2,3,4')
  },
  beforeRouteUpdate (to, from, next) {
     if(to.path==='/creat/sysuser'){
       this.created=false;
       this.selmsg=''
       this.getlist('1,2,3,4')
       next()
     }else{
       this.created=true;
       next()
     }
  },
  methods: {
    rowStyle(row, rowIndex) {
      if (row.row.status > 2) {
        return 'color: #ccc';
      } else {
        return '';
      }
    },
    cellStyle(row, column){
      if(row.column.label==='Opeerating'){
        return 'color: #606266';
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
    currentchange(index) {
      // 传idnex和要显示的数目获取数据 修改tableData数据
      this.pagination.current=index
      let str =''
       if(this.statevalue==='active'){
        str ='1,2'
      }else if(this.statevalue==='disable'){
        str ='3,4'
      }else{
        str ='1,2,3,4'
      }
      const data ={
                  page : this.pagination.current,
                  search : isCorrectsel(this.selmsg),
                  roleId : Number(getRoleID())+1,
                  status : str
      }
      // console.log('data', data)
      getlist(data).then(Response => {
        // console.log('Response',Response)
        this.tableData = Response.data.data.users
        this.pagination.total =  Response.data.data.count
      });
    },
    idel(row) {
      //  console.log('row', row);
       let status =''
       if(row.status ===1){
         status = '3'
       }else if(row.status ===2){
         status = '4'
       }else{
         status = row.status
       }
       const data = { userId : row.id}
      //  console.log("data  disable", data)
       this.$confirm('Are you sure to forbid this account?', 'Information', {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          type: 'warning'
        }).then(() => {
          disableUser(data).then(Response => {
            // console.log('disableUser Response',Response)
            this.$message({
              type: 'success',
              message: 'Forbid sucessfully!'
            });
            this.getlist('1,2,3,4')
          });
        }).catch(() => {
                  
        });
    },
    refresh(row){
      // console.log('row.cstatus', row.status);
       let status =''
       if(row.status ===3){
         status = '1'
       }else if(row.status ===4){
         status = '2'
       }else if(row.status ===1){
        //  console.log("--------")
         status = '3' //row.status
       }else if(row.status ===2){
         status = '4'
       }
      //  console.log('status', status);
       const data = { userId : row.id}
      //  console.log("data  disable", data)
       this.$confirm('Are you sure to reactivate this account?', 'Information', {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          type: 'warning'
        }).then(() => {
          activeUser(data).then(Response => {
            // console.log('disabledOrActive Response',Response)
            this.$message({
              type: 'success',
              message: 'Reactive sucessfully!'
            });
            this.getlist('1,2,3,4')
          });
        }).catch(() => {
              
        });
    },
    selstate(value){
      // console.log("value",value);
      if(value==='active'){
        this.getlist('1,2')
      }else if(value==='disable'){
        this.getlist('3,4')
      }else{
        this.getlist('1,2,3,4')
      }
    },
    getlist(str){
      const data ={
                  page : 1,
                  search : isCorrectsel(this.selmsg),
                  roleId : Number(getRoleID())+1,
                  status : str
      }
      // console.log('str', str)
      getlist(data).then(Response => {
        this.tableData = Response.data.data.users
        this.pagination.total =  Response.data.data.count
        this.pagination.current = 1
      });

    },
    tocreat(){
      this.created=false
      this.$router.push({ path: '/creat/sysuser' })
    },
    dateFormat(row, column){
      let date = row.create_time
      return dateformat(date)
    },
    charamat(row, column){
      return this.allroles[row.chara]
    },
    stFormat(row, column){
      return this.status[row.status]
    },
    search(){
      let str =''
       if(this.statevalue==='active'){
        str ='1,2'
      }else if(this.statevalue==='disable'){
        str ='3,4'
      }else{
        str ='1,2,3,4'
      }
      const data ={
                  page : 1,
                  search : isCorrectsel(this.selmsg),
                  roleId : Number(getRoleID())+1,
                  status : str
      }
      // console.log('data', data)
      getlist(data).then(Response => {
        // console.log('Response',Response)

        this.tableData = Response.data.data.users
        this.pagination.total =  Response.data.data.count
      });
    }
  },
  computed:{
    showeroleId(){
      this.roleId = getRoleID()
      return this.roleId
    },
    time(){
      if(this.$route.query.time){
        this.getlist('1,2,3,4')
        return this.$route.query.time
      }else{
        return new Date().getTime()
      }
    }
  }
};
</script>
<style scoped>
.app-container{
  width: 100%;
}
.box{
  width: 90%;
  margin: 0 auto;
}
.top{
  padding: 30px 0px 30px 0px;
}
.idel {
  cursor: pointer;
  color: #fff;
  width: 30px;
  height: 30px;
  background: #409EFF;
  padding: 2px;
}
.selstate{
  margin-left: 30px;
  float: right;
}
.selmsg{
  margin-left: 30px;
  float: right;
}
.selmsginput{
  width: 270px;
}
.datatab{
  width: 100%;
  border: 1px solid #ccc;
  text-align: center
}
.pageman{
  margin-top: 10px;
  text-align: center;
}
.creat{
  position: absolute;
  top: 10px;
  left: 0;
  bottom: 0;
  right: 100px;
  z-index: 100;
  background: #fff
}

</style>


