import { addingProductsTemplate, productsSorting } from "../js/func/shared.js"
import { products } from "../js/db/data.js"
import { paginationCalculations, saveToLocalStorage, getFromLocalStorage } from "./func/utils.js"

let $ = document

const hamburger = $.querySelector(".hamburger")
const contenerMenuMobail = $.querySelector(".contener-menu-mobail ")
hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active")
    contenerMenuMobail.classList.toggle("contener-menu-mobail--active")
})

let menuLink = $.querySelectorAll(".list-menu-item__link")
menuLink.forEach(function (menuLink) {
    menuLink.addEventListener("click", function () {
        $.querySelector(".list-menu-item__link--active").classList.remove("list-menu-item__link--active")
        menuLink.classList.add("list-menu-item__link--active")
    })
})


//** */ boxFilter
let shopFilterbox = $.querySelector(".shop-filter")
let boxFilterSelect = $.querySelector(".box-filter__select")
let iconFilter = $.querySelector(".shop-filter__svg-icon--filter")

iconFilter.addEventListener("click", function (event) {
    event.preventDefault()
    shopFilterbox.classList.toggle("shop-filter--active")
    boxFilterSelect.classList.toggle("box-filter__select--active")
})



let productsWrapper = $.querySelector(".row-container")
let containerPagination = $.querySelector(".shop-products__number-pagination")
let numberShowProduct = $.querySelector(".shop-filter__input--number")
let numberRowUser;
let btnFilter = $.querySelectorAll(".box-filter__btn")
let boxBtnFilter = $.querySelectorAll(".box-filter__btn-box")
let numberRow = 8
// numberProductsShown
let currentPage = 1
let resultShowProducts = document.querySelector(".shop-filter__result-text")

let productsBasedPagination = paginationCalculations(numberRow, currentPage, resultShowProducts)


const productsStructure = 'row'


let productsFilter = []


//**optionSelect */

let optionSelect = $.querySelector(".box-filter__select")


optionSelect.addEventListener('change', function (event) {
    let optionActive = event.target.value

    let productsFilter = productsSorting(products, optionActive)
    addingProductsTemplate(productsFilter, productsStructure, productsWrapper)
    saveToLocalStorage("optionActiveSelectBox", optionActive)
})




//**FilterArray */
// function productsFilterSetting(target) {
//     console.log(target);
//     switch (target) {
//         case 'new':
//             let filterProductsNew = products.filter(function (product) {
//                 return product.newProduct === true
//             })
//             console.log(filterProductsNew);
//             currentPage = 1
//      c
//             setpagination(filterProductsNew)
//             setinputNumberRow(filterProductsNew);
//             // gridSystm1col(filterProductsNew)
//             setBtnNextPrev(filterProductsNew)
//             saveToLocalStorage("FilteredProducts", filterProductsNew)
//             saveToLocalStorage("currentPage", currentPage)
//             productsFilter.push(filterProductsNew)
//             break;
//         case 'discount':
//             let filterProductsDiscunt = products.filter(function (product) {
//                 return product.discount === true
//             })
//             currentPage = 1
//             addingProductsTemplate(filterProductsDiscunt, productsStructure, productsWrapper)
//             setpagination(filterProductsDiscunt)
//             setinputNumberRow(filterProductsDiscunt);
//             // gridSystm1col(filterProductsDiscunt)
//             setBtnNextPrev(filterProductsDiscunt)
//             saveToLocalStorage("FilteredProducts", filterProductsDiscunt)
//             saveToLocalStorage("currentPage", currentPage)
//             productsFilter.push(filterProductsDiscunt)
//             break
//         case 'All':
//             currentPage = 1
//             addingProductsTemplate(products, productsStructure, productsWrapper)
//             setpagination(products)
//             setinputNumberRow(products)
//             // gridSystm1col(products)
//             setBtnNextPrev(products)
//             saveToLocalStorage("FilteredProducts", products)
//             saveToLocalStorage("currentPage", currentPage)
//             productsFilter.push(products)
//             break
//         default:
//             let filterProducts = products.filter(function (product) {
//                 return product.type === target
//             })
//             currentPage = 1
//             addingProductsTemplate(filterProducts, productsStructure, productsWrapper)
//             setpagination(filterProducts)
//             setinputNumberRow(filterProducts)
//             setBtnNextPrev(filterProducts)

