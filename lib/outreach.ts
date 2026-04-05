export type SendSmsResult = {
  ok: boolean;
  sentAt: string;
  provider: "mock-twilio";
};

export async function sendSMS(_phone: string, _message: string): Promise<SendSmsResult> {
  await new Promise((resolve) => window.setTimeout(resolve, 600));
  void _phone;
  void _message;

  return {
    ok: true,
    sentAt: new Date().toISOString(),
    provider: "mock-twilio"
  };
}
