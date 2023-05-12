const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
var request = require("request");
var cors = require('cors');

const axios = require("axios");
const app = express();
app.use(cors({
    origin: "*"
}))
app.use(bodyParser.json());

const code = `#include <iostream>
                using namespace std;
                int main() {
                    int x=10;
                    int y=25;
                    int z=x+y;
                    cout<<"Sum of x+y = " << z;
                }`;

// const proxyurl = "https://cors-anywhere.herokuapp.com/";
const url = "https://api.jdoodle.com/v1/execute";

app.get("/", (req, res) => {
  res.send("Backend is working!");
})

app.post("/compile", (req, res) => {
    console.log(req.body.lang);
    const program = {
        script: req.body.code,
        stdin: req.body.input,
        language: req.body.lang,
        versionIndex: "0",
        clientId: "939a2ba815a7324a75ba0834acd803db",
        clientSecret: "c19773df76a6e68ad53225ab31e2cbd8375075e80102eecde2538d3d73f0ddca",
    };
    request(
        {
            url: url,
            method: "POST",
            json: program,
        },
        function (error, response, body) {
            res.json(body);
            console.log("error:", error);
            console.log("statusCode:", response && response.statusCode);
            console.log("body:", body);
        }
    );
});

// production

if (process.env.NODE_ENV === "production") {
    app.use(express.static("app/build"));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "app", "build", "index.html"));
    });
}

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`server started on port ${port}`));
