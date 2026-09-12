import { useState } from 'react';
import { CopyButton } from '@/components/ToolUI';

interface UnitDef {
  name: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}

function makeConverter(units: Record<string, UnitDef>) {
  const keys = Object.keys(units);
  return function Converter({ defaultFrom = keys[0], defaultTo = keys[1] ?? keys[0] }: { defaultFrom?: string; defaultTo?: string } = {}) {
    const [value, setValue] = useState('1');
    const [from, setFrom] = useState(defaultFrom);
    const [to, setTo] = useState(defaultTo);

    const numValue = parseFloat(value);
    let result = '';
    if (!isNaN(numValue) && units[from] && units[to]) {
      result = units[to].fromBase(units[from].toBase(numValue)).toPrecision(8).replace(/\.?0+$/, '');
    }

    const unitKeys = Object.keys(units);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">From</label>
            <div className="flex gap-2">
              <input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="flex-1 rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40 font-mono" />
              <select value={from} onChange={(e) => setFrom(e.target.value)} className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40">
                {unitKeys.map((u) => <option key={u} value={u}>{units[u].name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">To</label>
            <div className="flex gap-2">
              <input type="text" value={result} readOnly className="flex-1 rounded-lg bg-slate-900/50 border border-slate-700 px-4 py-2.5 text-cyan-300 font-mono focus:outline-none" />
              <select value={to} onChange={(e) => setTo(e.target.value)} className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40">
                {unitKeys.map((u) => <option key={u} value={u}>{units[u].name}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="text-center text-sm text-slate-400">
          {value || '0'} {units[from]?.name} = <span className="text-cyan-400 font-mono font-bold">{result || '0'}</span> {units[to]?.name}
        </div>
        <CopyButton text={result} />
      </div>
    );
  };
}

// Length
const lengthUnits: Record<string, UnitDef> = {
  mm: { name: 'Millimeter', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
  cm: { name: 'Centimeter', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
  m: { name: 'Meter', toBase: (v) => v, fromBase: (v) => v },
  km: { name: 'Kilometer', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
  in: { name: 'Inch', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
  ft: { name: 'Foot', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
  yd: { name: 'Yard', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
  mi: { name: 'Mile', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
  nmi: { name: 'Nautical Mile', toBase: (v) => v * 1852, fromBase: (v) => v / 1852 },
};
export const LengthConverter = makeConverter(lengthUnits);

// Weight
const weightUnits: Record<string, UnitDef> = {
  mg: { name: 'Milligram', toBase: (v) => v / 1_000_000, fromBase: (v) => v * 1_000_000 },
  g: { name: 'Gram', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
  kg: { name: 'Kilogram', toBase: (v) => v, fromBase: (v) => v },
  t: { name: 'Tonne', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
  oz: { name: 'Ounce', toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
  lb: { name: 'Pound', toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
  st: { name: 'Stone', toBase: (v) => v * 6.35029, fromBase: (v) => v / 6.35029 },
};
export const WeightConverter = makeConverter(weightUnits);

// Temperature
function makeTempConverter() {
  return function TemperatureConverter() {
    const [value, setValue] = useState('0');
    const [from, setFrom] = useState('c');
    const [to, setTo] = useState('f');

    const numValue = parseFloat(value);
    let result = '';
    if (!isNaN(numValue)) {
      let celsius: number;
      if (from === 'c') celsius = numValue;
      else if (from === 'f') celsius = (numValue - 32) * 5/9;
      else celsius = numValue - 273.15;

      let out: number;
      if (to === 'c') out = celsius;
      else if (to === 'f') out = celsius * 9/5 + 32;
      else out = celsius + 273.15;
      result = out.toFixed(4).replace(/\.?0+$/, '');
    }

    const units: Record<string, string> = { c: 'Celsius', f: 'Fahrenheit', k: 'Kelvin' };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">From</label>
            <div className="flex gap-2">
              <input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="flex-1 rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40 font-mono" />
              <select value={from} onChange={(e) => setFrom(e.target.value)} className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40">
                {Object.entries(units).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">To</label>
            <div className="flex gap-2">
              <input type="text" value={result} readOnly className="flex-1 rounded-lg bg-slate-900/50 border border-slate-700 px-4 py-2.5 text-cyan-300 font-mono focus:outline-none" />
              <select value={to} onChange={(e) => setTo(e.target.value)} className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40">
                {Object.entries(units).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="text-center text-sm text-slate-400">
          {value || '0'}° {units[from]} = <span className="text-cyan-400 font-mono font-bold">{result || '0'}° {units[to]}</span>
        </div>
        <CopyButton text={result} />
      </div>
    );
  };
}
export const TemperatureConverter = makeTempConverter();

// Area
const areaUnits: Record<string, UnitDef> = {
  'm²': { name: 'Square Meter', toBase: (v) => v, fromBase: (v) => v },
  'km²': { name: 'Square Kilometer', toBase: (v) => v * 1_000_000, fromBase: (v) => v / 1_000_000 },
  'cm²': { name: 'Square Centimeter', toBase: (v) => v / 10000, fromBase: (v) => v * 10000 },
  'ft²': { name: 'Square Foot', toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
  'in²': { name: 'Square Inch', toBase: (v) => v * 0.00064516, fromBase: (v) => v / 0.00064516 },
  'acre': { name: 'Acre', toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
  'hectare': { name: 'Hectare', toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
  'mi²': { name: 'Square Mile', toBase: (v) => v * 2_589_988, fromBase: (v) => v / 2_589_988 },
};
export const AreaConverter = makeConverter(areaUnits);

// Volume
const volumeUnits: Record<string, UnitDef> = {
  ml: { name: 'Milliliter', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
  l: { name: 'Liter', toBase: (v) => v, fromBase: (v) => v },
  'm³': { name: 'Cubic Meter', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
  cup: { name: 'Cup', toBase: (v) => v * 0.236588, fromBase: (v) => v / 0.236588 },
  pt: { name: 'Pint (US)', toBase: (v) => v * 0.473176, fromBase: (v) => v / 0.473176 },
  qt: { name: 'Quart (US)', toBase: (v) => v * 0.946353, fromBase: (v) => v / 0.946353 },
  gal: { name: 'Gallon (US)', toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
  tbsp: { name: 'Tablespoon', toBase: (v) => v * 0.0147868, fromBase: (v) => v / 0.0147868 },
  tsp: { name: 'Teaspoon', toBase: (v) => v * 0.00492892, fromBase: (v) => v / 0.00492892 },
};
export const VolumeConverter = makeConverter(volumeUnits);

// Speed
const speedUnits: Record<string, UnitDef> = {
  'm/s': { name: 'Meters/second', toBase: (v) => v, fromBase: (v) => v },
  'km/h': { name: 'Kilometers/hour', toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
  'mph': { name: 'Miles/hour', toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
  'knot': { name: 'Knot', toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 },
  'ft/s': { name: 'Feet/second', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
};
export const SpeedConverter = makeConverter(speedUnits);

// Digital Storage
const digitalUnits: Record<string, UnitDef> = {
  b: { name: 'Bit', toBase: (v) => v / 8, fromBase: (v) => v * 8 },
  B: { name: 'Byte', toBase: (v) => v, fromBase: (v) => v },
  KB: { name: 'Kilobyte', toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
  MB: { name: 'Megabyte', toBase: (v) => v * 1024 * 1024, fromBase: (v) => v / (1024 * 1024) },
  GB: { name: 'Gigabyte', toBase: (v) => v * 1024 * 1024 * 1024, fromBase: (v) => v / (1024 * 1024 * 1024) },
  TB: { name: 'Terabyte', toBase: (v) => v * 1024 ** 4, fromBase: (v) => v / 1024 ** 4 },
  PB: { name: 'Petabyte', toBase: (v) => v * 1024 ** 5, fromBase: (v) => v / 1024 ** 5 },
};
export const DigitalConverter = makeConverter(digitalUnits);

// Time
const timeUnits: Record<string, UnitDef> = {
  ms: { name: 'Millisecond', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
  s: { name: 'Second', toBase: (v) => v, fromBase: (v) => v },
  min: { name: 'Minute', toBase: (v) => v * 60, fromBase: (v) => v / 60 },
  h: { name: 'Hour', toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
  d: { name: 'Day', toBase: (v) => v * 86400, fromBase: (v) => v / 86400 },
  wk: { name: 'Week', toBase: (v) => v * 604800, fromBase: (v) => v / 604800 },
  mo: { name: 'Month (30d)', toBase: (v) => v * 2592000, fromBase: (v) => v / 2592000 },
  yr: { name: 'Year', toBase: (v) => v * 31536000, fromBase: (v) => v / 31536000 },
};
export const TimeConverter = makeConverter(timeUnits);

// Pressure
const pressureUnits: Record<string, UnitDef> = {
  pa: { name: 'Pascal', toBase: (v) => v, fromBase: (v) => v },
  kpa: { name: 'Kilopascal', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
  mpa: { name: 'Megapascal', toBase: (v) => v * 1_000_000, fromBase: (v) => v / 1_000_000 },
  bar: { name: 'Bar', toBase: (v) => v * 100000, fromBase: (v) => v / 100000 },
  psi: { name: 'PSI', toBase: (v) => v * 6894.76, fromBase: (v) => v / 6894.76 },
  atm: { name: 'Atmosphere', toBase: (v) => v * 101325, fromBase: (v) => v / 101325 },
  torr: { name: 'Torr', toBase: (v) => v * 133.322, fromBase: (v) => v / 133.322 },
};
export const PressureConverter = makeConverter(pressureUnits);

// Power
const powerUnits: Record<string, UnitDef> = {
  w: { name: 'Watt', toBase: (v) => v, fromBase: (v) => v },
  kw: { name: 'Kilowatt', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
  mw: { name: 'Megawatt', toBase: (v) => v * 1_000_000, fromBase: (v) => v / 1_000_000 },
  hp: { name: 'Horsepower', toBase: (v) => v * 745.7, fromBase: (v) => v / 745.7 },
  btu: { name: 'BTU/hour', toBase: (v) => v * 0.293071, fromBase: (v) => v / 0.293071 },
};
export const PowerConverter = makeConverter(powerUnits);

// Energy
const energyUnits: Record<string, UnitDef> = {
  j: { name: 'Joule', toBase: (v) => v, fromBase: (v) => v },
  kj: { name: 'Kilojoule', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
  cal: { name: 'Calorie', toBase: (v) => v * 4.184, fromBase: (v) => v / 4.184 },
  kcal: { name: 'Kilocalorie', toBase: (v) => v * 4184, fromBase: (v) => v / 4184 },
  wh: { name: 'Watt-hour', toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
  kwh: { name: 'Kilowatt-hour', toBase: (v) => v * 3_600_000, fromBase: (v) => v / 3_600_000 },
  ev: { name: 'Electronvolt', toBase: (v) => v * 1.602e-19, fromBase: (v) => v / 1.602e-19 },
  btu_e: { name: 'BTU', toBase: (v) => v * 1055.06, fromBase: (v) => v / 1055.06 },
};
export const EnergyConverter = makeConverter(energyUnits);

// Frequency
const frequencyUnits: Record<string, UnitDef> = {
  hz: { name: 'Hertz', toBase: (v) => v, fromBase: (v) => v },
  khz: { name: 'Kilohertz', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
  mhz: { name: 'Megahertz', toBase: (v) => v * 1_000_000, fromBase: (v) => v / 1_000_000 },
  ghz: { name: 'Gigahertz', toBase: (v) => v * 1_000_000_000, fromBase: (v) => v / 1_000_000_000 },
  rpm: { name: 'RPM', toBase: (v) => v / 60, fromBase: (v) => v * 60 },
};
export const FrequencyConverter = makeConverter(frequencyUnits);

// Angle
const angleUnits: Record<string, UnitDef> = {
  deg: { name: 'Degree', toBase: (v) => v, fromBase: (v) => v },
  rad: { name: 'Radian', toBase: (v) => v * 57.2958, fromBase: (v) => v / 57.2958 },
  grad: { name: 'Gradian', toBase: (v) => v * 0.9, fromBase: (v) => v / 0.9 },
  arcmin: { name: 'Arcminute', toBase: (v) => v / 60, fromBase: (v) => v * 60 },
  arcsec: { name: 'Arcsecond', toBase: (v) => v / 3600, fromBase: (v) => v * 3600 },
};
export const AngleConverter = makeConverter(angleUnits);

// Current
const currentUnits: Record<string, UnitDef> = {
  a: { name: 'Ampere', toBase: (v) => v, fromBase: (v) => v },
  ma: { name: 'Milliampere', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
  ua: { name: 'Microampere', toBase: (v) => v / 1_000_000, fromBase: (v) => v * 1_000_000 },
  ka: { name: 'Kiloampere', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
};
export const CurrentConverter = makeConverter(currentUnits);

// Voltage
const voltageUnits: Record<string, UnitDef> = {
  v: { name: 'Volt', toBase: (v) => v, fromBase: (v) => v },
  mv: { name: 'Millivolt', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
  uv: { name: 'Microvolt', toBase: (v) => v / 1_000_000, fromBase: (v) => v * 1_000_000 },
  kv: { name: 'Kilovolt', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
};
export const VoltageConverter = makeConverter(voltageUnits);

// Pace
const paceUnits: Record<string, UnitDef> = {
  'min/km': { name: 'Minutes/km', toBase: (v) => v, fromBase: (v) => v },
  'min/mi': { name: 'Minutes/mile', toBase: (v) => v / 1.60934, fromBase: (v) => v * 1.60934 },
  'sec/100m': { name: 'Seconds/100m', toBase: (v) => v / 600, fromBase: (v) => v * 600 },
};
export const PaceConverter = makeConverter(paceUnits);

// Each
const eachUnits: Record<string, UnitDef> = {
  unit: { name: 'Unit', toBase: (v) => v, fromBase: (v) => v },
  dozen: { name: 'Dozen', toBase: (v) => v * 12, fromBase: (v) => v / 12 },
  gross: { name: 'Gross', toBase: (v) => v * 144, fromBase: (v) => v / 144 },
  score: { name: 'Score', toBase: (v) => v * 20, fromBase: (v) => v / 20 },
  ream: { name: 'Ream', toBase: (v) => v * 500, fromBase: (v) => v / 500 },
};
export const EachConverter = makeConverter(eachUnits);

// Parts Per
const partsPerUnits: Record<string, UnitDef> = {
  ppm: { name: 'Parts per million', toBase: (v) => v, fromBase: (v) => v },
  ppb: { name: 'Parts per billion', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
  ppt: { name: 'Parts per trillion', toBase: (v) => v / 1_000_000, fromBase: (v) => v * 1_000_000 },
  percent: { name: 'Percent', toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
};
export const PartsPerConverter = makeConverter(partsPerUnits);

// Reactive Power
const reactivePowerUnits: Record<string, UnitDef> = {
  var: { name: 'VAR', toBase: (v) => v, fromBase: (v) => v },
  kvar: { name: 'kVAR', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
  mvar: { name: 'MVAR', toBase: (v) => v * 1_000_000, fromBase: (v) => v / 1_000_000 },
};
export const ReactivePowerConverter = makeConverter(reactivePowerUnits);

// Apparent Power
const apparentPowerUnits: Record<string, UnitDef> = {
  va: { name: 'VA', toBase: (v) => v, fromBase: (v) => v },
  kva: { name: 'kVA', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
  mva: { name: 'MVA', toBase: (v) => v * 1_000_000, fromBase: (v) => v / 1_000_000 },
};
export const ApparentPowerConverter = makeConverter(apparentPowerUnits);

// Reactive Energy
const reactiveEnergyUnits: Record<string, UnitDef> = {
  varh: { name: 'VAR-hour', toBase: (v) => v, fromBase: (v) => v },
  kvarh: { name: 'kVAR-hour', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
  mvarh: { name: 'MVAR-hour', toBase: (v) => v * 1_000_000, fromBase: (v) => v / 1_000_000 },
};
export const ReactiveEnergyConverter = makeConverter(reactiveEnergyUnits);

// Volumetric Flow Rate
const flowUnits: Record<string, UnitDef> = {
  'l/s': { name: 'Liters/second', toBase: (v) => v, fromBase: (v) => v },
  'l/min': { name: 'Liters/minute', toBase: (v) => v / 60, fromBase: (v) => v * 60 },
  'm³/s': { name: 'Cubic meters/second', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
  'gpm': { name: 'Gallons/minute (US)', toBase: (v) => v * 0.0630902, fromBase: (v) => v / 0.0630902 },
  'cfm': { name: 'Cubic feet/minute', toBase: (v) => v * 0.471947, fromBase: (v) => v / 0.471947 },
};
export const VolumetricFlowRateConverter = makeConverter(flowUnits);

// Illuminance
const illuminanceUnits: Record<string, UnitDef> = {
  lx: { name: 'Lux', toBase: (v) => v, fromBase: (v) => v },
  klx: { name: 'Kilolux', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
  fc: { name: 'Foot-candle', toBase: (v) => v * 10.7639, fromBase: (v) => v / 10.7639 },
  nox: { name: 'Nox', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
};
export const IlluminanceConverter = makeConverter(illuminanceUnits);

// Torque
const torqueUnits: Record<string, UnitDef> = {
  nm: { name: 'Newton-meter', toBase: (v) => v, fromBase: (v) => v },
  kgm: { name: 'Kilogram-meter', toBase: (v) => v * 9.80665, fromBase: (v) => v / 9.80665 },
  lbft: { name: 'Pound-foot', toBase: (v) => v * 1.35582, fromBase: (v) => v / 1.35582 },
  lbin: { name: 'Pound-inch', toBase: (v) => v * 0.112985, fromBase: (v) => v / 0.112985 },
};
export const TorqueConverter = makeConverter(torqueUnits);

// Charge
const chargeUnits: Record<string, UnitDef> = {
  c: { name: 'Coulomb', toBase: (v) => v, fromBase: (v) => v },
  mc: { name: 'Microcoulomb', toBase: (v) => v / 1_000_000, fromBase: (v) => v * 1_000_000 },
  nc: { name: 'Nanocoulomb', toBase: (v) => v / 1_000_000_000, fromBase: (v) => v * 1_000_000_000 },
  mah: { name: 'Milliamp-hour', toBase: (v) => v * 3.6, fromBase: (v) => v / 3.6 },
  ah: { name: 'Amp-hour', toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
};
export const ChargeConverter = makeConverter(chargeUnits);

// Currency Converter (static rates relative to USD)
const currencyUnits: Record<string, UnitDef> = {
  usd: { name: 'USD ($)', toBase: (v) => v, fromBase: (v) => v },
  eur: { name: 'EUR (€)', toBase: (v) => v * 1.08, fromBase: (v) => v / 1.08 },
  gbp: { name: 'GBP (£)', toBase: (v) => v * 1.27, fromBase: (v) => v / 1.27 },
  jpy: { name: 'JPY (¥)', toBase: (v) => v * 0.0067, fromBase: (v) => v / 0.0067 },
  cad: { name: 'CAD (C$)', toBase: (v) => v * 0.73, fromBase: (v) => v / 0.73 },
  aud: { name: 'AUD (A$)', toBase: (v) => v * 0.65, fromBase: (v) => v / 0.65 },
  inr: { name: 'INR (₹)', toBase: (v) => v * 0.012, fromBase: (v) => v / 0.012 },
  bdt: { name: 'BDT (৳)', toBase: (v) => v * 0.0091, fromBase: (v) => v / 0.0091 },
};
export const CurrencyConverter = makeConverter(currencyUnits);
