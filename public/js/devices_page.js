let table,layer,form;
layui.use(['table','layer','form'],function (){
    table = layui.table;
    form = layui.form;
    layer = layui.layer;

    //处理搜索表单事件
    form.on('submit(form)',function (data){
        table.reload('table',{
            page:{curr:1},
            where:data.field
        })
        return false;
    });
    //渲染表格
    table.render({
        elem: '#table',
        url: '/device/api/findAll',
        cols:[[
            {field:'id',title:'ID',width:80},
            {field:'name',title:'所属医院',templet:function (d){
                return d.hospital.name;
            }},
            {field: 'device_imei_code',title:'设备序列号'},
            {field: 'device_reg_code',title:'设备注册码'},
            {field: 'is_update',title:'支持更新',width:120,templet:function (d){
                return d.is_update===1?'是':'否'
            }},
            {field: 'create_time',title:'创建时间'},
            {field: 'operate',title:'操作',templet:function (d){
                if(d.is_update===1){
                    return `<button class="layui-btn layui-btn-sm layui-btn-primary" onclick="onStateChange(${d.id},-1)">禁止更新</button>`;
                }else{
                    return `<button class="layui-btn layui-btn-sm" onclick="onStateChange(${d.id},1)">启用更新</button>`;
                }
            }},
        ]],
        page:true
    })
});
let hospitals = [];
let selectHospital = $('#selectHospital');

function loadHospitals() {
    $.ajax({
        url:'/hospital/api/findAll?page=1&limit=100',
        type:'GET',
        success:function(res){
            if(res.code===0){
                hospitals = res.data
                //渲染首页的列表
                renderHospitals(hospitals);
            }
        }
    })
}

function renderHospitals(data) {
    selectHospital.html('');
    let options = "<option value=''>选择医院</option>";
    for (const index in data) {
        options += '<option value="'+data[index].id+'">'+data[index].name+'</option>';
    }
    selectHospital.append(options);
    form.render('select')
}

function openDialog(title,id) {
    let index = layer.open({
        type: 1,
        content: `
                        <form class="layui-form layui-padding-3" id="addForm">
                                    <input type="hidden" name="id">
                                    <div class="layui-form-item">
                                      <label class="layui-form-label">选择医院</label>
                                      <div class="layui-input-block">
                                        <select type="text" name="hospital_id" required  lay-verify="required" id="addSelect"></select>
                                      </div>
                                    </div>
                                    <div class="layui-form-item">
                                      <label class="layui-form-label">设备序列号</label>
                                      <div class="layui-input-block">
                                        <input type="text" name="device_imei_code" required lay-verify="required" placeholder="请输入序列号" class="layui-input">
                                      </div>
                                    </div>
                                    <div class="layui-form-item">
                                       <div class="layui-inline">
                                            <label class="layui-form-label">设备注册码</label>
                                            <div class="layui-input-inline layui-input-wrap">
                                               <input type="text" disabled name="device_reg_code" required lay-verify="required" placeholder="请生成注册码" class="layui-input">
                                            </div>
                                            <div class="layui-form-mid" style="padding: 0!important;">
                                               <button type="button" class="layui-btn" onclick="generateRegCode()">生 成</button>
                                            </div>
                                       </div>
                                    </div>
                                    <div class="layui-form-item">
                                      <label class="layui-form-label">支持更新</label>
                                      <div class="layui-input-block">
                                        <input type="radio" value="1" name="is_update" checked title="允许"/>
                                        <input type="radio" value="-1" name="is_update" title="不允许"/>
                                      </div>
                                    </div>
                                    <div class="layui-form-item">
                                      <div class="layui-input-block">
                                        <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                                        <button type="submit" lay-filter="addForm" lay-submit class="layui-btn">提交</button>
                                      </div>
                                    </div>
                                  </form>
                    `,
        title: title,
        area: ['460px', '360px'],
        success: function () {
            //渲染select
            let options = "<option value=''>选择医院</option>"
            for(let i in hospitals){
                options += `<option value="${hospitals[i].id}">${hospitals[i].name}</option>`;
            }
            $('#addSelect').append(options);

            form.render('select')
            form.render('radio')
            if(id){
                let index = layer.load(3)
                //查询数据，
                $.ajax({
                    url: `DEVICE/api/findOne?id=${id}`,
                    method: 'get',
                    success: function (result) {
                        layer.close(index)
                        if(result.data){
                            //回显值
                            $("#addForm input[name='id']").val(result.data.id);
                            $("#addForm input[name='name']").val(result.data.name);
                            $("#addForm input[name='link']").val(result.data.link);
                            $("#addForm input[name='mobile']").val(result.data.mobile);
                            $("#addForm input[name='province']").val(result.data.province);
                            $("#addForm input[name='city']").val(result.data.city);
                            $("#addForm input[name='county']").val(result.data.county);
                            $("#addForm input[name='address']").val(result.data.address);
                        }else{
                            layer.msg('暂无该记录');
                        }

                    },
                    error: function (result) {
                        layer.close(index)
                    }
                })
            }
            form.on('submit(addForm)', function (data) {
                let loadIndex = layer.load(3)
                $.ajax({
                    url: data.field.id?'device/api/edit':'device/api/add',
                    method: 'post',
                    data: data.field,
                    success: function (res) {
                        layer.close(loadIndex)
                        if (res.code === 0) {
                            layer.msg(res.msg);
                            layer.close(index)
                            table.reload('table', {
                                page: {curr: 1},
                            });
                        } else {
                            layer.msg(res.msg)
                        }
                    },
                    error: function (result) {
                        layer.close(loadIndex)
                    }
                })
                return false
            })
        }
    })
}
//生成注册码
function generateRegCode() {
    let imei = $("#addForm input[name='device_imei_code']").val()
    if(!imei){
        layer.msg('请先输入序列号')
        return null;
    }
    //先随机生成注册码
    $("#addForm input[name='device_reg_code']").val((Math.random()*100000).toFixed(0))
}
function onStateChange(id,type){
    let index = layer.confirm(`确定${type===1?'启用':'禁用'}吗?`,{},()=>{
        //调用ajax更新状态
        let loadIndex = layer.load(3)
        $.ajax({
            url: `device/api/updateState`,
            method: 'post',
            data:{id:id,state:type},
            success: function (result) {
                layer.close(index)
                layer.close(loadIndex)
                layer.msg(result.msg)
                table.reload('table', {page: {curr: 1}, });
            },
            error: function (result) {
                layer.close(index)
                layer.close(loadIndex)
            }
        })
    },()=>{});
}
//初始化加载数据
function init(){
    loadHospitals()
    $('#btnAdd').on('click', function(){
        openDialog('添加设备信息')
    })
}

init()