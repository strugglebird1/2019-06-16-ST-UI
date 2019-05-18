<template>
<div class="ad">
    <div class="user-top">
        <div class="top-title">Data Authorized by Me</div>
        <div class="top-des">
                <p>Description:</p>
                <span>All data that has been authorized to other customers</span>
        </div>
    </div>
    <div class="ad-content">
        <div class="ad-title">Authorized Data Overview</div>
        <div class="search-box">
            <el-input v-model="search" size="small" placeholder="Search Column or Grantee" clearable>
                <el-button icon="el-icon-search" type="primary" slot="append"></el-button>
            </el-input>
        </div>
        <el-table class='eltable' :data="schemaData.filter(filterSchema).slice((currentPage-1)*pageSize,currentPage*pageSize)">
            <el-table-column label="Schema Id" prop="schema.id" align="center" width="150" ></el-table-column>
            <el-table-column label="Schema Name" prop="schema.schema" align="center" width="250"></el-table-column>
            <el-table-column label="Column" align="center" width="500">
                <template slot-scope="scope">
                    <el-tag style="margin: 0 3px 3px 0"
                            v-for="(item,index) in scope.row.schema.fields"
                            :key="index"
                            :index="index" v-if='item.status===1'> {{item.name}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="Grantee" prop="toCust.name" width="250" align="center"></el-table-column>
            <el-table-column label="Last Update Time" width="250" align="center">
                <template slot-scope="scope">
                    <span>
                        {{scope.row.lastModifyTime | filterDate}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="Last Operator" prop="operator" width="300" align="center"></el-table-column>
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
</template>

<script>
import { getAuthToOtherList } from "@/api/user"
import { dateformat } from '@/utils/dateformat'
import store from '@/store'
export default {
    data() {
        return {
            pageSize: 10,
            schemaData: [],
            search: '',
            currentPage: 1
        }
    },
    filters: {
        filterDate(val) {
            return dateformat(val)
        }
    },
    methods: {
        getAuthToOtherList() {
            getAuthToOtherList({
                custId: store.getters.custId
            }).then(res => {   
                this.schemaData = res.data.data.grants
                this.schemaData.forEach((item,i)=>{
                    if(item.schema.fields.length===0){
                        this.schemaData.splice(i,1)
                    }
                })
            })
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
        detailClick() {

        },
        handleSizeChange(val) {
            this.pageSize = val
        },
        handleCurrentChange(val) {
            this.currentPage = val
        }
    },
    created() {
        this.getAuthToOtherList()
    },
}
</script>
<style scoped>
.ad {
    margin-top: 10px;
    background-color: rgb(246,246,247);
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
.ad-content {
    width: 96%;
    margin: 3vh auto;
    padding: 2vh;
    border: 1px solid rgb(197,197,197);
    background-color: #fff;
    position:relative;
}
.ad-title {
    width: 100%;
    font-size: 2.3vh;
    height: 2vw;
    margin-top: 10px;
    border-bottom: 1px solid #ccc;
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
.edit-btn {
    float: right;
    margin-top: 2vw;
}
.pagination {
    text-align: center;
    margin: 2vw 0 0 0;
}
.eltable{
    margin-top: 3vh;
}
</style>
