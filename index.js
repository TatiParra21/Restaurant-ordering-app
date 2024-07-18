import { menuArray } from './data.js'
//import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const menuPart = document.getElementById("menu-part")
const formSec = document.getElementById("form-sec")
const orderPart = document.getElementById("order-part")
const thankSec = document.getElementById("thank-sec")
let orderList
const makeMenu = foods => {
    const madeMenu = foods.map((food)=>{

        const {name, ingredients, id, price, emoji} = food
        return `
    <div class="item-container">
        
            <div class="grid-items emoji-name">
                <h2>${name}</h2>
                <span>${emoji}</span>
            </div>
            <div class="item-details grid-items">
                <h2>${ingredients.join(", ")}</h2>
                <h3>$${price}</h3>
            </div>
            <div class="item-plus grid-items">
            <i class="fa-solid fa-circle-plus" data-icon="${id}"></i>
            </div>
    </div>
        
        `
    }).join(" ")
    return madeMenu
}

const render=()=>{
    menuPart.innerHTML =makeMenu(menuArray)
}
const start =()=>{
    thankSec.style.display = "none"
    orderPart.style.display ="none"
    formSec.style.display ="none"
    const namethank = localStorage.getItem("username")
    if(namethank){
        thankSec.innerHTML =`
        <button id="exit-thank" class="exit-button">X</button>
        <div id="thank-you-part">
        <h1 >Thank you ${namethank} for your purchase!!!</h1>
        </div>
        `
        thankSec.style.display = "flex"
        document.getElementById("exit-thank").addEventListener("click",()=>{
            thankSec.style.display = "none"
        })
        localStorage.removeItem("username")
    }
    render()
}









document.addEventListener("click",function(e){
    
    if(formSec.style.display == "none"){
        if(e.target.dataset.icon){
            addToOrder(e.target.dataset.icon)
            orderPart.style.display ="flex"
        }else if(e.target.dataset.uid){
            deleteOrder(e.target.dataset.uid,orderList)
        }else if(e.target.id == "complete-button"){
            console.log("worked??")
            formSec.style.display = "flex"
            renderForm()
        }else if(e.target.dataset.minus){
            applyEffect(e.target.dataset.minus,"sub")
        }else if(e.target.dataset.plus){
            applyEffect(e.target.dataset.plus,"add")
        }
    }
    else if(e.target.id == "exit-form"){
        
    formSec.style.display = "none"
        
}})


const applyEffect = (idd,effect)=>{
    const chosenOne = orderList.find(order=> order.id == idd)
   const thePrice = findOgPrice(idd)
   if(effect == "sub"){
    chosenOne.price -= thePrice
        if(chosenOne.price == 0){
            deleteOrder(chosenOne.id,orderList)
            console.log("chosenname",chosenOne.name)
        }else{
            renderOrders(orderList)
        }
    
   }else{
    chosenOne.price += thePrice
    renderOrders(orderList)
   }
   
}
const addToOrder = order =>{
    //order is the current item's id
    if(!orderList){
        orderList =[]
    }
    
    const existingOrder = orderList.find(item=>String(item.id) == order)
    if(existingOrder){
       
        addRepeat(existingOrder)
        
    }else{
const newOrder= {...menuArray.find(menu=>menu.id ==order)}
   orderList.push(newOrder)
    
   renderOrders(orderList)
   console.log(orderList,"the list")
    
    }
    }
 
const addRepeat= orderRep=>{
    const ogPrice = findOgPrice(orderRep.id)
 
    orderList.forEach(or=>{
        if(or.id ==orderRep.id){
            or.price += ogPrice
        }
    })

    renderOrders(orderList)
}
const findOgPrice=og =>{
    return menuArray.find(match=>String(og)==match.id).price
}
const renderOrders = list =>{
   
    const totalPrice = list.reduce((total,list)=>total + list.price,0)
    let renderedOrders = list.map(({name,id,price})=>{
        const ogPrice2 = findOgPrice(id)
    let amount = price/ogPrice2
   
        return `
        <div id="${id}" class="item-container">
            <div class="order">
                <h2>${name}</h2>
                <button class="delete-button" data-uid="${id}">remove</button>
            </div>
            <div class="item-container order-second">
            <h2>${amount}</h2>
               <div class="order-nums">
                    <i class="fa-regular fa-square-minus" data-minus="${id}"></i>
                    <i class="fa-regular fa-square-plus" data-plus="${id}"></i>
                </div>
            <h2>$${price}</h2>
            </div>
        </div>
        `
    }).join(" ")
    orderPart.innerHTML =  renderedOrders += `
    <div class="item-container total-sec">
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
////NOTE I GOTTA FIX THE DELETE ORDER FUNCTION
const deleteOrder = (order,currentOrders)=>{
    
let dlIndex 
currentOrders.forEach((item,index)=>{
    if(order == item.id){

            dlIndex = index
    }
})
currentOrders.splice(dlIndex,1)
renderOrders(currentOrders)
}

const renderForm=()=>{
formSec.innerHTML = `

<button id="exit-form"class="exit-button">X</button>
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
    const orderForm = document.getElementById("order-form")
    orderForm.addEventListener("submit",setThanks)
}

const setThanks=(e)=>{
    
    const userName = document.getElementById("user-name").value
    localStorage.setItem("username",userName)
   
   
}

start()