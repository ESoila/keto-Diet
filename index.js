const API_URL = 'https://www.themealdb.com/api/json/v1/1/';

document.addEventListener("DOMContentLoaded", () => {
    fetchCategories();
    loadAllReviews();
});

async function fetchCategories() {
    try {
      const endpoint = `${API_URL}categories.php`;  
      const response = await fetch(endpoint);
      const data = await response.json();
      displayCategories(data.categories);
    } catch (error) {
        
    }
}
function displayCategories(categories){
    const categoriesList = document.getElementById("categories"); 
    const categoriesCard = document.getElementById("categories-details");

    categories.forEach(category => {
        const card = categoriesCard.cloneNode (true);
        card.style.display = 'block';
        card.querySelector('#strcategory-title').textContent = category.strCategory;
        card.querySelector('#strcategorythumb').src = category.strCategoryThumb;
        card.querySelector('#strcategorydescription').textContent = category.strCategoryDescription.substring(0, 120) + '..';

        card.addEventListener('click', () => fetchingRecipeByCategory(category.strCategory));
        categoriesList.appendChild(card);

    }); 
}
function showSection(sectionId) {
    //.Render the menu sections.
    const sections = document.querySelectorAll("section, #movie-details");
    sections.forEach(section => section.style.display = "none");
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = "block";
    }
}
async function fetchingRecipeByCategory(category) {
    try {
        const endpoint = `${API_URL}filter.php?c=${encodeURIComponent(category)}`; 
        const response = await fetch(endpoint);
        const data = await response.json();
        const recipesToDisplay = data.meals.slice(0, 4);
        displayRecipesByCategory(recipesToDisplay);
    } catch (error) {
        
    }
}
function displayRecipesByCategory(recipes) {
    const recipeDetails = document.getElementById("recipe-details");
    recipeDetails.innerHTML = '';

    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');

        recipeCard.innerHTML = `
          <img src = "${recipe.strMealThumb}">
          <h3>${recipe.strMeal}</h3>
          <h3>${recipe.idMeal}</h3>
        `;
        
        recipeCard.addEventListener('click', () => fetchRecipeDetails(recipe.idMeal));
        recipeDetails.classList.remove("hidden");
      recipeDetails.appendChild(recipeCard); 

    });
}
async function fetchRecipeDetails(id) {
    try {
        const endpoint = `${API_URL}lookup.php?i=${id}`;
        const response = await fetch(endpoint);
        const data = await response.json();
        displayRecipeDetails(data.meals[0]);
    } catch (error) {
        
    }
}
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
function addReview(id) {
    const reviewText = document.getElementById('review-text').value;
    if (!reviewText)
        return;

    const reviews = getReviewFromLocalStorage();
    if (!reviews[id]){
        reviews[id] = [];
    }
    reviews[id].push(reviewText);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    loadReviewsForRecipe(id);
    document.getElementById('review-text').value = '';
}
function getReviewFromLocalStorage(){
    const reviews = localStorage.getItem('reviews');
    return reviews ? JSON.parse(reviews) : {};
}
function loadReviewsForRecipe(recipeId){
    const reviews = getReviewFromLocalStorage();
    const reviewList = document.getElementById('review-list');
    reviewList.innerHTML='';
    if (reviews && reviews[recipeId]) {
        reviews[recipeId].forEach((review, index) => {
            const reviewItem = document.createElement('li');
            reviewItem.innerHTML = `
                <p>${review}</p>
                <button onclick="deleteReviews('${recipeId}',${index})">Delete</button>
            `;
            reviewList.appendChild(reviewItem);
        });
    }
}
function loadAllReviews() {
   const recipe = document.querySelectorAll('.recipe-card');
   recipe.forEach(rcp =>{
    const id = rcp.querySelector('h3').textContent;
    loadReviewsForRecipe(id);
   });
}
function deleteReviews(id, index) {
    const reviews = getReviewFromLocalStorage();
    reviews[id].splice(index, 1);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    loadReviewsForRecipe(id);
}