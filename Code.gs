// this will apply the filters sent by the frontend and return the filtered object back to the frontend
function filterProducts(filters){
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Base products');
  const allData = sheet.getDataRange().getValues();

  const headers = allData[0];
  const rows = allData.slice(1);

  const idIndex = headers.indexOf("ID");
  const productIndex = headers.indexOf("TITLE");
  const brandIndex = headers.indexOf("BRAND");
  const priceIndex = headers.indexOf("PRICE");
  const availabilityIndex = headers.indexOf("AVAILABILITY");
  const colorIndex = headers.indexOf("COLOR");
  const sizeIndex = headers.indexOf("SIZE");
  const genderIndex = headers.indexOf("GENDER");
  const conditionIndex = headers.indexOf("CONDITION");

  const filtered = rows
    .filter(row => {
      const price = parseFloat(row[priceIndex]);
      const color = row[colorIndex]?.toLowerCase().trim();
      const gender = row[genderIndex]?.toLowerCase().trim();
      const bruteSize = row[sizeIndex];
      const size = classifySize(bruteSize, gender);

      if (filters.minPrice != null && price < filters.minPrice) return false;
      if (filters.maxPrice != null && price > filters.maxPrice) return false;
      if (filters.color && filters.color !== color) return false;
      if (filters.size && filters.size !== size) return false;
      if (filters.gender && filters.gender !== gender) return false;

      return true;
    })
    .map(row => {
      const gender = row[genderIndex]?.toLowerCase().trim();
      const bruteSize = row[sizeIndex];
      const size = classifySize(bruteSize, gender);

      return {
        id: row[idIndex],
        product: row[productIndex],
        brand: row[brandIndex],
        price: row[priceIndex],
        availability: row[availabilityIndex],
        color: row[colorIndex],
        size: size,
        gender: row[genderIndex],
        condition: row[conditionIndex]
      };
    });
  return filtered;
}

// we need to check if sizes are numerical, then convert into string-based sizes
function classifySize(rawSize, gender) {
  const raw = rawSize?.toString().toLowerCase().trim();
  const num = parseInt(raw);

  if (isNaN(num)) {
    return raw;
  } else {
    if (gender == "female") {
      if (num <= 36) return "pp";
      if (num >= 38 && num <= 40) return "p";
      if (num >= 42 && num <= 44) return "m";
      if (num >= 46 && num <= 48) return "g";
      if (num >= 50 && num <= 52) return "gg";
      if (num > 52) return "xgg";
    }
    if (gender == "male") {
      if (num <= 40) return "pp";
      if (num >= 42 && num <= 44) return "p";
      if (num >= 46 && num <= 50) return "m";
      if (num >= 52 && num <= 54) return "g";
      if (num == 56) return "gg";
      if (num > 56) return "xgg";
    }
    // só tem um row do gender "unisex", com size 38, equivalente a um tamanho "p"
    if (gender == "unisex") {
      if (num == 38) return "p";
    }
  }
  return null;
}

// Utility functions
// creates the onOpen meny on the spreadsheet page, use only for dev
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("Products Filter")
    .addItem("Open Form", "openForm")
    .addToUi();
}
// this is also only for dev
function openForm() {
  const html = HtmlService.createTemplateFromFile("Index")
    .evaluate()
    .setTitle("Monks.")
    .setWidth(850)
    .setHeight(850);
  
  SpreadsheetApp.getUi().showModalDialog(html, "Products Filter");
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// this is to serve the prod app to client
function doGet() {
  const template = HtmlService.createTemplateFromFile('Index');
  return template.evaluate();
}