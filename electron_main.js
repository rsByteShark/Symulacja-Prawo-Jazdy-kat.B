const { app, BrowserWindow, Menu } = require('electron');
if (require('electron-squirrel-startup')) app.quit();

const http = require('http');
const { https } = require("follow-redirects");
const path = require("path");
const fs = require('fs');
const { brotliDecompressSync } = require("zlib");
const { PrismaClient } = require('@prisma/client');
const { execSync } = require("child_process");

const resourceDatabaseLocation = path.join(process.cwd(), "prawokatbdb.sqlite");
const resourcesDatabaseURL = new URL("https://drive.google.com/uc?id=1Y0OiTnh9TbskOMZEMi71ygGAqk3EuspY&export=download");
let databaseDownloadProgress = 0;
let databaseByteSize = 0;
let expecedDatabaseSize = 3701772288;
process.env.DATABASE_LOCATION = `file:${resourceDatabaseLocation}`;

let resourcesDatabaseExists = fs.existsSync(resourceDatabaseLocation);

if (resourcesDatabaseExists) {

    const stats = fs.statSync(resourceDatabaseLocation);

    if (stats.size !== expecedDatabaseSize) {

        execSync(`del ${resourceDatabaseLocation}`)

        resourcesDatabaseExists = false;

    }

}

const maindb = JSON.parse(fs.readFileSync(path.join(__dirname, "PrawoB.json"), { encoding: "utf-8" }));



let prisma = resourcesDatabaseExists ? new PrismaClient() : null;



let exam = {
    normalPart: [],
    techPart: []
}

const genRandomNumInRange = (low, high) => {

    if (low >= high) {
        throw new Error("Invalid range. 'low' should be less than 'high'.");
    }

    const range = high - low;

    const randomDecimal = Math.random();

    const randomNumberInRange = low + randomDecimal * range;

    return Math.round(randomNumberInRange);

}

const mangleArray = (arr) => {
    // Check if the input is an array
    if (!Array.isArray(arr)) {
        throw new Error('Input is not an array');
    }

    const newArray = arr.slice(); // Create a shallow copy to avoid modifying the original array

    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Generate a random index
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Swap elements
    }

    return newArray;
}

const checkIfIsDuplicate = (drawedRecord, arrayOfRecords) => {


    let isDuplicate = false;

    const drawedQuestion = drawedRecord.question;

    arrayOfRecords.forEach(el => {

        if (el.question === drawedQuestion) isDuplicate = true;

    })

    return isDuplicate

}

