// 1. Импортируем зависимости
require('dotenv').config(); // Загружает переменные из .env файла
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Habit = require('./models/Habit'); // Импортируем модель Habit

// 2. Получаем строку подключения из переменных окружения
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error('MONGO_URI не определена в .env файле');
}

// 3. Создаем экземпляр приложения
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
// 4. Middleware для парсинга JSON
app.use(express.json());

// Функция для подключения к БД и запуска сервера
const start = async () => {
  try {
    // Подключаемся к MongoDB
    await mongoose.connect(mongoUri);
    console.log('Успешное подключение к MongoDB Atlas');

    // Запускаем сервер только после успешного подключения к БД
    app.listen(PORT, () => {
      console.log(`Сервер успешно запущен на порту ${PORT}`);
    });
  } catch (error) {
    console.error('Ошибка при подключении к MongoDB:', error);
    process.exit(1); // Выходим из процесса, если не удалось подключиться к БД
  }
};

// Главный маршрут
app.get('/', (req, res) => {
  res.send('Сервер работает! Подключение к БД успешно.');
});

// --- НАШИ НОВЫЕ API МАРШРУТЫ ---

// 5. Маршрут для создания новой привычки (CREATE)
app.post('/api/habits', async (req, res) => {
  try {
    // Получаем имя привычки из тела запроса
    const { name } = req.body;

    // Создаем новую привычку с помощью нашей модели
    const newHabit = new Habit({ name });

    // Сохраняем ее в базе данных
    await newHabit.save();

    // Отправляем успешный ответ со статусом 201 (Created) и созданным документом
    res.status(201).json(newHabit);
  } catch (error) {
    // Если произошла ошибка (например, не передали name), отправляем ошибку
    res.status(400).json({ message: 'Ошибка при создании привычки', error });
  }
});

//  Маршрут для получения всех привычек (READ)
app.get('/api/habits', async (req, res) => {
  try {
    // Находим все документы в коллекции Habit
    const habits = await Habit.find({});
    
    // Отправляем их клиенту в формате JSON
    res.status(200).json(habits);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении привычек', error });
  }
});

// Маршрут для обновления привычки (UPDATE)
app.put('/api/habits/:id', async (req, res) => {
  try {
    const { id } = req.params; // Получаем ID из параметров URL
    const { name } = req.body;  // Получаем новое имя из тела запроса

    // Находим привычку по ID и обновляем ее.
    // { new: true } говорит Mongoose вернуть обновленный документ, а не старый.
    const updatedHabit = await Habit.findByIdAndUpdate(id, { name }, { new: true });

    // Если привычка с таким ID не найдена, findByIdAndUpdate вернет null
    if (!updatedHabit) {
      return res.status(404).json({ message: 'Привычка не найдена' });
    }

    res.status(200).json(updatedHabit);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при обновлении привычки', error });
  }
});

// Маршрут для удаления привычки (DELETE)
app.delete('/api/habits/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedHabit = await Habit.findByIdAndDelete(id);

    if (!deletedHabit) {
      return res.status(404).json({ message: 'Привычка не найдена' });
    }

    // При успешном удалении часто возвращают пустое тело со статусом 204 No Content
    // или сообщение об успехе.
    res.status(200).json({ message: 'Привычка успешно удалена' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении привычки', error });
  }
});

// Запускаем всю нашу логику
start();