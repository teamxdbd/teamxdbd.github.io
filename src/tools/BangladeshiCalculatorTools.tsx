import { useState, useMemo } from 'react';
import { Calculator, TrendingUp, Wallet, ArrowRight, Smartphone, Info } from 'lucide-react';

interface FeeTier {
  value: string;
  label: string;
  rate: number;
  flat: number;
  desc: string;
}

interface CalcResult {
  charge: number;
  total: number;
  receive: number;
}

// bKash real charges (official bkash.com charge schedule + teamzlab 2026 update)
// Send Money (P2P): FREE (up to ৳25,000/month per receiver, then ৳5/txn)
// Cash Out from Agent (App): 1.85% = ৳18.50 per ৳1,000
// Cash Out from Priyo Agent: ৳13.95 per ৳1,000 (1.395%) up to ৳50,000/month
// Cash Out from ATM: 2% with minimum ৳25
// Payment to Merchant: FREE
// Bank Transfer: Flat ৳25 per transaction
// Mobile Recharge: FREE
// Salary Disbursement: FREE
// Utility Bill Pay: FREE
const BKASH_TIERS: FeeTier[] = [
  { value: 'send_money', label: 'Send Money (P2P)', rate: 0, flat: 0, desc: 'Free' },
  { value: 'cash_out_agent', label: 'Cash Out from Agent (App)', rate: 0.0185, flat: 0, desc: '1.85% (৳18.50 per ৳1,000)' },
  { value: 'cash_out_priyo', label: 'Cash Out from Priyo Agent', rate: 0.01395, flat: 0, desc: '1.395% (৳13.95 per ৳1,000) — up to ৳50K/month' },
  { value: 'cash_out_atm', label: 'Cash Out from ATM', rate: 0.02, flat: 25, desc: '2% (min ৳25)' },
  { value: 'payment_merchant', label: 'Payment to Merchant', rate: 0, flat: 0, desc: 'Free' },
  { value: 'bank_transfer', label: 'Bank Transfer', rate: 0, flat: 25, desc: 'Flat ৳25 per transaction' },
  { value: 'mobile_recharge', label: 'Mobile Recharge', rate: 0, flat: 0, desc: 'Free' },
  { value: 'salary', label: 'Salary Disbursement', rate: 0, flat: 0, desc: 'Free' },
  { value: 'utility', label: 'Utility Bill Pay', rate: 0, flat: 0, desc: 'Free' },
];

// Nagad real charges (official nagad.com.bd + teamzlab 2026 update)
// Send Money: FREE
// Cash Out from App (Regular): ৳12.50 per ৳1,000 = 1.25%
// Cash Out from USSD *167#: ৳15.00 per ৳1,000 = 1.50%
// Payment to Merchant: FREE
// Add Money: FREE
// Mobile Recharge: FREE
// Salary Disbursement: FREE
// Transfer to Bank: 1.50%
const NAGAD_TIERS: FeeTier[] = [
  { value: 'send_money', label: 'Send Money (P2P)', rate: 0, flat: 0, desc: 'Free' },
  { value: 'cash_out_app', label: 'Cash Out from App (Regular)', rate: 0.0125, flat: 0, desc: '1.25% (৳12.50 per ৳1,000)' },
  { value: 'cash_out_ussd', label: 'Cash Out from USSD (*167#)', rate: 0.015, flat: 0, desc: '1.50% (৳15.00 per ৳1,000)' },
  { value: 'payment_merchant', label: 'Payment to Merchant', rate: 0, flat: 0, desc: 'Free' },
  { value: 'bank_transfer', label: 'Transfer to Bank', rate: 0.015, flat: 0, desc: '1.50%' },
  { value: 'mobile_recharge', label: 'Mobile Recharge', rate: 0, flat: 0, desc: 'Free' },
  { value: 'salary', label: 'Salary Disbursement', rate: 0, flat: 0, desc: 'Free' },
  { value: 'utility', label: 'Utility Bill Pay', rate: 0, flat: 0, desc: 'Free' },
];

