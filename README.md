<h1 align="center" color="red">Monks Test Case</h1>

## 1. Project Overview

You can access the production app at this link: [Prod App](https://script.google.com/macros/s/AKfycbywJEDDx-0a6kevQ7xt_9VOGYHFXKD8EOFJK0O30iLt6iRIagHJudj06smxyP8waSVD/exec)

This project was developed as part of the .Monks Software Engineer position case test. The challenge was to build a web application using Google Apps Script that allows users to filter a spreadsheet of product data based on selected criteria. The main objective was to automate a time-consuming manual process and improve the company’s analytical workflows.

Technologies used include:
- Google Apps Script (backend)
- HTML & JavaScript (frontend)

The codebase is divided into three files:
- Code.gs: Backend logic written in Google Apps Script. Responsible for fetching and filtering spreadsheet data based on form inputs, and for transforming certain values for UI display.
- Index.html: The frontend of the application. Contains the filter form and the JavaScript code that communicates with the backend.
- Stylesheet.html: Contains CSS rules used to style the UI.

<br>

## 2. How To Set Up Project 
1. Make a Copy of the Original Spreadsheet  
   - Go to the following Google Sheet: [Original Dataset (Google Sheets)](https://docs.google.com/spreadsheets/d/1CfsTZKYr2-cnPqmaLUSzBwIzzOnIw4owgwsPzONYgJ4/edit?usp=sharing)  
   - Use File > Make a copy to duplicate it into your own Google Drive.
   - Make sure that the copied spreadsheet has a tab named exactly "Base products", without the quotes.
  
2. Open the Script Editor  
   - In your copied sheet, go to Extensions > Apps Script.  
   - This opens the script project attached to the spreadsheet.

3. Create and Populate the Script Files  
   - Replace any default content in Code.gs with the content from this repo’s Code.gs.
   - Create two new files and paste corresponding code from this repo:
       - Index.html 
       - Stylesheet.html 

4. Deploy the App  
   - Inside Apps Script, go to Deploy > New deployment.
   - Fill the Description, Web App and Access, then click on Deploy.
   - You can now access the deployed app via the app URL.
  
<br>

## 3. Code Logic

<details>
  <summary><h4>Frontend to Backend and Vice-Versa Communication</h4></summary>
  The UI form lets users optionally filter the spreadsheet data by minimum price (minPrice), maximum price (maxPrice), color, size, and gender. If no filters are applied, the full dataset is returned.<br><br>
  
  Frontend Form (simplified):
  ```html
  <form onsubmit="send(); return false;">
    <input id="minPrice" type="number" />
    // maxPrice, color, size, gender fields follow the same pattern
    <button>Filter</button>
  </form>
  ```
  
  When the form is submitted, it triggers the send() function in JavaScript:
  ```javascript
  function send() {
    const filters = {
      // Prices parsed as float or null if empty
      minPrice: ...,
      maxPrice: ...,
      color: ...,
      size: ...,
      gender: ...
    };

   ...etc

    // Call Apps Script backend with filters
    google.script.run
      .withSuccessHandler(...) // handle result
      .withFailureHandler(...) // handle error
      .filterProducts(filters);
  }
  ```
  
  The backend (Code.gs) receives the filter object, processes the spreadsheet data accordingly, and returns the filtered results to be rendered on the page.
  ```javascript
  function filterProducts(filters) {
    // Read spreadsheet, apply filters, return matching rows
  }
  ```
</details>

<details>
  <summary><h4>Backend Filtering Logic</h4></summary>
  The backend logic lives in the filterProducts(filters) function in Code.gs. It is responsible for:
    
  - Reading all data from the "Base products" spreadsheet.
  - Extracting column indices for fields like PRICE, COLOR, SIZE, etc.
  - Normalizing size values with the help of a helper function (classifySize()). 
  - Filtering rows based on the provided filters from the frontend.
  - Send filtered rows back to frotend, so it can be displayed in the UI.


```javascript
function filterProducts(filters) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Base products');
  // Skip the header row; we only want the data rows
  const rows = sheet.getDataRange().getValues().slice(1); 

  const filtered = rows
    .filter(row => {
      const price = parseFloat(row[...]);
      const color = row[...];
      const gender = row[...];
      const size = classifySize(row[...], gender);

      // Apply filters only if they were provided in the frontend form
      // If the row passes all provided filters, keep it. If not, remove it
      if (filters.minPrice != null && price < filters.minPrice) return false;
      if (filters.maxPrice != null && price > filters.maxPrice) return false;
      if (filters.color && filters.color !== color) return false;
      if (filters.size && filters.size !== size) return false;
      if (filters.gender && filters.gender !== gender) return false;
    })
    .map(row => ({
      id: row[...],
      product: row[...],
      brand: row[...],
      price: row[...],
      availability: row[...],
      color: row[...],
      size: classifySize(row[...], row[...]),
      gender: row[...],
      condition: row[...]
    }));
  // Send the filtered object back to the Frontend
  return filtered;
}
```
</details>

<details>
  <summary><h4>Size Normalization Logic</h4></summary>
  The sizes in the spreadsheet are sometimes stored as numerical values (e.g., 36, 44), while others are string-based (e.g., "P", "G"). We normalize all sizes into string categories ("pp", "p", "m", "g" and "xgg") using the classifySize() function.<br><br>
  
  ```javascript
  function classifySize(rawSize, gender) {
    const num = parseInt(rawSize);
  
    // If num is not a number, the rawSize is returned as is, because it's already a string-based size label ("p", "m", "g", etc)
    if (isNaN(num)) return rawSize;
  
    // Clothes size differ between male and female, so we run an if check for the gender
    if (gender == "female") {
      if (num <= 36) return "pp";
      if (num <= 40) return "p";
      if (num <= 44) return "m";
      if (num <= 48) return "g";
      if (num <= 52) return "gg";
      return "xgg";
    }
  
    if (gender == "male") {
      if (num <= 40) return "pp";
      if (num <= 44) return "p";
      if (num <= 50) return "m";
      if (num <= 54) return "g";
      if (num == 56) return "gg";
      return "xgg";
    }
  
    // There is only one product of gender "unisex" of number 38, equivalent to a "p" size
    if (gender == "unisex" && num == 38) return "p";
    
    return null;
  }
  ```
</details>

<details>
  <summary><h4>Rendering Filtered Results on the Frontend UI</h4></summary>
  After filtering the data on the backend, the frontend receives a list of matching products. These are rendered dynamically into the DOM using JavaScript.

  ```html
  // This is where all output (loading, results, or errors) will be rendered 
  <div id="results"></div>
  ```

  The reference to this element is stored in Javascript:
  ```javascript
  const resultsContainer = document.getElementById("results");
  ```

  This container variable is then used to update the UI with the results in a table format, or error messages, depending on the response:
  ```javascript
  google.script.run
    // If request was successful, we need to:
    .withSuccessHandler(products => {
      // 1 - Check if products are empty
      if (!products || products.length === 0) {
        ...etc
      }
  
      // 2 - If products are not empty, display the data in table tags
      resultsContainer.innerHTML = `
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>Price</th>
              ...etc
            </tr>
          </thead>
          <tbody>
            ${products.map(p => `
              <tr>
                <td>${p.id}</td>
                <td>${p.product}</td>
                <td>R$${p.price}</td>
                ...etc 
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;
      // Handling failure
      .withFailureHandler(() => {
        ...error message
      })
      // Sending filters data to backend
      .filterProducts(filters);
  ```
</details>

<h3>Summary</h3>

- The user fills out the HTML form with filter criteria (e.g., price range, color, size, gender).

- These inputs are sent to the backend via google.script.run, calling the filterProducts() function.
  
- The backend reads the spreadsheet, applies the filter logic, and returns the matching rows.
  
- The frontend receives the filtered data and dynamically renders it as an HTML table in the UI.

<br>

## 4. Maintenance Considerations

<details>
  <summary><h4>New Columns</h4></summary>
  Column positions in the spreadsheet are mapped using their header names rather than fixed indexes.

  ```javascript
    const priceIndex = headers.indexOf("PRICE");
  ```

  Instead of:
  ```javascript
     const price = row[8];
  ```

  This approach ensures that the correct data is always retrieved, even if the position of the columns gets shuffled in the future. If new columns are added, they can be easily integrated into the filtering logic by simply referencing their names.
</details>

<details>
  <summary><h4>Questionable Data (Size 1–7)</h4></summary>
  There are a few rows in the spreadsheet with clothing sizes ranging from 1 to 7, which are children’s clothing. However, these rows are currently labeled as adult products (AGE_GROUP = adults).
  
  These rows might be faulty data that were meant to be cleaned out, but since it was not clear, they are being classified as size "PP" for now.

  ```javascript
    if (gender == "female") {
      if (num <= 36) return "pp";
    }

    if (gender == "male") {
      if (num <= 40) return "pp";
    }
  ```
</details>

<details>
  <summary><h4>Displayed Fields in the UI</h4></summary>
  In the HTML interface, only a subset of product data was chosen to give a meaningful and compact overview of each product to the user:
  
  <br>
  [ ID, Product, Brand, Price, Color, Size, Gender, Condition, Availability ]
  <br><br>
  
  Additional fields can be added or removed from the UI table with by updating the map() logic in the JavaScript rendering function. 
  
  For example, if the client only wants the Product name, Price and Color:

  ```javascript
  <tbody>
    ${products.map(prod => `
      <tr>
        <td>${prod.product}</td>
        <td>R$${prod.price}</td>
        <td>${prod.color}</td>      
      </tr>
    `).join("")}
  </tbody>
  ```
  
