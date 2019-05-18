<template>
  <div class="aded-detail">
    <div class="user-top">
      <div class="top-title">Data Authorized to Me</div>
      <div class="top-des">
        <p>Description:</p>
        <span>The data authorized by other customers can be viewed and used only</span>
      </div>
    </div>
    <div class="rd-content">
      <div class="search-box">
        <el-input v-model="search" size="small" :placeholder="searchmsg" clearable>
          <el-button icon="el-icon-search" type="primary" slot="append"></el-button>
        </el-input>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="Schema" name='1'>
          <el-table :data="schemaData.filter(filterSchema)" style="width: 100%" max-height="430">
            <el-table-column label="Column Name" prop="name" align="center"></el-table-column>
            <el-table-column label="Column Type" prop="type" align="center"></el-table-column>
            <el-table-column label="Optional" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.optional|filterOptional}}</span>
              </template>
            </el-table-column>
            <el-table-column label="Description" prop="description" align="center"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="Data" name='2'>
          <el-table :data="dataData.filter(filterData)" style="width: 100%" max-height="430">
            <!-- <el-table-column label="CustUserID" prop="custUserId"></el-table-column> -->
            <el-table-column v-for='(v,i) in schemaData' :key='i' :label="v.name" :prop="'attrs.'+v.name"
                             align="center"></el-table-column>
            <!-- <el-table-column label="Age" prop="attrs.age"></el-table-column>
            <el-table-column label="Sex" prop="attrs.sex"></el-table-column> -->
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import {getAuthToMeList, getAttrDataList} from "@/api/user"

  export default {
    data() {
      return {
        activeName: '1',
        schemaData: [],
        dataData: [],
        search: '',
        schemaId: 0,
        searchmsg: 'Search Column Name'
      }
    },
    filters: {
      filterOptional(data) {
        const obj = {
          true: "Optional",
          false: "Required"
        }
        return obj[data]
      }
    },
    methods: {
      getAuthToMeList() {
        getAuthToMeList({
          custId: this.$route.query.custId
        }).then(res => {
          this.schemaData = res.data.data.schemas[this.$route.query.schema].schema.fields
          this.schemaData.forEach((val, index) => {
            val.type = 'string' === val.type.toLowerCase() ? 'String' : 'Number';
          });
          this.schemaId = res.data.data.schemas[this.$route.query.schema].schema.id
          this.getAttrDataList()
        })
      },
      getAttrDataList() {
        getAttrDataList({
          custId: this.$route.query.custId,
          schemaId: this.schemaId
        }).then(res => {
          this.dataData = res.data.data.attrs
        })
      },
      filterSchema(data) {
        if (this.search === '') {
          return data
        }
        else if (data.name.indexOf(this.search) !== -1) {
          return data
        }
      },
      filterData(data) {
        const arr = JSON.stringify(data.attrs).split(',')
        const arr2 = []
        for (let i = 0; i < arr.length; i++) {
          arr2.push(arr[i].split(':')[1])
        }
        if (this.search === '') {
          return data
        }
        else if (JSON.stringify(arr2).indexOf(this.search) !== -1) {
          return data
        }
      },
      handleClick(tab, event) {
        // console.log(tab,event)
        if (tab.label === 'Data') {
          this.searchmsg = 'Search Column'
        } else {
          this.searchmsg = 'Search Column Name'
        }
      }
    },
    created() {
      this.getAuthToMeList()
    },
  }
</script>
<style scoped>
  .aded-detail {
    background-color: rgb(246, 246, 247);
  }

  .user-top {
    height: 14vh;
    background-color: #fff;
    padding: 0 2%;
    position: relative;
  }

  .ad-title {
    width: 100%;
    font-size: 2vh;
    height: 2vw;
    margin-top: 10px;
    border-bottom: 1px solid #ccc;
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

  .rd-content {
    width: 96%;
    margin: 3vh auto;
    padding: 2vh;
    border: 1px solid rgb(197, 197, 197);
    background-color: #fff;
    position: relative;
  }

  .search-box {
    position: absolute;
    top: 2vh;
    right: 2vh;
    z-index: 999;
  }

  .search-box .el-input {
    width: 280px;
  }

  .edit-btn {
    float: right;
  }
</style>
