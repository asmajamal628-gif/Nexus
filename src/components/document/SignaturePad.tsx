import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

const SignaturePad: React.FC = () => {
  const sigRef = useRef<SignatureCanvas | null>(null);

  const clear = () => {
    sigRef.current?.clear();
  };

  const save = () => {
    if (sigRef.current?.isEmpty()) {
      alert("Please provide a signature first!");
      return;
    }
    const dataUrl = sigRef.current?.toDataURL();
    console.log("Signature Saved:", dataUrl); // TODO: send to backend
    alert("Signature saved (check console)");
  };

  return (
    <div className="space-y-2">
      <h3 className="font-semibold">E-Signature</h3>
      <SignatureCanvas
        ref={sigRef}
        penColor="black"
        canvasProps={{
          width: 400,
          height: 150,
          className: "border rounded shadow",
        }}
      />
      <div className="space-x-3">
        <button onClick={clear} className="px-3 py-1 bg-gray-300 rounded">
          Clear
        </button>
        <button onClick={save} className="px-3 py-1 bg-blue-500 text-white rounded">
          Save Signature
        </button>
      </div>
    </div>
  );
};

export default SignaturePad;
