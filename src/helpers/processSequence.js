/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from "../tools/api";

const api = new Api();

const processSequence = async ({
  value,
  writeLog,
  handleSuccess,
  handleError,
}) => {
  writeLog(value);

  const isValidValue = allPass(
    (value) => value.length < 10 && value.length > 2,
    (value) => /^[0-9.]+$/.test(value),
    (value) => !isNaN(parseFloat(value)),
    (value) => parseFloat(value) > 0
  )(value);

  if (!isValidValue) {
    handleError("ValidationError");
    return;
  }

  const roundedValue = pipe(parseFloat, Math.round, tap(writeLog))(value);

  const binaryString = await asyncPipe(
    convertToBase(10, 2),
    tap(writeLog)
  )(roundedValue);

  const lengthOfBinary = pipe((str) => str.length, tap(writeLog))(binaryString);

  const squaredLength = pipe(
    (x) => Math.pow(x, 2),
    tap(writeLog)
  )(lengthOfBinary);

  const modBy3 = pipe((x) => x % 3, tap(writeLog))(squaredLength);

  await asyncPipe(handleGetAnimalById, handleSuccess)(modBy3);
};

const convertToBase = (from, to) => (number) =>
  api
    .get("https://api.tech/numbers/base", { from, to, number })
    .then(({ result }) => result);

const handleGetAnimalById = (id) =>
  api.get(`https://animals.tech/${id}`, {}).then(({ result }) => result);

// helpers
const allPass = (...args) => {
  return (...values) => {
    return args.every((fn) => fn(...values));
  };
};

const pipe = (...fns) => {
  return (value) => {
    return fns.reduce((acc, fn) => fn(acc), value);
  };
};

const asyncPipe = (...fns) => {
  return async (value) => {
    let result = value;

    for (const fn of fns) {
      result = await fn(result);
    }

    return result;
  };
};

const tap = (fn) => {
  return (value) => {
    fn(value);

    return value;
  };
};

export default processSequence;
