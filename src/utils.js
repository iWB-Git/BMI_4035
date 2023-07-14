export const calculateBMI = (height, weight) => {
  const heightInMeters = height / 100; // Convert height from cm to meters
  const bmi = weight / (heightInMeters * heightInMeters);
  return bmi.toFixed(2);
};