const getIsPositive = (value: number) => {
  if (value === 0 && Object.is(value, -0)) {
    return false;
  }
  return value >= 0;
};

const getIsValidNumber = ({
  value,
  allowNegative,
  maxDecimals,
  maxValue,
}: {
  value: string;
  allowNegative: boolean;
  maxDecimals: number;
  maxValue?: number;
}) => {
  if (value === "") {
    return true;
  }

  if (value === "-" && allowNegative) {
    return true;
  }

  if (Number.isNaN(Number(value))) {
    return false;
  }

  if ((value.toString().split(".")[1] || "").length > maxDecimals) {
    return false;
  }

  const floatValue = parseFloat(value);

  if (maxValue !== undefined && floatValue > maxValue) {
    return false;
  }

  if (!allowNegative && !getIsPositive(floatValue)) {
    return false;
  }

  return true;
};

export default getIsValidNumber;
