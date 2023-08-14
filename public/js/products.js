let fetchingUrl = 'http://localhost:8080/api/products?limit=3&pageNum=1'
let products = []
let prevLinkPage = ' '
let nextLinkPage = ' '
let cartId = '64b522c4d5b51e2d98a0fa81'

const fetchingData = async (Url) => {
    try {
            let response = await fetch(Url)
            let productsData = await response.json()
            return productsData
    }catch(err) {
        console.log('No e posible realizar un fetch de los productos ',err)
    }
}
const fetchingNewCart = async () => {
    try {
        let response = await fetch('http://localhost:8080/api/carts/cart', {
           method: 'POST',
           headers: {
            'Content-type': 'application/json'
          }
        })
        let newCartResponse = await response.json()
        return newCartResponse.payload._id
    }catch(err) {
        console.log('no es posible crear el cart '+ err)
    }
}

const fetchingAddProductToCart = async (url, pid, qty) => {
    try {
        let response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({
                productId: pid,
                qty: qty
            })
        })
        let addingResponse = await response.json()
        return addingResponse
    }catch(err) {

    }
}

const addToCart = async (pid, status, stock) => {
    let qty = 1
    if(!cartId) {
        cartId = await fetchingNewCart()
    }
    let putUrl = `http://localhost:8080/api/carts/${cartId}`
    console.log(putUrl)
    if(status && stock > 0) {
        let productAdded = await fetchingAddProductToCart(putUrl, pid, qty)
        alert('producto agregado con exito')
    }
}

const productCardRender = async (payload) => {
    products = payload
    let productBox = document.getElementById('productContainer')
    productBox.innerHTML = ' '
    products.map(product => {
        let productBlister = document.createElement('div')
        productBlister.classList.add('product-blister')
        let {_id, code, title, description, thumbnails, price, stock, status, category} = product
        productBlister.innerHTML = `
            <div class='product-info'>
                <h4>${title}</h4>
                <p>${description}</p>
                <p>Categoría: ${category}</p>
                <p>Cantidad disponible: ${stock} piezas</p>
                <p id="productPrice">$ ${price.toFixed(2)}</p>
            </div>
            <div class="add-cart-button">
                <button id=${code}>Agrega al Carrito</button>
            </div>
            <div class="image-box">
                <img src=${thumbnails[0]} />
            </div>
        `
        productBox.append(productBlister)
        let addToCartButton = document.getElementById(code)
        addToCartButton.addEventListener('click', () => addToCart(_id, status, stock))
    })
}

const productsRender = async (Url) => {
    let productsData = await fetchingData(Url)
    let {payload, hasPrevPage, hasNextPage, prevLink, nextLink} = productsData
    productCardRender(payload)
    prevLinkPage = prevLink
    nextLinkPage = nextLink
    hasPrevPage ? document.getElementById("prevButton").style.display = "block" : document.getElementById("prevButton").style.display = "none"
    hasNextPage ? document.getElementById("nextButton").style.display = "block" : document.getElementById("nextButton").style.display = "none"
}

async function nextPage(nextLink) {
    await productsRender(nextLink)
}

async function prevPage(prevLink) {
    await productsRender(prevLink)
}

function viewCart() {
    let cartUrl = `http://localhost:8080/carts/${cartId}`
    if(!cartId) {
        alert('El carrito se encuentra vacio')
    }else {
        window.open(cartUrl, '_blank')
    }
}

productsRender(fetchingUrl)

let prevButton = document.getElementById("prevButton")
prevButton.addEventListener('click', () => prevPage(prevLinkPage))
let nextButton = document.getElementById("nextButton")
nextButton.addEventListener('click', () => nextPage(nextLinkPage))

let cartViewButton = document.getElementById("viewCart")
cartViewButton.addEventListener('click', viewCart)