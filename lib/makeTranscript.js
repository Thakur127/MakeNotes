const makeTranscript = (subtitleArray) => {
  return subtitleArray.map((subtitle) => subtitle.text).join(" ");
};

export default makeTranscript;
