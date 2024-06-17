import { menuArray } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const menuPart = document.getElementById("menu-part")
const formSec = document.getElementById("form-sec")
const orderPart = document.getElementById("order-part")
const start =()=>{
    orderPart.style.display ="none"
    formSec.style.display ="none"
}
let orderList =[]
start()
const makeMenu = foods => {
    const madeMenu = foods.map((food)=>{

        const {name, ingredients, id, price, emoji} = food
        return `
    <div class="item-container">
        <div class="single-food"> 
        <span>${emoji}</span>
            <div>
            <h2>${name}</h2>
            <h3>${ingredients.join(", ")}</h3>
            <h2>$${price}</h2>
            </div>
        </div>
        <i class="fa-solid fa-circle-plus" data-icon="${id}"></i>
    </div>
        
        `
    }).join(" ")
    return madeMenu
}

const render=()=>{
    menuPart.innerHTML =makeMenu(menuArray)
}
render()

const addToOrder = order =>{
    
   menuArray.forEach(food => {
    if(food.id == order){
        food.uid = uuidv4()
        orderList.push(food)
        console.log("added",orderList)
    }
   });
    renderOrders(orderList)
} 

const renderOrders = list =>{
    const totalPrice = list.reduce((total,list)=>total + list.price,0)
    let renderedOrders = list.map((order)=>{
        return `
        <div id="${order.id}" class="item-container">
            <div class="order">
                <h2>${order.name}</h2>
                <button class="delete-button" data-uid="${order.id}">remove</button>
            </div>
            <h2>$${order.price}</h2>
        </div>
        `
    }).join(" ")
    orderPart.innerHTML =  renderedOrders += `
    <div class="item-container">
        <div>
                <h2>Total Price</h2>
        </div>
        <div>
                <h2>$${totalPrice}</h2>
        </div>
   
    </div>
     <button id="complete-button" class="green-back">Complete Order</button>
        `
}

const deleteOrder = (order,currentOrders)=>{
let dlIndex 
currentOrders.forEach((item,index)=>{
    if(order == item.uid){
            dlIndex = index
    }
})
currentOrders.splice(dlIndex,1)
renderOrders(currentOrders)
}

const renderForm=()=>{
formSec.innerHTML = `

<button id="exit-form">X</button>
<h2>Enter card details</h2>
<form id="order-form">
    <input
    required
    type="text"
    id="user-name"
    name="user-name"
    placeholder="Enter your name"
    >
     <input
    required
    type="number"
    id="card-number"
    name="card-number"
    placeholder="Enter card number"
    >
    <input
    required
    type="text"
    id="cvv-num"
    name="cvv-num"
    minlength="3"
    maxlength="3"
    pattern="\\d{3}"
    placeholder="Enter CVV"
    >
    <input type="submit" value ="Pay" class="green-back">
    </form>
`
}

document.addEventListener("click",function(e){
    if(formSec.style.display == "none"){
        if(e.target.dataset.icon){
            addToOrder(e.target.dataset.icon)
            orderPart.style.display ="flex"
        }else if(e.target.dataset.uid){
            deleteOrder(e.target.dataset.uid,orderList)
        }else if(e.target.id == "complete-button"){
            formSec.style.display = "flex"
            renderForm()
        }
    }
   else if(e.target.id == "exit-form"){
        formSec.style.display = "none"
    }
        
})