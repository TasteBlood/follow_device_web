let table,layer,form,uploader;
layui.use(['table','layer','form','upload'],function (){
    table = layui.table;
    form = layui.form;
    layer = layui.layer;
    uploader = layui.upload;
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
        url: '/version/api/findAll',
        cols:[[
            {field:'id',title:'ID',width:80},
            {field:'name',title:'所属医院',width:200,templet:function (d){
                return d.hospital.name;
            }},
            {field: 'version',title:'版本号',width:80},
            {field: 'code',title:'版本标识',width:100,},
            {field: 'content',title:'更新内容'},
            {field: 'size',title:'大小',width:120,templet:function (d){
                return `<a type="icon" href="${window.origin+'/file/'+d.url}" target="_blank">${(d.size/1024/1024).toFixed(2)+'Mb'}<i class="layui-icon layui-icon-download-circle"></i></a>`
            }},
            {field: 'create_time',title:'创建时间',width:160,},
            {field: 'operate',title:'操作',width:160,templet:function (d){
                return `<button class="layui-btn layui-btn-xs"><i class="layui-icon layui-icon-edit" onclick="openDialog('编辑版本信息',${d.id})">编辑</i></button>
                        <button class="layui-btn layui-btn-xs layui-btn-danger">&nbsp;<i class="layui-icon layui-icon-delete" onclick="onDeleteClick(${d.id})">删除</i></button>
                        `;
            }},
        ]],
        page:true
    })
    loadHospitals()
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
                                      <label class="layui-form-label">版本号</label>
                                      <div class="layui-input-block">
                                        <input type="text" name="version" required lay-verify="required" placeholder="请输入版本号" class="layui-input">
                                      </div>
                                    </div>
                                    <div class="layui-form-item">
                                      <label class="layui-form-label">版本标识</label>
                                      <div class="layui-input-block">
                                        <input type="text" name="code" required lay-verify="required" placeholder="请输入版本标识" class="layui-input">
                                      </div>
                                    </div>
                                    <div class="layui-form-item">
                                      <label class="layui-form-label">更新内容</label>
                                      <div class="layui-input-block">
                                        <textarea type="text" name="content" required lay-verify="required" placeholder="请输入更新内容" class="layui-textarea"></textarea>
                                      </div>
                                    </div>
                                    <div class="layui-form-item">
                                      <label class="layui-form-label">安装包</label>
                                      <div class="layui-input-block">
                                        <button type="button" id="uploader" class="layui-btn layui-btn-primary layui-btn-sm" lay-options="{accept:'file',exts:'apk'}">
                                            <i class="layui-icon layui-icon-upload"></i> 上传安装包
                                        </button>
                                        <div id="urlTips" style="margin-top: .1rem"></div>
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
        area: ['460px', '500px'],
        success: function () {
            //渲染select
            let options = "<option value=''>选择医院</option>"
            for(let i in hospitals){
                options += `<option value="${hospitals[i].id}">${hospitals[i].name}</option>`;
            }
            $('#addSelect').append(options);

            form.render('select')

            //渲染上传文件
            let loadIndex;
            let apkUrl = '';
            let apkSize = 0;
            let urlTips = $('#urlTips');
            urlTips.hide()
            uploader.render({
                elem: '#uploader',
                url:'/upload/single',
                size: 1024 * 50,//最大50MB
                accept:'file',
                before:function (){
                    loadIndex = layer.load(3)
                },
                done:function (res){
                    layer.close(loadIndex)
                    apkUrl = res.file.filename;
                    apkSize = res.file.size;
                    urlTips.text(apkUrl);
                    urlTips.show();
                    if(res.code===0){
                        layer.msg('上传成功')
                    }else{
                        layer.msg(res.msg)
                    }
                },
                error:function (){
                    layer.close(loadIndex)
                    layer.msg('网络异常')
                }
            });

            //处理表单重置事件
            $('#addForm').on('reset', function(){
                apkUrl = '';
                apkSize = 0;
                urlTips.text('')
                urlTips.hide()
                return true
            })

            if(id){
                let index = layer.load(3)
                //查询数据，
                $.ajax({
                    url: `version/api/findOne?id=${id}`,
                    method: 'get',
                    success: function (result) {
                        layer.close(index)
                        if(result.data){
                            //回显值
                            $("#addForm input[name='id']").val(result.data.id);
                            $("#addForm input[name='version']").val(result.data.version);
                            $("#addForm input[name='code']").val(result.data.code);
                            $("#addForm textarea[name='content']").val(result.data.content);
                            $("#addForm select[name='hospital_id']").val(result.data.hospital_id);
                            apkUrl = result.data.url;
                            apkSize = result.data.size;
                            urlTips.text(apkUrl);
                            urlTips.show();
                            form.render('select')
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
                if(!apkUrl){
                    layer.msg('请上传安装包！')
                    return false;
                }
                let loadIndex = layer.load(3)
                //处理数据
                data.field.url = apkUrl;
                data.field.size = apkSize;
                $.ajax({
                    url: data.field.id?'version/api/edit':'version/api/add',
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
                    error: function () {
                        layer.close(loadIndex)
                    }
                })
                return false
            })
        }
    })
}

function onDeleteClick(id){
    let index = layer.confirm('确定删除吗？',{},()=>{
        $.ajax({
            url: `version/api/delete?id=${id}`,
            method: 'get',
            success: function (result) {
                layer.close(index)
                layer.msg(result.msg)
                if(result.code===0){
                    table.reload('table', {page: {curr: 1},});
                }
            },
            error: function () {
                layer.msg('网络异常')
            }
        })
    },()=>{

    })
}
function init(){
    $('#btnAdd').on('click', function(){
        openDialog('添加版本信息')
    })
}
init()