// Rocket (Dutch-Bangla Bank) real charges (official dutchbanglabank.com/rocket/charges-and-fees.html)
// Cash-in at Agent: FREE
// Cash-out at Agent: 1.67% of Txn Amt
// Cash-out at DBBL Branches: 0.9% of Txn Amt (min ৳10)
// Cash-out from DBBL ATM: 0.9% of Txn Amt
// P2P Send Money (same product): FREE (USSD & App)
// P2P Send Money (other product): 0.90% (charged from receiver)
// Merchant Payment: FREE
// Top-up / Mobile Recharge: FREE
// Salary/Stipend Disbursement: FREE
const ROCKET_TIERS: FeeTier[] = [
  { value: 'send_money', label: 'Send Money (P2P Same Product)', rate: 0, flat: 0, desc: 'Free (USSD & App)' },
  { value: 'cash_out_agent', label: 'Cash Out at Agent', rate: 0.0167, flat: 0, desc: '1.67% of transaction amount' },
  { value: 'cash_out_branch', label: 'Cash Out at DBBL Branch', rate: 0.009, flat: 10, desc: '0.9% (min ৳10)' },
  { value: 'cash_out_atm', label: 'Cash Out from DBBL ATM', rate: 0.009, flat: 0, desc: '0.9% of transaction amount' },
  { value: 'payment_merchant', label: 'Merchant Payment', rate: 0, flat: 0, desc: 'Free' },
  { value: 'mobile_recharge', label: 'Top-up / Mobile Recharge', rate: 0, flat: 0, desc: 'Free' },
  { value: 'salary', label: 'Salary / Stipend Disbursement', rate: 0, flat: 0, desc: 'Free' },
];

type Service = 'bkash' | 'nagad' | 'rocket';

const SERVICE_CONFIG: Record<Service, { name: string; color: string; icon: string; tiers: FeeTier[] }> = {
  bkash: { name: 'bKash', color: 'pink', icon: 'P', tiers: BKASH_TIERS },
  nagad: { name: 'Nagad', color: 'orange', icon: 'N', tiers: NAGAD_TIERS },
  rocket: { name: 'Rocket', color: 'purple', icon: 'R', tiers: ROCKET_TIERS },
};

