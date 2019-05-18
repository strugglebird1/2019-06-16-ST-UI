<template>
<div class="al">
    <router-view class="routerview" />
    <div class="user-top">
        <div class="top-title">Authorization overview</div>
        <div class="top-des">
                <p>Description:</p>
                <span>All data that has been authorized to other customers</span>
        </div>
    </div>
    <div class="al-main" v-show="show">
        <div class="al-content">
            <div class="al-title">Authorization List&nbsp;(<span>Authorized by {{name}}</span>)</div>
            <div class="search-box">
                <el-input v-model="search" size="small" placeholder="Search Column or Grantee" clearable>
                    <el-button icon="el-icon-search" type="primary" slot="append"></el-button>
                </el-input>
            </div>
            <el-button type="primary" icon="el-icon-plus" class="add-btn" @click="toAdd()"></el-button>
            <el-table class="eltable" :data="schemaData.filter(filterSchema).slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 100%" v-if="showData">
                <el-table-column label="Schema Id" prop="schema.id" align="center" width="150"></el-table-column>
                <el-table-column label="Schema Name" prop="schema.schema" width="150" align="center"></el-table-column>
                <el-table-column label="Column" align="center">
                    <template slot-scope="scope">
                        <el-tag style="margin: 0 3px 3px 0"
                                v-for="(item,index) in scope.row.schema.fields"
                                :key="index"
                                :index="index" v-if='item.status===1'>{{ item.name}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="Grantee" prop="toCust.name" width="230" align="center"></el-table-column>
                <el-table-column label="Last Update Time" width="230" align="center">
                    <template slot-scope="scope">
                        <span>
                            {{scope.row.lastModifyTime | filterDate}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="Operation" width="200" align="center">
                    <template slot-scope="scope">
                        <div class="op-btn">
                            <el-button @click="toEdit(scope.$index)" type="primary" icon="el-icon-edit" size="mini"></el-button>
                            <el-button @click="toDelete(scope.row)" type="primary" icon="el-icon-delete" size="mini"></el-button>
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
import { getAuthList,deleteAuthItem } from "@/api/auth"
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
            cusidarr:[],
        }
    },
    filters: {
        filterDate(val) {
            return dateformat(val)
        }
    },
    props:["times"],
    watch: {
     times: "nowtime",
    },
    computed:{
        time(){
            return this.$route.query.time
        }
    },
    methods: {
        getAuthList() {
            this.name = this.$route.query.name
            getAuthList({
                custId: this.$route.query.custId
            }).then(res => { 
                res.data.data.grants.forEach((item,i)=>{
                    if(item.schema.fields.length===0){
                        res.data.data.grants.splice(i,1)
                    }
                })
                this.schemaData = res.data.data.grants
                this.schemaData.forEach(item =>{
                    this.cusidarr.push(item.toCust.id)
                })
            })
        },
        nowtime(val){
            this.show=true
            this.getAuthList()
        },
        filterSchema(data) {
            const arr =[]
            arr.push(data.toCust.name)
            for(let j = 0,len=data.schema.fields.length; j < len; j++) {
                arr.push(data.schema.fields[j].name)
            }
            if(this.search === '') {
                return data
            }
            else if(JSON.stringify(arr).indexOf(this.search) !== -1) {
                return data
            }
        },
        handleSizeChange(val) {
            this.pageSize = val
        },
        handleCurrentChange(val) {
            this.currentPage = val
        },
        toDelete(row) {
            this.$confirm("Sure to cancel the customer's data permission?", 'Information', {
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                type: 'warning'
                }).then(() => {
                    const data = {}
                    data.custId = this.$route.query.custId
                    data.tarCustId = row.toCust.id
                    data.schemaId = row.schema.id
                    data.fields = new Array()
                    // row.schema.fields.forEach(item => {
                    //     data.fields.push(item.id)
                    // })
                    deleteAuthItem(data).then(res => {
                        this.$nextTick(() => {
                            getAuthList({
                                custId: this.$route.query.custId
                            }).then(res => {    
                                this.schemaData = res.data.data.grants
                                this.cusidarr =[]
                                this.schemaData.forEach(item =>{
                                    this.cusidarr.push(item.toCust.id)
                                })
                                 this.currentPage = 1
                            })
                        })
                    })
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: 'Cancel Edit'
                });          
            });
        },
        toEdit(row) {
            this.show=false
            let index = 0
            if(this.currentPage===1){
                index=row
            }else{
                index = row+this.pageSize*(this.currentPage-1)
            }
            this.$router.push({
                path: `/auth/editauth?custId=${this.$route.query.custId}&id=${index}&name=${this.$route.query.name}`
            })
        },
        toAdd() {
            this.show=false
            this.$router.push({
                path: `/auth/addauth?custId=${this.$route.query.custId}&name=${this.$route.query.name}&custarr=${Array.from(new Set(this.cusidarr))}`
            })
        }
    },
    created() {
        this.getAuthList()
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
}
</style>
