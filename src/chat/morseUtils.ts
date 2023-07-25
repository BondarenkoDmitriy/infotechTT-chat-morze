const morseAlphabet: { [key: string]: string } = {
  "A": ".-",
   "B": "-...",
   "C": "-.-.",
   "D": "-..",
   "E": ".",
   "F": "..-.",
   "G": "--.",
   "H": "....",
   "I": "..",
   "J": ".---",
   "K": "-.-",
   "L": ".-..",
   "M": "--",
   "N": "-.",
   "O": "---",
   "P": ".--.",
   "Q": "--.-",
   "R": ".-.",
   "S": "...",
   "T": "-",
   "U": "..-",
   "W": ".--",
   "X": "-..-",
   "Y": "-.--",
   "Z": "--.."
};

export function textToMorse(text: string): string {
  const morseCodeArray = text.toUpperCase().split('').map(char => morseAlphabet[char] || char).join(' ');
  return morseCodeArray;
}

export function morseToText(morseCode: string): string {
  const textArray = morseCode.trim().split(' ').map(code => {
    const char = Object.keys(morseAlphabet).find(key => morseAlphabet[key] === code);
    return char || code;
  });
  return textArray.join('');
}