const generateExam = () => {

    const threePointQuestions = maindb.normal["high"];

    if (threePointQuestions.length > 10) {

        while (exam.normalPart.length !== 10) {

            let drawedQuestion = threePointQuestions[genRandomNumInRange(0, (threePointQuestions.length - 1))];

            while (checkIfIsDuplicate(drawedQuestion, exam.normalPart)) {

                drawedQuestion = threePointQuestions[genRandomNumInRange(0, (threePointQuestions.length - 1))];

            }

            exam.normalPart.push(drawedQuestion);

        }

    } else {

        if (threePointQuestions.length !== 1 && threePointQuestions.length !== 0) {

            let i = 0;
            while (exam.normalPart.length !== 10 && (threePointQuestions.length - 1) !== i) {

                exam.normalPart.push(threePointQuestions[i]);

                i++;

            }

        } else if (threePointQuestions.length === 1) {

            exam.normalPart.push(threePointQuestions[0]);

        }


        while (exam.normalPart.length !== 10) {

            let drawedQuestion = maindb.normal["highDone"][genRandomNumInRange(0, (maindb.normal["highDone"].length - 1))];

            while (checkIfIsDuplicate(drawedQuestion, exam.normalPart)) {

                drawedQuestion = maindb.normal["highDone"][genRandomNumInRange(0, (maindb.normal["highDone"].length - 1))];

            }

            exam.normalPart.push(drawedQuestion);

        }


    }

    const twoPointQuestions = maindb.normal["mid"];

    if (twoPointQuestions.length > 16) {

        while (exam.normalPart.length !== 16) {


            let drawedQuestion = twoPointQuestions[genRandomNumInRange(0, (twoPointQuestions.length - 1))];

            while (checkIfIsDuplicate(drawedQuestion, exam.normalPart)) {

                drawedQuestion = twoPointQuestions[genRandomNumInRange(0, (twoPointQuestions.length - 1))];

            }

            exam.normalPart.push(drawedQuestion);

        }

    } else {


        if (twoPointQuestions.length !== 1 && twoPointQuestions.length !== 0) {

            let i = 0;
            while (exam.normalPart.length !== 16 && (twoPointQuestions.length - 1) !== i) {

                exam.normalPart.push(twoPointQuestions[i]);

                i++;

            }

        } else if (twoPointQuestions.length === 1) {

            exam.normalPart.push(twoPointQuestions[0]);

        }



        while (exam.normalPart.length !== 16) {

            let drawedQuestion = maindb.normal["midDone"][genRandomNumInRange(0, (maindb.normal["midDone"].length - 1))];

            while (checkIfIsDuplicate(drawedQuestion, exam.normalPart)) {

                drawedQuestion = maindb.normal["midDone"][genRandomNumInRange(0, (maindb.normal["midDone"].length - 1))];

            }

            exam.normalPart.push(drawedQuestion);

        }


    }

    const onePointQuestions = maindb.normal["low"];

    if (onePointQuestions.length > 20) {

        while (exam.normalPart.length !== 20) {

            let drawedQuestion = onePointQuestions[genRandomNumInRange(0, (onePointQuestions.length - 1))];


            while (checkIfIsDuplicate(drawedQuestion, exam.normalPart)) {

                drawedQuestion = onePointQuestions[genRandomNumInRange(0, (onePointQuestions.length - 1))];

            }

            exam.normalPart.push(drawedQuestion);

        }

    } else {

        if (onePointQuestions.length !== 1 && onePointQuestions.length !== 0) {

            let i = 0;
            while (exam.normalPart.length !== 20 && (onePointQuestions.length - 1) !== i) {

                exam.normalPart.push(onePointQuestions[i]);

                i++;

            }

        } else if (onePointQuestions.length === 1) {

            exam.normalPart.push(onePointQuestions[0]);

        }



        while (exam.normalPart.length !== 20) {

            let drawedQuestion = maindb.normal["lowDone"][genRandomNumInRange(0, (maindb.normal["lowDone"].length - 1))];

            while (checkIfIsDuplicate(drawedQuestion, exam.normalPart)) {

                drawedQuestion = maindb.normal["lowDone"][genRandomNumInRange(0, (maindb.normal["lowDone"].length - 1))];

            }

            exam.normalPart.push(drawedQuestion);
        }


    }


    exam.normalPart = mangleArray(exam.normalPart);


    const threePointTechQuestions = maindb.tech["high"];

    if (threePointTechQuestions.length > 6) {

        while (exam.techPart.length !== 6) {

            let drawedQuestion = threePointTechQuestions[genRandomNumInRange(0, (threePointTechQuestions.length - 1))];

            while (checkIfIsDuplicate(drawedQuestion, exam.techPart)) {

                drawedQuestion = threePointTechQuestions[genRandomNumInRange(0, (threePointTechQuestions.length - 1))];

            }

            exam.techPart.push(drawedQuestion);

        }

    } else {

        if (threePointTechQuestions.length !== 1 && threePointTechQuestions.length !== 0) {

            let i = 0;
            while (exam.techPart.length !== 6 && (threePointTechQuestions.length - 1) !== i) {

                exam.techPart.push(threePointTechQuestions[i]);

                i++;

            }

        } else if (threePointTechQuestions.length === 1) {

            exam.techPart.push(threePointTechQuestions[0]);

        }



        while (exam.techPart.length !== 6) {

            let drawedQuestion = maindb.tech["highDone"][genRandomNumInRange(0, (maindb.tech["highDone"].length - 1))];

            while (checkIfIsDuplicate(drawedQuestion, exam.techPart)) {

                drawedQuestion = maindb.tech["highDone"][genRandomNumInRange(0, (maindb.tech["highDone"].length - 1))];

            }

            exam.techPart.push(drawedQuestion);

        }


    }

    const twoPointTechQuestions = maindb.tech["mid"];

    if (twoPointTechQuestions.length > 10) {

        while (exam.techPart.length !== 10) {

            let drawedQuestion = twoPointTechQuestions[genRandomNumInRange(0, (twoPointTechQuestions.length - 1))];

            while (checkIfIsDuplicate(drawedQuestion, exam.techPart)) {

                drawedQuestion = twoPointTechQuestions[genRandomNumInRange(0, (twoPointTechQuestions.length - 1))];

            }

            exam.techPart.push(drawedQuestion);

        }

    } else {

        if (twoPointTechQuestions.length !== 1 && twoPointTechQuestions.length !== 0) {

            let i = 0;
            while (exam.techPart.length !== 10 && (twoPointTechQuestions.length - 1) !== i) {

                exam.techPart.push(twoPointTechQuestions[i]);

                i++;

            }

        } else if (twoPointTechQuestions.length === 1) {

            exam.techPart.push(twoPointTechQuestions[0]);

        }



        while (exam.techPart.length !== 10) {

            let drawedQuestion = maindb.tech["midDone"][genRandomNumInRange(0, (maindb.tech["midDone"].length - 1))];

            while (checkIfIsDuplicate(drawedQuestion, exam.techPart)) {

                drawedQuestion = maindb.tech["midDone"][genRandomNumInRange(0, (maindb.tech["midDone"].length - 1))];


            }

            exam.techPart.push(drawedQuestion);

        }


    }

    const onePointTechQuestions = maindb.tech["low"];

    if (onePointTechQuestions.length > 12) {

        while (exam.techPart.length !== 12) {

            let drawedQuestion = onePointTechQuestions[genRandomNumInRange(0, (onePointTechQuestions.length - 1))];

            while (checkIfIsDuplicate(drawedQuestion, exam.techPart)) {

                drawedQuestion = onePointTechQuestions[genRandomNumInRange(0, (onePointTechQuestions.length - 1))];

            }

            exam.techPart.push(drawedQuestion);

        }

    } else {

        if (onePointTechQuestions.length !== 1 && onePointTechQuestions.length !== 0) {

            let i = 0;
            while (exam.techPart.length !== 12 && (onePointTechQuestions.length - 1) !== i) {

                exam.techPart.push(onePointTechQuestions[i]);

                i++;

            }

        } else if (onePointTechQuestions.length === 1) {

            exam.techPart.push(onePointTechQuestions[0]);

        }



        while (exam.techPart.length !== 12) {

            let drawedQuestion = maindb.tech["lowDone"][genRandomNumInRange(0, (maindb.tech["lowDone"].length - 1))];

            while (checkIfIsDuplicate(drawedQuestion, exam.techPart)) {

                drawedQuestion = maindb.tech["lowDone"][genRandomNumInRange(0, (maindb.tech["lowDone"].length - 1))];
            }

            exam.techPart.push(drawedQuestion);

        }


    }


    exam.techPart = mangleArray(exam.techPart);

}

