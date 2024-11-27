$(document).ajaxError(function (event, status, xhr) {
    if(status.status === 401){
        layui.use('layer',function (){
            let layer = layui.layer;
            layer.alert('未登录或登录失效！', () => {
                window.location.href = '/'
            });
        })
    }
})