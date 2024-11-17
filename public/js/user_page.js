let form,table,layer;
layui.use(['form', 'table', 'layer'], function(){
    form = layui.form;
    table = layui.table;
    layer = layui.layer;

    table.render({
        elem: 'table',
        url: '/user/api/findAll',
        cols:[[
            {field:'id',title:'ID',width:80},
            {field:'username',title:'用户名'},
            {field:'real_name',title:'姓名'},
            {field:'mobile',title:'联系方式'},
            {field:'state',title:'状态',width:80,templet:function (record){
                return `<span style="color:${record.state===0?'green':'red'}">${record.state===0?'可用':'已禁用'}</span>`
            }},
            {field:'create_time',title:'创建时间'},
            {field:'operate',title:'操作',templet:function(record){
                let ele = `<button class="layui-btn layui-btn-xs layui-btn-normal"><i class="layui-icon layui-icon-edit" onclick="openDialog('编辑用户信息',${record.id})">编辑</i></button>`;
                if(record.state===0){
                    ele += `<button class="layui-btn layui-btn-xs layui-btn-primary"><i class="layui-icon layui-icon-lock" onclick="onStateChange(${record.id},-1)">禁用</i></button>`;
                }else{
                    ele += `<button class="layui-btn layui-btn-xs"><i class="layui-icon layui-icon-eye" onclick="onStateChange(${record.id},0)">启用</i></button>`;
                }
                return ele;
            }},
        ]],
        page:true
    });
    form.on('submit(form)', function(data) {
        table.reload('table',{page:{curr: 1},where:data.field});
        return false;
    })

});

function openDialog(title,id) {
    let index = layer.open({
        type: 1,
        content: `
                        <form class="layui-form layui-padding-3" id="addForm">
                                    <input type="hidden" name="id">
                                    <div class="layui-form-item">
                                      <label class="layui-form-label">用户名</label>
                                      <div class="layui-input-block">
                                        <input type="text" name="username" required lay-verify="required" placeholder="请输入用户名" class="layui-input">
                                      </div>
                                    </div>
                                    <div class="layui-form-item">
                                      <label class="layui-form-label">密 码</label>
                                      <div class="layui-input-block">
                                        <input type="password" name="password" required lay-verify="required" placeholder="请输入密码" class="layui-input">
                                      </div>
                                    </div>
                                    <div class="layui-form-item">
                                      <label class="layui-form-label">重复密码</label>
                                      <div class="layui-input-block">
                                        <input type="password" name="password1" required lay-verify="required" placeholder="请输入密码" class="layui-input">
                                      </div>
                                    </div>
                                    <div class="layui-form-item">
                                      <label class="layui-form-label">真实姓名</label>
                                      <div class="layui-input-block">
                                        <input type="text" name="real_name" placeholder="请输入姓名" class="layui-input">
                                      </div>
                                    </div>
                                    <div class="layui-form-item">
                                      <label class="layui-form-label">联系方式</label>
                                      <div class="layui-input-block">
                                        <input type="text" name="mobile" lay-verify="required|phone" placeholder="请输入联系方式" class="layui-input">
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
        area: ['420px', '420px'],
        success: function () {
            if(id){
                let index = layer.load(3)
                //查询数据，
                $.ajax({
                    url: `user/api/findOne?id=${id}`,
                    method: 'get',
                    success: function (result) {
                        layer.close(index)
                        if(result.data){
                            //回显值
                            $("#addForm input[name='id']").val(result.data.id);
                            $("#addForm input[name='username']").val(result.data.username);
                            $("#addForm input[name='real_name']").val(result.data.real_name);
                            $("#addForm input[name='mobile']").val(result.data.mobile);
                            $("#addForm input[name='password']").val(result.data.password);
                            $("#addForm input[name='password1']").val(result.data.password);
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
                if(data.field.password!==data.field.password1){
                    layer.msg('密码不一致！')
                    return false;
                }
                let loadIndex = layer.load(3)
                $.ajax({
                    url: data.field.id?'user/api/edit':'user/api/add',
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
function onStateChange(id,type){
    let index = layer.confirm(`确定${type===0?'启用':'禁用'}吗?`,{},()=>{
        //调用ajax更新状态
        let loadIndex = layer.load(3)
        $.ajax({
            url: `user/api/updateState`,
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
function init(){
    $('#btnAdd').on('click', function(){
        openDialog('添加用户')
    })
}
init()