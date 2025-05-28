import MFAVerifier from "../components/MFAVerifier";

export default function VerifyMFA() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">MFA Verification</h1>
      <MFAVerifier />
    </div>
  );
}
