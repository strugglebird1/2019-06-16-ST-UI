<template>
<div class="al">
    <router-view class="routerview" />
    <div class="user-top">
        <div class="top-title">User Event Data</div>
        <div class="top-des">
                <p>Description:</p>
                <span>User Event Data，which contains user unique event information.</span>
        </div>
    </div>
    <div class="al-main" v-show="show">
        <div class="al-content">
            <div class="al-title">Schema List</div>
            <div class="search-box">
                <el-input v-model="search" size="small" placeholder="Search Schema Name" clearable>
                    <el-button icon="el-icon-search" type="primary" slot="append"></el-button>
                </el-input>
            </div>
            <el-button type="primary" icon="el-icon-plus" class="add-btn" @click="toAdd()"></el-button>
            <el-table class="eltable" :data="schemaData.filter(filterSchema).slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 100%" v-if="showData">
                <el-table-column label="Schema Id" prop="id" align="center" ></el-table-column>
                <el-table-column label="Schema Name" prop="schema" align="center"></el-table-column>
                <el-table-column label="Owner" prop="owner" align="center"></el-table-column>
                <el-table-column label="Update Time" width="230" align="center">
                    <template slot-scope="scope">
                        <span>
                            {{scope.row.updateTime | filterDate}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="Operation" width="200" align="center">
                    <template slot-scope="scope">
                        <div class="op-btn">
                            <el-button @click="toDetail(scope.row)" type="primary" size="mini">Details</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="schemaData.filter(filterSchema).length"
                class="pagination">
            </el-pagination>
        </div>
    </div>
</div>
</template>

<script>
import { getSchemaList } from "@/api/event"
import { dateformat } from '@/utils/dateformat'
export default {
    data() {
        return {
            pageSize: 10,
            showData: true,
            schemaData: [],
            search: '',
            currentPage: 1,
            name:null,
            show:true,
            cusidarr:[]
        }
    },
    filters: {
        filterDate(val) {
            return dateformat(val)
        }
    },
    computed:{

    },
    watch:{
        '$route':'gettime'
    },
    methods: {
        getSchemaList() {
          var url = window.location.href.split('#')[1];
          if(url.indexOf("/eventdata") != -1) {
            this.show = true
          } else {
            this.show = false
          }
            getSchemaList().then(res => {
                if(res.data.code===0){
                    this.schemaData =res.data.data.schema.reverse()
                    this.schemaData.forEach(item =>{
                        item.owner =this.$store.getters.name
                    })
                }
            })
        },
        filterSchema(data) {
            if(this.search === ''&&data.status===1) {
                return data
            }
            else if(data.schema.indexOf(this.search) !== -1&&data.status===1) {
                return data
            }
        },
        handleSizeChange(val) {
            this.pageSize = val
        },
        handleCurrentChange(val) {
            this.currentPage = val
        },
        toDetail(row) {
            this.$router.push({
                path: `/schemadetail?scid=${row.id}`
            })
        },
        toAdd() {
            this.$router.push({
                path: `/addschema`
            })
        },
        gettime(){
           this.getSchemaList()
        }
    },
    created() {
        this.getSchemaList()
    },
}
</script>
<style scoped>
.al {
    background-color: rgb(246,246,247);
    /* overflow: scroll; */
}
.al-main{
    background-color: rgb(246,246,247);
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
.al-content {
    width: 96%;
    margin: 3vh auto;
    border: 1px solid rgb(197,197,197);
    background-color: #fff;
    position:relative;
}
.al-title {
    width: 100%;
    font-size: 2.3vh;
    height: 3vw;
    line-height: 3vw;
    margin-top: 10px;
    padding: 0 1vh;
    border-bottom: 1px solid #ccc;
}
.al-title span{
    font-size: 1.8vh;
    font-weight: 700;
}
.search-box {
    position: absolute;
    top: 2vh;
    right: 2vh;
    z-index: 999;
}
.search-box .el-input{
    width: 270px;
}
.add-btn {
    margin-top: 1vh;
    float: right;
    padding: 7px 20px;
    margin-right: 2vh;
}
.pagination {
    margin: 1vh 0;
    text-align: center;

}
.eltable{
    margin-top: 3vh;
}
.routerview {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1000;
  height: 100vh;
}
</style>
