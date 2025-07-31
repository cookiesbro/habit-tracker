// Получаем ссылки на HTML-элементы
const addHabitForm = document.getElementById('add-habit-form');
const habitInput = document.getElementById('habit-input');
const habitsList = document.getElementById('habits-list');

// URL нашего бэкенда API
const API_URL = '/api/habits';

// Функция для отображения привычек на странице
async function renderHabits() {
    habitsList.innerHTML = ''; // Очищаем список перед обновлением

    try {
        const response = await fetch(API_URL); // Отправляем GET-запрос на бэкенд
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const habits = await response.json(); // Парсим JSON-ответ

        // Если привычек нет, показываем сообщение
        if (habits.length === 0) {
            habitsList.innerHTML = '<li>Пока что нет привычек. Добавьте первую!</li>';
            return;
        }

        // Для каждой привычки создаем элемент списка и добавляем его на страницу
        habits.forEach(habit => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${habit.name}</span>
                <button class="delete-btn" data-id="${habit._id}">Удалить</button>
            `;
            habitsList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Ошибка при загрузке привычек:', error);
        habitsList.innerHTML = '<li>Не удалось загрузить привычки. Пожалуйста, попробуйте позже.</li>';
    }
}

// Функция для добавления новой привычки
async function addHabit(e) {
    e.preventDefault(); // Предотвращаем стандартное поведение формы (перезагрузку страницы)

    const habitName = habitInput.value.trim(); // Получаем значение из поля ввода
    if (!habitName) return; // Если поле пустое, ничего не делаем

    try {
        const response = await fetch(API_URL, {
            method: 'POST', // Отправляем POST-запрос
            headers: {
                'Content-Type': 'application/json', // Говорим серверу, что отправляем JSON
            },
            body: JSON.stringify({ name: habitName }), // Преобразуем объект в JSON-строку
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // После успешного добавления, очищаем поле ввода и обновляем список привычек
        habitInput.value = '';
        await renderHabits(); // Перезагружаем список
    } catch (error) {
        console.error('Ошибка при добавлении привычки:', error);
        alert('Не удалось добавить привычку. Проверьте консоль для деталей.');
    }
}

// Функция для удаления привычки
async function deleteHabit(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE', // Отправляем DELETE-запрос
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        await renderHabits(); // Обновляем список привычек
    } catch (error) {
        console.error('Ошибка при удалении привычки:', error);
        alert('Не удалось удалить привычку. Проверьте консоль для деталей.');
    }
}

// --- Обработчики событий ---

// Отправка формы: привязываем функцию addHabit к событию submit формы
addHabitForm.addEventListener('submit', addHabit);

// Обработка кликов на списке привычек (для кнопок "Удалить")
habitsList.addEventListener('click', (e) => {
    // Проверяем, был ли клик по кнопке с классом 'delete-btn'
    if (e.target.classList.contains('delete-btn')) {
        const habitId = e.target.dataset.id; // Получаем ID привычки из атрибута data-id
        if (confirm('Вы уверены, что хотите удалить эту привычку?')) {
            deleteHabit(habitId); // Вызываем функцию удаления
        }
    }
});

// Запускаем загрузку и отображение привычек при первой загрузке страницы
document.addEventListener('DOMContentLoaded', renderHabits);