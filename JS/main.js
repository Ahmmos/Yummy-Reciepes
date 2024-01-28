

const rowData = document.getElementById("rowData");
const categoriesBtn = document.getElementById("categories")
const areaBtn = document.getElementById("area")
const ingrdBtn = document.getElementById("ingredients")
const searchBtn = document.getElementById("search")
const contactBtn = document.getElementById("contact")



//loader
$(function () {
    $("#loading").fadeOut(500)
    $("body").css("overflow", "visible")
})

function closeNav() {
    $("#closeBtn").toggleClass(("disappear"))
    $("#openBtn").toggleClass("disappear")
    $(".left-menu").animate({ left: "-250px" }, 500)
    $(".open-nav").animate({ left: "0px" }, 500)
}

//sideNavbar
$("#openBtn").on("click", function () {
    $(this).toggleClass(("disappear"))
    $("#closeBtn").toggleClass("disappear")
    $(".left-menu").animate({ left: "0px" }, 500)
    $(".open-nav").animate({ left: "250px" }, 500)
    for (let i = 0; i < 5; i++) {
        $(".sidenav a").eq(i).animate({ top: 0 }, (i + 5) * 100)
    }
})
$("#closeBtn").on("click", function () {
    $(this).toggleClass(("disappear"))
    $("#openBtn").toggleClass("disappear")
    $(".left-menu").animate({ left: "-250px" }, 500)
    $(".open-nav").animate({ left: "0px" }, 500)
    for (let i = 0; i < 5; i++) {
        $(".sidenav a").eq(i).animate({ top: 300 }, (i + 5) * 100)
    }
})


//display random meal

async function mainDisplay() {
    let cartona = ``
    $("#loading").fadeIn(500)
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s`);
    const data = await response.json();
    const realData = await data.meals
    $("#loading").fadeOut(500)

    for (let i = 0; i <= 20; i++) {
        cartona += `
        <div class="col-md-3 position-relative display-item">
        <div class="overlay d-flex align-items-center "><h2 class=" ms-1 text-black">${realData[i].strMeal}</h2></div>
        <img src="${realData[i].strMealThumb}" alt="" class=" preview" id="${realData[i].idMeal}">
      </div>
        
        
        `
    }
    rowData.innerHTML = cartona;
    let item = Array.from(document.getElementsByClassName("display-item"));
    item.forEach(element => {
        element.addEventListener("click", displayRecipe)

    })
}

mainDisplay()

// display recipe of each meal

async function displayRecipe(e) {
    $("#loading").fadeIn(500)
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${e.target.nextElementSibling.id}`)
    const data = await response.json()
    const meals = await data.meals
    const meal = meals[0]
    $("#loading").fadeOut(500)

    let ingredients = ``

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }
    // console.log(ingredients)
    let tags = meal.strTags?.split(",")

    if (!tags) tags = []

    let tagsStr = ''
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
    }

    rowData.innerHTML = `
      <div class="col-md-4 mt-3 ">
      <img class="w-100 rounded-3" src="${meal.strMealThumb}"
         alt="">
         <h2>${meal.strMeal}</h2>
      </div>
      <div class="col-md-8">
      <h2>Instructions</h2>
      <p>${meal.strInstructions}</p>
      <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
      <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
      <h3>Recipes :</h3>
      <ul class="list-unstyled d-flex g-3 flex-wrap">
         ${ingredients}
      </ul>

      <h3>Tags :</h3>
      <ul class="list-unstyled d-flex g-3 flex-wrap">
         ${tagsStr}
      </ul>

      <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
      <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
      </div>`

}

// display meals by category

categoriesBtn.addEventListener('click', async function () {
    closeNav()
    let cartoona = ``
    $("#loading").fadeIn(500)

    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    const data = await response.json()
    const categories = await data.categories

    $("#loading").fadeOut(500)


    for (let i = 0; i < 12; i++) {

        cartoona += `
        
        <div class="col-md-3 position-relative display-item" >
        <div class="overlay text-center text-black d-flex flex-column justify-content-start " id = "${categories[i].strCategory}">
          <h2 class=" ms-1 mt-3">${categories[i].strCategory}</h2>
          <p> ${categories[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")} </p>
        </div>
        <img src="${categories[i].strCategoryThumb}" alt="" class=" preview1" id="${categories[i].strCategory}">
        </div>
        `
    }
    rowData.innerHTML = cartoona;
    let item = Array.from(document.getElementsByClassName("display-item"));
    item.forEach(element => {
        element.addEventListener("click", displayCategory)

    })

})