//             saveToLocalStorage("FilteredProducts", filterProducts)
//             saveToLocalStorage("currentPage", currentPage)
//             productsFilter.push(filterProducts)
//             break;
//     }
// }


//**setinputNumberRow
function setinputNumberRow(products) {
    numberShowProduct.addEventListener("keydown", function (event) {
        if (event.keyCode === 13) {
            let numberRowUser = +event.target.value
            saveToLocalStorage("showCountProducts", numberRowUser)
            console.log(numberRow);
            if (numberRowUser > 0 && numberRowUser < 49) {
                numberRow = numberRowUser
                currentPage = 1
                addingProductsTemplate(products, productsStructure, productsWrapper)
                setpagination(products)
                // gridSystm1col(products)
                setBtnNextPrev(products)
                saveToLocalStorage("FilteredProducts", products)
                saveToLocalStorage("currentPage", currentPage)
            } else {
                alert("please select a number and above zero")
            }


        }

    })
}

//**setpagination
function setpagination(products) {
    containerPagination.innerHTML = ""
    let numberpagination = Math.ceil(products.length / numberRow)
    for (let i = 1; i < numberpagination + 1; i++) {
        setBtnDom(i, products)
    }
}
//**setBtnDom
function setBtnDom(i, products) {
    console.log(currentPage);
    let divelmnt = $.createElement("div")
    divelmnt.className = "shop-products__pagination-box-btn"

    let btnElm = $.createElement("button")
    btnElm.className = "shop-product-button"

    btnElm.innerHTML = i

    divelmnt.append(btnElm)

    if (i === currentPage) {
        divelmnt.classList.add("shop-products__pagination-box--active")
        btnElm.classList.add("shop-product-button--active")
    }


    btnElm.addEventListener("click", function () {
        currentPage = i
        // addingProductsTemplate(products, productsStructure, productsWrapper)

        let btnActive = $.querySelector(".shop-product-button.shop-product-button--active")
        let btnDivActive = $.querySelector(".shop-products__pagination-box-btn.shop-products__pagination-box--active")
        btnActive.classList.remove("shop-product-button--active")
        btnDivActive.classList.remove("shop-products__pagination-box--active")
        divelmnt.classList.add("shop-products__pagination-box--active")
        btnElm.classList.add("shop-product-button--active")
        let divBtnPrev = $.querySelector(".shop-products__prev-btn-box")
        let nextDivElem = $.querySelector(".shop-products__next-btn-box")
        let numberpagination = Math.ceil(products.length / numberRow)
        if (currentPage === numberpagination) {
            nextDivElem.style.display = "none"
        }
        if (currentPage > 1) {
            divBtnPrev.style.display = "flex"
        }
        if (currentPage === 1) {
            divBtnPrev.style.display = "none"
        }
        if (currentPage < numberpagination) {
            nextDivElem.style.display = "flex"
        }
        if (numberpagination === 1) {
            nextDivElem.style.display = "none"
            divBtnPrev.style.display = "none"
        }
        saveToLocalStorage("currentPage", currentPage)
    })
    containerPagination.append(divelmnt)
}

//** SetBtnNextPrev*/
let nextContainer = $.querySelector(".shop-products__Next")
let prevContainer = $.querySelector(".shop-products__prev")
function setBtnNextPrev(products) {
    nextContainer.innerHTML = ""
    prevContainer.innerHTML = ""
    for (let i = 1; i < 2; i++) {
        setBtnNextPrevDom(products)
    }
}
function setBtnNextPrevDom(productArrayFilter) {
    prevContainer.insertAdjacentHTML("afterbegin", '<div class="shop-products__prev-btn-box">     <button class="shop-products__button-prev-text">Prev</button></div > ')
    nextContainer.insertAdjacentHTML("beforeend", ' <div class="shop-products__next-btn-box"> <button class="shop-products__button-next-text">Next</button></div > ')
    let nextDivElem = $.querySelector(".shop-products__next-btn-box")
    let divBtnPrev = $.querySelector(".shop-products__prev-btn-box")
    let numberpagination = Math.ceil(productArrayFilter.length / numberRow)
    if (numberpagination === 1) {
        nextDivElem.style.display = "none"
        divBtnPrev.style.display = "none"
    }
    if (currentPage === 1) {
        divBtnPrev.style.display = "none"
    }
    if (currentPage === numberpagination) {
        nextDivElem.style.display = "none"
    }
    nextDivElem.addEventListener("click", function () {
        currentPage++
        if (currentPage === numberpagination) {
            nextDivElem.style.display = "none"
        }
        if (currentPage > 1) {
            divBtnPrev.style.display = "flex"
        }
        addingProductsTemplate(productArrayFilter, productsStructure, productsWrapper)

        setpagination(productArrayFilter)
        saveToLocalStorage("currentPage", currentPage)
    })
    divBtnPrev.addEventListener("click", function (event) {
        event.preventDefault()
        currentPage--
        let numberpagination = Math.ceil(products.length / numberRow)
        if (currentPage === 1) {
            divBtnPrev.style.display = "none"
        } if (currentPage < numberpagination) {
            nextDivElem.style.display = "flex"
        }
        addingProductsTemplate(productArrayFilter, productsStructure, productsWrapper)
        setpagination(productArrayFilter)
        saveToLocalStorage("currentPage", currentPage)
    })
}

