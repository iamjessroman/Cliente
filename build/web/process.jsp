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
        Connection conn = DriverManager.getConnection("jdbc:mysql://166.62.78.1:3306/data", "jessicaroman", "12345");
        Statement st = conn.createStatement();

        int i = st.executeUpdate("insert into images (`Parqueo`, `dataimage`) values(1,'" + first_name +"')");
        out.println("Data is successfully inserted!");
    } catch (Exception e) {
        out.println("NO!");
        System.out.print(e);
        e.printStackTrace();
    }
    

%>
