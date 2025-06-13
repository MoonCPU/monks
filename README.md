<h1 align="center" color="red">Monks Test Case</h1>

## 1. Project Overview
This project was developed as part of the .Monks Software Engineer position case test. The challenge was to build a web application using Google Apps Script that allows users to filter a spreadsheet of product data based on selected criteria. The main objective was to automate a time-consuming manual process and improve the company’s analytical workflows.

Technologies used include:
- Google Apps Script (backend)
- HTML & JavaScript (frontend)


## 2. Code Structure
The codebase is divided into three files:
- Code.gs: Backend logic written in Google Apps Script. Responsible for fetching and filtering spreadsheet data based on form inputs, and for transforming certain values for UI display.
- Index.html: The frontend of the application. Contains the filter form and the JavaScript code that communicates with the backend.
- Stylesheet.html: Contains CSS rules used to style the UI.


## 3. Code Logic

<details>
  <summary><h3>Frontend to Backend and Vice-Versa Communication (click to expand)</h3></summary>
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
  
    // Show loading feedback
    document.getElementById("results").innerHTML = "...";
  
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
