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
            {field: 'name', title: '名称'},
            {field: 'link', title: '联系人', width: 100},
            {field: 'mobile', title: '联系方式',width:120},
            {
                field: 'address', title: '地址', templet: function (d) {
                    return d.province + d.city + d.county + d.address;
                }
            },
            {
                field: 'create_time', title: '创建时间'},
            {
                field: 'operate', title: '操作', width: 180, templet: function (d) {
                    return `<button class="layui-btn layui-btn-xs layui-btn-primary"><i class="layui-icon layui-icon-edit" onclick="openDialog('编辑医院信息',${d.id})">编辑</i></button>
                            <button class="layui-btn layui-btn-xs"><i class="layui-icon layui-icon-set" onclick="openConfigDialog(${d.id})">公卫配置</i></button>
                             `
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

function openConfigDialog(hospital_id) {
    let index = layer.open({
        type: 1,
        content: `
                        <form class="layui-form layui-padding-3" id="addForm">
                                    <input type="hidden" name="hospital_id" value="${hospital_id}">
                                    <div class="layui-form-item">
                                        <div class="layui-inline">
                                            <label class="layui-form-label required">机构ID</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="jgid" required  lay-verify="required" placeholder="请输入机构ID" class="layui-input">
                                            </div>
                                        </div>
                                        <div class="layui-inline">
                                            <label class="layui-form-label required">系统名称</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="xtmc" required  lay-verify="required" placeholder="请输入系统名称" class="layui-input">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <div class="layui-inline">
                                            <label class="layui-form-label required" >业务代码</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="ywjgdm" required  lay-verify="required" placeholder="请输入业务机构代码" class="layui-input">
                                            </div>
                                        </div>
                                        <div class="layui-inline">
                                            <label class="layui-form-label required">行政ID</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="xzid" required  lay-verify="required" placeholder="请输入行政ID" class="layui-input">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                      <label class="layui-form-label required">请求地址</label>
                                      <div class="layui-input-block">
                                        <input type="text" name="api_url" required  lay-verify="required" placeholder="请输入请求地址" class="layui-input">
                                      </div>
                                    </div>
                                    <div class="layui-form-item">
                                      <label class="layui-form-label required">证书ID</label>
                                      <div class="layui-input-block">
                                        <input type="text" name="certificate_id" required lay-verify="required" placeholder="请输入证书ID" class="layui-input">
                                      </div>
                                    </div>
                                    <div class="layui-form-item">
                                       <label class="layui-form-label required">公 匙</label>
                                        <div class="layui-input-block">
                                           <textarea type="text" name="public_key" required lay-verify="required" placeholder="请输入公匙" class="layui-textarea"></textarea>
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                       <label class="layui-form-label">私 匙</label>
                                        <div class="layui-input-block">
                                           <textarea type="text" name="private_key" placeholder="请输入私匙" class="layui-textarea"></textarea>
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                      <div style="text-align: center">
                                        <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                                        <button type="submit" lay-filter="addForm" lay-submit class="layui-btn">保存</button>
                                      </div>
                                    </div>
                                  </form>
                    `,
        title: '配置公卫平台信息',
        area: ['720px', '640px'],
        success: function () {
            //先根据hospital_id查询
            let loadIndex = layer.load(3)
            $.ajax({
                url: 'hospital/api/getConfig?hospital_id=' + hospital_id,
                method: 'get',
                success: function (res) {
                    layer.close(loadIndex)
                    if(res.code === 0 && res.data && res.data.jgid) {
                        //回显值
                        $('#addForm input[name="jgid"]').val(res.data.jgid);
                        $('#addForm input[name="api_url"]').val(res.data.api_url);
                        $('#addForm input[name="certificate_id"]').val(res.data.certificate_id);
                        $('#addForm textarea[name="public_key"]').val(res.data.public_key);
                        $('#addForm textarea[name="private_key"]').val(res.data.private_key);
                        $('#addForm input[name="ywjgdm"]').val(res.data.ywjgdm);
                        $('#addForm input[name="xtmc"]').val(res.data.xtmc);
                        $('#addForm input[name="xzid"]').val(res.data.xzid);
                    }
                },
                error: function () {
                    layer.msg('网络异常');
                    layer.close(loadIndex)
                }
            })
            form.on('submit(addForm)', function (data) {
                let loadIndex = layer.load(3)
                console.log(data)
                $.ajax({
                    url: 'hospital/api/saveConfig',
                    method: 'post',
                    data: data.field,
                    success: function (res) {
                        layer.close(loadIndex)
                        layer.close(index)
                        if (res.code === 0) {
                            layer.msg(res.msg);
                            layer.close(index);
                        } else {
                            layer.msg(res.msg)
                        }
                    },
                    error: function () {
                        layer.close(loadIndex)
                        layer.msg('网络异常');
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