const moveQuestionsToDoneSection = () => {

    const sevs = ["lowDone", "midDone", "highDone"];

    exam.normalPart.forEach(el => {

        let indexOfQuestionInDb;
        let elementSev;
        let questionIsPresentInDoneSegment = false;
        let doneSegmentCleared = false;

        for (let sev in maindb.normal) {

            if (!indexOfQuestionInDb && !sevs.includes(sev)) {



                for (let i = 0; i < maindb.normal[sev].length; i++) {

                    const questionInDb = maindb.normal[sev][i];

                    if (questionInDb.uid === el.uid) {

                        indexOfQuestionInDb = i;
                        elementSev = sev;
                        break;

                    }

                }

                if (maindb.normal[sev].length === 0) {


                    maindb.normal[`${sev}Done`].forEach((el, i) => {

                        maindb.normal[sev].push(el);

                    })

                    maindb.normal[`${sev}Done`] = [];

                    doneSegmentCleared = true;

                }

            }

        }

        if (indexOfQuestionInDb !== undefined) {

            let elInDBCopy = { ...maindb.normal[elementSev][indexOfQuestionInDb] }

            maindb.normal[elementSev].splice(indexOfQuestionInDb, 1);

            maindb.normal[`${elementSev}Done`].push(elInDBCopy);

        } else if (!doneSegmentCleared) {

            for (let sev in maindb.normal) {

                if (!indexOfQuestionInDb && sevs.includes(sev)) {


                    for (let i = 0; i < maindb.normal[sev].length; i++) {

                        const questionInDb = maindb.normal[sev][i];

                        if (questionInDb.uid === el.uid) {

                            indexOfQuestionInDb = i;
                            elementSev = sev;
                            questionIsPresentInDoneSegment = true
                            break;

                        }

                    }

                }

            }

            if (!questionIsPresentInDoneSegment) {

                throw new Error("question isn't present in done segment")

            }

        }

    })

    exam.techPart.forEach(el => {

        let indexOfQuestionInDb;
        let elementSev;
        let questionIsPresentInDoneSegment = false;
        let doneSegmentCleared = false;

        for (let sev in maindb.tech) {

            if (!indexOfQuestionInDb && !sevs.includes(sev)) {

                for (let i = 0; i < maindb.tech[sev].length; i++) {

                    const questionInDb = maindb.tech[sev][i];

                    if (questionInDb.uid === el.uid) {

                        indexOfQuestionInDb = i;
                        elementSev = sev;
                        break;

                    }

                }

                if (maindb.tech[sev].length === 0) {


                    maindb.tech[`${sev}Done`].forEach((el, i) => {

                        maindb.tech[sev].push(el);

                    })

                    maindb.tech[`${sev}Done`] = [];

                    doneSegmentCleared = true;

                }

            }

        }


        if (indexOfQuestionInDb !== undefined) {


            let elInDBCopy = { ...maindb.tech[elementSev][indexOfQuestionInDb] }

            maindb.tech[elementSev].splice(indexOfQuestionInDb, 1);

            maindb.tech[`${elementSev}Done`].push(elInDBCopy);

        } else if (!doneSegmentCleared) {

            for (let sev in maindb.tech) {

                if (!indexOfQuestionInDb && sevs.includes(sev)) {

                    for (let i = 0; i < maindb.tech[sev].length; i++) {

                        const questionInDb = maindb.tech[sev][i];

                        if (questionInDb.uid === el.uid) {

                            indexOfQuestionInDb = i;
                            elementSev = sev;
                            questionIsPresentInDoneSegment = true
                            break;

                        }

                    }

                }

            }

            if (!questionIsPresentInDoneSegment) {

                throw new Error("question isn't present in done segment")

            }





        }



    })

}

