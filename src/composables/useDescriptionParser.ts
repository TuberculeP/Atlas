function getColor(match: string): string {
  switch (match) {
    case "<EARTH>":
    case "<TITLE>":
    case "<TRANS_EXP>":
    case "<TEMPERATURE>":
    case "<TECHNOLOGY>":
    case "<TECHNOLOLY>":
      return "#83BCDB";
    case "<TRANS_TRA>":
    case "<TRADEABLE>":
      return "#AADE9B";
    case "<TRANS_WAR>":
    case "<WARNING>":
      return "#AE615E";
    case "<FUEL>":
      return "#C03022";
    case "<STELLAR>":
      return "#C9D68B";
    case "<COMMODITY>":
      return "#B09857";
    case "<SPECIAL>":
      return "#B0A5DD";
    case "<VAL_ON>":
      return "#F5F5F5";
    case "<CATALYST>":
      return "#F3A923";
    default:
      return "inherit";
  }
}

export default function useDescriptionParser() {
  return {
    parseDescription: (text: string): string => {
      let finalText = text;
      const regex = /<(\w+)>/g;
      const matches = text.match(regex);
      if (matches) {
        matches.forEach((match) => {
          const color = getColor(match);
          finalText = finalText.replace(
            match,
            `<span style="color: ${color}">`
          );
        });
      }
      finalText = finalText.replace(/<>/g, "</span>");
      return finalText;
    },
  };
}
