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

  // Build the input: a plain string when there's no image, otherwise a
  // text + image array so the model conditions on the provided picture.
  let input;
  if (inputImagePath) {
    const base64Image = fs.readFileSync(inputImagePath).toString("base64");
    input = [
      { type: "text", text: prompt },
      {
        type: "image",
        mime_type: mimeForPath(inputImagePath),
        data: base64Image,
      },
    ];
  } else {
    input = prompt;
  }

  const interaction = await ai.interactions.create({ model: MODEL, input });

  const generatedImage = interaction.output_image;
  if (!generatedImage) {
    throw new Error("No image was returned by the model.");
  }

  fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true });
  fs.writeFileSync(outputPath, Buffer.from(generatedImage.data, "base64"));
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