const refreshDb = () => {

    const sevs = ["lowDone", "midDone", "highDone"];

    for (let sev in maindb.normal) {

        if (!sevs.includes(sev)) {

            maindb.normal[`${sev}Done`].forEach(el => {

                maindb.normal[sev].push(el);

            })

            maindb.normal[`${sev}Done`] = [];

        }


    }

    for (let sev in maindb.tech) {


        if (!sevs.includes(sev)) {

            maindb.tech[`${sev}Done`].forEach(el => {

                maindb.tech[sev].push(el);

            })

            maindb.tech[`${sev}Done`] = [];

        }


    }

}

const checkIntegrity = () => {

    const sevs = ["lowDone", "midDone", "highDone"];

    const UIDs = [];

    let counter = 0;

    for (let sev in maindb.normal) {

        maindb.normal[sev].forEach(el => {

            if (UIDs.includes(el.uid)) throw new Error("duplicate detected")

            UIDs.push(el.uid);

            counter++;

        })

    }

    for (let sev in maindb.tech) {

        maindb.tech[sev].forEach(el => {

            if (UIDs.includes(el.uid)) throw new Error("duplicate detected")

            UIDs.push(el.uid);

            counter++;

        })



    }

    console.log(`detected ${counter} unique entiries in db`);


}

/**
 * @param {Buffer} htmlData 
 */
const handleGoogleVirusCheck = (htmlData) => {

    const htmlString = htmlData.toString("utf-8")

    let databaseContentURL = "";

    let startIndex = htmlString.indexOf('https:');

    while (htmlString[startIndex] !== '"') {

        databaseContentURL += htmlString[startIndex]

        startIndex++;
    }

    databaseContentURL = databaseContentURL.replaceAll("&amp", "&");

    databaseContentURL = databaseContentURL.replaceAll(";", "");

    const databaseURL = new URL(databaseContentURL);

    /**@type {import("https").RequestOptions} */
    const requestOptions = {
        path: `${databaseURL.pathname}${databaseURL.search}`,
        servername: databaseURL.hostname,
        hostname: databaseURL.hostname,
        headers: {
            'Host': 'drive.google.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': '0',
            'Origin': 'null',
            'DNT': '1',
            'Sec-GPC': '1',
            'Connection': 'keep-alive',
            'Referer': 'https://drive.google.com/',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mod': 'navigate',
            'Sec-Fetch-Site': 'cross-site',
            'Sec-Fetch-User': '?1',
            'Pragma': 'no-cache',
            'Cache-Control': 'no-cache',
        },
        method: "POST"
    };


    const req = https.request(requestOptions);

    const databaseFileWriteStream = fs.createWriteStream(resourceDatabaseLocation, { flags: "a" });

    req.on("response", res => {

        if (res.statusCode === 429) throw new Error("TOO MANY REQUEST TO GOOGLE SERVER");

        databaseByteSize = Number(res.headers["content-length"])

        res.pipe(databaseFileWriteStream);

        res.on("data", (chunk) => {

            databaseDownloadProgress += chunk.length;

        })

        res.on("end", () => {

            databaseFileWriteStream.end();

            prisma = new PrismaClient();

            resourcesDatabaseExists = true;

        })

    })

    req.end();

}

