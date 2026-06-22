import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import * as path from "node:path";

const MODEL = "gemini-3.1-flash-image";

const MIME_BY_EXT = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

function usage() {
  console.error(
    [
      "Usage: node generate-image.js <prompt> <outputPath> [inputImagePath]",
      "",
      "  <prompt>          Text describing the image to generate (quote it).",
      "  <outputPath>      Where to write the generated image (e.g. out.png).",
      "  [inputImagePath]  Optional source image to condition the generation on.",
      "",
      "Requires GEMINI_API_KEY (or GOOGLE_API_KEY) in the environment.",
    ].join("\n")
  );
}

function mimeForPath(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mime = MIME_BY_EXT[ext];
  if (!mime) {
    throw new Error(`Unsupported image extension "${ext}" for ${filePath}`);
  }
  return mime;
}

async function generateImage({ prompt, outputPath, inputImagePath }) {
  const ai = new GoogleGenAI({});

  // Build the request parts: the text prompt plus, optionally, a source image
  // (as inlineData) so the model conditions on / edits the provided picture.
  const parts = [{ text: prompt }];
  if (inputImagePath) {
    const base64Image = fs.readFileSync(inputImagePath).toString("base64");
    parts.push({
      inlineData: {
        mimeType: mimeForPath(inputImagePath),
        data: base64Image,
      },
    });
  }

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [{ role: "user", parts }],
  });

  const candidateParts = response?.candidates?.[0]?.content?.parts ?? [];
  const imagePart = candidateParts.find((p) => p.inlineData?.data);
  if (!imagePart) {
    const textPart = candidateParts.find((p) => p.text)?.text;
    throw new Error(
      textPart
        ? `No image was returned by the model. Model said: ${textPart}`
        : "No image was returned by the model."
    );
  }

  fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true });
  fs.writeFileSync(outputPath, Buffer.from(imagePart.inlineData.data, "base64"));
  console.log(`Image saved as ${outputPath}`);
}

async function main() {
  const [prompt, outputPath, inputImagePath] = process.argv.slice(2);

  if (!prompt || !outputPath) {
    usage();
    process.exit(1);
  }

  if (inputImagePath && !fs.existsSync(inputImagePath)) {
    console.error(`Input image not found: ${inputImagePath}`);
    process.exit(1);
  }

  try {
    await generateImage({ prompt, outputPath, inputImagePath });
  } catch (err) {
    console.error(`Failed to generate image: ${err.message}`);
    process.exit(1);
  }
}

main();
