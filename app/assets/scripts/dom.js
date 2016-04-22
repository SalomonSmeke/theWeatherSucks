function setGradients(gradientColors, domElement){
  var cssPrefix = getCssValuePrefix();

  if (!gradientColors) return false;
  if (gradientColors.length<2) return false;

  var style = "";
  for (color in gradientColors){
    style = style + "#" + gradientColors[color] + ", ";
  }
  style = style.substring(0,style.length-2);
  domElement.style.backgroundImage = getCssValuePrefix() + 'repeating-linear-gradient(' + style + ')';
  return style;
}

function setPallete(typeStr){
  var colorSet;
  switch (typeStr) {
    case "cold":
      colorSet = colorSets.cold;
      break;
    case "neutral":
      colorSet = colorSets.neutral;
      break;
    case "warm":
      colorSet = colorSets.warm;
      break;
    default:
      console.error("unknown pallete code.")
      colorSet = colorSets.neutral;
  }
  for (color in colorSet){
    console.log(setGradients(colorSet[color], document.getElementById(('page_' + color))));
  }
}
