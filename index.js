// defining endpoint
const API_URL = 'https://www.themealdb.com/api/json/v1/1/';

// give instructions on what to do after loading page.
document.addEventListener("DOMContentLoaded", () => {
    fetchCategories();
    loadAllReviews();
});
// allows page to fetch categories and display them
async function fetchCategories() {
    try {
      const endpoint = `${API_URL}categories.php`;  
      const response = await fetch(endpoint);
      const data = await response.json();
      displayCategories(data.categories);
    } catch (error) {
        console.log("Error Loading");
    }
}
// display categories.
function displayCategories(categories){
    const categoriesList = document.getElementById("categories"); 
    const categoriesCard = document.getElementById("categories-details");
// looping through each category
    categories.forEach(category => {
        const card = categoriesCard.cloneNode (true);
        card.style.display = 'block';
        card.querySelector('#strcategory-title').textContent = category.strCategory;
        card.querySelector('#strcategorythumb').src = category.strCategoryThumb;
        card.querySelector('#strcategorydescription').textContent = category.strCategoryDescription.substring(0, 120) + '..';
// on click event fetch recipe by category
        card.addEventListener('click', () => fetchingRecipeByCategory(category.strCategory));
        categoriesList.appendChild(card);

    }); 
}
// Allows page to fetch recipe by category and dispay
async function fetchingRecipeByCategory(category) {
    try {
        const endpoint = `${API_URL}filter.php?c=${encodeURIComponent(category)}`; 
        const response = await fetch(endpoint);
        const data = await response.json();
        const recipesToDisplay = data.meals.slice(0, 4);
        displayRecipesByCategory(recipesToDisplay);
    } catch (error) {
        console.log("Error Loading");
    }
}
// display Recipes by category
function displayRecipesByCategory(recipes) {
    const recipeDetails = document.getElementById("recipe-details");
    recipeDetails.innerHTML = '';
// loop through each recipe on the category
    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
// shows attributes to display on recipe card
        recipeCard.innerHTML = `
          <img src = "${recipe.strMealThumb}">
          <h3>${recipe.strMeal}</h3>
          <h3>${recipe.idMeal}</h3>
        `;
// shows receipe detail when you click recipe card
        recipeCard.addEventListener('click', () => fetchRecipeDetails(recipe.idMeal));
        recipeDetails.classList.remove("hidden");
      recipeDetails.appendChild(recipeCard); 

    });
}
// fetching recipe details by id
async function fetchRecipeDetails(id) {
    try {
        const endpoint = `${API_URL}lookup.php?i=${id}`;
        const response = await fetch(endpoint);
        const data = await response.json();
        displayRecipeDetails(data.meals[0]);
    } catch (error) {
        console.log("Error Loading");
    }
}
// display recipe details
function displayRecipeDetails(meal) {
    const recipeDetails = document.getElementById("recipe-details");
    recipeDetails.innerHTML = `
        <div class="recipe-display">
        <h2>${meal.strMeal}</h2>
        <h2>${meal.strArea}</h2>
        <p>${meal.strInstructions}</p>
        <img src = "${meal.strMealThumb}">
        <a href="${meal.strYoutube}">video tutorial</a>
        <ul>${getIngredList(meal)}</ul>
        </div>
        <div id="review-section" class="">
        <h3>Review Section</h3>
        <form id="review-form">
            <textarea name="" id="review-text" placeholder="Kindly share your views on our recipes here...."></textarea>
            <br/><br/>
            <button type="submit" onclick="addReview('${meal.idMeal}')">Submit</button>
        </form>
        <hr>
        <h3>All Reviews</h3>
        <ul id="review-list"></ul>
    </div>
    `;
    loadReviewsForRecipe(meal.idMeal);
}
// add ingredients list by looping through the pay load
function getIngredList(meal) {
    let ingredients = '';
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ingredient && ingredient.trim() !== '') {
            ingredients += `<li>${ingredient} ${measure}</li>`;
        }
    }
    return ingredients;
}
// reviews box text and functions.
function addReview(id) {
    const reviewText = document.getElementById('review-text').value;
    if (!reviewText)
        return;

    const reviews = getReviewFromLocalStorage();
    const editIndex = document.getElementById('review-text').dataset.editIndex;
    if (editIndex){
        reviews[id][editIndex] = reviewText;
        delete document.getElementById('review-text').dataset.editIndex;
    } else { 
        if (!reviews[id]){
            reviews[id] = [];
        }
        reviews[id].push(reviewText);
    }
   
    localStorage.setItem('reviews', JSON.stringify(reviews));
    loadReviewsForRecipe(id);
    document.getElementById('review-text').value = '';
}
// get stored review retrival
function getReviewFromLocalStorage(){
    const reviews = localStorage.getItem('reviews');
    return reviews ? JSON.parse(reviews) : {};
}
// front face review viwer and delete.
function loadReviewsForRecipe(recipeId){
    const reviews = getReviewFromLocalStorage();
    const reviewList = document.getElementById('review-list');
    reviewList.innerHTML='';
    if (reviews && reviews[recipeId]) {
        reviews[recipeId].forEach((review, index) => {
            const reviewItem = document.createElement('li');
            reviewItem.innerHTML = `
                <p>${review}</p>
                <button onclick="editReviews('${recipeId}',${index})">Edit</button>
                <button onclick="deleteReviews('${recipeId}',${index})">Delete</button>
            `;
            reviewList.appendChild(reviewItem);
        });
    }
}
// allows all reviews to load.
function loadAllReviews() {
   const recipe = document.querySelectorAll('.recipe-card');
   recipe.forEach(rcp =>{
    const id = rcp.querySelector('h3').textContent;
    loadReviewsForRecipe(id);
   });
}
// Edit Reviews
function editReviews(id,index) {
    const reviews = getReviewFromLocalStorage();
    const reviewText = reviews[id] [index];
    document.getElementById('review-text').value = reviewText;
    document.getElementById('review-text').dataset.editIndex = index;
}
// delete reviews.
function deleteReviews(id, index) {
    const reviews = getReviewFromLocalStorage();
    reviews[id].splice(index, 1);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    loadReviewsForRecipe(id);
}