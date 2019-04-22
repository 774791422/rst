<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    Object username=request.getAttribute("username");
    Object password=request.getAttribute("password");
%>
<html>
<head>
    <title>Title</title>
</head>
<body>
<span>跳转中...</span>
<form id="ssoLoginForm" action="login" method="post" style="display: none">
    <div>
        <input type="text" name="username" value="<%=username.toString()%>">
    </div>
    <div>
        <input type="password" name="password" value="<%=password.toString()%>">
    </div>
</form>
<script src="plugins/jQuery/jquery-2.2.3.min.js"></script>
<script>
    $(document).ready(function(){
        $("#ssoLoginForm").submit();
    });
</script>
</body>
</html>
