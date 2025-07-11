/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

// helpers
const allPass = (...args) => {
  return (...values) => {
    return args.every((fn) => fn(...values));
  };
};

const values = (obj) => {
  return Object.values(obj);
};

const anyPass = (...args) => {
  return (...values) => {
    return args.some((fn) => fn(...values));
  };
};

const pipe = (...fns) => {
  return (value) => {
    return fns.reduce((acc, fn) => fn(acc), value);
  };
};

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass(
  ({ star }) => star === "red",
  ({ square }) => square === "green",
  ({ triangle, circle }) => triangle === "white" && circle === "white"
);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = pipe(
  values,
  (figures) => figures.filter((figure) => figure === "green"),
  (greenFigures) => greenFigures.length >= 2
);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = pipe(
  values,
  (figures) => {
    const redFigures = figures.filter((figure) => figure === "red");
    const blueFigures = figures.filter((figure) => figure === "blue");

    return { redFigures, blueFigures };
  },
  ({ redFigures, blueFigures }) => redFigures.length === blueFigures.length
);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass(
  ({ star }) => star === "red",
  ({ circle }) => circle === "blue",
  ({ square }) => square === "orange"
);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = pipe(
  values,
  anyPass(
    (figures) => figures.filter((c) => c === "red").length >= 3,
    (figures) => figures.filter((c) => c === "blue").length >= 3,
    (figures) => figures.filter((c) => c === "green").length >= 3,
    (figures) => figures.filter((c) => c === "orange").length >= 3
  )
);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass(
  ({ triangle }) => triangle === "green",
  ({ star, square, circle }) =>
    [star, square, circle].filter((c) => c === "green").length === 1,
  ({ star, square, circle }) =>
    [star, square, circle].filter((c) => c === "red").length === 1
);

// 7. Все фигуры оранжевые.

export const validateFieldN7 = allPass(
  ({ star }) => star === "orange",
  ({ square }) => square === "orange",
  ({ triangle }) => triangle === "orange",
  ({ circle }) => circle === "orange"
);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = allPass(
  ({ star }) => star !== "red" && star !== "white"
);

// 9. Все фигуры зеленые.
export const validateFieldN9 = allPass(
  ({ star }) => star === "green",
  ({ square }) => square === "green",
  ({ triangle }) => triangle === "green",
  ({ circle }) => circle === "green"
);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass(
  ({ triangle, square }) => triangle === square && triangle !== "white"
);
