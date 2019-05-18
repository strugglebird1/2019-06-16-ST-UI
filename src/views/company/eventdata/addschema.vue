<template>
  <div class="al">
    <router-view class="routerview"/>
    <div class="user-top">
      <div class="top-title">User Event Data</div>
      <div class="top-des">
        <p>Description:</p>
        <span>User Event Data，which contains user unique event information.</span>
      </div>
    </div>
    <div class="al-main">
      <div class="step">
        <el-steps :space="500" :active="active">
          <el-step title="Schema Info"></el-step>
          <el-step title="Column Info"></el-step>
        </el-steps>
      </div>
      <div class="schemainfo" v-show="active===1">
        <div class="contain">
          <p class="contain-title">Schema Info</p>
          <div class="contain-main">
            <el-form label-position="left" label-width="150px">
              <el-form-item
                label="Schema Name"
                required
              >
                <span>event_</span>
                <el-input type="text" size="small" class="schemaname" v-model="schemaname"></el-input>
              </el-form-item>
              <el-form-item
                label="Description"
                required
              >
                <el-input
                  type="textarea"
                  :rows="2"
                  placeholder
                  v-model="description"
                  class="decsription"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="step">
            <el-button type="primary" size="small" @click="next()">&nbsp;Next&nbsp;</el-button>
            <el-button size="small" @click="cancel()">Cancel</el-button>
          </div>
        </div>
      </div>
      <div class="columninfo" v-show="active===2">
        <el-row>
          <el-col :span="24" v-show="master_user.data">
            <el-table
              ref="table"
              size="mini"
              :data="master_user.data"
              max-height="382"
              highlight-current-row
            >
              >
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
                  <el-button
                    v-else
                    type="primary"
                    icon="el-icon-delete"
                    size="mini"
                    style="cursor: pointer;"
                    @click="pwdChange(scope.row,scope.$index,false)"
                  ></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="24">
            <div class="el-table-add-row" @click="addMasterUser()">
              <span>
                <i class="el-icon-plus"></i>
              </span>
            </div>
          </el-col>
        </el-row>
        <el-dialog
          title="Schema Registration"
          :visible.sync="dialogVisible"
          width="30%"
          :modal-append-to-body="false"
          :before-close="handleClose"
        >
          <p>Please confirm schema registration information</p>
          <p>Schema Name:event_{{schemaname}}</p>
          <p>
            Column:
            <span v-for="(item,i) in master_user.data" :key="i">
              {{item.name}}
              <span v-if="i!==master_user.data.length-1">,</span>
            </span>
          </p>
          <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose('cancel')" size="small">Cancel</el-button>
            <el-button type="primary" @click="handleClose('confirm')" size="small">Confirm</el-button>
          </span>
        </el-dialog>
      </div>
      <div class="step" v-show="active===2">
        <el-button type="info" size="small" @click="toPrev()">Previous</el-button>
        <el-button type="primary" size="small" @click="toDialog()">Confirm</el-button>
        <el-button type="info" size="small" @click="cancel()">Cancel</el-button>
      </div>
    </div>
    <div class="clear"></div>
  </div>
</template>

