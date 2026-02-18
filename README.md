# AG Grid Community Demo — AdTech Traffic Arbitrage

Demo-проект для **ag-grid-community** (MIT, бесплатно) на Vue 3, демонстрирующий решения двух типичных проблем при работе с AG Grid.

## Проблематика

### Pain Point #1 — Производительность кастомных компонентов

**Проблема:** Кастомные Vue-компоненты в ячейках (чекбоксы и т.д.) — таблица тормозит при скролле на больших данных.

**Причина:** AG Grid внутри не использует Vue. Каждый Vue cell renderer создает мини-приложение Vue — на 50k+ строк это тысячи инстансов при скролле.

**Решение:** JS class cell renderers (`implements ICellRendererComp`) — прямая работа с DOM без оверхеда Vue.

### Pain Point #2 — Клик-события в ячейках

**Проблема:** Кастомные клик-события (кнопки, попапы, вложенные таблицы) — невозможно обработать без костылей с `this`.

**Причина:** Если использовать Vue-компонент как renderer, доступ к grid API и данным строки идет через `params` с потерей контекста. При попытке вызвать внешний метод (открыть попап) теряется `this`.

**Решение:** JS class cell renderers + коммуникация с Vue через `CustomEvent` с `bubbles: true`.

## Демо-страницы

### 1. Campaign Report — 100k строк, пагинация, сортировка
- Колонки: Campaign, Advertiser, Country, App, Month, Impressions, Clicks, CTR, Installs, CPI, Revenue, Spend, Profit, ROI
- JS renderers: CurrencyRenderer, PercentRenderer, ProfitRenderer (зеленый/красный), FlagRenderer
- Пагинация (50/100/500/1000 строк), сортировка по всем колонкам, быстрый фильтр
- **Демонстрирует:** AG Grid свободно держит 100k строк в памяти с виртуализацией

### 2. Country Breakdown — спарклайны на canvas
- ~200 строк (по странам), колонка Revenue Trend — мини-график на `<canvas>` 120x30px
- SparklineRenderer рисует линию: зеленая если тренд вверх, красная вниз
- **Демонстрирует:** Enterprise-спарклайны не нужны, canvas работает бесплатно

### 3. App Performance — A/B сравнение производительности (Pain Point #1)
- 50k строк с колонкой-чекбоксом
- Переключатель вверху: "Vue Component" / "JS Class" / "Built-in checkbox"
- PerformancePanel показывает FPS при скролле в каждом режиме
- **Демонстрирует:** Vue renderer тормозит, JS renderer — плавно, built-in — лучше всего

### 4. Daily Revenue — раскрытие строк + попапы (Pain Point #2)
- 365 строк (по дням), кнопка ▶ раскрывает вложенные строки-источники
- Кнопка "Details" открывает попап с деталями
- Механизм: `onCellClicked` для раскрытия строк, JS renderer + `CustomEvent(bubbles: true)` для попапа
- **Демонстрирует:** клик-события в ячейках БЕЗ костылей с `this`

### 5. Drag & Drop Priority — перетаскивание строк
- 50 кампаний с приоритетом
- `rowDragManaged: true`, `animateRows: true`
- При дропе — пересчет приоритетов
- **Демонстрирует:** drag-and-drop — бесплатная фича community

## Ключевые архитектурные решения

| Решение | Почему |
|---------|--------|
| JS class renderers для тяжелых колонок | Нет оверхеда Vue, прямой DOM |
| `CustomEvent` + `bubbles: true` | Чистая коммуникация renderer → Vue без глобальных шин |
| Вставка/удаление строк для раскрытия | Master/Detail — Enterprise, наш подход бесплатный |
| Singleton-кэш данных | Не генерировать 100k при каждой навигации |
| `ag-theme-quartz` | Современная тема, идет с community |

## Стек

- **Vue 3** + Composition API + TypeScript
- **Vite** — сборка
- **ag-grid-community 35.x** + `ag-grid-vue3` (MIT, бесплатно)
- **vue-router** — навигация между демо-страницами
- **Naive UI** — UI-компоненты (кнопки, модалки, переключатели, layout)
- **@faker-js/faker** — генерация реалистичных AdTech данных

## Запуск

```bash
npm install
npm run dev
```

## Сборка

```bash
npm run build
npm run preview
```
