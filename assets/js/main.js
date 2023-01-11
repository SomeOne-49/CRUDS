/*----------------------------------------------------*\
    *** Open & Close The Boxes ***
\*----------------------------------------------------*/

//ToDo ==> Open & Close Boxs On Click On The Commend Buttons :
const btns = document.querySelectorAll(".btns__box button");
const boxes = document.querySelectorAll(".boxes > div");
const boxesParent = document.querySelector(".boxes");
btns.forEach((el) => {
  el.addEventListener("click", () => {
    boxes.forEach((ele) => {
      if (ele.id === el.getAttribute("data-box")) {
        ele.classList.toggle("open");
      } else ele.classList.remove("open");
    });
    //! Set Addition Box Texts :
    if (el.classList.contains("add__btn")) {
      state = "addition";
      setTxt();
    }
  });
});

//ToDo ==> Close Boxes On Click Outside It :
document.addEventListener("click", (e) => {
  boxes.forEach((el) => {
    el.addEventListener("click", (e) => e.stopPropagation());
  });
  btns.forEach((el) => {
    let box = document.getElementById(el.getAttribute("data-box"));
    if (
      e.target !== el &&
      e.target !== box &&
      box.classList.contains("open") &&
      !e.target.classList.contains("fa-pen-to-square")
    ) {
      box.classList.remove("open");
    }
  });
});

//ToDo ==> Close Boxs On Click Close Button :
const cansel = document.querySelectorAll(".cansel"),
  alertResult = document.getElementById("alert__search");
cansel.forEach((el) => {
  el.addEventListener("click", () => {
    document
      .getElementById(el.getAttribute("data-box"))
      .classList.remove("open");
    clearInputs(
      document.querySelectorAll("#" + el.getAttribute("data-box") + " input")
    );

    if (el.getAttribute("data-box") === "calc__box")
      document.querySelector(".total span:last-child").innerHTML = "0";
    if (
      el.getAttribute("data-box") === "search__box" &&
      allProducts.length > 0
    ) {
      createRow(allProducts);
      addRemoveClass(table, "show", alertResult, "no__result");
    }
  });
});

/*----------------------------------------------------*\
    *** Create & Edit The Element ***
\*----------------------------------------------------*/
//ToDo ==> Add Product To Table :
const boxTitle = document.querySelector("#add__box h2"),
  addInputs = document.querySelectorAll(
    "#add__box input:not([type='checkbox']"
  ),
  requiredInputs = document.querySelectorAll("#add__box .required input"),
  addCheck = document.querySelector("#add__box input[type='checkbox']"),
  addBtn = document.querySelector("#add__box .addition"),
  alertProduct = document.getElementById("alert__products"),
  table = document.querySelector(".table"),
  tBody = document.querySelector(".table .tbody");
let state = "addition",
  allProducts = [],
  thereIsEmpty,
  index;

//! Check If There Are Products In The LocalStorage :
if (localStorage.products) {
  allProducts = JSON.parse(localStorage.products);
  createRow(allProducts);
}

addBtn.addEventListener("click", (e) => {
  checkEmpty();
  if (!thereIsEmpty) return;
  getValues(addInputs, index);
  createRow(allProducts);
  clearInputs(addInputs);
  closeParent(`#${e.target.getAttribute("data-box")}`, "open");
});

/*----------------------------------------------------*\
    *** Helpers Button ***
\*----------------------------------------------------*/

//ToDo ==> Set calculator :
const calcInputs = document.querySelectorAll("#calc__box input"),
  calcCheck = document.querySelector("#calc__box input[type=checkbox]"),
  calcTotal = document.querySelector("#calc__box .total span:last-child");
