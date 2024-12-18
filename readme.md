# Recipe App

A simple web application that allows users to browse meal categories, view recipes, and manage reviews using Local Storage. The app fetches data from [TheMealDB API](https://www.themealdb.com/api.php).

## Features
- Browse meal categories
- View recipes by category
- See detailed recipe information
- Add and delete reviews using Local Storage

## How It Works
### API Integration
We utilize TheMealDB API endpoints to fetch meal data:

1. **Fetching Categories**:
   - Endpoint: `https://www.themealdb.com/api/json/v1/1/categories.php`
   - Purpose: Retrieve meal categories and display them on the home page.

2. **Fetching Recipes by Category**:
   - Endpoint: `https://www.themealdb.com/api/json/v1/1/filter.php?c={CATEGORY}`
   - Purpose: Display a list of meals from a specific category.

3. **Fetching Recipe Details**:
   - Endpoint: `https://www.themealdb.com/api/json/v1/1/lookup.php?i={MEAL_ID}`
   - Purpose: Show detailed information about a specific meal, including instructions, ingredients, and a tutorial link.

### Local Storage Integration
We manage user reviews using Local Storage:
- **Add Review**: Users can write and submit reviews.
- **Delete Review**: Users can remove specific reviews.
- **Persistent Data**: Reviews are saved in the browser, persisting even after the page is reloaded.

## How to Run the App
1. Clone the repository:
   ```bash
   git clone https://github.com/ESoila/keto-Diet.git
   ```
2. Open `index.html` in your web browser.

## Project Structure
```
📁 Recipe App
 ├── index.html        # Main HTML file
 ├── style.css         # CSS styles
 ├── script.js         # JavaScript logic
 └── README.md         # Documentation
```

## Acknowledgments
- [TheMealDB API](https://www.themealdb.com/api.php) for providing meal data.


