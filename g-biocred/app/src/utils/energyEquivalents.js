// Illustrative everyday-life conversions, used only to help a reader picture
// what a calculated energy output means. These do not feed into any other
// calculation in the app.
export const LED_BULB_KW = 0.05 // a 50 W LED bulb
export const LPG_CYLINDER_KWH = 14.5 * 12.8 // 14.5 kg cylinder at 12.8 kWh/kg LPG
export const PETROL_KWH_PER_LITRE = 9.5 // 34.2 MJ/L = 9.5 kWh/L

export function calcEnergyEquivalents({ electricalKwh, thermalKwh, totalKwh }) {
  return {
    ledHours: electricalKwh / LED_BULB_KW,
    lpgCylinders: thermalKwh / LPG_CYLINDER_KWH,
    petrolLitres: totalKwh / PETROL_KWH_PER_LITRE,
  }
}