async function displayCategory(e) {
    $("#loading").fadeIn(500)
    let categoryId = ""
    let cartona1 = ``
    if (e.srcElement.localName == "h2" || e.srcElement.localName == "p") {
        categoryId = e.target.parentNode.id
    } else {
        categoryId = e.target.id

    }
    console.log(categoryId)

    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryId}`)
    const data = await response.json()
    const catMeals = await data.meals

    $("#loading").fadeOut(500)

    for (let i = 0; i <= 20; i++) {
        cartona1 += `
        <div class="col-md-3 position-relative display-item">
        <div class="overlay d-flex align-items-center "><h2 class=" ms-1 text-black">${catMeals[i].strMeal}</h2></div>
        <img src="${catMeals[i].strMealThumb}" alt="" class=" preview" id="${catMeals[i].idMeal}">
      </div>


        `
    }
    rowData.innerHTML = cartona1
    let item = Array.from(document.getElementsByClassName("display-item"));
    item.forEach(element => {
        element.addEventListener("click", displayRecipe)

    })
}

//display meal by area
areaBtn.addEventListener("click", async function () {
    closeNav()
    let cartoona2 = ``
    $("#loading").fadeIn(500)
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    const data = await response.json()
    const area = await data.meals

    $("#loading").fadeOut(500)

    for (let i = 0; i <= 20; i++) {

        cartoona2 += `
        <div class="col-md-3">
        <div class="rounded-2 text-center cursor-pointer ">
                        <i class="fa-solid fa-house-laptop fa-4x area-name"></i>
                        <h3>${area[i].strArea}</h3>
        </div>
        </div>
        `
    }

    rowData.innerHTML = cartoona2;
    let item = Array.from(document.getElementsByClassName("area-name"));
    item.forEach(element => {
        element.addEventListener("click", displayArea)

    })


})


async function displayArea(e) {

    let cartoona3 = ``
    $("#loading").fadeIn(500)
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${e.srcElement.nextElementSibling.innerHTML}`)
    const data = await response.json()
    const areaMeals = await data.meals

    $("#loading").fadeOut(500)

    for (let i = 0; i < areaMeals.length; i++) {
        cartoona3 += `
        <div class="col-md-3 position-relative display-item">
        <div class="overlay d-flex align-items-center "><h2 class=" ms-1 text-black">${areaMeals[i].strMeal}</h2></div>
        <img src="${areaMeals[i].strMealThumb}" alt="" class=" preview" id="${areaMeals[i].idMeal}">
      </div>
        
        `
    }
    rowData.innerHTML = cartoona3;
    let item = Array.from(document.getElementsByClassName("display-item"));
    item.forEach(element => {
        element.addEventListener("click", displayRecipe)

    })

}



//display meal by ingrediants

ingrdBtn.addEventListener("click", async function () {
    closeNav()
    let cartoona2 = ``
    $("#loading").fadeIn(500)
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
    const data = await response.json()
    const ingred = await data.meals

    $("#loading").fadeOut(500)

    for (let i = 0; i <= 20; i++) {

        cartoona2 += `
        <div class="col-md-3">
        <div  class="rounded-2 text-center cursor-pointer">
                <i class="fa-solid fa-drumstick-bite fa-4x ingred-name"></i>
                <h3>${ingred[i].strIngredient}</h3>
                <p>${ingred[i].strDescription.split(" ").slice(0, 20).join(" ")}</p>
        </div>
        </div>
        `
    }

    rowData.innerHTML = cartoona2;
    let item = Array.from(document.getElementsByClassName("ingred-name"));
    item.forEach(element => {
        element.addEventListener("click", displayingrediant)

    })


})


