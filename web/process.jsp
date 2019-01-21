<%-- 
    Document   : process.jsp
    Created on : 05/11/2018, 21:09:59
    Author     : jessi
--%>

<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@page import="java.sql.*,java.util.*"%>

<%
    String first_name = request.getParameter("code");

    try {
        Class.forName("com.mysql.jdbc.Driver");
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost/data", "jessica", "1234");
        Statement st = conn.createStatement();
        String query = "delete from images";
        PreparedStatement preparedStmt = conn.prepareStatement(query);
        // execute the preparedstatement
        preparedStmt.execute();
        st.executeUpdate("insert into images (`Parqueo`, `dataimage`) values(1,'" + first_name + "')");
        out.println("Parqueos Guardados!");
        conn.close();
    } catch (Exception e) {
        System.out.print(e);
        e.printStackTrace();
    }


%>
