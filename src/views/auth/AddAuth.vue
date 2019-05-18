<template>
  <div class="ad">
    <div class="user-top">
      <div class="top-title">Add authorization</div>
      <div class="top-des">
        <p>Description:</p>
        <span>Selected columns will be authorized to other customers</span>
      </div>
    </div>
    <div class="ad-content">
      <div class="ad-title">Schema</div>
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
        <el-table-column label="Description" prop="description" align="center"></el-table-column>
      </el-table>
    </div>
    <div class="btn-box">
      <el-button type="primary" @click="toSave()" size="small">&nbsp;&nbsp;Next&nbsp;&nbsp;</el-button>
      <el-button type="info" @click="returnList()" size="small">Cancel</el-button>
    </div>

  </div>
</template>

<script>
  import {addAuthItem, getAddList} from "@/api/auth"
  import {getCustId} from '@/utils/auth'

  export default {
    data() {
      return {
        searchFields: ['name', 'type', 'displayName'],
        pageSize: 10,
        schemaData: [],
        search: this.$route.query.search ? this.$route.query.search : '',
        currentPage: 1,
        multipleSelection: [],
        selected: this.$route.query.selected ? this.$route.query.selected : '',
        showTable: true,
        selectedIdArr: [],
        selectedIndexArr: []
      }
    },
    filters: {
      filterOptional(data) {
        const obj = {
          true: "Optional",
          false: "Rquired"
        }
        return obj[data]
      }
    },
    methods: {
      getAddList() {
        console.log("custid" + getCustId())
        getAddList({
          custId: getCustId()
        }).then(res => {
          this.schemaData = res.data.data.schemas[0].fields
          this.schemaData.forEach((item, index) => {
            item.type = 'string' === item.type.toLowerCase() ? 'String' : 'Number';
          })
          this.getEdit()
        })
      },
      getEdit() {
        if (this.selected) {
          this.schemaData.forEach((item, index) => {
            this.selectedIdArr = this.selected.split(",")
            if (this.selectedIdArr.indexOf(String(item.id)) !== -1) {
              this.$nextTick(() => {
                this.$refs.multipleTable.toggleRowSelection(this.schemaData[index], true)
                this.selectedIndexArr.push(index)
              })
            }
          })
        }
      },
      filterSchema(data) {
        return this.searchFields.some(field => data[field] && data['status'] === 1 && data[field].indexOf(this.search) > -1)
      },
      handleSizeChange(val) {
        this.pageSize = val
      },
      handleCurrentChange(val) {
        this.currentPage = val
      },
      handleSelectionChange(val, row) {
        this.multipleSelection = val;
      },
      toSave() {
        var selected = []
        if (this.multipleSelection.length === 0) {
          this.$message.error('Please select column!');
        }
        else {
          this.multipleSelection.forEach(item => {
            selected.push(item.id)
          })
          this.$router.push({
            path: `/auth/sie?custId=${this.$route.query.custId}&name=${this.$route.query.name}&selected=${selected}&search=${this.search}&custarr=${Array.from(new Set(this.$route.query.custarr.split(',')))}`
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
      this.getAddList()
    },
  }
</script>
<style scoped>
  .ad {
    background-color: rgb(246, 246, 247);
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
    border: 1px solid rgb(197, 197, 197);
    background-color: #fff;
    position: relative;
  }

  .ad-title {
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

  .edit-btn {
    float: right;
    margin-top: 2vw;
  }

  .btn-box {
    width: 18vw;
    display: block;
    margin: 0 auto;
  }

  .btn-box .el-button {
    width: 5vw;
  }

  .eltable {
    margin-top: 3vh;
  }
</style>
