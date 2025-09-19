function getSuggestion(phq9, gad7) {
  let phqLevel =
    phq9 <= 4 ? "Minimal" :
    phq9 <= 9 ? "Mild" :
    phq9 <= 14 ? "Moderate" :
    phq9 <= 19 ? "Moderately severe" : "Severe";

  let gadLevel =
    gad7 <= 4 ? "Minimal" :
    gad7 <= 9 ? "Mild" :
    gad7 <= 14 ? "Moderate" : "Severe";

  return `PHQ-9: ${phqLevel}, GAD-7: ${gadLevel}`;
}

module.exports = getSuggestion;
