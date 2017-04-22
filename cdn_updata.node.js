
const path = require("path")
const fs = require("fs")
const axios = require("axios")


var SCAN_PATH = path.join(__dirname, "docs")
// var GIT_URL = "http://ui-dna.doc.design-enzyme.com"
var GIT_URL = "http://doc.design-enzyme.com"
var NOTSCAN = /^node_modules/


fileList = []

console.info("\x1b[34m","扫描目录----------------------------", SCAN_PATH)
scanDir(SCAN_PATH)

function scanDir(inPath) {
    var dir = fs.readdirSync(inPath)
    for (x in dir) {
        if(NOTSCAN.test(dir[x]))
        {
              console.log("skip ", dir[x])
            continue;
        }
       

        var _thisPath = path.join(inPath, dir[x])
        var isDirectory = false
        try {
            var stat = fs.statSync(_thisPath)
            isDirectory = stat.isDirectory()
        } catch (e) {
            console.error(e)
        }

        if (isDirectory) {
            scanDir(_thisPath)
        } else {

            console.log("+", _thisPath)
            fileList.push(path.relative(SCAN_PATH, _thisPath))

        }

    }
}

console.log(fileList)

console.log("\x1b[34m","发送 Get ----------------------------")
var count = 0
var len = fileList.length

for (x in fileList) {

    var uid = "magi_" + Math.round(Math.random() * 9999 )+ "sss"
    var url = GIT_URL + "/" + fileList[x] + "?" + uid
    getOnce(url)
}

function getOnce(url){

     axios.get(url).then(function (response) {
        console.log( "\x1b[32m",`[${++count}/${len}]`, url,(response.status+""))
    }).catch(function (error) {
        if (error.response != undefined && error.response.status != undefined) {
            var einfo = error.response.status
        } else {
            einfo = "error"
        }

        console.log( "\x1b[31m",`[${++count}/${len}]`, url, error.response.status)
    });
}