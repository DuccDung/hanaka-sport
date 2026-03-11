import { SELF_RATING_SECTIONS } from "../data/selfRatingData";

function roundToNearestHalf(num) {
  return Math.round(num * 2) / 2;
}

/**
 * Map điểm trung bình 1-5 sang thang pickleball phổ biến 2.0-5.0
 * Đây là quy tắc nội bộ hợp lý, không phải rating chính thức của 1 liên đoàn duy nhất.
 */
function mapAverageToPickleballLevel(avg) {
  if (avg <= 1.4) return 2.0;
  if (avg <= 1.9) return 2.5;
  if (avg <= 2.4) return 3.0;
  if (avg <= 2.9) return 3.5;
  if (avg <= 3.4) return 4.0;
  if (avg <= 3.9) return 4.5;
  return 5.0;
}

function weightedAverage(values, mode = "single") {
  let totalWeight = 0;
  let totalScore = 0;

  SELF_RATING_SECTIONS.forEach((section) => {
    const value = values[section.key]?.[mode] ?? 3;
    const weight =
      mode === "single" ? section.singleWeight : section.doubleWeight;

    totalScore += value * weight;
    totalWeight += weight;
  });

  return totalWeight > 0 ? totalScore / totalWeight : 0;
}

export function calculateSelfRating(values) {
  const singleAvg = weightedAverage(values, "single");
  const doubleAvg = weightedAverage(values, "double");

  const singleLevel = mapAverageToPickleballLevel(singleAvg);
  const doubleLevel = mapAverageToPickleballLevel(doubleAvg);

  return {
    singleRaw: Number(singleAvg.toFixed(2)),
    doubleRaw: Number(doubleAvg.toFixed(2)),
    singleLevel: roundToNearestHalf(singleLevel).toFixed(1),
    doubleLevel: roundToNearestHalf(doubleLevel).toFixed(1),
  };
}

export function buildInitialValues() {
  const initial = {};
  SELF_RATING_SECTIONS.forEach((section) => {
    initial[section.key] = {
      single: section.defaultSingle,
      double: section.defaultDouble,
    };
  });
  return initial;
}
