layui.use(['form','layer'],function (){
    const form = layui.form;
    const layer = layui.layer;
    form.on('submit(form)',function(data){
        $.ajax({
            url: '/api/login',
            type: 'post',
            data: data.field,
            success: function(data){
                if(data.code===0){
                    layer.msg('登录成功')
                    window.location.href= '/home'
                }else{
                    layer.msg(data.msg)
                }
            },
            error: function(data){
                layer.msg('网络异常')
            }
        })
        return false
    })
})