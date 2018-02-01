'use strict';

const url = 'http://localhost:8080';
const button = document.querySelector('#total');
let message = document.querySelector('section.message');
let table = document.querySelector('table');

function connect(method, url, callback) {
  let xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === xhr.DONE && xhr.status === 200) {
      callback(JSON.parse(xhr.responseText));
    }
  };
  xhr.send();
};

function createTable(result) {
  table.innerHTML = "";
  table.innerHTML =
    `<tr>
      <th>Item</th>
      <th>Manufacturer</th>
      <th>Category</th>
      <th>Size</th>
      <th>Unit price</th>
    </tr>`;
  result.clothes.forEach(function (item) {
    table.innerHTML +=
      `<tr>
        <td>${item.item_name}</td>
        <td>${item.manufacturer}</td>
        <td>${item.category}</td>
        <td>${item.size}</td>
        <td>${item.unit_price}</td>
      </tr>`;
  })
};

function createReport(res) {
  if (res.result !== "ok") {
    message.innerHTML = "";
    message.innerHTML += `<p>${res.result}</p>`;
    message.setAttribute('class', 'red');
    table.innerHTML = "";
  } else {
    message.innerHTML = "";
    message.innerHTML += `<p>Spended ${res.total_price}. Thank you for shopping!</p>`;
    message.setAttribute('class', 'green');
    table.innerHTML = "";
  };
};

button.addEventListener('click', function () {
  let selectedItem = document.querySelector('#item');
  let selectedSize = document.querySelector('#size');
  let selectedQuantity = document.querySelector('#quantity')
  let query = `/price-check?item=${selectedItem.value}&size=${selectedSize.value}&quantity=${selectedQuantity.value}`;
  connect('GET', url + query, createReport);
  connect('GET', url + "/warehouse", createTable);
});

connect('GET', url + "/warehouse", createTable)
