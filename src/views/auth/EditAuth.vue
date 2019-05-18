<template>
<div class="al">
    <div class="user-top">
        <div class="top-title">Edit authorization</div>
        <div class="top-des">
                <p>Description:</p>
                <span>Selected columns will be authorized to other customers</span>
        </div>
    </div>
    <div class="al-content">
        <div class="al-title">Authorization List</div>
        <div class="search-box">
            <el-input v-model="search" size="small" placeholder="Search Column Name" clearable>
                <el-button icon="el-icon-search" type="primary" slot="append"></el-button>
            </el-input>
        </div>
        <el-table
            v-if="showTable"
            class="eltable"
            ref="multipleTable"
            :data="schemaData.filter(filterSchema)"
            tooltip-effect="dark"
            style="width: 100%"
            max-height="430"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" :reserve-selection="true" align="center"></el-table-column>
            <el-table-column label="Column Name" prop="name" align="center"></el-table-column>
            <el-table-column label="Column Type" prop="type" align="center"></el-table-column>
            <el-table-column label="Optional" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.optional|filterOptional}}</span>
                </template>
            </el-table-column>
            <el-table-column label="Description" prop="displayName" align="center"></el-table-column>
        </el-table>
        <div class="btn-box" >
            <el-button type="primary" class="next-btn" size="small" @click="toNext()">Next</el-button>
            <el-button type="info" @click="returnList()" size="small">Cancel</el-button>
        </div>
    </div>
</div>
</template>

<script>
import { getAuthList,getAddList, getEditList } from "@/api/auth"
import { getCustId } from '@/utils/auth'

export default {
    data() {
        return {
            searchFields: ["name","type","displayName"],
            pageSize: 10,
            schemaData: [],
            search: this.$route.query.search? this.$route.query.search : '',
            currentPage: 1,
            tarCustId: 0,
            schemaId: 0,
            showTable: true,
            multipleSelection: [],
            selected: this.$route.query.selected? this.$route.query.selected : ''
        }
    },
    filters:{
        filterOptional(data){
            const obj ={
                        true: "Optional",
                        false: "Rquired"
                        }
            return obj[data]
        }
    },
    methods: {
        getAuthList() {
          console.log("custid" + getCustId())
            getAuthList({
                custId: getCustId()
            }).then(res => {
                res.data.data.grants.forEach((item,i)=>{
                    if(item.schema.fields.length===0){
                        res.data.data.grants.splice(i,1)
                    }
                })
                this.tarCustId = res.data.data.grants[this.$route.query.id].toCust.id
                this.schemaId = res.data.data.grants[this.$route.query.id].schema.id
                this.getEditList()
            })
        },
        getEdit() {
            if(this.selected) {
                this.schemaData.forEach((item,index) => {
                    var selectedIdArr = this.selected.split(",")
                    if(selectedIdArr.indexOf(String(item.id)) !== -1) {
                        this.$nextTick(() => {
                            this.$refs.multipleTable.toggleRowSelection(this.schemaData[index],true)
                        })
                    }
                })

            }
        },
        getEditList() {
            getEditList({
                tarCustId: this.tarCustId,
                custId: getCustId(),
                schemaId: this.schemaId
            }).then(res => {
                this.schemaData = res.data.data.schema.fields
                this.getEdit()
                this.$nextTick(() => {
                    this.schemaData.forEach((item,index) => {
                        item.type = 'string' === item.type.toLowerCase() ? 'String' : 'Number';
                        if(item.granted === 1) {
                            this.$refs.multipleTable.toggleRowSelection(this.schemaData[index],true)
                        }
                    })
                })
            })
        },
        filterSchema(data) {
            return this.searchFields.some(field => data[field] && data[field].indexOf(this.search) > -1)
        },
        handleSizeChange(val) {
            this.pageSize = val
        },
        handleCurrentChange(val) {
            this.currentPage = val
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        toNext() {
            if(this.multipleSelection.length === 0) {
                this.$message.error('Please select column!');
            }
            else {
                var selected = []
                this.multipleSelection.forEach(item => {
                    selected.push(item.id)
                })
                this.$router.push({
                    path: `/auth/si?custId=${this.$route.query.custId}&id=${this.$route.query.id}&selected=${selected}&search=${this.search}&name=${this.$route.query.name}`
                })
            }
        },
        returnList() {
            this.$confirm('Click Yes will not to save any edit, sure to continue ?', 'Information', {
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                type: 'warning'
                }).then(() => {
                    this.$router.push({
                        path: `/auth/al?custId=${this.$route.query.custId}&name=${this.$route.query.name}`
                    })
                }).catch((e) => {
                    console.log(e)
            });
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
.al-content {
    width: 96%;
    margin: 3vh auto;
    padding: 2vh;
    border: 1px solid rgb(197,197,197);
    background-color: #fff;
    position:relative;
}
.al-title {
    width: 100%;
    font-size: 2vh;
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
.add-btn {
    float: right;
    margin-top: 2vw;
}
.pagination {
    margin: 2vw 0 0 0;
    text-align: center;
}
/* .next-btn {
    width: 5vw;
    margin: 0 auto;
    margin-top: 2vh;
    text-align: center;
    display: block;
} */
.btn-box {
    width: 18vw;
    display: block;
    margin: 0 auto;
    margin-top: 2vh;
}
.btn-box .el-button{
    width: 5vw;
}
.eltable{
    margin-top: 3vh;
}
</style>
