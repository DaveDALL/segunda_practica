const fetchingCart = async () => {
    let cartFetchUrl = 'http://localhost:8080/api' + window.location.pathname
    try {
        let response = await fetch(cartFetchUrl)
        let cartData = await response.json()
        return cartData
    }catch(err) {
        console.log('No es posible realizar un fetch del cart ' + err)
    }
}

const fetchToDeleteCartProduct = async (cid, pid) => {
    let deleteProductUrl = `http://localhost:8080/api/carts/${cid}/products/${pid}`
    try {
        let response = await fetch(deleteProductUrl, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json'
              }
        })
        let deleteInfo = await response.json()
        return deleteInfo
    }catch(err) {
        console.log('No fue posible eliminar el producto del cart ' + err)
    }
}

const cartRenderCards = (cid, products) => {
 let cartBox = document.getElementById('cartContainer')
 cartBox.innerHTML= ' '
 products.map( product => {
    let cartBlister = document.createElement('div')
    cartBlister.classList.add('cart-blister', 'col-8')
    let {productId, qty} = product
    cartBlister.innerHTML = `
        <div class="cart-product-box">
            <div class"cart-image-box col-2">
                <img src=${productId.thumbnails[0]} />
            </div>
            <div class="col-3">${productId.title}</div>
            <div class="col-2">${qty} piezas</div>
            <div class"col-2">subtotal $${(qty*productId.price).toFixed(2)}</div>
            <div>
                <button id=${productId.code}>Eliminar</button>
        </div>
    `
    cartBox.append(cartBlister)
    let deleteButton = document.getElementById(productId.code)
    deleteButton.addEventListener('click', () => deleteProductFromCart(cid, productId._id))
 })
}

const cartRender = async () => {
    let cartData = await fetchingCart()
    let {payload} = cartData
    let {_id, products} = payload
    cartRenderCards(_id, products)
}

async function deleteProductFromCart (cid, pid) {
    let deleteResult = await fetchToDeleteCartProduct(cid, pid)
    if(deleteResult.status === 'success') alert('Producto eliminado con exito')
    cartRender()
}

cartRender()

let returnButton = document.getElementById('returnButton')
returnButton.addEventListener('click', () => {
    window.close()
})