<%-- 
    Document   : testFilters
    Created on : 01-ene-2019, 21:11:14
    Author     : jessi
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
    </head>
    <body>
        <canvas id="canvas"></canvas>
    </body>
    <script>
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        ctx.filter = 'blur(20px)';
        ctx.font = '48px serif';
        ctx.fillText('Hello world', 50, 100);
    </script>
</html>