let calcPrice, calcCount, calcTaxes, calcAds, calcDis, total;
calcInputs.forEach((el) => {
  switch (el.placeholder.toLowerCase()) {
    case "price":
      calcPrice = el;
      break;
    case "count":
      calcCount = el;
      break;
    case "taxes":
      calcTaxes = el;
      break;
    case "ads":
      calcAds = el;
      break;
    case "discount":
      calcDis = el;
      break;
  }

  el.addEventListener("input", () => {
    total =
      (+calcPrice.value + +calcAds.value) *
      (+calcCount.value > 0 ? +calcCount.value : 1);
    let taxes = total * (+calcTaxes.value / 100);
    let finalTotal = total + taxes;
    let dis = calcCheck.checked
      ? finalTotal - (+calcDis.value * finalTotal) / 100
      : finalTotal - +calcDis.value;
    calcTotal.innerHTML = dis > 0 ? dis.toFixed(2) : "Free";
  });
});

//ToDo ==> Search In Table :
const searchInputs = document.querySelectorAll("#search__box input"),
  searchInp = document.querySelector("#search__box input[type='search']"),
  searchBy = document.getElementById("by__title");
searchInputs.forEach((el) => {
  el.addEventListener("input", () => {
    let searchReasult = [];
    let searchType = searchBy.checked ? "title" : "category";

    if (allProducts.length > 0) {
      if (searchInp.value === "") {
        createRow(allProducts);
        addRemoveClass(table, "show", alertResult, "no__result");
        return;
      }

      tBody.innerHTML = "";

      for (let i = 0; i < allProducts.length; i++) {
        if (
          allProducts[i][searchType]
            .toLowerCase()
            .includes(searchInp.value.toLowerCase().trim())
        )
          searchReasult.push(allProducts[i]);
      }
      if (searchReasult.length > 0) {
        createRow(searchReasult);
        addRemoveClass(table, "show", alertResult, "no__result");
      } else addRemoveClass(alertResult, "no__result", table, "show");
    }
  });
});

//ToDo ==> Remove All Products :
const removeAll = document.querySelector(".remove__all");
removeAll.addEventListener("click", (e) => {
  allProducts = [];
  localStorage.removeItem("products");
  createRow(allProducts);
  addRemoveClass(alertProduct, "no__product", table, "show");
  addRemoveClass(alertProduct, "no__product", alertResult, "no__result");
  closeParent(`#${e.target.getAttribute("data-box")}`, "open");
});

/*----------------------------------------------------*\
    *** All Functions ***
\*----------------------------------------------------*/

//* Close Parent Box :
function closeParent(box, className) {
  document.querySelector(box).classList.remove(className);
}

//* Add & Delete Element Class :
function addRemoveClass(el1, addClass, el2, removeClass) {
  el1.classList.add(addClass);
  el2.classList.remove(removeClass);
}

//* Set Addition Box Texts :
const setTxt = () => {
  if (state === "addition") {
    boxTitle.innerHTML = "Add Item";
    addBtn.innerHTML = "Add";
  } else if (state === "edit") {
    boxTitle.innerHTML = "Edit Item";
    addBtn.innerHTML = "Edit";
  }
};

//* Clear Inputs :
function clearInputs(inputs) {
  inputs.forEach((el) => {
    el.value = "";
  });
}

//* Check Empty Inputs :
const checkEmpty = () => {
  requiredInputs.forEach((inp) => {
    if (inp.value === "") inp.parentElement.classList.add("empty");
    else inp.parentElement.classList.remove("empty");
  });
  thereIsEmpty = Array.from(requiredInputs).every((inp) => inp.value !== "");
};

//* Store Inputs Values In Object :
function getValues(inputs, index) {
  let obj = {};
  inputs.forEach((el) => {
    let input = el.placeholder.toLowerCase();
    if (el.value !== "") {
      percentage = addCheck.checked ? `%${el.value}` : `$${el.value}`;
      switch (input) {
        case "title":
          obj[input] = el.value;
          break;
        case "category":
          obj[input] = el.value;
          break;
        case "price":
          obj[input] = `$${el.value}`;
          break;
        case "count":
          obj[input] = el.value;
          break;
        case "taxes":
          obj[input] = `%${el.value}`;
          break;
        case "ads":
          obj[input] = `$${el.value}`;
          break;
        case "discount":
          obj[input] = percentage;
          break;
      }
    } else {
      obj[input] = "";
      if (input === "count") obj[input] = 1;
    }
  });
  if (state === "addition") allProducts.push(obj);
  else allProducts[index] = obj;
  localStorage.products = JSON.stringify(allProducts);
}