<script>
  import {getSchemaList, addEventSchema} from "@/api/event";
  import {dateformat} from "@/utils/dateformat";

  export default {
    data() {
      return {
        dialogVisible: false,
        showData: true,
        schemaData: [],
        schemaname: "",
        namearr: [],
        name: null,
        show: true,
        active: 1,
        description: "",
        master_user: {
          sel: {}, //选中行
          columns: [
            {field: "name", title: "Column Name"},
            {field: "type", title: "Column Type"},
            {field: "optional", title: "Optional"},
            {field: "description", title: "Description"}
          ],
          data: []
        },
        addstatus: null,
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
            value: "Required",
            label: "Required"
          },
          {
            value: "Optional",
            label: "Optional"
          }
        ]
      };
    },
    filters: {
      filterDate(val) {
        return dateformat(val);
      }
    },
    props: ["times"],
    watch: {
      times: "nowtime"
    },
    computed: {},
    methods: {
      getSchemaList() {
        getSchemaList().then(res => {
          if (res.data.code === 0) {
            res.data.data.schema.forEach(item => {
              this.namearr.push(item.schema)
            })
          }
        })
      },
      nowtime(val) {
        this.show = true;
      },
      filterSchema(data) {
        if (this.search === "") {
          return data;
        } else if (JSON.stringify(data).indexOf(this.search) !== -1) {
          return data;
        }
      },
      handleSizeChange(val) {
        this.pageSize = val;
      },
      handleCurrentChange(val) {
        this.currentPage = val;
      },
      handleClose(val) {
        if (val === "confirm") {
          this.toConfirm();
        } else {
          this.dialogVisible = false;
        }
      },
      next() {
        const startLetterReg = /^[a-zA-z]/;
        const eventRegLetter = /^[a-zA-Z0-9_]*$/;
        if (this.schemaname === "" || this.description === '') {
          return this.$message.warning("Schema name or decsription can't be empty!");
        } else if (!startLetterReg.test(this.schemaname)) {
          this.$message.error("Column name must start with a letter!");
        } else if (!eventRegLetter.test(this.schemaname)) {
          return this.$message.warning("The column names can contain only letters, numbers, or the underscore character!");
        } else if (this.schemaname.length > 45) {
          return this.$message.warning(
            "The maximum length of Schema Name is 45 characters."
          );
        } else if (this.description.length > 200) {
          return this.$message.warning(
            "The maximum length of Description is 200 characters."
          );
        } else if (this.duplicateCreateCherker("event_" + this.schemaname) === "exist") {
          return this.$message.warning("The schema already exists!");
        } else {
          this.active = 2;
        }
      },
      duplicateCreateCherker(str) {
        for (let i of this.namearr) {
          if (i.toLowerCase() === str.toLowerCase()) {
            return "exist";
          }
        }
      },
      toPrev() {
        this.active = 1;
      },
      toDialog() {
        for (let i of this.master_user.data) {
          if (i.isSet) {
            return this.$message.warning("Save the current edit item first!");
          }
        }
        this.dialogVisible = true;
      },
      toConfirm() {
        const columnarr = [];
        for (let i of this.master_user.data) {
          if (i.isSet) {
            return this.$message.warning("Save the current edit item first!");
          } else {
            const obj = {};
            obj.name = i.name;
            obj.optional = i.optional === "Optional" ? true : false;
            obj.type = i.type;
            obj.description = i.description;
            columnarr.push(obj);
          }
        }
        const data = {};
        data.custId = this.$store.getters.custId;
        data.schema = "event_" + this.schemaname;
        data.description = this.description;
        data.fields = columnarr;
        addEventSchema(data).then(Response => {
          if (Response.data.code === 0) {
            this.dialogVisible = false
            this.$alert(
              "Event Schema was successfully created and  jumps to event schema list page!",
              "Information",
              {
                confirmButtonText: "Yes",
                callback: action => {
                  this.$router.push({
                    path: `/eventdata?time=${new Date().getTime()}`
                  });
                }
              }
            );
          } else {
            this.$message.error(Response.data.msg)
          }
        });
      },
      cancel() {
        this.$confirm(
          "Click Yes will not to save any edit, sure to continue?",
          "Information",
          {
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            type: "warning"
          }
        )
          .then(() => {
            this.$router.push({
              path: `/eventdata`
            });
          })
          .catch(e => {
            console.log(e);
          });
      },
      addMasterUser() {
        for (let i of this.master_user.data) {
          if (i.isSet)
            return this.$message.warning("Save the current edit item first!");
        }
        let j = {
          id: 0,
          type: "String",
          optional: "Optional",
          name: "",
          description: "",
          isSet: true,
          _temporary: true
        };
        this.master_user.data.push(j);
        this.master_user.sel = JSON.parse(JSON.stringify(j));
        this.addstatus = "ing";

        // clearTimeout(timeout)
      },
      //修改
      pwdChange(row, index, cg) {
        //是否是取消操作
        if (!cg) {
          if (!this.master_user.sel.id) this.master_user.data.splice(index, 1);
          return (row.isSet = !row.isSet);
        }
        //提交数据
        if (row.isSet) {
          if (this.master_user.sel.name === "") {
            this.$message.error("Column name can't be empty!");
          } else if (this.master_user.sel.name.length > 45) {
            this.$message.error("Column name up to 45 characters allowed!");
          } else if (this.saveColumnChecker(this.master_user.sel.name) === "start") {
            this.$message.warning("Column name must start with a letter!");
          } else if (this.saveColumnChecker(this.master_user.sel.name) === "reg") {
            this.$message.warning("The column names can contain only letters, numbers, or the underscore character!");
          } else if (this.saveColumnChecker(this.master_user.sel.name) === "exist") {
            this.$message.warning("The column already exists!");
          } else {
            let data = JSON.parse(JSON.stringify(this.master_user.sel));
            data.type ='string' === data.type.toLowerCase() ? 'String' : 'Number';
            for (let k in data) row[k] = data[k];
            row.isSet = false;
          }
        } else {
          this.master_user.sel = JSON.parse(JSON.stringify(row));
          row.isSet = true;
        }
      },
      saveColumnChecker(str) {
        const startLetterReg = /^[a-zA-z]/;
        const reg = /^[a-zA-Z][0-9a-zA-Z_]{0,}$/;
        if (!startLetterReg.test(str)) {
          return "start"
        }
        if (!reg.test(str)) {
          return "reg";
        }
        for (let i of this.master_user.data) {
          if (i.name.toLowerCase() === str.toLowerCase()) {
            return "exist";
          }
        }
      }
    },
    created() {
      this.getSchemaList();
    }
  };
</script>
<style scoped>
  .al {
    background-color: rgb(246, 246, 247);
    /* overflow: scroll; */
  }

  .al-main {
    width: 100%;
    background-color: rgb(246, 246, 247);
  }

  .al-main .step {
    margin-left: 50%;
    padding-top: 30px;
    transform: translate(-30%);
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

  .routerview {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 1000;
    height: 100vh;
  }

  .contain {
    width: 50%;
    margin: 3vw auto 0 auto;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 8px;
  }

  .contain-title {
    font-size: 2.3vh;
    width: 100%;
    padding: 0 0 1% 1%;
    border-bottom: 1px solid #ccc;
  }

  .contain-main {
    padding-left: 1%;
  }

  .schemaname {
    margin-left: 10px;
    width: 220px;
  }

  .decsription {
    width: 275px;
  }

  .step {
    padding: 10px;
  }

  .clear {
    height: 50vh;
    background-color: rgb(246, 246, 247);
  }

  .el-table-add-row {
    width: 90%;
    margin: 5px auto;
    height: 34px;
    border: 1px dashed #c1c1cd;
    border-radius: 3px;
    cursor: pointer;
    justify-content: center;
    display: flex;
    line-height: 34px;
  }

  .columninfo {
    width: 90%;
    margin: 3vw auto 0 auto;
    background-color: #fff;
    border: 1px solid #ccc;
  }

  .el-dialog {
    z-index: 10000;
  }
</style>
