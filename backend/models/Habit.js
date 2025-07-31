// models/Habit.js

const mongoose = require('mongoose');

// 1. Создаем схему (чертеж) для привычки
const habitSchema = new mongoose.Schema({
  // Название привычки: тип - строка, обязательное поле
  name: {
    type: String,
    required: true,
    trim: true, // Убирает лишние пробелы в начале и конце
  },
  // Дата создания привычки: тип - дата, по умолчанию - текущая дата
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Сюда в будущем можно будет добавлять другие поля:
  // например, массив с датами выполнения, цвет иконки и т.д.
});

// 2. Создаем модель на основе схемы
// mongoose.model('ИмяМодели', схема)
const Habit = mongoose.model('Habit', habitSchema);

// 3. Экспортируем модель, чтобы использовать ее в других частях приложения
module.exports = Habit;