$(document).foundation();

const userInput = document.getElementById('user-input');
const recipeCreationEl = document.getElementById('recipes');
const submitFormEl = document.getElementById('form-index');
const pastSearchesEl = document.getElementById('past-results');

submitFormEl.addEventListener('submit', function(event){

    event.preventDefault();

    const search = userInput.value;
    const searchPlus = search.replaceAll(' ','+')

    if (searchPlus === ''){
        return
    };

    if (!pastResults.includes(search)){
        pastResults.push(search);
        localStorage.setItem('history', JSON.stringify(pastResults));
    };

    userInput.value = '';

    generateSearchHistory();

    ingredientSearch(searchPlus);
})


function ingredientSearch(searchPlus){
    fetch(`https://api.spoonacular.com/recipes/findByIngredients?apiKey=196192673e7b41b2b8a7e8f82c389470&ingredients=${searchPlus}&number=4&instructionsRequired=true&addRecipeInformation=true`)
    .then(function(response){
        return response.json();
    })
    .then(function(foodData){
        return recipeInformation(foodData);
    })
}

// change 0 to i
function recipeInformation(foodData){

    recipeCreationEl.textContent = '';
    
    for (let i = 0; i < 2; i++) {
        fetch(`https://api.spoonacular.com/recipes/${foodData[i].id}/information?apiKey=196192673e7b41b2b8a7e8f82c389470&includeNutrition=false`)
        .then(function(response){
            return response.json();
        })
        .then(function(foodData){
            return generateRecipes(foodData);
        })
    }
}

function generateRecipes(foodData){

    const section = document.createElement('section');
    section.setAttribute('class','recipe-card')
    const article = document.createElement('article');
    article.setAttribute('class','recipe-info')

    const h1 = document.createElement('h1');
    if (foodData.vegan){
        h1.textContent = 'V | ' + foodData.title;
    } else if (foodData.glutenFree){
        h1.textContent = 'GF | ' + foodData.title;
    } else {
        h1.textContent = foodData.title;
    }

    article.appendChild(h1);
    
    const img = document.createElement('img');
    img.setAttribute('src',foodData.image);
    img.setAttribute('class','recipe-img');
    
    const p = document.createElement('p');
    let instructions = foodData.instructions;
    if (instructions !== null){
        const removeFromString = ['<li>','</li>','<ol>','</ol>']
        for (let i = 0; i < removeFromString.length; i++) {
            const removed = removeFromString[i];
            const recipeInstructions = instructions.replaceAll(removed,'')
            instructions = recipeInstructions
        } 

        p.textContent = 'Serves: ' + foodData.servings + ' | ' + 'Ready-in: ' + foodData.readyInMinutes + ' minutes | Instructions: ' + instructions;
        article.appendChild(p);
        
        const ol = document.createElement('ol');
        ol.setAttribute('class','recipe-ingredients')
        const howManyIngredients = foodData.extendedIngredients
        for (let i = 0; i < howManyIngredients.length; i++) {
            const ingredient = foodData.extendedIngredients[i].name;
            const measurement = foodData.extendedIngredients[i].measures.metric.amount+' '+foodData.extendedIngredients[i].measures.metric.unitShort;

            if (ingredient === ''){
                return;
            }

            const li = document.createElement('li');
            li.textContent = measurement + ' ' + ingredient;
            ol.appendChild(li)
        }

        article.appendChild(ol)
        section.appendChild(img);
        section.appendChild(article);
        recipeCreationEl.appendChild(section);
    } else {

        const h2 = document.createElement('h2');
        h2.textContent = 'Try a broader search!';
        recipeCreationEl.appendChild(h2);
    }
}

let pastResults = [];
function generateSearchHistory(){
    pastSearchesEl.textContent = '';

    let storedHistory = JSON.parse(localStorage.getItem("history"));
    if (storedHistory !== null){
        pastResults = storedHistory;
    }

    for (let i = 0; i < pastResults.length; i++) {
        const pastResult = pastResults[i];
        const button = document.createElement('button');
        button.setAttribute('class','button search-history');
        button.textContent = pastResult;

        button.addEventListener('click', function(){
            const searchPlus = (button.textContent).replaceAll(' ','+')
            ingredientSearch(searchPlus)
        })
        
        pastSearchesEl.appendChild(button);
    }
}

    