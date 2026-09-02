import React, { useState, useEffect, useRef } from 'react';
import { Mail, ArrowLeft, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useAuth } from '../../hooks/useAuth';

interface OTPVerificationProps {
  email: string;
  onSuccess: () => void;
  onBack?: () => void;
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  onSuccess,
  onBack,
}) => {
  const { verifyEmail, resendOTP } = useAuth();
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleDigitChange = (index: number, value: string) => {
    setError(null);
    const cleanValue = value.replace(/\D/g, ''); // only digits

    if (cleanValue.length > 1) {
      // Handle paste in an input
      handlePasteValue(cleanValue);
      return;
    }

    const newDigits = [...otpDigits];
    newDigits[index] = cleanValue;
    setOtpDigits(newDigits);

    // Auto advance focus
    if (cleanValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit if all 6 digits entered
    if (cleanValue && index === 5 && newDigits.every((d) => d.length === 1)) {
      triggerVerification(newDigits.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      // Move focus back
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    handlePasteValue(pasted);
  };

  const handlePasteValue = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 6).split('');
    if (digits.length === 0) return;

    const newDigits = ['', '', '', '', '', ''];
    digits.forEach((d, idx) => {
      if (idx < 6) newDigits[idx] = d;
    });
    setOtpDigits(newDigits);

    const nextIndex = Math.min(digits.length, 5);
    inputRefs.current[nextIndex]?.focus();

    if (digits.length === 6) {
      triggerVerification(newDigits.join(''));
    }
  };

  const triggerVerification = async (otpString?: string) => {
    const code = otpString || otpDigits.join('');
    if (code.length !== 6) {
      setError('Please enter all 6 digits of the verification code.');
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      await verifyEmail({ email, otp: code });
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1200);
    } catch (err: any) {
      setError(err?.message || 'Invalid or expired verification code. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    setError(null);
    try {
      await resendOTP({ email });
      setResendCooldown(60);
      setOtpDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setError(err?.message || 'Failed to resend verification code. Please try again later.');
    } finally {
      setIsResending(false);
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <Card className="w-full shadow-lg border-[#E2E8F0]">
      <Card.Body className="p-8">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center text-sm font-medium text-[#64748B] hover:text-[#172033] mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to edit info
          </button>
        )}

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-[#2563EB]">
            {isSuccess ? (
              <CheckCircle2 className="h-8 w-8 text-[#16A34A] animate-bounce" />
            ) : (
              <Mail className="h-7 w-7" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-[#172033] mb-2">Verify Your Email</h2>
          <p className="text-sm text-[#64748B] max-w-sm mx-auto">
            We sent a 6-digit verification code to <span className="font-semibold text-[#172033]">{email}</span>
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2">
            <span className="font-semibold">Error:</span> {error}
          </div>
        )}

        {isSuccess && (
          <div className="mb-6 p-3.5 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 font-medium text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            Verification successful! Redirecting...
          </div>
        )}

        {/* 6 Digit Inputs */}
        <div className="flex justify-center items-center gap-2.5 sm:gap-3 mb-6" onPaste={handlePaste}>
          {otpDigits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              disabled={isVerifying || isSuccess}
              onChange={(e) => handleDigitChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`w-11 h-13 sm:w-13 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-lg border transition-all focus:outline-none focus:ring-2 ${
                error
                  ? 'border-red-300 focus:ring-red-500 bg-red-50/20'
                  : isSuccess
                  ? 'border-green-400 bg-green-50/30 text-green-700'
                  : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-[#2563EB]/20 bg-white'
              }`}
            />
          ))}
        </div>

        <Button
          type="button"
          onClick={() => triggerVerification()}
          loading={isVerifying}
          disabled={otpDigits.join('').length !== 6 || isSuccess}
          className="w-full mb-6 py-3 font-semibold text-base"
        >
          {isSuccess ? 'Verified' : 'Verify Email'}
        </Button>

        {/* Resend Cooldown Section */}
        <div className="text-center text-sm text-[#64748B] space-y-2 border-t border-[#F1F5F9] pt-4">
          <p>
            Didn't receive the email? Check spam or{' '}
            {resendCooldown > 0 ? (
              <span className="font-semibold text-[#172033]">
                resend in <span className="text-[#2563EB]">{formatSeconds(resendCooldown)}</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-[#2563EB] hover:text-[#1d4ed8] font-semibold inline-flex items-center gap-1 transition-colors"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Resend code'
                )}
              </button>
            )}
          </p>
          <div className="flex items-center justify-center gap-1 text-xs text-[#94A3B8]">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Codes expire in 10 minutes</span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};
