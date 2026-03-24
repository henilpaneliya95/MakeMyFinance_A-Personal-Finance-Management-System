import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini with API key (use env in production)
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Helper function to scan receipt
async function scanReceipt(file) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const arrayBuffer = await file.arrayBuffer();
  const base64String = btoa(
    new Uint8Array(arrayBuffer).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ""
    )
  );

  const prompt = `
    Analyze this receipt image and extract the following information in JSON format:
    - Total amount (just the number)
    - Date (in ISO format) /2025-07-15T18:30:00.000+00:00 this formate
    - Description or items purchased (brief summary)
    - type / income or expense
    - Suggested category / CATEGORY_CHOICES = [ # Income Categories
    "salary", "freelance", "business", "investment", "rental_income",
    "gift", "cashback", "bonus", "commission", "other_income",

    # Expense Categories
    "groceries", "rent", "utilities", "internet", "transportation",
    "education", "health", "shopping", "travel", "other_expense",
    
    # other
    "other"
]

    Only respond with valid JSON in this exact format:
    {
      "amount": number,
      "type": "string", /income or expense
      "date": "ISO date string", /2025-07-15T18:30:00.000+00:00
      "description": "string",
      "category": "string", 
    }

    If it's not a receipt, return an empty object.
  `;

  const result = await model.generateContent([
    {
      inlineData: {
        data: base64String,
        mimeType: file.type,
      },
    },
    prompt,
  ]);

  const response = await result.response;
  const text = response.text();
  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

  try {
    const data = JSON.parse(cleanedText);
    return {
      amount: parseFloat(data.amount),
      date: new Date(data.date),
      description: data.description,
      category: data.category,
      type: data.type,
    };
  } catch (error) {
    console.error("Error parsing Gemini response:", error);
    throw new Error("Failed to parse scanned data");
  }
}

const ReceiptScanner = () => {
  const [file, setFile] = useState(null);
  const [scannedData, setScannedData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setLoading(true);

    try {
      const result = await scanReceipt(selectedFile);
      setScannedData(result);
    } catch (error) {
      alert("❌ Failed to scan receipt. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="file-input"
      />

      {loading && <p className="text-blue-500">Scanning receipt...</p>}

      {scannedData && (
        <div className="p-4 border rounded bg-gray-50 shadow-sm">
          <h3 className="font-semibold mb-2">🧾 Scanned Receipt Data</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <strong>Amount:</strong> ₹{scannedData.amount}
            </li>
            <li>
              <strong>Date:</strong>{" "}
              {new Date(scannedData.date).toLocaleDateString()}
            </li>
            <li>
              <strong>Description:</strong> {scannedData.description}
            </li>
            <li>
              <strong>Type:</strong> {scannedData.type}
            </li>
            <li>
              <strong>Category:</strong> {scannedData.category}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReceiptScanner;
