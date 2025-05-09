export const doesObjectExist = (list, objectToCheck) => {
  return list?.some((item) =>
    Object.keys(objectToCheck).every((key) => item[key] === objectToCheck[key]),
  );
};
