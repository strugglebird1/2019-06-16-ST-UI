<template>
<div class="sie">
    <div class="user-top">
        <div class="top-title">Add authorization</div>
        <div class="top-des">
                <p>Description:</p>
                <span>Selected columns will be authorized to other customers</span>
        </div>
    </div>
    <div class="contain">
        <p class="contain-title">Save Authorization</p>
        <div class="contain-main">
            <el-form label-position="left" label-width="150px">
                <el-form-item label="Authorization Field">
                    <el-tag v-for="(item,index) in tags" :index="index" :key="index" style="margin: 0 3px 3px 0">
                        {{item.name}}
                    </el-tag>
                </el-form-item>
                <el-form-item label="Schema Name">
                    <span>{{schemaName}}</span>
                </el-form-item>
                <el-form-item label="Grantee">
                    <el-select v-model="item" filterable placeholder="Grantee">
                        <el-option
                        v-for="(item,index) in options"
                        :key="index"
                        :label="item.company"
                        :value="item.cid">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <div class="step">
            <el-button type="info" size='small' @click="toPrev()">Previous</el-button>
            <el-button type="primary" size='small' @click="toConfirm()">Confirm</el-button>
            <el-button type="info" size='small' @click="toConceal()">Cancel</el-button>
        </div>
    </div>
</div>
</template>

<script>
import { getAddList, getCustList, addPermission } from "@/api/auth"
export default {
    data() {
        return {
            form: [],
            schemaName: '',
            tags: [],
            selected: this.$route.query.selected,
            options: [],
            item: '',
            schema: 0
        }
    },
    methods: {
        getAddList() {
            getAddList({
                custId: this.$route.query.custId
            }).then(res => {   
                this.schema = res.data.data.schemas[0].id
                this.schemaName = res.data.data.schemas[0].schema
                const arr =this.selected.split(',')
                res.data.data.schemas[0].fields.forEach(item => {
                    if(arr.indexOf(item.id+'') !== -1) {
                        this.tags.push(item)
                    }
                })
            })
        },
        getCustList() {
            const data = {}
            data.status = "1"
            data.roleId = 4
            data.page = 1
            data.pageSize=10000
            getCustList(data).then(res => {
                const arr = Array.from(new Set(this.$route.query.custarr.split(',')))
                arr.push(this.$route.query.custId)
                res.data.data.users.forEach(item => {
                    if(arr.indexOf(String(item.cid))===-1){
                        this.options.push(item)
                    }
                })
            })
        },
        toPrev() {
            this.$router.push({
                path: `/auth/addauth?custId=${this.$route.query.custId}&name=${this.$route.query.name}&selected=${this.$route.query.selected}&search=${this.$route.query.search}&custarr=${Array.from(new Set(this.$route.query.custarr.split(',')))}`
            })
        },
        toConfirm() {
            if(this.item===''){
                this.$message.error('Please select Grantee!');
            }else{
                const data = {}
                data.custId = Number(this.$route.query.custId)
                data.tarCustId = Number(this.item),
                data.schemaId = this.schema,
                data.fields = new Array()
                this.tags.forEach(item => {
                    data.fields.push(item.id)
                })
                addPermission(data).then(res => {
                    this.$alert('Authorization is completed and  jumps to authorization list page!', 'Information', {
                        confirmButtonText: 'Yes',
                        callback: action => {
                            this.$router.push({
                                path: `/auth/al?custId=${this.$route.query.custId}&name=${this.$route.query.name}&time=${new Date().getTime()}`
                            })
                        }
                    });
                })
            }         
        },
        toConceal() {
            this.$confirm('Click Yes will not to save any edit, sure to continue?', 'Information', {
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
        this.getCustList()
    },
}
</script>
<style scoped>
.sie {
    background-color: rgb(246,246,247);
    padding-bottom: 3vw;
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
.contain {
    width: 50%;
    margin: 3vw auto 0 auto;
    background-color:#fff;
    border: 1px solid #ccc;
    border-radius: 8px;
}
.contain-title{
    font-size: 2.3vh;
    width: 100%;
    padding: 0 0 1% 1%;
    border-bottom: 1px solid #ccc
}
.contain-main{
    padding: 1%;
}
.step{
    text-align: center;
    padding-bottom: 1%;
}
.step .el-button{
    width: 100px;
    text-align: center;
}
</style>
