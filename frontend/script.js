
const addHabitForm = document.getElementById('add-habit-form');
const habitInput = document.getElementById('habit-input');
const habitsList = document.getElementById('habits-list');

const API_BASE_URL = '/api/habits';

// --- Функции для работы с API ---

// Функция для отображения привычек на странице
async function renderHabits() {
    habitsList.innerHTML = '';

    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const habits = await response.json();

        if (habits.length === 0) {
            habitsList.innerHTML = '<li>Пока что нет привычек. Добавьте первую!</li>';
            return;
        }

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

async function addHabit(e) {
    e.preventDefault();

    const habitName = habitInput.value.trim();
    if (!habitName) return;

    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: habitName }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        habitInput.value = '';
        await renderHabits();
    } catch (error) {
        console.error('Ошибка при добавлении привычки:', error);
        alert('Не удалось добавить привычку.');
    }
}

async function deleteHabit(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        await renderHabits();
    } catch (error) {
        console.error('Ошибка при удалении привычки:', error);
        alert('Не удалось удалить привычку.');
    }
}


// --- Обработчики событий ---

addHabitForm.addEventListener('submit', addHabit);

habitsList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const habitId = e.target.dataset.id;
        if (confirm('Вы уверены, что хотите удалить эту привычку?')) {
            deleteHabit(habitId);
        }
    }
});

document.addEventListener('DOMContentLoaded', renderHabits);