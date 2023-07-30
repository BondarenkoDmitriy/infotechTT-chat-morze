import { morseToText, textToMorse } from "../src/helper/morseUtils";

test('Convert text to Morse code', () => {
    const morseHello = textToMorse('HELLO');
    const morseWorld = textToMorse('WORLD');
    const morseSOS = textToMorse('SOS');
  
    expect(morseHello).toBe('.... . .-.. .-.. ---');
    expect(morseWorld).toBe('.-- --- .-. .-.. -..');
    expect(morseSOS).toBe('... --- ...');
  });

  test('Convert Morse code to text', () => {
    const morseHello = morseToText('.... . .-.. .-.. ---');
    const morseWorld = morseToText('.-- --- .-. .-.. -..');
    const morseSOS = morseToText('... --- ...');
  
    expect(morseHello).toBe('HELLO');
    expect(morseWorld).toBe('WORLD');
    expect(morseSOS).toBe('SOS');
  });