function addingShowProductCountbyUser(products) {
    let data = getFromLocalStorage("showCountProducts")
    if (data) {
        numberRow = +data
    }
    else {
        numberRow = 8
    }
    // addingProductsTemplate(products, productsStructure, productsWrapper)
    setpagination(products)
    setBtnNextPrev(products)
}

function addingCurrentPageByUser(productsFilter) {
    let data = getFromLocalStorage("currentPage")
    if (currentPage) {
        currentPage = data
    }
    else {
        currentPage = 1
    }
    addingProductsTemplate(productsFilter, productsStructure, productsWrapper)
    setpagination(productsFilter)
    setinputNumberRow(productsFilter)
    setBtnNextPrev(productsFilter)
}

//**SET LOCAL STROGE OptionActive*/


function addingActiveOptionInSelectBoxByUser(productsFilter) {
    let data = getFromLocalStorage("optionActiveSelectBox")
    if (data) {
        optionSelect.value = data
    }
    else {
        optionSelect.value = []
    }

    addingProductsTemplate(productsFilter, productsStructure, productsWrapper)
    setpagination(productsFilter)
    setinputNumberRow(productsFilter)
    setBtnNextPrev(productsFilter)
}


function addingProductsFilteredbyUser(productsFilter) {
    let data = getFromLocalStorage('FilteredProducts')
    if (data) {
        productsFilter = data
    }
    else {
        productsFilter = []
    }
    addingProductsTemplate(productsFilter, productsStructure, productsWrapper)
    setpagination(productsFilter)
    setinputNumberRow(productsFilter)
    setBtnNextPrev(productsFilter)
}

//** gridSystm1col */