async function displayingrediant(e) {

    let cartoona3 = ``
    $("#loading").fadeIn(500)
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${e.srcElement.nextElementSibling.innerHTML}`)
    const data = await response.json()
    const areaMeals = await data.meals

    $("#loading").fadeOut(500)

    for (let i = 0; i < areaMeals.length; i++) {
        cartoona3 += `
        <div class="col-md-3 position-relative display-item">
        <div class="overlay d-flex align-items-center "><h2 class=" ms-1 text-black">${areaMeals[i].strMeal}</h2></div>
        <img src="${areaMeals[i].strMealThumb}" alt="" class=" preview" id="${areaMeals[i].idMeal}">
      </div>
        
        `
    }
    rowData.innerHTML = cartoona3;
    let item = Array.from(document.getElementsByClassName("display-item"));
    item.forEach(element => {
        element.addEventListener("click", displayRecipe)

    })

}


// search 

searchBtn.addEventListener("click", function () {
    closeNav()
    rowData.innerHTML =` <div class="container w-75" id="searchContainer">
        <div class="row py-4 ">
            <div class="col-md-6 ">
                <input onkeyup="searchByName(this.value)" class="form-control bg-white text-black" type="text" placeholder="Search By Name">
            </div>
            <div class="col-md-6">
                <input onkeyup="searchByLetter(this.value)" maxlength="1" class="form-control bg-white text-black" type="text" placeholder="Search By First Letter">
            </div>
        </div>
        </div>
        <div class="container py-5">
        <div class="row g-4" id="searchRow">
        </div>
        </div>
        `
})

async function searchByName(term){
    let cartona=``

    $("#loading").fadeIn(500);

    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
    const data = await response.json()
    const meal = await data.meals

    $("#loading").fadeOut(500)

    for(let i = 0; i < meal.length; i++){
        cartona+=`
        <div class="col-md-3 position-relative display-item">
        <div class="overlay d-flex align-items-center "><h2 class=" ms-1 text-black">${meal[i].strMeal}</h2></div>
        <img src="${meal[i].strMealThumb}" alt="" class=" preview" id="${meal[i].idMeal}">
        </div>
        `
    }

    document.getElementById("searchRow").innerHTML=cartona
    let item = Array.from(document.getElementsByClassName("display-item"));
    item.forEach(element => {
        element.addEventListener("click", displayRecipe)

    })


}
async function searchByLetter(term){
    let cartona=``

    $("#loading").fadeIn(500);

    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`)
    const data = await response.json()
    const meal = await data.meals

    $("#loading").fadeOut(500)

    for(let i = 0; i < meal.length; i++){
        cartona+=`
        <div class="col-md-3 position-relative display-item">
        <div class="overlay d-flex align-items-center "><h2 class=" ms-1 text-black">${meal[i].strMeal}</h2></div>
        <img src="${meal[i].strMealThumb}" alt="" class=" preview" id="${meal[i].idMeal}">
        </div>
        `
    }

    document.getElementById("searchRow").innerHTML=cartona
    let item = Array.from(document.getElementsByClassName("display-item"));
    item.forEach(element => {
        element.addEventListener("click", displayRecipe)

    })
}



// contact us ( copied from Route Exam )

contactBtn.addEventListener('click', showContacts)


function showContacts() {
    rowData.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input  id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
</div> `
    submitBtn = document.getElementById("submitBtn")


    document.getElementById("nameInput").addEventListener("focus", () => {
        nameInputTouched = true
    })

    document.getElementById("emailInput").addEventListener("focus", () => {
        emailInputTouched = true
    })

    document.getElementById("phoneInput").addEventListener("focus", () => {
        phoneInputTouched = true
    })

    document.getElementById("ageInput").addEventListener("focus", () => {
        ageInputTouched = true
    })

    document.getElementById("passwordInput").addEventListener("focus", () => {
        passwordInputTouched = true
    })

    document.getElementById("repasswordInput").addEventListener("focus", () => {
        repasswordInputTouched = true
    })
}

let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;




function inputsValidation() {
    if (nameInputTouched) {
        if (nameValidation()) {
            document.getElementById("nameAlert").classList.replace("d-block", "d-none")

        } else {
            document.getElementById("nameAlert").classList.replace("d-none", "d-block")

        }
    }
    if (emailInputTouched) {

        if (emailValidation()) {
            document.getElementById("emailAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("emailAlert").classList.replace("d-none", "d-block")

        }
    }

    if (phoneInputTouched) {
        if (phoneValidation()) {
            document.getElementById("phoneAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("phoneAlert").classList.replace("d-none", "d-block")

        }
    }

    if (ageInputTouched) {
        if (ageValidation()) {
            document.getElementById("ageAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("ageAlert").classList.replace("d-none", "d-block")

        }
    }

    if (passwordInputTouched) {
        if (passwordValidation()) {
            document.getElementById("passwordAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("passwordAlert").classList.replace("d-none", "d-block")

        }
    }
    if (repasswordInputTouched) {
        if (repasswordValidation()) {
            document.getElementById("repasswordAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("repasswordAlert").classList.replace("d-none", "d-block")

        }
    }


    if (nameValidation() &&
        emailValidation() &&
        phoneValidation() &&
        ageValidation() &&
        passwordValidation() &&
        repasswordValidation()) {
        submitBtn.removeAttribute("disabled")
    } else {
        submitBtn.setAttribute("disabled", true)
    }
}

function nameValidation() {
    return (/^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value))
}

function emailValidation() {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById("emailInput").value))
}

function phoneValidation() {
    return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById("phoneInput").value))
}

function ageValidation() {
    return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("ageInput").value))
}

function passwordValidation() {
    return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("passwordInput").value))
}

function repasswordValidation() {
    return document.getElementById("repasswordInput").value == document.getElementById("passwordInput").value
}