function ChargeCalculator({ service }: { service: Service }) {
  const config = SERVICE_CONFIG[service];
  const [amount, setAmount] = useState('');
  const [tierValue, setTierValue] = useState(config.tiers[0].value);

  const tier = useMemo(() => config.tiers.find((t) => t.value === tierValue) ?? config.tiers[0], [config, tierValue]);

  const result = useMemo<CalcResult | null>(() => {
    const a = parseFloat(amount);
    if (isNaN(a) || a <= 0) return null;
    const percentageCharge = a * tier.rate;
    const charge = tier.flat > 0 ? Math.max(percentageCharge, tier.flat) : percentageCharge;
    return { charge, total: a + charge, receive: a };
  }, [amount, tier]);

  const colorClasses: Record<string, { bg: string; text: string; border: string; gradient: string; ring: string; badge: string }> = {
    pink: { bg: 'bg-pink-500/15', text: 'text-pink-400', border: 'border-pink-500/30', gradient: 'from-pink-500 to-rose-600', ring: 'focus:ring-pink-400/40 focus:border-pink-400/40', badge: 'bg-pink-500/10 border-pink-500/20 text-pink-300' },
    orange: { bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-500/30', gradient: 'from-orange-500 to-amber-600', ring: 'focus:ring-orange-400/40 focus:border-orange-400/40', badge: 'bg-orange-500/10 border-orange-500/20 text-orange-300' },
    purple: { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30', gradient: 'from-purple-500 to-indigo-600', ring: 'focus:ring-purple-400/40 focus:border-purple-400/40', badge: 'bg-purple-500/10 border-purple-500/20 text-purple-300' },
  };
  const c = colorClasses[config.color];

  return (
    <div className="space-y-6">
      <div className={`flex items-center gap-3 rounded-xl ${c.bg} ${c.border} border px-4 py-3`}>
        <div className={`flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${c.gradient} text-white font-bold text-lg`}>
          {config.icon}
        </div>
        <div>
          <div className="text-sm font-bold text-white">{config.name} Charge Calculator</div>
          <div className="text-xs text-slate-400">Real transaction charges — verified from official sources</div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Transaction Type</label>
        <select
          value={tierValue}
          onChange={(e) => setTierValue(e.target.value)}
          className={`w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 ${c.ring} transition-all`}
        >
          {config.tiers.map((t) => (
            <option key={t.value} value={t.value}>{t.label} — {t.desc}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Amount (৳)</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">৳</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1000"
            className={`w-full rounded-lg bg-slate-900 border border-slate-700 pl-10 pr-4 py-3 text-white font-mono text-lg focus:outline-none focus:ring-2 ${c.ring} transition-all`}
          />
        </div>
      </div>

      {result ? (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-slate-900 border border-slate-700 px-4 py-4">
              <div className="flex items-center gap-2 mb-1">
                <Wallet className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-500">Amount</span>
              </div>
              <div className="text-lg font-bold text-white font-mono">৳{result.receive.toFixed(2)}</div>
            </div>
            <div className={`rounded-xl border px-4 py-4 ${c.badge}`}>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 opacity-70" />
                <span className="text-xs opacity-80">Charge</span>
              </div>
              <div className="text-lg font-bold font-mono">৳{result.charge.toFixed(2)}</div>
              <div className="text-xs opacity-70 mt-0.5">
                {tier.rate > 0 && tier.flat > 0
                  ? `${(tier.rate * 100).toFixed(2)}% (min ৳${tier.flat})`
                  : tier.flat > 0
                    ? `Flat ৳${tier.flat}`
                    : tier.rate > 0
                      ? `(${(tier.rate * 100).toFixed(2)}%)`
                      : 'Free'}
              </div>
            </div>
            <div className="rounded-xl bg-slate-900 border border-slate-700 px-4 py-4">
              <div className="flex items-center gap-2 mb-1">
                <ArrowRight className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-500">Total (incl. charge)</span>
              </div>
              <div className="text-lg font-bold text-white font-mono">৳{result.total.toFixed(2)}</div>
            </div>
          </div>

          <div className="rounded-xl bg-slate-900 border border-slate-700 p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">You send</span>
              <span className="text-white font-mono">৳{result.receive.toFixed(2)}</span>
            </div>
            {result.charge > 0 ? (
              <div className="flex items-center justify-between text-sm">
                <span className={`flex items-center gap-1 ${c.text}`}>
                  <Smartphone className="h-3.5 w-3.5" />
                  {config.name} fee
                </span>
                <span className={`font-mono ${c.text}`}>+৳{result.charge.toFixed(2)}</span>
              </div>
            ) : (
              <div className="flex items-center justify-between text-sm">
                <span className="text-emerald-400">{config.name} fee</span>
                <span className="font-mono text-emerald-400">Free</span>
              </div>
            )}
            <div className="border-t border-slate-700 pt-2 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-300">Total cost</span>
              <span className="text-lg font-bold text-white font-mono">৳{result.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-sm text-slate-500 text-center py-6">
          Enter an amount to see the charge breakdown.
        </div>
      )}

      <div className={`flex items-start gap-2 text-xs text-slate-500 ${c.badge} border rounded-lg px-4 py-3`}>
        <Info className="h-4 w-4 shrink-0 mt-0.5" />
        <span>
          Charges verified from official {config.name} rates
          {service === 'bkash' && ' (bkash.com)'}
          {service === 'nagad' && ' (nagad.com.bd)'}
          {service === 'rocket' && ' (dutchbanglabank.com)'}. All fees include VAT. Actual charges may vary based on account type and promotions.
        </span>
      </div>
    </div>
  );
}

export function BKashChargeCalculator() {
  return <ChargeCalculator service="bkash" />;
}

export function NagadChargeCalculator() {
  return <ChargeCalculator service="nagad" />;
}

export function RocketChargeCalculator() {
  return <ChargeCalculator service="rocket" />;
}
