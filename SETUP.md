# Настройка переменных окружения

## Локальная разработка

1. Создайте файл `.env.local` в корне проекта
2. Добавьте переменную:
   ```
   FACEBOOK_ACCESS_TOKEN=ваш_токен_здесь
   ```

## Настройка в Vercel

1. Откройте ваш проект в [Vercel Dashboard](https://vercel.com/dashboard)
2. Перейдите в **Settings** → **Environment Variables**
3. Добавьте новую переменную:
   - **Key**: `FACEBOOK_ACCESS_TOKEN`
   - **Value**: ваш Facebook access token
   - **Environment**: выберите все окружения (Production, Preview, Development)
4. Нажмите **Save**
5. Перезапустите деплой (Redeploy), чтобы переменные применились

## Важно

- Никогда не коммитьте файл `.env.local` в git
- Токен должен храниться только в переменных окружения
- Файл `.env.example` содержит пример структуры без реальных значений


