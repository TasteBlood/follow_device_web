let table,form,layer;
layui.use(['table', 'form', 'layer'], function () {
    table = layui.table;
    form = layui.form;
    layer = layui.layer;
    table.render({
        elem: '#table',
        url: '/hospital/api/findAll',
        cols: [[
            {field: 'id', title: 'ID', width: 80},
            {field: 'name', title: '名称', width: 300},
            {field: 'link', title: '联系人', width: 100},
            {field: 'mobile', title: '联系方式', width: 180},
            {
                field: 'address', title: '地址', templet: function (d) {
                    return d.province + d.city + d.county + d.address;
                }
            },
            {
                field: 'create_time', title: '创建时间', width: 200, templet: function (d) {
                    return d.create_time.toLocaleString('zh-cn');
                }
            },
            {
                field: 'operate', title: '操作', width: 200, templet: function (d) {
                    return `<button class="layui-btn layui-btn-xs"><i class="layui-icon layui-icon-edit" onclick="openDialog('编辑医院信息',${d.id})">编辑</i></button>
                                <button class="layui-btn layui-btn-xs layui-btn-danger"><i class="layui-icon layui-icon-delete" onclick="deleteClick(${d.id})">删除</i></button>`
                }
            },
        ]],
        page: true,
    });
    form.on('submit(form)', function (data) {
        let field = data.field;
        table.reload('table', {
            page: {curr: 1},
            where: field,
        });
        return false;
    });
    $('#btnAdd').on('click', function () {
        openDialog('添加医院信息')
    })
});

function openDialog(title,id) {
    let index = layer.open({
        type: 1,
        content: `
                        <form class="layui-form layui-padding-3" id="addForm">
                                    <input type="hidden" name="id">
                                    <div class="layui-form-item">
                                      <label class="layui-form-label">医院名称</label>
                                      <div class="layui-input-block">
                                        <input type="text" name="name" required  lay-verify="required" placeholder="请输入名称" class="layui-input">
                                      </div>
                                    </div>
                                    <div class="layui-form-item">
                                      <label class="layui-form-label">联系人</label>
                                      <div class="layui-input-block">
                                        <input type="text" name="link" required lay-verify="required" placeholder="请输入联系人" class="layui-input">
                                      </div>
                                    </div>
                                    <div class="layui-form-item">
                                       <label class="layui-form-label">联系电话</label>
                                        <div class="layui-input-block">
                                           <input type="text" name="mobile" required lay-verify="required" placeholder="请输入联系电话" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                       <label class="layui-form-label">省份</label>
                                        <div class="layui-input-block">
                                           <input type="text" name="province" required lay-verify="required" placeholder="请输入省份" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                       <label class="layui-form-label">市/州</label>
                                        <div class="layui-input-block">
                                           <input type="text" name="city" required lay-verify="required" placeholder="请输入市" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                       <label class="layui-form-label">县/区</label>
                                        <div class="layui-input-block">
                                           <input type="text" name="county" required lay-verify="required" placeholder="请输入县" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                       <label class="layui-form-label">详细地址</label>
                                        <div class="layui-input-block">
                                           <input type="text" name="address" placeholder="请输入详细地址" class="layui-input">
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
        area: ['400px', '550px'],
        success: function () {
            if(id){
                let index = layer.load(3)
                //查询数据，
                $.ajax({
                    url: `hospital/api/findOne?id=${id}`,
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
                    url: data.field.id?'hospital/api/edit':'hospital/api/add',
                    method: 'post',
                    data: data.field,
                    success: function (res) {
                        layer.close(loadIndex)
                        layer.close(index)
                        if (res.code === 0) {
                            layer.msg(res.msg);
                            layer.close(index);
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
function deleteClick(id) {
    let index = layer.confirm('确定删除吗？',null,()=>{
        $.ajax({
            url: 'hospital/api/delete',
            method: 'post',
            data: {id},
            success: function (res) {
                layer.msg(res.msg);
                layer.close(index);
                table.reload('table', {page: {curr: 1}});
            },
            error: function (res) {
                layer.msg(res.msg);
            }
        })
    }, ()=>{
    })
}