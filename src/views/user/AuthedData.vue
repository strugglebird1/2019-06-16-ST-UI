<template>
<div class="ad">
    <div class="user-top">
        <div class="top-title">Data Authorized to Me</div>
        <div class="top-des">
                <p>Description:</p>
                <span>The data authorized by other customers can be viewed and used only</span>
        </div>
    </div>
    <div class="ad-content">
        <div class="ad-title">Authorized Data Overview</div>
        <div class="search-box">
            <el-input v-model="search" size="small" placeholder="Search Schema Name" clearable>
                <el-button icon="el-icon-search" type="primary" slot="append"></el-button>
            </el-input>
        </div>
        <el-table class='eltable' :data="schemaData.filter(filterSchema).slice((currentPage-1)*pageSize,currentPage*pageSize)" max-height="430">
            <el-table-column label="Schema Id" prop="schema.id" align="center" width="150"></el-table-column>
            <el-table-column label="Schema Name" prop="schema.schema" align="center" width="150" ></el-table-column>
            <!-- <el-table-column label="Owner Id" prop="owner.id" align="center" width="120"></el-table-column> -->
            <el-table-column label="Owner" prop="owner.name" align="center"  width="150"></el-table-column>
            <el-table-column label="Authorization Time"  align="center" >
                <template slot-scope="scope">
                    <span>
                        {{scope.row.authTime | filterDate}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="Last Update Time" >
                <template slot-scope="scope">
                    <span>
                        {{scope.row.lastModifyTime | filterDate}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="Operation" >
                <template slot-scope="scope">
                    <div class="op-btn">
                        <el-button @click="detailClick(scope.row,scope.$index)" type="text">Details</el-button>
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
    <router-view class="routerview" />
</div>
</template>

<script>
import { getAuthToMeList } from "@/api/user"
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
        getAuthToMeList() {
            getAuthToMeList({
                custId: store.getters.custId
            }).then(res => {
                res.data.data.schemas.forEach(item => {
                    this.schemaData.push(item)
                })
            })
        },
        filterSchema(data) {
            if(this.search === '') {
                return data
            }
            else if(JSON.stringify(data.schema.schema).indexOf(this.search) !== -1) {
                return data
            }
        },
        detailClick(row,index) {
            this.$router.push({
                path: `/user/adddetail?custId=${row.schema.custId}&schema=${index}`
            })
        },
        handleSizeChange(val) {
            this.pageSize = val;
        },
        handleCurrentChange(val) {
            this.currentPage = val;
        }
    },
    created() {
        this.getAuthToMeList()
    },
}
</script>
<style scoped>
.ad {
    margin-top: 10px;
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
.routerview {
  position: absolute;
  top: 10px;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1000;
}
</style>
