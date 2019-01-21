<%--
    Document   : index
    Created on : 22-sep-2018, 19:29:49
    Author     : Jessi
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">

    <head>
        <!-- Required meta tags -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <!-- Bootstrap CSS -->
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
        <link rel="icon" href="./images/1600.png">
        <link href="https://netdna.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet prefetch">
        <title>Cliente</title>
    </head>

    <body>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <h1 class="navbar-brand" href="#">Cliente</h1>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav"></ul>
            </div>
        </nav>
        <div class="col-md-11">
            <div class="card">
                <canvas id="a" width="800" height="600"></canvas>
                <div class="card-body">
                    <h5 class="card-title"></h5>
                    <p class="card-text"></p>

                    <div class="btn-group" role="group" aria-label="Basic example">
                        <button type="button" class="btn btn-primary" id="btnUpload">Cargar</button>
                        <button type="button" class="btn btn-primary" id="btnCut">Cortar</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-7">
<<<<<<< HEAD
            <%@ page import="java.io.*" 
                     import="com.ute.models.coordenates.Conexion"%>

            <%
                Conexion cx = new Conexion();
                cx.testMethod();
            %>
            <%!
                public String[] ReadArray() throws FileNotFoundException {
                    String ruta = "C:\\Users\\jessi\\Documents\\NetBeansProjects\\Cliente\\filters.txt";
                    String[] filters = null;
                    File archivo = new File(ruta);
                    FileReader fr = new FileReader(ruta);
                    BufferedReader br = new BufferedReader(fr);

=======
            <%@ page import="java.io.*" %>
            <%!
                public String[] ReadArray() throws FileNotFoundException {
                    String ruta = "C:\\Users\\jessi\\Documents\\NetBeansProjects\\Cliente\\filters.txt";
                    String[] filters = null;
                    File archivo = new File(ruta);
                    FileReader fr = new FileReader(ruta);
                    BufferedReader br = new BufferedReader(fr);

>>>>>>> 137ea75539c8244bd23e2867fa5eaad92dccd94f
                    try {
                        if (archivo.exists()) {
                            String linea;
                            while ((linea = br.readLine()) != null) {
                                filters = linea.split(",");
                            }

                        } else {
                            filters = null;
                        }
                        fr.close();
                    } catch (IOException ex) {

                    }
                    return filters;
                }

            %>
            <div class="card">
                <div class="card-body">

                    <h5 class="card-title">Filtros</h5>
                    <select class="custom-select" id="filter_list">

                        <option selected="selected">
                            Seleccionar Filtro</option>
<<<<<<< HEAD
                            <%                                try {
                                    String text[] = this.ReadArray();
                                    for (int i = 0; i < text.length; i++) {%> 
                        <option value = "<%= text[i]%>"><%= text[i]%></option>
=======
                            <%
                                try {
                                    String text[] = this.ReadArray();
                                    for (int i = 0; i < text.length; i++) {%> 
                                    <option value = "<%= text[i] %>"><%= text[i] %></option>
>>>>>>> 137ea75539c8244bd23e2867fa5eaad92dccd94f
                        <% }
                            } catch (IOException ex) {
                            }

                        %> 
<<<<<<< HEAD

                    </select>

                    <p class="card-text"></p>

=======
                        
                    </select>

                    <p class="card-text"></p>
              
>>>>>>> 137ea75539c8244bd23e2867fa5eaad92dccd94f

                </div>
            </div>
        </div>
        <div class="col-md-7">
            <h3></h3>
            <h5>Output</h5>
            <div class="input-group mb-3">
                <canvas id="output"></canvas>
                <canvas id="b"></canvas>
            </div>
            <button id="refresh" class="btn btn-primary" onclick="reFresh()">Refresh</button>
            <button id="canvasImageSave" class="btn btn-primary" onclick="savecanvas()">Save</button>
            <button id="canvasJsonSave" class="btn btn-primary" data-toggle="modal" data-target="#myModal">Save Json</button>
        </div>
        <div class="col-md-7">
            <div class="container">
                <!-- Modal -->
                <div class="modal fade" id="myModal" role="dialog">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">

                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <form method="post" action="process.jsp">
                                    <textarea name="code" id="code" class="form-control"></textarea>
                                    <input type="submit" class="btn btn-primary" value="Save">


                                </form>

                            </div>
                            <div class="modal-footer">
                                <!-- <button type="button" class="btn btn-default" id="cjson">Copiar</button>-->
                                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-7">
            <div id="Layer1" style="width: 1920px; height: 1080px; overflow: scroll;"></div>
        </div>



        <!-- Optional JavaScript -->
        <!-- jQuery first, then Popper.js, then Bootstrap JS -->
        <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
        <!-- <script src="./js/script.js"></script> <script src="./js/Imagefilter.js"></script> -->
        <script src="./js/fabric.min.js"></script>
        <script src="./js/jquery-3.3.1.min.js"></script>
        <script src="./js/DAT.GUI.js"></script>
        <script src="./js/imagefilters.js"></script>
        <script src="./js/jquery-1.6.min.js"></script>
        <script src="./js/Imagefilter.js"></script>
        <script src="./js/script.js"></script>
        <script></script>
    </body>

</html>
