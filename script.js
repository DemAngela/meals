const row = document.querySelector('.row')
const all = document.querySelector('#all');
const search = document.querySelector('#search')
const searchBox = document.querySelector('.search-wrapper');
const searchInput = document.querySelector('#searchInput');
const submit = document.querySelector('.submit');
const result = document.querySelector('.result')
all.addEventListener('change', () => {
    if (all.checked) {
        row.classList.remove('hidden')
        searchBox.classList.add('hidden')
        result.innerHTML = ''
    }
})

search.addEventListener('change', () => {
    if (search.checked) {
        searchBox.classList.remove('hidden')
        row.classList.add('hidden')
    }
})

const handleGetMeals = () => {
    fetch('https://www.themealdb.com/api/json/v2/1/randomselection.php')
        .then(res => res.json())
        .then(data => {
            data.meals.forEach(meal => {
                const {idMeal, strMeal, strMealThumb, strArea, strCategory} = meal

                const card = document.createElement('div')
                card.classList.add('col-3')
                card.innerHTML += `
                        <div class="card">
                            <div class="title">
                                <div class="subtitle">
                                    <h2>${strMeal}</h2>
                                </div>
                                <img src="${strMealThumb}" width="200px" alt="${strMeal}">
                                <p>${strArea}</p>
                            </div>
                                <h4 class="mainText">${strCategory}</h4>
                        </div>`

                row.appendChild(card)

                card.addEventListener('click', () => {

                    const deleteIngredientsList = card.querySelector('ul');
                    if (card.classList.contains('col-3')) {
                        card.classList.remove('col-3')
                        card.classList.add('col-6')

                        fetch(`https://www.themealdb.com/api/json/v2/1/lookup.php?i=${idMeal}`)
                            .then(res => res.json())
                            .then(data => {
                                const ingredients = []
                                for (let i = 1; i <= 3; i++) {
                                    const ingredient = data.meals[0][`strIngredient${i}`]

                                    if (ingredient) {
                                        ingredients.push(ingredient)
                                    }
                                }
                                const ingredientsList = document.createElement(`ul`)
                                ingredients.forEach(ingredient => {
                                    const list = document.createElement('li')
                                    list.textContent = ingredient
                                    ingredientsList.appendChild(list)

                                    const ingredientImg = document.createElement('img')
                                    ingredientImg.src = `https://www.themealdb.com/images/ingredients/${ingredient}.png`
                                    ingredientImg.alt = ingredient
                                    ingredientImg.width = 100
                                    ingredientImg.height = 100

                                    list.appendChild(ingredientImg);

                                    ingredientsList.appendChild(list);

                                })

                                const link = document.createElement('h5');
                                link.innerHTML = 'and more';

                                const linkWrapper = document.createElement('div');
                                linkWrapper.classList.add('linkWrapper')

                                linkWrapper.appendChild(link);

                                card.querySelector('.card').appendChild(ingredientsList)
                                ingredientsList.appendChild(linkWrapper);

                            })
                    } else if (card.classList.contains('col-6')) {
                        card.classList.remove('col-6')
                        card.classList.add('col-3')
                    } if (deleteIngredientsList) {
                        deleteIngredientsList.remove();
                    }
                })
            })
        })
}

handleGetMeals()

const handleSearch = () => {
    let value = searchInput.value
    result.innerHTML = ''
    fetch(`https://www.themealdb.com/api/json/v2/1/Search.php?s=${value}`)
        .then(res => res.json())
        .then(json => {
            json.meals.forEach(meal => {
                const {idMeal, strMeal, strMealThumb, strArea, strInstructions, strCategory} = meal

                result.innerHTML += `
                <div class="result">
                    <div class="resultWrap">
                    <h2>${strMeal}</h2>
                        <div class="Benefits">
                            <div class="mainOne">
                                <img src="${strMealThumb}" width="300px" alt="${strMeal}">
                                <p>${strArea}</p>
                                <p>${strInstructions}</p>
                            </div>
                            <div class="mainTwo">
                                <h3>Ingredients:</h3>
                                    <ul class="ingredientList-${idMeal}"></ul>
                            </div>
                        </div>
                    <h4 class="mainText">${strCategory}</h4>
                    </div>
                </div>`

                fetch(`https://www.themealdb.com/api/json/v2/1/lookup.php?i=${idMeal}`)
                    .then(res => res.json())
                    .then(data => {
                        const ingredients = [];
                        for (let i = 1; i <= 20; i++) {
                            const ingredient = data.meals[0][`strIngredient${i}`]
                            const measure = data.meals[0][`strMeasure${i}`]
                            if (ingredient && measure) {
                                ingredients.push({ ingredient, measure })
                            }
                        }
                        const ingredientList = document.querySelector(`.ingredientList-${idMeal}`)
                        ingredients.forEach(({ ingredient, measure }) => {
                            ingredientList.innerHTML += `
                                <li>
                                    <img src="https://www.themealdb.com/images/ingredients/${ingredient}.png" alt="${ingredient}">
                                    ${measure} ${ingredient}
                                </li>`
                        })
                    })
            })
            searchInput.value = ''
        })
    result.classList.remove('hidden')
}



searchInput.addEventListener('keydown', function(event) {
    if (event.keyCode === 13) {
        handleSearch()
        submit.click()
    }
})