// let svgCol1 = $.querySelector(".shop-filter__svg-icon--col-1")
// let svgCol3 = $.querySelector(".shop-filter__svg-icon--col-3")
// function gridSystm1col(products) {
//     svgCol1.addEventListener("click", function () {
//         productsWrapper.innerHTML = ""
//         indexEnd = numberRow * currentPage
//         indexStart = indexEnd - numberRow
//         shopFilterResultText.innerHTML = "Showing" + indexStart + "-- " + indexEnd + " of" + products.length + " results"
//         let productListArraysSlice = products.slice(indexStart, indexEnd)
//         productListArraysSlice.forEach(function (product) {
//             if (product.discount === true) {
//                 let price = +product.price
//                 let discountPercent = +product.discountPercent
//                 let totalDiscount = (price * discountPercent) / 100
//                 let total = price - totalDiscount
//                 productsWrapper.insertAdjacentHTML('beforeend', '<div class="col col-lg-12 product-main-box product-main-box__shop product-main-box__shop--show "><div class="product-box"  id="discount"  ><div  ' +
//                     'class="img-box-overlay"><img class="product__img" src="' + product.img + '" alt="product1"><div class="product-overlay">' +
//                     '<div class="box-add-btn-cart box-add-btn-cart--grid-col-1"><span class="box-add-btn-cart__text">Add to cart</span></div>' +
//                     ' <div class="product-overlay__options product-overlay__options--grid-col-1">' +
//                     ' <div class="option-overlay">' +
//                     ' <svg width="12" height="14" viewBox="0 0 12 14" fill="none" >' +
//                     '<path d="M10 9.66671C9.47467 9.66671 9 9.87337 8.644 10.2047L3.94 7.46671C3.97333 7.31337 4 7.16004 4 7.00004C4 6.84004 3.97333 6.68671 3.94 6.53337L8.64 3.79337C9 4.12671 9.47333 4.33337 10 4.33337C11.1067 4.33337 12 3.44004 12 2.33337C12 1.22671 11.1067 0.333374 10 0.333374C8.89333 0.333374 8 1.22671 8 2.33337C8 2.49337 8.02667 2.64671 8.06 2.80004L3.36 5.54004C3 5.20671 2.52667 5.00004 2 5.00004C0.893333 5.00004 0 5.89337 0 7.00004C0 8.10671 0.893333 9.00004 2 9.00004C2.52667 9.00004 3 8.79337 3.36 8.46004L8.05867 11.2054C8.02112 11.3563 8.00143 11.5112 8 11.6667C8 12.0623 8.1173 12.4489 8.33706 12.7778C8.55682 13.1067 8.86918 13.3631 9.23463 13.5145C9.60009 13.6658 10.0022 13.7054 10.3902 13.6283C10.7781 13.5511 11.1345 13.3606 11.4142 13.0809C11.6939 12.8012 11.8844 12.4448 11.9616 12.0569C12.0387 11.6689 11.9991 11.2668 11.8478 10.9013C11.6964 10.5359 11.44 10.2235 11.1111 10.0038C10.7822 9.784 10.3956 9.66671 10 9.66671Z" fill="white"/></svg>' +
//                     '<span class="option-overlay__text">Share</span> </div> <div class="option-overlay">' +
//                     '<svg class="option-overlay-Compare" width="14" height="14"viewBox="0 0 14 14" fill="none">' +
//                     '<path d="M9.08004 6L10.08 7L13.52 3.55L10 0L9.00004 1L10.8 2.8H1.00004V4.2H10.82L9.08004 6ZM4.86004 8L3.86004 7L0.420044 10.5L3.91004 14L4.91004 13L3.10004 11.2H13V9.8H3.10004L4.86004 8Z" fill="white" /></svg>' +
//                     ' <span class="option-overlay__text">Compare</span></div>' +
//                     ' <div class="option-overlay"><svg class="option-overlay-Like" width="16" height="15" viewBox="0 0 16 15" fill="none">' +
//                     ' <path d="M7.99973 13.0361C-5.33333 5.66669 3.99999 -2.33331 7.99973 2.72539C12 -2.33331 21.3333 5.66669 7.99973 13.0361Z"stroke="white" stroke-width="1.8" /> </svg>' +
//                     ' <span class="option-overlay__text">Like</span></div></div></div> </div> <div  class="Discount-product">' +
//                     ' <span class="Discount-product__number">' + "-" + product.discountPercent + "%" + '</span></div><div class="product-Introductions"><h3 class="product-name">' + product.productName + '</h3>' +
//                     ' <p class="product-Introduction">' + product.productIntroduction + '</p><div class="product-price-box">' +
//                     '<span class="product-price">' + "Rp " + total.toLocaleString("en") + '</span><span class="product-discountPrice">' + "Rp" + product.price + '</span>' +
//                     '</div> </div></div></div> ')
//             }

