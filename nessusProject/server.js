const csv = require("csv-parser");
const fs = require("fs");

const results = [];
const result = [];
fs.createReadStream("data.csv")
  .pipe(csv())
  .on("data", (data) => {
    if (data.Risk !== "None") {
      results.push(data);
    }
  })
  .on("end", () => {
    results.reduce((acc, curr) => {
      const genreExists = acc.find((book) => book.Name === curr.Name);
      if (!genreExists) {
        result.push(curr);
      }
      return acc;
    }, []);

    console.log(result);
    // Do something with the results
  });

//   <table>
//   <tr>
//     <th>ID</th>
//     <th>Name</th>
//   </tr>
//   <% data.map(function(item) { %>
//     <tr>
//       <td><%= item.id %></td>
//       <td><%= item.name %></td>
//     </tr>
//   <% }); %>
// </table>

// <form method="POST" action="/next-page">
//   <select name="id">
//     <% data.map(function(item) { %>
//       <option value="<%= item.id %>"><%= item.name %></option>
//     <% }); %>
//   </select>
//   <button type="submit">Submit</button>
// </form>

// app.post('/next-page', function(req, res) {
//   const id = parseInt(req.body.id);
//   const selectedData = data.find(function(item) {
//     return item.id === id;
//   });
//   res.render('next-page', { selectedData: selectedData });
// });
// In your next-page.ejs file, access the selected data object and display it:
// less
// Copy code
// <h1>Selected Data</h1>
// <p>ID: <%= selectedData.id %></p>
// <p>Name: <%= selectedData.name %></p>
// <p>Age: <%= selectedData.age %></p>
