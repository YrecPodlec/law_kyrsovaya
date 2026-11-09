# ПРАВО — учебная CRM юридической фирмы

Next.js App Router, TypeScript, FSD и SCSS Modules.

Главная `/` переводит в список дел `/cases`. У каждого дела три раздела:

- `/cases/CASE-001` — обзор, сведения и таймлайн;
- `/cases/CASE-001/documents` — документы по папкам, поиск, сортировка и текстовый предпросмотр;
- `/cases/CASE-001/mail` — цепочки писем, фильтры по участникам и поиск по содержимому.

Слева находится переход к списку дел, внутри дела — навигация по его разделам.
В документах родительская папка включает вложенные; поиск учитывает выбранную папку.
В почте цепочки идут от новых к старым, а письма внутри цепочки — от ранних к поздним.

## Запуск интерфейса

Требуется Node.js 22.12+ (проект проверяется на Node.js 22).

```bash
npm install
npm run dev
```

Откройте адрес из терминала, обычно http://localhost:3000.
Интерфейс работает на `src/entities/legal-case/model/demo-case.ts` без подключения к базе.
Демонстрационная дата — 9 ноября 2026 года; ближайший срок — 12 ноября.
Документы (`src/entities/case-document/model/documents.ts`) и переписка
(`src/entities/email-thread/model/threads.ts`) — учебные примеры с привязкой к номеру дела.
Подключение Google не имитируется: его отсутствие явно указано на страницах материалов.

## PostgreSQL на Windows

Для локальной установки нужны Windows PowerShell, Python 3.9+ и curl.exe.
Команда скачивает серверные файлы PostgreSQL 18.6 из официального архива EDB в `.local/`,
создаёт `.env` со случайным паролем и запускает отдельный экземпляр на `127.0.0.1:5433`.
Системная служба не устанавливается; существующий `.env` сохраняется.

```bash
npm run db:local
npm run db:migrate
npm run db:seed
npm run db:check
```

Команды управления:

```bash
npm run db:status
npm run db:stop
npm run db:local
npm run db:studio
```

Повторный `db:local` запускает существующий кластер, а `db:seed` не удаляет данные
и не создаёт дубликаты. Файлы `.local/` и `.env` не попадают в Git.

## Альтернатива: Docker Compose

Если установлен Docker, можно вместо локального сервера использовать контейнер:

```bash
# Скопируйте .env.example в .env и задайте свой пароль в обоих полях:
# POSTGRES_PASSWORD и DATABASE_URL (в URL пароль должен быть URL-encoded).
docker compose up -d
npm run db:migrate
npm run db:seed
npm run db:check
```

Используйте один способ запуска PostgreSQL: оба варианта занимают порт 5433.
`docker compose stop` останавливает контейнер и сохраняет данные в volume.

## Prisma

Схема: `prisma/schema.prisma`. Конфигурация CLI: `prisma.config.ts`.
Серверный клиент: `src/shared/api/db.ts` (`getDb()`, защищён `server-only`).
Сгенерированный клиент не хранится в Git: `npm install` и `npm run build` генерируют его.

Модели: Client, Lawyer, LegalCase, CaseEvent, Document, Email.
Предусмотрены связи, индексы, статусы и внешние идентификаторы Google.
Документы и Gmail ещё не интегрированы. Страница продолжает использовать демоданные;
БД можно проверить отдельно командой `db:check`.

## Проверки

```bash
npm run lint
npm run typecheck
npm test
npm run db:validate
npm run build
```

`npm run test:page` проверяет уже запущенный сайт: все четыре маршрута, ссылки,
порядок событий, подключённые SCSS Modules и обработку неизвестного дела.
По умолчанию используется
http://localhost:3000, другой адрес задаётся переменной `BASE_URL`.

Для production: `npm run build`, затем `npm start`.

## Структура

В корневом `app/` остаются только Next.js entry points. FSD-слои и правила импортов
описаны в [docs/architecture.md](docs/architecture.md). Каждый визуальный компонент
имеет собственный SCSS Module; глобальных CSS-файлов и Tailwind нет.