//             product.newProduct === true ? productsWrapper.insertAdjacentHTML('beforeend', '   <div class="col col-lg-12 product-main-box product-main-box__shop " id="new"><div class="product-box"><div  ' +
//                 'class="img-box-overlay"><img class="product__img" src="' + product.img + '" alt="product1"><div class="product-overlay">' +
//                 '<div class="box-add-btn-cart"><span class="box-add-btn-cart__text">Add to cart</span></div>' +
//                 ' <div class="product-overlay__options">' +
//                 ' <div class="option-overlay">' +
//                 '+ <svg width="12" height="14" viewBox="0 0 12 14" fill="none" >' +
//                 '+<path d="M10 9.66671C9.47467 9.66671 9 9.87337 8.644 10.2047L3.94 7.46671C3.97333 7.31337 4 7.16004 4 7.00004C4 6.84004 3.97333 6.68671 3.94 6.53337L8.64 3.79337C9 4.12671 9.47333 4.33337 10 4.33337C11.1067 4.33337 12 3.44004 12 2.33337C12 1.22671 11.1067 0.333374 10 0.333374C8.89333 0.333374 8 1.22671 8 2.33337C8 2.49337 8.02667 2.64671 8.06 2.80004L3.36 5.54004C3 5.20671 2.52667 5.00004 2 5.00004C0.893333 5.00004 0 5.89337 0 7.00004C0 8.10671 0.893333 9.00004 2 9.00004C2.52667 9.00004 3 8.79337 3.36 8.46004L8.05867 11.2054C8.02112 11.3563 8.00143 11.5112 8 11.6667C8 12.0623 8.1173 12.4489 8.33706 12.7778C8.55682 13.1067 8.86918 13.3631 9.23463 13.5145C9.60009 13.6658 10.0022 13.7054 10.3902 13.6283C10.7781 13.5511 11.1345 13.3606 11.4142 13.0809C11.6939 12.8012 11.8844 12.4448 11.9616 12.0569C12.0387 11.6689 11.9991 11.2668 11.8478 10.9013C11.6964 10.5359 11.44 10.2235 11.1111 10.0038C10.7822 9.784 10.3956 9.66671 10 9.66671Z" fill="white"/></svg>' +
//                 '<span class="option-overlay__text">Share</span> </div> <div class="option-overlay">' +
//                 '<svg class="option-overlay-Compare" width="14" height="14"viewBox="0 0 14 14" fill="none">' +
//                 '<path d="M9.08004 6L10.08 7L13.52 3.55L10 0L9.00004 1L10.8 2.8H1.00004V4.2H10.82L9.08004 6ZM4.86004 8L3.86004 7L0.420044 10.5L3.91004 14L4.91004 13L3.10004 11.2H13V9.8H3.10004L4.86004 8Z" fill="white" /></svg>' +
//                 ' <span class="option-overlay__text">Compare</span></div>' +
//                 ' <div class="option-overlay"><svg class="option-overlay-Like" width="16" height="15" viewBox="0 0 16 15" fill="none">' +
//                 ' <path d="M7.99973 13.0361C-5.33333 5.66669 3.99999 -2.33331 7.99973 2.72539C12 -2.33331 21.3333 5.66669 7.99973 13.0361Z"stroke="white" stroke-width="1.8" /> </svg>' +
//                 ' <span class="option-overlay__text">Like</span></div></div></div> </div> <div  class="Discount-product Discount-product--green ">' +
//                 ' <span class="Discount-product__number">NEW</span></div><div class="product-Introductions"><h3 class="product-name">' + product.productName + '</h3>' +
//                 ' <p class="product-Introduction">' + product.productIntroduction + '</p><div class="product-price-box">' +
//                 '<span class="product-price">' + product.price.toLocaleString("en") + '</span>' +
//                 '</div> </div></div></div> ') : product.poster === false ? productsWrapper.insertAdjacentHTML('beforeend', '   <div class="col col-lg-12 product-main-box product-main-box__shop poster"><div class="product-box "><div  ' +
//                     'class="img-box-overlay"><img class="product__img" src="' + product.img + '" alt="product1"><div class="product-overlay">' +
//                     '<div class="box-add-btn-cart"><span class="box-add-btn-cart__text">Add to cart</span></div>' +
//                     ' <div class="product-overlay__options">' +
//                     ' <div class="option-overlay">' +
//                     '+ <svg width="12" height="14" viewBox="0 0 12 14" fill="none" >' +
//                     '+<path d="M10 9.66671C9.47467 9.66671 9 9.87337 8.644 10.2047L3.94 7.46671C3.97333 7.31337 4 7.16004 4 7.00004C4 6.84004 3.97333 6.68671 3.94 6.53337L8.64 3.79337C9 4.12671 9.47333 4.33337 10 4.33337C11.1067 4.33337 12 3.44004 12 2.33337C12 1.22671 11.1067 0.333374 10 0.333374C8.89333 0.333374 8 1.22671 8 2.33337C8 2.49337 8.02667 2.64671 8.06 2.80004L3.36 5.54004C3 5.20671 2.52667 5.00004 2 5.00004C0.893333 5.00004 0 5.89337 0 7.00004C0 8.10671 0.893333 9.00004 2 9.00004C2.52667 9.00004 3 8.79337 3.36 8.46004L8.05867 11.2054C8.02112 11.3563 8.00143 11.5112 8 11.6667C8 12.0623 8.1173 12.4489 8.33706 12.7778C8.55682 13.1067 8.86918 13.3631 9.23463 13.5145C9.60009 13.6658 10.0022 13.7054 10.3902 13.6283C10.7781 13.5511 11.1345 13.3606 11.4142 13.0809C11.6939 12.8012 11.8844 12.4448 11.9616 12.0569C12.0387 11.6689 11.9991 11.2668 11.8478 10.9013C11.6964 10.5359 11.44 10.2235 11.1111 10.0038C10.7822 9.784 10.3956 9.66671 10 9.66671Z" fill="white"/></svg>' +
//                     '<span class="option-overlay__text">Share</span> </div> <div class="option-overlay">' +
//                     '<svg class="option-overlay-Compare" width="14" height="14"viewBox="0 0 14 14" fill="none">' +
//                     '<path d="M9.08004 6L10.08 7L13.52 3.55L10 0L9.00004 1L10.8 2.8H1.00004V4.2H10.82L9.08004 6ZM4.86004 8L3.86004 7L0.420044 10.5L3.91004 14L4.91004 13L3.10004 11.2H13V9.8H3.10004L4.86004 8Z" fill="white" /></svg>' +
//                     ' <span class="option-overlay__text">Compare</span></div>' +
//                     ' <div class="option-overlay"><svg class="option-overlay-Like" width="16" height="15" viewBox="0 0 16 15" fill="none">' +
//                     ' <path d="M7.99973 13.0361C-5.33333 5.66669 3.99999 -2.33331 7.99973 2.72539C12 -2.33331 21.3333 5.66669 7.99973 13.0361Z"stroke="white" stroke-width="1.8" /> </svg>' +
//                     ' <span class="option-overlay__text">Like</span></div></div></div> </div><div class="product-Introductions"><h3 class="product-name">' + product.productName + '</h3>' +
//                     ' <p class="product-Introduction"> ' + product.productIntroduction + '</p><div class="product-price-box">' +
//                     '<span class="product-price">' + product.price.toLocaleString("en") + '</span>' +
//                     '</div> </div></div></div> ') : ""

