FROM python:3.10-slim

WORKDIR /app

# Копируем и устанавливаем зависимости
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем исходный код
COPY .. .

# Запуск приложения uvicorn на порту 8081
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8081"]
