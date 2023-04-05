const express = require("express");
const fs = require("fs");
const multer = require("multer");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
// const csv = require("csvtojson");
const csv = require("csv-parser");
const NessusModel = require("./models/DataModel");

const app = express();
const PORT = 8000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./views/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
var uploads = multer({ storage: storage });

const uri =
  "mongodb+srv://krishna:krishna@cluster0.kewtg4v.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(uri)
  .then(() => console.log("Connected"))
  .catch((err) => console.log(err));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, "views")));

app.get("/", async (req, res) => {
  res.render("pages/upload");
  // console.log(data);
  // NessusModel.find({}).then((data) => {
  // res.render("pages/upload", { data: nussusArray });
  // });
});

var empResponse;
const results = [];
const result = [];
let nussusArray = [];
app.post("/", uploads.single("csvFile"), (req, res) => {
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => {
      if (data.Risk !== "None") {
        results.push(data);
      }
    })

    .on("end", () => {
      // results.forEach((element) => {
      //   if (!result.includes(element)) {
      //     result.push(element);
      //   }
      // });
      // results.reduce((acc, curr) => {
      //   const genreExists = acc.find((book) => book.Name === curr.Name);
      //   if (!genreExists) {
      //     result.push(curr);
      //   }
      //   return acc;
      // }, []);
      // const unique = [...new Set(results.map((item) => item.Name))];
      // console.log(unique);

      //   let uniqueObjArray = [
      //     ...new Map(results.map((item) => [item["Name"], item])).values(),
      //   ];
      //   // //  result.push(uniqueObjArray);
      //   res.render("pages/getData", { data: uniqueObjArray });
      // });

      // console.log(uniqueObjArray);
      // Do something with the results
      // const filteredData = results.filter(function (item, index, arr) {
      //   return (
      //     arr
      //       .map(function (innerItem) {
      //         return innerItem.Name;
      //       })
      //       .indexOf(item.Name) === index &&
      //     arr.filter(function (innerItem) {
      //       return innerItem.Name === item.Name && innerItem.Host !== item.Host;
      //       //  {
      //       //   console.log(innerItem.Name.length);
      //       // }
      //     }).length > 0
      //   );
      // });
      // // console.log(filteredData);
      // res.render("pages/getData", { data: filteredData });

      // const result = new Map();

      // for (let i = 0; i < results.length; i++) {
      //   const obj = results[i];
      //   if (result.has(obj.Name)) {
      //     result.get(obj.Name).push(obj.Host);
      //   } else {
      //     result.set(obj.Name, [obj.Host]);
      //     //  nussusArray.push({ name: obj.Name, host: obj.Host });
      //   }
      // }

      // for (let [Name, Host] of result.entries()) {
      //   // console.log(Name);

      //   for (let ip of Host) {
      //     // console.log(ip);
      //     // console.log(Name);
      //   }
      // }
      // console.log(result);
      // nussusArray.push(result);
      //  console.log(nussusArray);
      // res.render("pages/getData", { data: result });

      const groupedData = results.reduce((accumulator, currentValue) => {
        if (!accumulator[currentValue.Name]) {
          accumulator[currentValue.Name] = {
            Name: currentValue.Name,
            Host: [currentValue.Host],
            Risk: currentValue.Risk,
            Synopsis: currentValue.Synopsis,
            Description: currentValue.Description,
            Solution: currentValue.Solution,
          };
        } else {
          accumulator[currentValue.Name].Host.push(currentValue.Host);
        }
        return accumulator;
      }, {});

      const result = Object.values(groupedData).map((group) => ({
        name: group.Name,
        host: group.Host,
        risk: group.Risk,
        synopsis: group.Synopsis,
        description: group.Description,
        solution: group.Solution,
      }));

      const result1 = [];

      // const uniqueNames1 = result.map((obj) => obj.host);

      // uniqueNames1.forEach((name) => {
      //   // const uniqueIps = [
      //   //   ...new Set(
      //   console.log(name);
      //   const uniqueIps = result
      //     .filter((obj) => obj.name === name)
      //     .map((obj) => obj.host);
      //   //   ),
      //   // ];

      //   result1.push({ name, ip: uniqueIps });
      // });

      //  console.log(result1);

      const uniqueObjects = [
        ...new Map(result.map((obj) => [obj.name, obj])).values(),
      ].map((obj) => ({ ...obj, host: [...new Set(obj.host)] }));

      // console.log(uniqueObjects);

      // const uniqueObjArray = result.reduce((acc, obj) => {
      //   // Find the index of the first object in acc with the same non-duplicated value
      //   const index = acc.findIndex((item) => item.name === obj.name);

      //   // If no such object exists, add the current object to the accumulator array
      //   if (index === -1) {
      //     // Filter out duplicates in the hobbies array
      //     const filteredHobbies = [...new Set(obj.host)];
      //     // Return a new object with the filtered array of hobbies
      //     return [...acc, { name: obj.name, host: filteredHobbies }];
      //   }

      //   // Otherwise, return the accumulator array without the object at that index,
      //   // and add the current object to the array at that index
      //   return [
      //     ...acc.slice(0, index),
      //     { name: obj.name, host: [...new Set(obj.host)] },
      //     ...acc.slice(index + 1),
      //   ];
      // }, []);
      // console.log(uniqueObjArray);
      res.render("pages/getData", { data: uniqueObjects });
    });

  // csv()
  //   .fromFile(req.file.path)
  //   .then((response) => {
  //     for (var x = 0; x < response; x++) {
  //       empResponse = parseFloat(response[x].CVE);
  //       response[x].CVE = empResponse;
  //       empResponse = parseFloat(response[x].Risk);
  //       response[x].Risk = empResponse;
  //       empResponse = parseFloat(response[x].Host);
  //       response[x].Host = empResponse;
  //       empResponse = parseFloat(response[x].Port);
  //       response[x].Port = empResponse;
  //       empResponse = parseFloat(response[x].Name);
  //       response[x].Name = empResponse;
  //       empResponse = parseFloat(response[x].Synopsis);
  //       response[x].Synopsis = empResponse;
  //       // nussusArray.push({
  //       //   CVE: response[x].CVE,
  //       //   Risk: response[x].Risk,
  //       //   Host: response[x].Host,
  //       //   Port: response[x].Port,
  //       //   Name: response[x].Name,
  //       //   Synopsis: response[x].Synopsis,
  //       // });
  //     }
  //     nussusArray.push(response);
  //     // console.log(aa);
  //     // res.redirect("/");

  //     const aa = JSON.stringify(response);
  //     // console.log(aa);

  //     // for (var x = 0; x < response; x++) {
  //     //   const sec = new NessusModel({
  //     //     nessus: [
  //     //       {
  //     //         CVE: response[x].CVE,
  //     //       },
  //     //     ],
  //     //   });
  //     //   sec.save();
  //     // }
  //     const sec = new NessusModel({
  //       nessus: aa,
  //     });
  //     sec.save();
  // NessusModel.insertMany(nussusArray).then((data) => {
  //   console.log(data);
  // // const order = new NessusModel(nussusArray);

  // // const createdOrder = order.save();
  // // console.log(createdOrder);
  // });
  // for (let i = 0; i < nussusArray.length; i++) {
  //   nessusSchema.insertOne(nussusArray[i], function (err, result) {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       console.log("Object saved to MongoDB!");
  //     }
  //   });
  // }

  // fs.writeFile("message.csv", aa, (err) => {
  //   if (err) throw err;
  //   console.log("The file has been saved!");
  //   // res.render("pages/getData", { data: aa });
  // });

  // nessusSchema.insertMany(response).then((data) => {
  //   console.log(data);
  // });

  // nussusArray.push(response, (err, data) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     res.redirect("/upload");
  //     //  console.log(data);
  //   }
  // });
  // });
});

app.get("/upload", async (req, res) => {
  fs.readFile("message.csv", (err, data) => {
    if (err) throw err;
    // console.log(data);
  });
  // res.render("pages/getData", { data: nussusArray });
  // await nessusSchema.find((err, data) => {
  //   if (err) {
  //   } else {
  //     if (data != "") {
  //       res.render("pages/upload", { data: nussusArray });
  //     } else {
  //       res.render("pages/upload", { data: "" });
  //     }
  //   }
  // });
});
app.listen(PORT, () => console.log("App connected on: " + PORT));