//         })
//         setpagination(products)
//         setinputNumberRow(products);
//         setBtnNextPrev(products)
//     })


//     svgCol3.addEventListener("click", function () {
//         addingProductsTemplate(productsFilter, productsStructure, productsWrapper)
//         setpagination(products)
//         setinputNumberRow(products);
//         setBtnNextPrev(products)

//     })

// }
// gridSystm1col(products)
//** searchInput*/
let searchInput = $.querySelector(".shop-filter__input--text")
function searchProducts(products) {
    searchInput.addEventListener("keyup", function (e) {
        if (e.keyCode === 13) {

            let valueInputSearch = searchInput.value.trim()
            let findProductType = products.filter(function (params) {
                return params.type === valueInputSearch
            })
            console.log(findProductType, valueInputSearch);
            if (findProductType.length > 0) {
                currentPage = 1
                addingProductsTemplate(findProductType, productsStructure, productsWrapper)
                setpagination(findProductType)
                setinputNumberRow(findProductType);
                gridSystm1col(findProductType)
                setinputNumberRow(findProductType)
                setBtnNextPrev(findProductType)
                searchInput.value = ""
            } else {
                alert("Your search is not found. Please search carefully")
            }
        }
    })
}
// searchProducts(products)


console.log(optionSelect.value);

// if (optionSelect.value === "All") {
//     if (currentPage === null) {
//         currentPage = 1
//     } else {
//         currentPage = currentPage
//     }
//     console.log(productsBasedPagination);



//     setpagination(productsBasedPagination)
//     setinputNumberRow(productsBasedPagination)
//     setBtnNextPrev(productsBasedPagination)
//     saveToLocalStorage("FilteredProducts", productsBasedPagination)
//     saveToLocalStorage("currentPage", currentPage)
//     addingCurrentPageByUser(productsBasedPagination)
// };









window.addEventListener('load', function () {


    addingActiveOptionInSelectBoxByUser(productsFilter)
    addingProductsFilteredbyUser(productsFilter)
    addingCurrentPageByUser(productsFilter)
    addingShowProductCountbyUser(products)



    addingProductsTemplate(productsBasedPagination, productsStructure, productsWrapper)
}) 