const fetchDatabase = () => {


    /**@type {https.RequestOptions} */
    const requestOptions = {
        path: `${resourcesDatabaseURL.pathname}${resourcesDatabaseURL.search}`,
        servername: resourcesDatabaseURL.hostname,
        hostname: resourcesDatabaseURL.hostname,
    };

    const fetchReq = https.request(requestOptions);

    fetchReq.on("response", res => {

        let preVirusCheckHTMLData = Buffer.from([]);

        res.on("data", data => {

            preVirusCheckHTMLData = Buffer.concat([preVirusCheckHTMLData, data]);

        })

        res.on("end", () => {



            handleGoogleVirusCheck(preVirusCheckHTMLData);



        })

    })

    fetchReq.end();

}

const initContentServer = async () => {

    return new Promise((resolve) => {

        const server = http.createServer();

        server.on("request", async (req, res) => {

            let contentType;
            let data;
            let status = 200

            const parsedURL = new URL(req.url, `http://localhost/`);

            if (req.url === "/") {

                contentType = "text/html";

                data = fs.readFileSync(path.join(__dirname, "base.html"));

                if (!resourcesDatabaseExists) {



                    fetchDatabase();



                }

            } else if (req.url === "/exam.html") {

                contentType = "text/html";

                const examHtmlData = await prisma.baseContent.findFirst({
                    where: {
                        pathname: "/exam.html"
                    }
                })

                data = examHtmlData.data;

            } else if (parsedURL.pathname === "/generateexam") {

                generateExam();

                moveQuestionsToDoneSection();

                data = Buffer.from(JSON.stringify(exam));

                exam = {
                    normalPart: [],
                    techPart: []
                };

                contentType = "application/json; charset=utf-8";

            } else if (req.url.includes("getdatabaseinfo")) {

                /**@type {{downloading:boolean,maxSize:number | "unknown",downloadedSize:number}}*/
                const resData = {};

                if (!resourcesDatabaseExists) {

                    resData.maxSize = databaseByteSize ? databaseByteSize : "unknown";

                    resData.downloadedSize = databaseDownloadProgress;

                    resData.downloading = true;

                } else {

                    resData.downloading = false;

                }

                data = Buffer.from(JSON.stringify(resData));

                contentType = "application/json; charset=utf-8";

            } else if (req.url.includes("playIcon.png")) {

                contentType = "image/png"

                const playIconData = await prisma.baseContent.findFirst({
                    where: {
                        pathname: "/playIcon.png"
                    }
                })

                data = playIconData.data;

            } else {


                if (req.url.includes("css")) contentType = "text/css";
                else if (req.url.includes("js")) contentType = "application/javascript";
                else if (req.url.includes("jpg")) contentType = "image/jpeg";
                else if (req.url.includes("mp4")) contentType = "video/mp4";
                else contentType = "text/html"


                try {


                    const requestedMedia = await prisma.visualMedia.findFirst({
                        where: {
                            medianame: decodeURIComponent(req.url.substring(1)),
                        }
                    })


                    data = brotliDecompressSync(requestedMedia.data);

                } catch (error) {

                    status = 404;

                }


            }

            if (status === 200) {

                res.statusCode = 200;

                res.setHeader('Content-Type', contentType);

                res.setHeader("content-length", data.length);


            } else {

                res.statusCode = status;

            }

            res.end(data);


        })

        server.listen(() => {

            console.log(`Server is listening on port http://localhost:${server.address().port}`);

            resolve(server.address().port)

        });

    })

}

app.whenReady().then(async () => {
    // Create a BrowserWindow with contextIsolation enabled.

    //dev tools don't work without menu
    Menu.setApplicationMenu(null);

    const serverPort = await initContentServer()

    const bw = new BrowserWindow({
        width: 1200,
        height: 1200,
        webPreferences: {
            contextIsolation: true,
        },
        resizable: false
    })

    app.on('window-all-closed', () => {

        fs.writeFileSync(path.join(__dirname, "PrawoB.json"), JSON.stringify(maindb));

        if (process.platform !== 'darwin') app.quit()
    })


    bw.loadURL(`http://localhost:${serverPort}`)

})