//* Create Table Row :
function createRow(array) {
  tBody.innerHTML = "";
  if (allProducts.length > 0)
    addRemoveClass(table, "show", alertProduct, "no__product");
  array.forEach((obj) => {
    let index = tBody.children.length + 1,
      row = document.createElement("div"),
      items = document.createElement("div"),
      id = document.createElement("p");
    row.id = index;
    row.className = "tr";
    items.className = "items";
    id.className = "id";
    id.textContent = index < 10 ? "0" + index : index;
    items.append(id);
    Object.keys(obj).forEach((key) => {
      let item = document.createElement("p");
      item.className = key;
      item.setAttribute("data-input", key);
      item.textContent = obj[key];
      items.append(item);
    });
    row.append(items);
    tBody.append(row);
    creatIcons(row, index);
  });
  const dots = document.querySelectorAll(".dots");
  const icons = document.querySelectorAll(".icons");
  const trash = document.querySelectorAll(".fa-trash-can");
  const edit = document.querySelectorAll(".fa-pen-to-square");
  showIcons(dots, icons);
  deleteProduct(trash);
  editProduct(edit);
}

//* Create Icons :
function creatIcons(parent, index) {
  let box = document.createElement("div");
  box.className = "icon__box";
  let dots = document.createElement("i");
  dots.classList.add("fa-solid", "fa-ellipsis", "dots");
  dots.setAttribute("data-box", index);
  let iconBox = document.createElement("div");
  iconBox.className = "icons";
  iconBox.setAttribute("data-parent", index);
  ["fa-trash-can", "fa-pen-to-square"].forEach((item) => {
    let icon = document.createElement("i");
    icon.classList.add("fa-solid", item);
    icon.setAttribute("data-parent", index);
    iconBox.append(icon);
  });
  box.append(dots, iconBox);
  parent.append(box);
}

//* Show Icon Box :
function showIcons(dots, icons) {
  dots.forEach((el) => {
    el.onclick = () => {
      icons.forEach((icon) => {
        if (el.getAttribute("data-box") === icon.getAttribute("data-parent")) {
          icon.classList.toggle("open");
        } else icon.classList.remove("open");
      });
    };
  });
}

//* Edit Product Data :
function editProduct(icons) {
  icons.forEach((icon) => {
    icon.addEventListener("click", () => {
      state = "edit";
      setTxt();
      document.getElementById("add__box").classList.add("open");
      Array.from(
        document.getElementById(icon.getAttribute("data-parent")).children[0]
          .children
      ).forEach((item) => {
        let data = item.textContent
          .split("")
          .filter((e) => !isNaN(e))
          .join("");
        addInputs.forEach((inp) => {
          if (
            item.getAttribute("data-input") === inp.placeholder.toLowerCase()
          ) {
            if (inp.type === "text") inp.value = item.textContent;
            else {
              console.log(item, data);
              inp.value = data;
            }
          }
        });
      });
      index = icon.getAttribute("data-parent") - 1;
    });
  });
}

//* Delete product Row From Table :
function deleteProduct(trash) {
  trash.forEach((e) => {
    e.addEventListener("click", () => {
      allProducts.splice(e.getAttribute("data-parent") - 1, 1);
      localStorage.setItem("products", JSON.stringify(allProducts));
      if (allProducts.length > 0) createRow(allProducts);
      else addRemoveClass(alertProduct, "no__product", table, "show");
    });
  });
}
