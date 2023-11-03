<!DOCTYPE html>
<html>
<head>
    <title>Simple Input Page</title>
</head>
<body>
    <h1>Simple Input Page</h1>
    <p>Enter your name:</p>
    <input type="text" id="nameInput">
    <br>
    <button type="button" onclick="submitData()">Submit</button>

    <script>
        function submitData() {
            var name = document.getElementById("nameInput").value;
            alert("You entered: " + name);
        }
    </script>
</body>
</html>
